# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Stock Trade is a stock trading simulation app with a NestJS backend (port 3001, SQLite) and an AngularJS 1.8 static frontend (`public/index.html`).

### Running the application

- **Backend**: `npm run start:dev` — starts NestJS in watch mode on port 3001. SQLite DB (`stock-trade.db`) is auto-created via TypeORM `synchronize: true`.
- **Frontend**: Serve `public/index.html` via any static file server (e.g. `python3 -m http.server 8080 --directory public`). The frontend calls `http://localhost:3001/api/trade/*`.

### Commands

| Task | Command |
|------|---------|
| Install deps | `npm install --legacy-peer-deps` |
| Dev server | `npm run start:dev` |
| Build | `npm run build` |
| Lint (autofix) | `npm run lint` |
| Test | `npm test` (no test files currently exist; use `npx jest --passWithNoTests` to avoid exit code 1) |
| Format | `npm run format` |

### Gotchas

- `npm install` requires `--legacy-peer-deps` due to a peer dependency conflict between `prettier@^2.8.8` and `eslint-plugin-prettier@^5.0.0` (which expects `prettier>=3`).
- There are no test files in the repository. `npm test` exits with code 1 by default.
- The frontend loads AngularJS from a CDN, so network access is needed for the frontend to work in a browser.
- The SQLite database file (`stock-trade.db`) is created at the project root. It is gitignored implicitly (no `.gitignore` present, but it should not be committed).
