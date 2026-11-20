# boosta

Small Cloudflare Worker. Local development uses Wrangler and does not need a Cloudflare account.

```bash
npm ci
npm test
npm run dev
```

The dev server listens on http://127.0.0.1:8787/ and responds with `Hello World!`.

`BOOSTA_KEY` is a required secret. Wrangler reads it from the environment, or from an uncommitted `.dev.vars` file. `GET /ready` returns whether that secret is configured and never returns its value.
