# ERMS Backend (Research Report API)

## Overview
Express + TypeScript + MongoDB backend for research report websites like PS Market Research.
Supports SEO-friendly slugs, category-based filtering, pagination, and contact forms.

---

## 📦 Features
- **Slug-based SEO URLs** for categories and reports  
- **Full CRUD** for Categories, Reports, and Contacts  
- **Integrated search and pagination**  
- **Category–Report relationship** with population  
- **Contact form submission** and retrieval  
- **Enhanced schema** for market research (summary, highlights, price, table of contents, meta info)  
- **TypeScript type safety** and error handling  

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd ERMS-backend

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your MongoDB URI
```

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/erms
PORT=3000
CORS_ORIGIN=*
MONGODB_MAX_RETRIES=5
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=0
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build
npm start
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🏷️ Categories API

### GET `/api/categories`
Get all categories
```json
{
  "success": true,
  "message": "Categories fetched",
  "data": {
    "count": 5,
    "categories": [...]
  }
}
```

### GET `/api/categories/:slug`
Get category by slug with associated reports
```json
{
  "success": true,
  "message": "Category fetched",
  "data": {
    "category": {
      "_id": "...",
      "name": "Market Research",
      "slug": "market-research",
      "description": "Research reports on market trends",
      "thumbnailUrl": "https://example.com/thumb.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "reports": {
        "count": 3,
        "items": [...]
      }
    }
  }
}
```

### POST `/api/categories`
Create new category
```json
{
  "name": "Market Research",
  "description": "Research reports on market trends",
  "thumbnailUrl": "https://example.com/thumb.jpg"
}
```

### PUT `/api/categories/:slug`
Update category by slug
```json
{
  "name": "Updated Market Research",
  "description": "Updated description",
  "thumbnailUrl": "https://example.com/new-thumb.jpg"
}
```

### DELETE `/api/categories/:slug`
Delete category by slug

---

## 📊 Reports API

### GET `/api/reports`
Get reports with filtering and pagination

**Query Parameters:**
- `category=slug` - Filter by category slug
- `search=text` - Search in title, description, summary, keywords
- `page=1` - Page number (default: 1)
- `limit=20` - Items per page (default: 20, max: 100)

**Example:**
```
GET /api/reports?category=market-research&search=technology&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "totalPages": 3,
    "totalReports": 25
  },
  "data": [
    {
      "_id": "...",
      "title": "Global Tech Market Analysis 2024",
      "slug": "global-tech-market-analysis-2024",
      "summary": "Comprehensive analysis of global technology markets",
      "description": "Detailed report covering...",
      "publishDate": "2024-01-15T00:00:00.000Z",
      "imageUrl": "https://example.com/report.jpg",
      "price": 299.99,
      "keyHighlights": ["Market growth", "Key players", "Future trends"],
      "tableOfContent": ["Executive Summary", "Market Overview", "Analysis"],
      "meta": {
        "keywords": ["technology", "market", "analysis"],
        "seoDescription": "Global tech market analysis report 2024"
      },
      "category": {
        "_id": "...",
        "name": "Market Research",
        "slug": "market-research"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### GET `/api/reports/:slug`
Get single report by slug
```json
{
  "success": true,
  "report": {
    "_id": "...",
    "title": "Global Tech Market Analysis 2024",
    "slug": "global-tech-market-analysis-2024",
    // ... full report data
  }
}
```

### POST `/api/reports`
Create new report
```json
{
  "title": "Global Tech Market Analysis 2024",
  "category": "market-research",
  "summary": "Comprehensive analysis of global technology markets",
  "description": "Detailed report covering market trends, key players, and future outlook",
  "publishDate": "2024-01-15",
  "imageUrl": "https://example.com/report.jpg",
  "price": 299.99,
  "keyHighlights": [
    "Market growth of 15% YoY",
    "Key players analysis",
    "Future trends prediction"
  ],
  "tableOfContent": [
    "Executive Summary",
    "Market Overview", 
    "Key Players Analysis",
    "Future Trends",
    "Conclusion"
  ],
  "meta": {
    "keywords": ["technology", "market", "analysis", "2024"],
    "seoDescription": "Comprehensive global technology market analysis report for 2024"
  }
}
```

### PUT `/api/reports/:slug`
Update report by slug

### DELETE `/api/reports/:slug`
Delete report by slug

---

## 📧 Contact API

### GET `/api/contacts`
Get all contact messages with pagination

**Query Parameters:**
- `page=1` - Page number (default: 1)
- `limit=20` - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "pagination": {
    "page": 1,
    "totalPages": 2,
    "totalContacts": 35
  },
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "Report Inquiry",
      "message": "I'm interested in your market research reports...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST `/api/contacts`
Submit contact message
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Report Inquiry",
  "message": "I'm interested in your market research reports. Could you provide more information about pricing?"
}
```

---

## 🗄️ Data Models

### Category
```typescript
{
  name: string;           // required, unique
  slug: string;           // auto-generated from name
  description?: string;
  thumbnailUrl?: string;
  createdAt: Date;        // auto-generated
  updatedAt: Date;        // auto-generated
}
```

### Report
```typescript
{
  title: string;                    // required
  slug: string;                     // auto-generated from title
  category: ObjectId;              // ref Category, required
  description?: string;
  summary?: string;
  publishDate?: Date;
  imageUrl?: string;
  price?: number;
  keyHighlights: string[];         // default: []
  tableOfContent: string[];        // default: []
  meta: {
    keywords: string[];            // default: []
    seoDescription?: string;
  };
  createdAt: Date;                 // auto-generated
  updatedAt: Date;                 // auto-generated
}
```

### Contact
```typescript
{
  name: string;           // required
  email: string;          // required, validated
  subject: string;        // required
  message: string;        // required
  createdAt: Date;        // auto-generated
}
```

---

## 🔧 Health Endpoints

### GET `/`
Basic health check
```
Backend is running
```

### GET `/health`
API health status
```json
{
  "ok": true
}
```

### GET `/db-status`
Database connection status
```json
{
  "state": 1,
  "human": "connected",
  "ping": "ok"
}
```

---

## 🛠️ Development

### Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
```

### Database
- Uses MongoDB with Mongoose ODM
- Automatic connection retry with exponential backoff
- Graceful shutdown handling
- Connection pooling for performance

### Error Handling
- Consistent error response format
- Proper HTTP status codes
- Input validation
- Database error handling

### CORS
- Configurable via `CORS_ORIGIN` environment variable
- Defaults to `*` for development

---

## 📝 Notes
- All slugs are auto-generated using the `slugify` package
- Search functionality works across multiple fields
- Pagination is consistent across all list endpoints
- All timestamps are in ISO format
- Category-Report relationships are properly populated
- SEO-friendly URLs with slug-based routing