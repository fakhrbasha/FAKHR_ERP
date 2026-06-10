# 🌋 Volcano — Warehouse & Employee Management System

A production-ready REST API built with **Node.js**, **Express**, and **TypeScript** for managing a textile factory's full operations — employees, yarn stock, purchase orders, products, customers, expenses, and more.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Modules & Endpoints](#modules--endpoints)
  - [Auth](#-auth---auth)
  - [Department](#-department---department)
  - [Employee](#-employee---employee)
  - [Attendance](#-attendance---attendance)
  - [Material](#-material---material)
  - [Color](#-color---color)
  - [Yarn Stock](#-yarn-stock---yarn-stock)
  - [Supplier](#-supplier---suppliers)
  - [Purchase Order](#-purchase-order---purchase-order)
  - [Products](#-products---products)
  - [Customers](#-customers---customers)
  - [Expenses](#-expenses---expenses)
  - [Dashboard](#-dashboard---dashboard)
  - [Reports](#-reports---reports)
  - [Notifications](#-notifications---notifications)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Architecture](#architecture)

---

## Overview

**Volcano** is a comprehensive back-end system designed for textile manufacturing businesses. It covers the complete operational lifecycle:

- 👥 **HR** — employee records, departments, daily attendance tracking
- 🧵 **Inventory** — yarn stock management with in/out transaction history
- 🛒 **Procurement** — purchase orders and supplier management
- 📦 **Products** — finished goods catalogue with Cloudinary image hosting
- 👤 **Customers** — customer directory with search & pagination
- 💸 **Expenses** — expense logging by category and date
- 📊 **Dashboard** — real-time aggregated business statistics
- 📈 **Reports** — filterable reports for expenses, attendance, stock, and orders

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express 5 |
| Database | MongoDB + Mongoose |
| Caching / Session | Redis (Upstash) |
| Authentication | JWT (Access + Refresh tokens) |
| Password Hashing | bcrypt |
| Validation | Zod |
| File Upload | Multer (memory storage) |
| Image Hosting | Cloudinary |
| Email | Nodemailer (Gmail SMTP) |
| API Documentation | Swagger UI (swagger-jsdoc + swagger-ui-express) |
| Dev Tooling | concurrently + tsc --watch |

---

## Project Structure

```
Volcano/
├── src/
│   ├── app.controller.ts        # Express app bootstrap & route wiring
│   ├── index.ts                 # Entry point
│   ├── config/
│   │   ├── config.service.ts    # Environment variable exports
│   │   └── swagger.config.ts    # Swagger/OpenAPI definition & schemas
│   ├── common/
│   │   ├── enums/               # Shared enums (attendance, multer, etc.)
│   │   ├── middleware/          # Auth, validation, multer middleware
│   │   ├── services/            # Redis service
│   │   └── utils/               # Error handling, success response, cloudinary
│   ├── DB/
│   │   ├── connectionDB.ts      # MongoDB connection
│   │   ├── models/              # Mongoose models
│   │   └── repository/          # Generic repository layer (CRUD abstractions)
│   ├── docs/                    # Swagger YAML files (one per module)
│   │   ├── auth.yaml
│   │   ├── department.yaml
│   │   ├── employee.yaml
│   │   ├── attendance.yaml
│   │   ├── material.yaml
│   │   ├── color.yaml
│   │   ├── yarnStock.yaml
│   │   ├── supplier.yaml
│   │   ├── purchaseOrder.yaml
│   │   ├── product.yaml
│   │   ├── customer.yaml
│   │   ├── expenses.yaml
│   │   ├── dashboard.yaml
│   │   ├── reports.yaml
│   │   └── notification.yaml
│   ├── modules/
│   │   ├── auth/
│   │   ├── department/
│   │   ├── employee/
│   │   ├── Attendance/
│   │   ├── materials/
│   │   ├── Color/
│   │   ├── Stock/               # Yarn stock
│   │   ├── stock transaction/   # Stock IN/OUT ledger
│   │   ├── supplier/
│   │   ├── PurchaseOrder/
│   │   ├── products/
│   │   ├── Customer/
│   │   ├── expenses/
│   │   ├── dashboard/
│   │   ├── notification/
│   │   └── Reports/
│   └── types/                   # Global TypeScript type extensions
├── dist/                        # Compiled JavaScript output
├── .env                         # Environment variables (not committed)
├── .gitignore
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** running locally or a MongoDB Atlas URI
- **Redis** instance (local or Upstash)
- **Cloudinary** account
- **Gmail** account with an App Password

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Volcano

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# ─── Server ──────────────────────────────────────────────────
PORT=3000

# ─── Database ────────────────────────────────────────────────
MONGO_URI=mongodb://127.0.0.1:27017/volcano

# ─── Redis ───────────────────────────────────────────────────
REDIS_URL=rediss://<user>:<password>@<host>:<port>

# ─── JWT ─────────────────────────────────────────────────────
ENCRYPTION_KEY=your_32_char_encryption_key
PREFIX_USER=Bearer
PREFIX_ADMIN=Admin

ACCESS_SECRET_KEY_USER=your_user_access_secret
REFRESH_SECRET_KEY_USER=your_user_refresh_secret

ACCESS_SECRET_KEY_ADMIN=your_admin_access_secret
REFRESH_SECRET_KEY_ADMIN=your_admin_refresh_secret

# ─── Security ────────────────────────────────────────────────
SALT_ROUND=13

# ─── Email (Gmail SMTP) ──────────────────────────────────────
GMAIL_USER=your@gmail.com
GMAIL_PASS=your_gmail_app_password
WAREHOUSE_EMAIL=warehouse@yourdomain.com

# ─── Cloudinary ──────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Running the Server

```bash
# Development (TypeScript watch + Node watch)
npm run start:dev
```

The server starts on `http://localhost:3000` by default.

> TypeScript is compiled to `dist/` automatically. Both processes run concurrently via `concurrently`.

---

## API Documentation

Interactive Swagger UI is available once the server is running:

| Resource | URL |
|---|---|
| **Swagger UI** | `http://localhost:3000/api-docs` |
| **OpenAPI JSON** | `http://localhost:3000/api-docs.json` |

All endpoints require a **Bearer JWT token** (except auth endpoints). Use the **Authorize** button in Swagger UI to set your token.

---

## Modules & Endpoints

> 🔒 = Requires JWT authentication

---

### 🔐 Auth — `/auth`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user account |
| POST | `/auth/confirm-email` | Confirm email address with OTP |
| POST | `/auth/login` | Login and receive access + refresh tokens |
| POST | `/auth/forgot-password` | Send OTP for password reset |
| POST | `/auth/reset-password` | Reset password using OTP |
| PATCH | `/auth/update-password` | 🔒 Update logged-in user's password |

**Register body:**
```json
{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "secret123",
  "confirmPassword": "secret123",
  "phone": "01012345678",
  "role": "admin"
}
```

---

### 🏢 Department — `/department`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/department/add-department` | 🔒 Create a new department |
| GET | `/department` | 🔒 Get all departments |
| GET | `/department/:id` | 🔒 Get department by ID |
| PUT | `/department/update-department/:id` | 🔒 Update department |
| DELETE | `/department/delete-department/:id` | 🔒 Delete department |

---

### 👷 Employee — `/employee`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/employee/add-employee` | 🔒 Add a new employee |
| GET | `/employee` | 🔒 Get all employees (paginated) |
| GET | `/employee/:id` | 🔒 Get employee by ID |
| PUT | `/employee/update-employee/:id` | 🔒 Update employee details |
| DELETE | `/employee/delete-employee/:id` | 🔒 Delete employee |

**Create body:**
```json
{
  "fullName": "Ahmed Hassan",
  "salary": 5000,
  "phone": "01098765432",
  "role": "supervisor"
}
```

---

### 📋 Attendance — `/attendance`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/attendance/check-in` | 🔒 Record employee check-in |
| GET | `/attendance` | 🔒 Get all attendance records (paginated) |
| GET | `/attendance/:id` | 🔒 Get attendance record by ID |
| PUT | `/attendance/update/:id` | 🔒 Update attendance record |
| DELETE | `/attendance/delete/:id` | 🔒 Delete attendance record |

**Status values:** `present` · `absent` · `late`

---

### 🧵 Material — `/material`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/material/add-material` | 🔒 Add a new raw material |
| GET | `/material` | 🔒 Get all materials (paginated) |
| GET | `/material/:id` | 🔒 Get material by ID |
| PUT | `/material/update-material/:id` | 🔒 Update material |
| DELETE | `/material/delete-material/:id` | 🔒 Delete material |

**Unit values:** `kg` · `g` · `meter` · `piece`

---

### 🎨 Color — `/color`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/color/add-color` | 🔒 Add a new color |
| GET | `/color` | 🔒 Get all colors |
| GET | `/color/:id` | 🔒 Get color by ID |
| PUT | `/color/update-color/:id` | 🔒 Update color |
| DELETE | `/color/delete-color/:id` | 🔒 Delete color |

**Create body:**
```json
{ "name": "Red", "hexCode": "#FF0000" }
```

---

### 📦 Yarn Stock — `/yarn-stock`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/yarn-stock/add` | 🔒 Add a new yarn stock entry |
| GET | `/yarn-stock` | 🔒 Get all stock entries (paginated) |
| GET | `/yarn-stock/:id` | 🔒 Get stock entry by ID |
| PUT | `/yarn-stock/:id/stock-in` | 🔒 Record stock-in transaction |
| PUT | `/yarn-stock/:id/stock-out` | 🔒 Record stock-out transaction |
| DELETE | `/yarn-stock/:id` | 🔒 Delete stock entry |

Stock transactions are logged to a separate ledger for full traceability.

---

### 🏭 Supplier — `/suppliers`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/suppliers/add-supplier` | 🔒 Add a new supplier |
| GET | `/suppliers` | 🔒 Get all suppliers (paginated) |
| GET | `/suppliers/:id` | 🔒 Get supplier by ID |
| PUT | `/suppliers/update-supplier/:id` | 🔒 Update supplier |
| DELETE | `/suppliers/delete-supplier/:id` | 🔒 Delete supplier |

---

### 🛒 Purchase Order — `/purchase-order`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/purchase-order/create` | 🔒 Create a new purchase order |
| GET | `/purchase-order` | 🔒 Get all purchase orders (paginated) |
| GET | `/purchase-order/:id` | 🔒 Get purchase order by ID |
| PATCH | `/purchase-order/:id/status` | 🔒 Update order status |
| DELETE | `/purchase-order/:id` | 🔒 Delete purchase order |

**Status values:** `PENDING` · `APPROVED` · `RECEIVED` · `CANCELLED`

**Create body:**
```json
{
  "supplierId": "664f1c2e3a1b2c3d4e5f6a7d",
  "items": [
    {
      "materialId": "664f1c2e3a1b2c3d4e5f6a7b",
      "colorId": "664f1c2e3a1b2c3d4e5f6a7c",
      "quantity": 200,
      "unitPrice": 35.5
    }
  ],
  "notes": "Urgent delivery"
}
```

---

### 👕 Products — `/products`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/products/add-product` | 🔒 Add a product (**multipart/form-data** with image) |
| GET | `/products` | 🔒 Get all products (paginated, searchable) |
| GET | `/products/:id` | 🔒 Get product by ID |
| PUT | `/products/edit-product/:id` | 🔒 Update product (optional image replacement) |
| DELETE | `/products/:id` | 🔒 Delete product |

Images are uploaded to **Cloudinary** under the `Volcano/Products` folder.

**Available sizes:** `XS` · `S` · `M` · `L` · `XL` · `XXL`

---

### 👤 Customers — `/customers`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/customers/add-customer` | 🔒 Add a new customer |
| GET | `/customers` | 🔒 Get all customers (paginated, searchable by name) |
| GET | `/customers/:id` | 🔒 Get customer by ID |
| PUT | `/customers/update-customer/:id` | 🔒 Update customer |
| DELETE | `/customers/delete-customer/:id` | 🔒 Delete customer |

---

### 💸 Expenses — `/expenses`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/expenses/add-expense` | 🔒 Log a new expense |
| GET | `/expenses` | 🔒 Get all expenses (paginated) |
| GET | `/expenses/:id` | 🔒 Get expense by ID |
| PUT | `/expenses/update-expense/:id` | 🔒 Update expense |
| DELETE | `/expenses/delete-expense/:id` | 🔒 Delete expense |

**Create body:**
```json
{
  "title": "Electricity Bill",
  "amount": 1200,
  "category": "Utilities",
  "expenseDate": "2026-06-01",
  "note": "Monthly payment"
}
```

---

### 📊 Dashboard — `/dashboard`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/state` | 🔒 Get aggregated business statistics |

**Response:**
```json
{
  "employees": 25,
  "departments": 5,
  "suppliers": 12,
  "customers": 80,
  "products": 150,
  "materials": 30,
  "purchaseOrders": 40,
  "lowStockItems": 7
}
```

---

### 📈 Reports — `/reports`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reports/expenses` | 🔒 Expense report (filter by `from`, `to`, `category`) |
| GET | `/reports/attendance` | 🔒 Attendance report (filter by `employeeId`, `from`, `to`) |
| GET | `/reports/low-stock` | 🔒 Low yarn-stock report (items at/below minimum) |
| GET | `/reports/purchase-orders` | 🔒 Purchase orders report (filter by `status`, `supplierId`, `from`, `to`) |

**Example — expense report with filters:**
```
GET /reports/expenses?from=2026-01-01&to=2026-06-30&category=Utilities
```

**Example — purchase orders by status:**
```
GET /reports/purchase-orders?status=APPROVED
```

---

### 🔔 Notifications — `/notifications`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/notifications` | 🔒 Get all notifications (paginated, searchable) |
| GET | `/notifications/unread-count` | 🔒 Get unread notification count |
| GET | `/notifications/:id/read` | 🔒 Mark a notification as read |

---

## Authentication

The system uses **dual JWT token strategy**:

| Token | Prefix | Header |
|---|---|---|
| User access token | `Bearer` | `Authorization: Bearer <token>` |
| Admin access token | `Admin` | `Authorization: Admin <token>` |

Both access and refresh tokens are issued on login. Tokens are verified via the `authentication` middleware on all protected routes.

OTP codes for email confirmation and password reset are stored in **Redis** with a TTL for automatic expiry.

---

## Error Handling

All errors are handled centrally via a `globalErrorHandler` middleware. Responses follow a consistent structure:

```json
{
  "message": "Human-readable error description",
  "status": 404
}
```

| Status | Meaning |
|---|---|
| `400` | Bad request / validation error |
| `401` | Unauthorized (missing or invalid token) |
| `404` | Resource not found |
| `409` | Conflict (duplicate record) |
| `500` | Internal server error |

Validation is handled with **Zod** schemas. Invalid request bodies, params, and queries return descriptive `400` errors before reaching the service layer.

---

## Architecture

```
Request → Express Router
       → authentication middleware (JWT verify)
       → validation middleware (Zod)
       → Service method (business logic)
       → Repository method (MongoDB via Mongoose)
       → successResponse() → JSON
```

The **Repository Pattern** abstracts all database operations. Each module has its own repository extending a generic base with:
- `create`, `findOne`, `find`, `update`, `delete`, `count`, `paginate`

This keeps service classes free of raw Mongoose queries and makes the data layer easily testable and swappable.

---

## Author

**Fakhr Basha** — [ahmed.msalaa@gmail.com](mailto:ahmed.msalaa@gmail.com)
