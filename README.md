# ERMS-backend

Express + TypeScript + Mongoose backend for ERMS.

## New Endpoints

Base URL: `/api`

### Categories `/api/categories`
- GET `/` → get all categories
- GET `/:id` → get a category by id
- POST `/` → create a category
- PUT `/:id` → update category
- DELETE `/:id` → delete category

### Reports `/api/reports`
- GET `/` → get all reports (pagination: `?page=1&limit=20`)
- GET `/search?query=xyz` → search by title, description, tags
- GET `/:id` → get a single report
- POST `/` → create a new report
- PUT `/:id` → update a report
- DELETE `/:id` → delete a report

Responses follow the shape:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

## Models

### Category
```ts
{
  name: string; // required, unique
  description?: string;
  createdAt: Date; // default now
}
```

### Report
```ts
{
  title: string; // required
  category: ObjectId; // ref Category, required
  description?: string;
  status: "draft" | "pending" | "approved" | "rejected"; // default "draft"
  reporterName?: string;
  location?: string;
  tags: string[];
  createdAt: Date; // default now
}
```

## Run
- Set `MONGODB_URI` in env
- `npm run dev` for development
- `npm run build && npm start` for production

## Notes
- CORS origin is configurable via `CORS_ORIGIN`
- `/db-status` provides basic DB health info
