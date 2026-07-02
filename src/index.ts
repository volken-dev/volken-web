import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js"
import * as cheerio from "cheerio"
import express from "express"
import { z } from "zod"

const MAX_TEXT = 8000

async function load(url: string): Promise<cheerio.CheerioAPI> {
  const response = await fetch(url, { headers: { "User-Agent": "volken-web-example/1.0" } })
  if (!response.ok) {
    throw new Error(`Could not fetch ${url} (${response.status}).`)
  }
  return cheerio.load(await response.text())
}

function createServer() {
  const server = new McpServer({ name: "web", version: "1.0.0" })

  server.registerTool(
    "fetch_page",
    {
      description: "Fetch a web page and return its readable text content",
      inputSchema: { url: z.string().url().describe("The page to read") },
    },
    async ({ url }) => {
      const $ = await load(url)
      $("script, style, noscript, nav, header, footer").remove()
      const title = $("title").first().text().trim()
      const body = $("body").text().replace(/\s+/g, " ").trim().slice(0, MAX_TEXT)
      return { content: [{ type: "text", text: title ? `${title}\n\n${body}` : body }] }
    },
  )

  server.registerTool(
    "extract_links",
    {
      description: "List the outbound links on a web page",
      inputSchema: { url: z.string().url().describe("The page to read") },
    },
    async ({ url }) => {
      const $ = await load(url)
      const links = new Set<string>()
      $("a[href]").each((_, element) => {
        const href = $(element).attr("href")
        const label = $(element).text().replace(/\s+/g, " ").trim()
        if (href?.startsWith("http")) {
          links.add(`${label || "(no text)"} -> ${href}`)
        }
      })
      const list = [...links].slice(0, 100)
      return { content: [{ type: "text", text: list.length ? list.join("\n") : "No links found." }] }
    },
  )

  server.registerTool(
    "extract_tables",
    {
      description: "Extract every HTML table on a page as JSON rows",
      inputSchema: { url: z.string().url().describe("The page to read") },
    },
    async ({ url }) => {
      const $ = await load(url)
      const tables: string[][][] = []
      $("table").each((_, table) => {
        const rows: string[][] = []
        $(table)
          .find("tr")
          .each((_, tr) => {
            const cells: string[] = []
            $(tr)
              .find("th, td")
              .each((_, cell) => cells.push($(cell).text().replace(/\s+/g, " ").trim()))
            if (cells.length > 0) {
              rows.push(cells)
            }
          })
        if (rows.length > 0) {
          tables.push(rows)
        }
      })
      return {
        content: [
          { type: "text", text: tables.length ? JSON.stringify(tables, null, 2) : "No tables found." },
        ],
      }
    },
  )

  return server
}

const app = express()
app.use(express.json())

app.post("/", async (req, res) => {
  const server = createServer()
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  res.on("close", () => {
    transport.close()
    server.close()
  })
  await server.connect(transport)
  await transport.handleRequest(req, res, req.body)
})

const port = Number(process.env.PORT ?? 8080)
app.listen(port, () => {
  console.log(`web MCP server listening on ${port}`)
})
