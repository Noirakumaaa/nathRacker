# NathRacker

React Router v7 frontend for the NathRacker document encoding and verification system.

- **Production:** https://nathracker.nathdomain.com
- **Staging:** https://staging.nathracker.nathdomain.com

---

## Requirements

- Node.js 20+
- PM2 (`npm install -g pm2`)

---

## Environment Setup

Create the environment file for your target environment.

**.env** (local dev)
```
VITE_API_URL=http://localhost:3001
```

**.env.staging**
```
VITE_API_URL=https://staging-nathrackerapi.nathdomain.com
ALLOWED_HOSTS=staging.nathracker.nathdomain.com
```

**.env.production**
```
VITE_API_URL=https://nathrackerapi.nathracker.com
ALLOWED_HOSTS=nathracker.nathdomain.com
```

---

## Project Setup

```powershell
npm install
```

---

## Development

```powershell
# development (uses .env)
npm run dev

# staging (uses .env.staging)
npm run dev:staging
```

---

## Production Deployment

### 1. Build
```powershell
# production (uses .env.production)
npm run build

# staging (uses .env.staging)
npm run build:staging
```

### 2. Start with PM2
```powershell
pm2 start ecosystem.config.cjs --only nathracker

# or staging:
pm2 start ecosystem.config.cjs --only nathracker-staging

pm2 save
pm2 startup
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run dev:staging` | Start dev server in staging mode |
| `npm run build` | Build for production |
| `npm run build:staging` | Build for staging |
| `npm run typecheck` | Run TypeScript type check |
| `npm run lint` | Lint source files |
| `npm run test` | Run unit tests |

---

## PM2 Process Reference

```powershell
pm2 list                    # view all processes
pm2 logs nathracker         # view logs
pm2 restart nathracker      # restart
pm2 stop nathracker         # stop
```
