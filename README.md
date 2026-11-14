# A field guide to making decisions together (Education edition)

Static site for GitHub Pages. Open `index.html`, or serve the folder.

- `edits.js` holds text changes made in the online editor, baked in.
- `config.js` holds the address of the feedback Worker. When it is empty, the feedback buttons are hidden.
- `worker/worker.js` is the Cloudflare Worker that passes anonymous feedback to Notion.
- `tools/add-google-tag.py` adds the Google tag to every page. Run it from the repo root after copying in a fresh build, before pushing.

## Feedback setup

1. **Notion**: create an internal integration at https://www.notion.so/my-integrations and copy its secret.
   The database "User Log - Making Decisions Together" has these properties:
   `Example` (title), `Kind` (select), `Reaction` (select), `Note` (text), `Page` (text), `Time` (date).
   Open the database, choose ••• → Connections, and add the integration.
   The database ID is the 32-character code in its URL.
2. **Cloudflare**: Workers & Pages → Create → Worker. Paste `worker/worker.js`, deploy.
   Settings → Variables: add secrets `NOTION_TOKEN` and `NOTION_DB_ID`, and a plain variable
   `ALLOWED_ORIGIN` = `https://welearnwegrow.github.io`.
3. Put the Worker's address (e.g. `https://guide-feedback.<you>.workers.dev`) in `config.js`.
