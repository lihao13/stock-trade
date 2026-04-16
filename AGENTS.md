# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Stock Trade is a simple stock trading app: NestJS backend (port 3001) + AngularJS 1.8 static frontend (`public/index.html`) + SQLite (embedded, auto-created via TypeORM `synchronize: true`).

### Running the app

- **Backend (dev):** `npm run start:dev` — starts NestJS with `--watch` on port 3001
- **Frontend:** Open `public/index.html` directly or serve with `npx serve public -l 8080`
- See `README.md` for all commands (`build`, `lint`, `test`, `format`)

### Non-obvious notes

- `npm install` requires `--legacy-peer-deps` due to a peer dependency conflict between `prettier@^2.8.8` and `eslint-plugin-prettier@^5.0.0` which expects `prettier>=3.0.0`.
- The SQLite database file `stock-trade.db` is auto-created in the project root on first startup. It can be safely deleted to reset state.
- No test files exist in the repo. `npm test` exits with code 1 by default; use `npx jest --passWithNoTests` to get exit code 0.
- The frontend loads AngularJS from a CDN (`ajax.googleapis.com`) and calls the backend at `http://localhost:3001`. CORS is enabled on the backend.
- The `createOrder` endpoint expects the caller to supply `timestamp` and `status` fields in the request body; the backend does not auto-set these.
