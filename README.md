# Customer Management System (CMS)

A full-stack Customer Management System built with **Spring Boot** (backend) and **React + Vite** (frontend), backed by a **MariaDB** database. Supports full CRUD operations, bulk customer creation via Excel uploads, and a clean paginated dashboard.

---

## ✨ Features

- 📋 **Customer Dashboard** — Paginated, sortable table of all customers
- 👤 **View Customer** — Detailed profile view with addresses and linked family members
- ➕ **Create Customer** — Multi-address, multi-contact form with country/city dropdowns
- ✏️ **Edit Customer** — Pre-populated form with full update capability
- 📦 **Bulk Create** — Upload an `.xlsx` Excel file to create up to 1,000,000 customer records asynchronously in the background
- 🔄 **Real-time UI Sync** — Dashboard automatically refreshes after any create/edit/bulk operation

---

## 🏗️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite 8, Ant Design 6, TanStack Query 5, Axios, TypeScript |
| Backend   | Spring Boot 2.7, Spring Data JPA, Hibernate 5   |
| Database  | MariaDB 10.11                                   |
| Container | Docker, Docker Compose                          |

---

## 🚀 Running Locally (Recommended for Best Performance)

Running locally gives you hot-module replacement, faster build times, and direct database access — ideal for development.

### Prerequisites

| Tool         | Version     |
|--------------|-------------|
| Java JRE/JDK | 8+          |
| Node.js      | 22.12+      |
| MariaDB      | 10.x        |
| Maven        | 3.8+        |

### 1. Set Up the Database

Start your local MariaDB instance and create the database:

```sql
CREATE DATABASE customer_db;
```

### 2. Configure the Backend

Edit `backend/src/main/resources/application.properties` to match your local database credentials:

```properties
spring.datasource.url=jdbc:mariadb://localhost:3306/customer_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

> The API will be available at **http://localhost:8080/api**

### 4. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

> The app will be available at **http://localhost:5173**

---

## 🐳 Running with Docker Compose

Docker Compose will spin up all three services — MariaDB, Spring Boot, and the Nginx-served React app — with a single command.

> ⚠️ **Note:** The Docker setup is suitable for testing and demonstration. For active development, the local setup above is significantly faster due to hot-reload and direct debugging capabilities.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

### Steps

From the **project root** directory:

```bash
docker-compose up --build
```

This will:
1. Pull and start a **MariaDB 10.11** container
2. Build and run the **Spring Boot** backend (waits for the DB to be healthy)
3. Build the React app and serve it via **Nginx**

### Service URLs (Docker)

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:8080/api    |
| Database | `localhost:3300` (host)      |

### Stopping the Stack

```bash
docker-compose down
```

To also remove persisted database data:

```bash
docker-compose down -v
```

---

## 📁 Project Structure

```
cms/
├── backend/                   # Spring Boot application
│   ├── src/main/java/         # Java source files
│   ├── src/main/resources/    # application.properties, SQL scripts
│   └── Dockerfile
│
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── components/        # Reusable UI components (CustomerTable, AddressForm, ...)
│   │   ├── hooks/             # TanStack Query data hooks
│   │   ├── pages/             # Page-level components (Dashboard, Create, Edit, View, Bulk)
│   │   ├── services/          # Axios API service layer
│   │   └── types/             # TypeScript type definitions
│   └── Dockerfile
│
└── docker-compose.yml         # Full-stack orchestration
```

---

## 📊 Bulk Upload Format

For the Bulk Create feature, prepare an `.xlsx` file with the following column structure (row 1 is a header and will be skipped):

| Column | Field              | Example          |
|--------|--------------------|------------------|
| 1      | Full Name          | Jane Smith       |
| 2      | Date of Birth      | 1985-08-22       |
| 3      | NIC Number         | 987654321V       |
| 4      | Mobile Numbers     | 0779876543       |

> The system processes records asynchronously and is optimized for files with up to **1,000,000 rows**.

---

## 📜 API Overview

| Method | Endpoint                               | Description                          |
|--------|----------------------------------------|--------------------------------------|
| GET    | `/api/customers`                       | Get paginated customer list          |
| GET    | `/api/customers/{id}`                  | Get customer by ID                   |
| POST   | `/api/customers`                       | Create a new customer                |
| PUT    | `/api/customers/{id}`                  | Update an existing customer          |
| POST   | `/api/customers/bulk`                  | Bulk create from `.xlsx` file        |
| GET    | `/api/locations/countries`             | Get list of all countries            |
| GET    | `/api/locations/countries/{id}/cities` | Get cities for a given country       |

> Full API documentation can be found in `backend/docs/API.md`.
