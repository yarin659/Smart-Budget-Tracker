# Smart Budget Tracker — Starter (React + Spring Boot + PostgreSQL)

## Structure
- `backend/` — Java Spring Boot (Web, JPA, Validation, OpenAPI)
- `frontend/` — React + Vite + styled-components
- `docker-compose.yml` — Local PostgreSQL

## Run locally
1. Start DB:
```bash
docker compose up -d
```
2. Backend:
```bash
cd backend
mvn spring-boot:run
```
3. Frontend:
```bash
cd ../frontend
npm install
npm run dev
```

Open http://localhost:5173 and add a few transactions.
Swagger: http://localhost:8080/swagger-ui/index.html

## Next steps
- JWT auth (login/register) + per-user data.
- Budgets per category & month.
- Analytics charts.
- CSV import/export.
- Recurring transactions & reminders.
