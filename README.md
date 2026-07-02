# volken-web

An MCP server that gives an AI client live access to the web, ready to deploy on
[Volken](https://volken.dev). No API keys, no accounts. Three tools:

- `fetch_page(url)` returns a page's readable text.
- `extract_links(url)` lists the outbound links on a page.
- `extract_tables(url)` returns every HTML table as JSON rows.

Models cannot browse the web on their own. This server is the tool that lets
them, and it is the fastest of the examples to get running because it needs no
secret.

For the full walkthrough see
[the Examples page](https://docs.volken.dev/docs/examples#web).

## Deploy it

1. Click **Use this template** (or clone this repo) to make your own copy, then
   clone it locally.
2. Deploy:

   ```bash
   npm install -g volken
   volken login
   volken init
   volken deploy
   ```

3. Connect a client with the gateway token from the deploy:

   ```bash
   volken connect --install --token <your gateway token>
   ```

4. Ask your AI client to "read https://example.com and summarise it" and watch
   the call land:

   ```bash
   volken calls --tail
   ```

## Local development

```bash
npm install
volken dev
```

`volken dev` opens the server in the MCP Inspector.
