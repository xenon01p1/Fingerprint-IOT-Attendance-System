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

## Attendance Endpoints

### 1. Get All Attendance Records
**GET** `/api/attendance?page=1&pageSize=10`

**Response:**
```json
{
  "status": true,
  "message": "Attendance records retrieved successfully",
  "data": {
    "items": [
      {
        "id": "attendance-id-1",
        "type": "checkIn",
        "employee": {
          "id": "emp-id",
          "employeeNumber": 1001,
          "fullname": "John Doe",
          "username": "johndoe",
          "email": "john@company.com"
        },
        "device": {
          "id": "device-id",
          "name": "Device 01",
          "location": "Gate A"
        },
        "createdAt": "2026-05-28T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 22,
      "totalPages": 3
    }
  }
}
```

### 2. Get Single Attendance Record
**GET** `/api/attendance/:attendanceId`

Example: `http://localhost:8000/api/attendance/attendance-id-1`

### 3. Create Attendance Record
**POST** `/api/attendance`

**Body (JSON):**
```json
{
  "type": "checkIn",
  "employeeId": "emp-id-123",
  "deviceId": "device-id-456"
}
```

**Available types:** `checkIn` or `checkOut`

**Note:** `deviceId` is optional (for manual admin entries)

---

## Device Endpoints

### 1. Get All Devices
**GET** `/api/device?page=1&pageSize=10`

**Response:**
```json
{
  "status": true,
  "message": "Devices retrieved successfully",
  "data": {
    "items": [
      {
        "id": "device-001",
        "name": "Fingerprint Device A",
        "address": "123 Main Street",
        "location": "Main Gate",
        "createdAt": "2026-05-28T10:30:00Z",
        "updatedAt": "2026-05-28T10:30:00Z",
        "companyId": "company-123",
        "isDeleted": false
      },
      {
        "id": "device-002",
        "name": "Fingerprint Device B",
        "address": "456 Side Avenue",
        "location": "Back Entrance",
        "createdAt": "2026-05-29T09:15:00Z",
        "updatedAt": "2026-05-29T09:15:00Z",
        "companyId": "company-123",
        "isDeleted": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 2,
      "totalPages": 1
    }
  }
}
```

### 2. Create Device
**POST** `/api/device`

**Body (JSON):**
```json
{
  "name": "Fingerprint Device C",
  "address": "789 Office Park",
  "location": "Front Lobby",
  "companyId": "company-123"
}
```

**Expected Response (201 Created):**
```json
{
  "status": true,
  "message": "Device created successfully",
  "data": {
    "id": "device-003"
  }
}
```

### 3. Update Device ⭐
**PUT** `/api/device/:deviceId`

Example: `http://localhost:8000/api/device/device-001`

**Body (JSON):**
```json
{
  "name": "Fingerprint Device A - Updated",
  "address": "123 Main Street, Suite 100",
  "location": "Main Gate - Entrance",
  "companyId": "company-123",
  "updatedAt": "2026-06-01T14:30:00Z"
}
```

**Expected Response (200 OK):**
```json
{
  "status": true,
  "message": "Device updated successfully",
  "data": {
    "id": "device-001",
    "name": "Fingerprint Device A - Updated",
    "address": "123 Main Street, Suite 100",
    "location": "Main Gate - Entrance",
    "createdAt": "2026-05-28T10:30:00Z",
    "updatedAt": "2026-06-01T14:30:00Z",
    "companyId": "company-123",
    "isDeleted": false
  }
}
```

**Note:** You can update individual fields - send only what you want to change.

### 4. Delete Device ⭐
**DELETE** `/api/device/:deviceId`

Example: `http://localhost:8000/api/device/device-001`

No body required.

**Expected Response (200 OK):**
```json
{
  "status": true,
  "message": "Device deleted successfully",
  "data": {
    "id": "device-001"
  }
}
```

---

## Testing Device Endpoints in Order

Follow these steps to test all device endpoints:

1. **GET All Devices** - First, retrieve all existing devices
2. **POST Create Device** - Create a new device with the dummy data above
3. **PUT Update Device** - Update the device you just created (use the returned `id`)
4. **DELETE Device** - Delete the device you updated

### Sample Test Flow:

```
Step 1: GET /api/device?page=1&pageSize=10
  → Copy the device ID from response

Step 2: POST /api/device
  → Get back device ID (e.g., device-003)

Step 3: PUT /api/device/device-003
  → Using the ID from Step 2

Step 4: DELETE /api/device/device-003
  → Using the same ID from Step 2
```

---

## Log Device Endpoints

### 1. Get All Log Device Records
**GET** `/api/logDevice?page=1&pageSize=10`

**Response:**
```json
{
  "status": true,
  "message": "Log device records retrieved successfully",
  "data": {
    "items": [
      {
        "id": "logdevice-id-1",
        "type": "checkIn",
        "fingerprintId": "fingerprint-id",
        "fingerprint": {
          "id": "fingerprint-id",
          "fingerPrintIndex": 1,
          "employeeId": "emp-id",
          "deviceId": "device-id"
        },
        "createdAt": "2026-05-28T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalItems": 22,
      "totalPages": 3
    }
  }
}
```

### 2. Get Single Log Device Record
**GET** `/api/logDevice/:logDeviceId`

Example: `http://localhost:8000/api/logDevice/logdevice-id-1`

### 3. Create Log Device Record
**POST** `/api/logDevice`

**Body (JSON):**
```json
{
  "type": "checkIn",
  "fingerprintId": "fingerprint-id-123",
  "deviceId": "device-id-456"
}
```

**Available types:** 
- `register` - Register fingerprint
- `finishRegister` - Finish registration
- `checkIn` - Check in event
- `checkOut` - Check out event
- `delete` - Delete event

---

## Tips

- Always include valid IDs (use GET endpoints to find them first)
- For password fields, use strong passwords
- Phone numbers should follow your validation rules
- Email must be unique across the system
- Username must be unique across the system


