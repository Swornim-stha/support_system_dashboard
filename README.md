# Four Symmetrons — Support System Dashboard

A full-stack ticketing system with a Laravel API backend and a Vite React (TypeScript + Tailwind) frontend.

## Project Structure

- `symmetrons-support-api/` — Laravel 12 API (SQLite, file uploads)
- `symmetrons-support-dashboard/` — React + Vite frontend

## Backend (Laravel API)

Prereqs: PHP 8.2+ (we use 8.4), Composer

1. Install dependencies:

```
cd symmetrons-support-api
composer install
```

2. Create SQLite DB and run migrations:

```
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate --graceful
```

3. Storage symlink for attachments:

```
php artisan storage:link
```

4. Serve API (dev):

```
php -S 0.0.0.0:8000 -t public
```

API base URL: `http://localhost:8000/api`

### API Endpoints

- GET `/api/tickets/stats` — { total, open, resolved_today, urgent }
- GET `/api/tickets` — List with optional filters: `status`, `priority`, `department`
- POST `/api/tickets` — Create ticket (multipart form): `subject`, `department`, `priority`, `description?`, `attachments[]?`
- POST `/api/tickets/{ticket}/resolve` — Mark resolved

## Frontend (React + Vite)

Prereqs: Node 18+

1. Install deps:

```
cd symmetrons-support-dashboard
npm install
```

2. Configure API URL:

- `.env` already set to `VITE_API_URL=http://localhost:8000/api`.
- Adjust if backend runs elsewhere.

3. Run dev server:

```
npm run dev -- --host
```

4. Production build:

```
npm run build
```

## Features

- Dashboard cards: total, open, resolved today, urgent
- Ticket list with filters
- New ticket form with attachments (stored on Laravel public disk)
- CORS enabled for local development
- Tailwind brand theme for Four Symmetrons

## Notes

- Default DB uses SQLite; switch to MySQL/Postgres via `config/database.php` and `.env` if needed.
- File uploads are saved in `storage/app/public/attachments` and served under `/storage/attachments/...`.
