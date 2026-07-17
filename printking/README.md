# PrintKing

PrintKing is a printing service website with a password-protected admin system for managing product categories, product images, options, selling prices, costs, postage and WhatsApp ordering.

## Project Architecture

This project is **not Next.js**, **not PHP/Laravel**, and **not a traditional Express app for production**.

It is:

- Static frontend: `index.html`, `admin/index.html`, `assets/css`, `assets/js`, `assets/images`
- Vercel Serverless API routes: `api/*.js`
- Local development Node server: `server.js`
- Persistent production data: recommended **Upstash Redis**
- Local demo data: `.data/pricing.json`

The local `server.js` is only for local preview. On Vercel, API files inside `api/` become serverless functions.

## Is Vercel Suitable?

Yes, Vercel is suitable for this project if you connect a persistent database.

Recommended setup:

- Hosting: **Vercel**
- Database: **Upstash Redis**, preferably through Vercel Marketplace
- Build output: `dist`
- API: Vercel Serverless Functions from `/api`

Important: Vercel serverless functions cannot reliably save admin edits to local files. Without Upstash Redis, the website can still deploy, but admin changes will fall back to default data and will not persist reliably.

## Required Environment Variables

Create these in Vercel Project Settings -> Environment Variables:

```env
ADMIN_PASSWORD=your-secure-admin-password
AUTH_SECRET=your-long-random-cookie-secret
UPSTASH_REDIS_REST_URL=your-upstash-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token
```

Backward-compatible names are also supported:

```env
KV_REST_API_URL=your-upstash-rest-url
KV_REST_API_TOKEN=your-upstash-rest-token
```

Use either `UPSTASH_REDIS_*` or `KV_REST_API_*`. The recommended names are `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

Local optional variable:

```env
PORT=3000
```

## Database

Use **Upstash Redis**.

The project stores one pricing/config object at this Redis key:

```text
printking:pricing:v1
```

No SQL database is required. No Prisma, Laravel migration, MySQL migration, or Postgres migration is needed.

## Migration / Seed Admin Account

No migration is required.

There is no database admin user table. Admin login is controlled by:

```env
ADMIN_PASSWORD
```

Default products and prices are already seeded in:

```text
api/_lib/defaultPricing.js
```

When Redis is empty, the API uses this default pricing automatically. After you log in to `/admin` and click `Save Changes`, the current data is saved into Upstash Redis.

## Local Development

Install dependencies is not required because this project currently uses only Node built-ins.

Run:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
http://localhost:3000/admin
```

Default local admin password:

```text
admin1234
```

For production, set `ADMIN_PASSWORD` in Vercel.

## Build

Run:

```bash
npm run build
```

This creates:

```text
dist/
```

Vercel should serve `dist` as the frontend output while keeping `/api` as serverless API routes.

## Vercel Project Settings

When importing from GitHub to Vercel:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: leave default or empty
- Root Directory: project root, usually `printking`

This is already defined in:

```text
vercel.json
```

Current `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "rewrites": [
    { "source": "/admin", "destination": "/admin/index.html" },
    { "source": "/admin/", "destination": "/admin/index.html" }
  ]
}
```

## GitHub Upload -> Vercel Deployment Steps

1. Push the `printking` folder to GitHub.
2. Go to Vercel Dashboard.
3. Click `Add New` -> `Project`.
4. Import the GitHub repository.
5. If this project is inside a larger repository, set `Root Directory` to:

```text
printking
```

6. Confirm:

```text
Framework Preset: Other
Build Command: npm run build
Output Directory: dist
```

7. Add Environment Variables:

```env
ADMIN_PASSWORD=your-secure-admin-password
AUTH_SECRET=your-long-random-cookie-secret
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

8. Deploy.
9. Open:

```text
https://your-domain.com/admin
```

10. Login using `ADMIN_PASSWORD`.
11. Click `Save Changes` once in admin to seed the initial pricing into Redis.

## Upstash Redis Setup

Recommended Vercel way:

1. In Vercel Dashboard, open your project.
2. Go to `Storage` or `Marketplace`.
3. Add **Upstash Redis**.
4. Connect it to the PrintKing project.
5. Confirm these variables exist in Vercel Environment Variables:

```env
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

6. Redeploy the Vercel project after adding env vars.

## Alternative Deployment Options

### Render

Render is suitable if you deploy this as a Node service:

- Build Command: `npm run build`
- Start Command: `node server.js`
- Environment Variables: same as above
- Database: Upstash Redis recommended

Do not rely on Render local filesystem for important admin data unless you configure persistent disk. Upstash Redis is still cleaner.

### Railway

Railway is suitable as a Node service:

- Start Command: `node server.js`
- Environment Variables: same as above
- Database: Upstash Redis recommended

Railway can run the local server directly, but Redis is still recommended for stable admin data.

### VPS

VPS is suitable if you want full control:

- Install Node.js 20+
- Upload project
- Run `npm run build`
- Run `node server.js` with PM2/systemd
- Put Nginx in front as reverse proxy

You can use local `.data/pricing.json` on VPS, but you must back it up. Upstash Redis is still safer.

### cPanel

Normal static cPanel hosting is not enough because this project needs `/api` backend routes for admin login and saving prices.

cPanel is only suitable if:

- Your cPanel supports Node.js apps
- You can run `node server.js`
- You can configure environment variables

If your cPanel only supports static HTML/PHP, use Vercel or convert the backend to PHP/MySQL.

## Important Files

- `index.html` - public website
- `admin/index.html` - admin interface
- `assets/js/app.js` - public calculator and WhatsApp order flow
- `assets/js/admin.js` - admin product/category/price editor
- `api/pricing.js` - public pricing API without costs
- `api/admin/login.js` - admin login API
- `api/admin/logout.js` - admin logout API
- `api/admin/pricing.js` - private admin pricing API
- `api/_lib/auth.js` - password and signed cookie auth
- `api/_lib/storage.js` - local JSON / Upstash Redis storage adapter
- `api/_lib/defaultPricing.js` - default seed data
- `scripts/build.js` - copies frontend files to `dist`
- `vercel.json` - Vercel build/output/admin route config

## Production Notes

- Change `ADMIN_PASSWORD` before deployment.
- Use a long random `AUTH_SECRET`.
- Connect Upstash Redis before relying on admin edits.
- Do not commit `.env.local` or real secrets.
- After changing env vars in Vercel, redeploy.
- If images are uploaded through admin, they are compressed and saved inside Redis as data URLs. For many large images, consider moving uploaded media to Vercel Blob later.
