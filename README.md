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

1. Click **Use this template** to make your own copy, then clone it locally.
2. Install the CLI and sign in:

   ```bash
   npm install -g @volken/cli
   volken login
   ```

3. Initialise, then push the files `init` writes. Builds run on what is in your
   repository, so the `Dockerfile` has to be there before the first deploy. Then
   deploy:

   ```bash
   volken init
   git add volken.toml Dockerfile .dockerignore AGENTS.md
   git commit -m "Add Volken config"
   git push
   volken deploy
   ```

4. Connect a client with the gateway token from the deploy:

   ```bash
   volken connect --install --token <your gateway token>
   ```

5. Ask your AI client to "read https://example.com and summarise it" and watch
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
