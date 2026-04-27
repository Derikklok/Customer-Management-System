# Customer Management API Documentation

Base URL: `http://localhost:8080/api/customers`

---

## 1. Get All Customers (Paginated)
Retrieves a paginated list of all customer records.

**Endpoint:** `GET /api/customers`
**Query Parameters (Optional):**
- `page` (default: 0): Page number to retrieve.
- `size` (default: 20): Number of records per page.
- `sort` (default: name): Field to sort by (e.g., `name,asc` or `dateOfBirth,desc`).

**Sample Request:**
```http
GET /api/customers?page=0&size=5
```

**Sample Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1001,
      "name": "John Doe",
      "dateOfBirth": "1990-05-15",
      "nicNumber": "123456789V",
      "mobileNumbers": ["0712345678"],
      "addresses": [],
      "familyMembers": []
    }
  ],
  "pageable": {
    "sort": { "sorted": true, "unsorted": false },
    "pageNumber": 0,
    "pageSize": 5
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true
}
```

---

## 2. Get Customer by ID
Retrieves details of a specific customer by their ID.

**Endpoint:** `GET /api/customers/{id}`

**Sample Request:**
```http
GET /api/customers/1001
```

**Sample Response (200 OK):**
```json
{
  "id": 1001,
  "name": "John Doe",
  "dateOfBirth": "1990-05-15",
  "nicNumber": "123456789V",
  "mobileNumbers": ["0712345678", "0771234567"],
  "addresses": [
    {
      "id": 1,
      "addressLine1": "123 Main St",
      "addressLine2": "Apt 4B",
      "cityName": "Colombo",
      "countryName": "Sri Lanka"
    }
  ],
  "familyMembers": []
}
```

---

## 3. Create a New Customer
Creates a new customer record. 

**Endpoint:** `POST /api/customers`

**Sample Request:**
```http
POST /api/customers
Content-Type: application/json

{
  "name": "Jane Smith",
  "dateOfBirth": "1985-08-22",
  "nicNumber": "987654321V",
  "mobileNumbers": ["0779876543"],
  "addresses": [
    {
      "addressLine1": "456 Side St",
      "addressLine2": "",
      "cityId": 2,
      "countryId": 1
    }
  ],
  "familyMemberIds": []
}
```

**Sample Response (201 Created):**
```json
{
  "id": 1002,
  "name": "Jane Smith",
  "dateOfBirth": "1985-08-22",
  "nicNumber": "987654321V",
  "mobileNumbers": ["0779876543"],
  "addresses": [
    {
      "id": 2,
      "addressLine1": "456 Side St",
      "addressLine2": "",
      "cityName": "Kandy",
      "countryName": "Sri Lanka"
    }
  ],
  "familyMembers": []
}
```

---

## 4. Update an Existing Customer
Updates an existing customer record by ID. Replaces existing addresses and family member links.

**Endpoint:** `PUT /api/customers/{id}`

**Sample Request:**
```http
PUT /api/customers/1002
Content-Type: application/json

{
  "name": "Jane Smith Updated",
  "dateOfBirth": "1985-08-22",
  "nicNumber": "987654321V",
  "mobileNumbers": ["0779876543", "0112345678"],
  "addresses": [
    {
      "addressLine1": "456 Side St",
      "addressLine2": "Floor 2",
      "cityId": 2,
      "countryId": 1
    }
  ],
  "familyMemberIds": [1001]
}
```

**Sample Response (200 OK):**
```json
{
  "id": 1002,
  "name": "Jane Smith Updated",
  "dateOfBirth": "1985-08-22",
  "nicNumber": "987654321V",
  "mobileNumbers": ["0779876543", "0112345678"],
  "addresses": [
    {
      "id": 3,
      "addressLine1": "456 Side St",
      "addressLine2": "Floor 2",
      "cityName": "Kandy",
      "countryName": "Sri Lanka"
    }
  ],
  "familyMembers": [
    {
      "id": 1001,
      "name": "John Doe",
      "nicNumber": "123456789V"
    }
  ]
}
```

---

## 4.1 Partial Update Customer (PATCH)
Updates specific fields of a customer record by ID without replacing the entire entity. Only include the fields you want to change. (Addresses and Family Members not supported by this partial endpoint yet)

**Endpoint:** `PATCH /api/customers/{id}`

**Sample Request:**
```http
PATCH /api/customers/1002
Content-Type: application/json

{
  "name": "Jane Smith Patched",
  "mobileNumbers": ["0711111111"]
}
```

**Sample Response (200 OK):**
```json
{
  "id": 1002,
  "name": "Jane Smith Patched",
  "dateOfBirth": "1985-08-22",
  "nicNumber": "987654321V",
  "mobileNumbers": ["0711111111"],
  "addresses": [...],
  "familyMembers": [...]
}
```

---

## 5. Bulk Create Customers from Excel (Async)
Uploads an `.xlsx` file containing customer records to be processed and inserted in the background. Highly optimized for large files (up to 1M records).

**Endpoint:** `POST /api/customers/bulk`

**Request Format:** `multipart/form-data`
- `file` (File): The `.xlsx` Excel file to process.

**Sample Request (cURL):**
```bash
curl --location 'http://localhost:8080/api/customers/bulk' \
--form 'file=@"/path/to/customers_1m.xlsx"'
```

**Sample Response (202 Accepted):**
```json
{
    "message": "File uploaded successfully. Processing started in background."
}
```

**Note on File Structure:**
The Excel file should omit a header row (or have exactly 1 header row that will be skipped) and contain data in the following cell index order:
- **Index 0:** Name (`String`)
- **Index 1:** Date of Birth (`Date` or `String` parseable)
- **Index 2:** NIC Number (`String`)

Created LocationController which exposes these services as REST endpoints under /api/locations.
GET /api/locations/countries — Retrieves the list of all countries.

```bash
[
    {
        "id": 2,
        "name": "India"
    },
    {
        "id": 1,
        "name": "Sri Lanka"
    },
    {
        "id": 4,
        "name": "UK"
    },
    {
        "id": 3,
        "name": "USA"
    }
]

```
GET /api/locations/countries/{countryId}/cities — Retrieves the list of cities for the selected country ID.

```bash
[
    {
        "id": 1,
        "name": "Colombo"
    },
    {
        "id": 2,
        "name": "Kandy"
    },
    {
        "id": 3,
        "name": "Galle"
    },
    {
        "id": 11,
        "name": "Colombo"
    },
    {
        "id": 12,
        "name": "Kandy"
    },
    {
        "id": 13,
        "name": "Galle"
    },
    {
        "id": 21,
        "name": "Colombo"
    },
    {
        "id": 22,
        "name": "Kandy"
    },
    {
        "id": 23,
        "name": "Galle"
    },
    {
        "id": 31,
        "name": "Colombo"
    },
    {
        "id": 32,
        "name": "Kandy"
    },
    {
        "id": 33,
        "name": "Galle"
    },
    {
        "id": 41,
        "name": "Colombo"
    },
    {
        "id": 42,
        "name": "Kandy"
    },
    {
        "id": 43,
        "name": "Galle"
    },
    {
        "id": 51,
        "name": "Colombo"
    },
    {
        "id": 52,
        "name": "Kandy"
    },
    {
        "id": 53,
        "name": "Galle"
    },
    {
        "id": 61,
        "name": "Colombo"
    },
    {
        "id": 62,
        "name": "Kandy"
    },
    {
        "id": 63,
        "name": "Galle"
    },
    {
        "id": 71,
        "name": "Colombo"
    },
    {
        "id": 72,
        "name": "Kandy"
    },
    {
        "id": 73,
        "name": "Galle"
    },
    {
        "id": 81,
        "name": "Colombo"
    },
    {
        "id": 82,
        "name": "Kandy"
    },
    {
        "id": 83,
        "name": "Galle"
    },
    {
        "id": 91,
        "name": "Colombo"
    },
    {
        "id": 92,
        "name": "Kandy"
    },
    {
        "id": 93,
        "name": "Galle"
    },
    {
        "id": 101,
        "name": "Colombo"
    },
    {
        "id": 102,
        "name": "Kandy"
    },
    {
        "id": 103,
        "name": "Galle"
    },
    {
        "id": 111,
        "name": "Colombo"
    },
    {
        "id": 112,
        "name": "Kandy"
    },
    {
        "id": 113,
        "name": "Galle"
    },
    {
        "id": 121,
        "name": "Colombo"
    },
    {
        "id": 122,
        "name": "Kandy"
    },
    {
        "id": 123,
        "name": "Galle"
    },
    {
        "id": 131,
        "name": "Colombo"
    },
    {
        "id": 132,
        "name": "Kandy"
    },
    {
        "id": 133,
        "name": "Galle"
    },
    {
        "id": 141,
        "name": "Colombo"
    },
    {
        "id": 142,
        "name": "Kandy"
    },
    {
        "id": 143,
        "name": "Galle"
    }
]
```