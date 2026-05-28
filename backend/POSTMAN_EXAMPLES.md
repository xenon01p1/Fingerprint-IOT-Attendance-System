# Backend API - Postman Examples

## Base URL
```
http://localhost:8000
```

---

## Admin Endpoints

### 1. Get All Admins
**GET** `/api/admin?page=1&pageSize=10`

### 2. Get Single Admin
**GET** `/api/admin/:adminId`

Example: `http://localhost:8000/api/admin/clyr1example1`

### 3. Create Admin
**POST** `/api/admin`

**Body (JSON):**
```json
{
  "username": "newadmin",
  "password": "SecurePass123!",
  "email": "admin@example.com",
  "phoneNumber": "+62812345678"
}
```

### 4. Update Admin ⭐
**PUT** `/api/admin/:adminId`

Example: `http://localhost:8000/api/admin/clyr1example1`

**Body (JSON):**
```json
{
  "username": "updatedadmin",
  "email": "updated@example.com",
  "phoneNumber": "+62887654321"
}
```

**Note:** You can update individual fields - send only what you want to change.

### 5. Delete Admin ⭐
**DELETE** `/api/admin/:adminId`

Example: `http://localhost:8000/api/admin/clyr1example1`

No body required.

---

## Employee Endpoints

### 1. Get All Employees
**GET** `/api/employee?page=1&pageSize=10`

### 2. Get Single Employee
**GET** `/api/employee/:employeeId`

Example: `http://localhost:8000/api/employee/clyemp1example1`

### 3. Create Employee
**POST** `/api/employee`

**Body (JSON):**
```json
{
  "employeeNumber": 1001,
  "fullname": "John Doe",
  "username": "johndoe",
  "password": "SecurePass123!",
  "email": "john@company.com",
  "phoneNumber": "+6281234567890",
  "companyId": "clyrcompany1",
  "role": "regular",
  "employeeStatus": "active"
}
```

### 4. Update Employee ⭐
**PUT** `/api/employee/:employeeId`

Example: `http://localhost:8000/api/employee/clyemp1example1`

**Body (JSON):**
```json
{
  "fullname": "John Smith",
  "phoneNumber": "+6281234567890",
  "role": "supervisor",
  "employeeStatus": "onLeave"
}
```

**Available fields to update:**
- `fullname`
- `email`
- `phoneNumber`
- `role` (regular, supervisor)
- `employeeStatus` (active, onLeave, resigned)

### 5. Delete Employee ⭐
**DELETE** `/api/employee/:employeeId`

Example: `http://localhost:8000/api/employee/clyemp1example1`

No body required.

---

## Testing Steps in Postman

### For PUT (Edit) Request:
1. Select **PUT** method
2. Enter the endpoint URL with the ID
3. Go to **Body** tab
4. Select **raw** and **JSON**
5. Paste the JSON payload
6. Click **Send**

**Expected Response:**
```json
{
  "status": true,
  "message": "Admin updated successfully",
  "data": {
    "id": "clyr1example1",
    "username": "updatedadmin",
    "email": "updated@example.com",
    "phoneNumber": "+62887654321",
    "createdAt": "2026-05-28T10:30:00Z",
    "updatedAt": "2026-05-28T12:45:00Z",
    "isDeleted": false
  }
}
```

### For DELETE Request:
1. Select **DELETE** method
2. Enter the endpoint URL with the ID
3. Click **Send** (no body needed)

**Expected Response:**
```json
{
  "status": true,
  "message": "Admin deleted successfully",
  "data": {
    "id": "clyr1example1"
  }
}
```

---

## Environment Variables (Optional)

You can set up environment variables in Postman to make testing easier:

1. Create a new environment
2. Add variables:
   ```
   base_url = http://localhost:8000
   admin_id = (paste actual admin ID)
   employee_id = (paste actual employee ID)
   ```

3. Use in URLs like: `{{base_url}}/api/admin/{{admin_id}}`

---

## Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success (GET, PUT, DELETE) |
| 201 | Created (POST) |
| 400 | Bad Request (Invalid data) |
| 404 | Not Found (ID doesn't exist) |
| 500 | Server Error |

---

## Tips

- Always include valid IDs (use GET endpoints to find them first)
- For password fields, use strong passwords
- Phone numbers should follow your validation rules
- Email must be unique across the system
- Username must be unique across the system
