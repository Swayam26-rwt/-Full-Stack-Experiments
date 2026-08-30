# Experiment 3 — Role-Based Authentication & Route Protection

## Run

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite.

## Demo accounts

| Role | Username | Password |
|---|---|---|
| Admin | admin | admin123 |
| Editor | editor | editor123 |
| Viewer | viewer | viewer123 |

## Routes

- `/login` — authentication
- `/dashboard` — authenticated users
- `/admin` — admin only
- `/editor` — admin/editor
- `/viewer` — authenticated users
- `/unauthorized` — 403 page

## Experiment objectives covered

1. Authentication vs authorization
2. JWT structure and decoded claims
3. Token storage
4. Axios request interceptor
5. Axios response interceptor and refresh-token concept
6. RBAC permissions
7. Protected routes
8. Role-based conditional rendering
9. Unauthorized access handling
10. Centralized frontend security architecture

## Important academic note

The browser demo generates an unsigned demonstration JWT (`alg: none`) so the experiment can run without a backend. This is NOT secure production authentication.

In a production system:
- The backend validates credentials.
- The backend signs the JWT.
- The backend validates the JWT on every protected API request.
- Prefer an HttpOnly, Secure, SameSite refresh-token cookie.
- Do not treat frontend route protection as a replacement for backend authorization.
