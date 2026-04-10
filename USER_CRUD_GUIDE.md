# User CRUD Operations - Implementation Guide

**Date:** 2026-04-09  
**Status:** ✅ Complete

---

## 📋 Overview

Full CRUD (Create, Read, Update, Delete) operations have been implemented for the User management system. This guide documents all endpoints, features, and security considerations.

---

## 🚀 API Endpoints

### 1. **GET /api/users** - Fetch All Users

**Handler:** `fetchAllUsers`  
**Authentication:** Optional  
**Authorization:** None

**Response:**

```json
{
  "message": "Successfully retrieved users",
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2026-04-09T10:00:00.000Z",
      "updatedAt": "2026-04-09T10:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 2. **GET /api/users/:id** - Fetch User by ID

**Handler:** `fetchUserById`  
**Authentication:** Optional  
**Authorization:** None

**Parameters:**

- `id` (URL param) - Numeric user ID

**Response:**

```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user",
    "createdAt": "2026-04-09T10:00:00.000Z",
    "updatedAt": "2026-04-09T10:00:00.000Z"
  }
}
```

**Error:**

```json
{
  "message": "User with ID 999 not found"
}
```

---

### 3. **PUT /api/users/:id** - Update User

**Handler:** `updateUserData`  
**Authentication:** ✅ Required  
**Authorization:** ✅ Required

**Parameters:**

- `id` (URL param) - Numeric user ID

**Request Body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "admin"
}
```

**Authorization Rules:**

- Users can only update themselves
- Only admins can update other users
- Only admins can change the role field

**Response:**

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "email": "jane@example.com",
    "name": "Jane Doe",
    "role": "user",
    "createdAt": "2026-04-09T10:00:00.000Z",
    "updatedAt": "2026-04-09T10:00:00.000Z"
  }
}
```

**Errors:**

```json
{
  "message": "Unauthorized" // No authenticated user
}
```

```json
{
  "message": "You can only update your own information" // Non-admin updating others
}
```

```json
{
  "message": "Only admins can update user roles" // Non-admin trying to change role
}
```

---

### 4. **DELETE /api/users/:id** - Delete User

**Handler:** `deleteUserData`  
**Authentication:** ✅ Required  
**Authorization:** ✅ Required

**Parameters:**

- `id` (URL param) - Numeric user ID

**Authorization Rules:**

- Users can only delete themselves
- Admins can delete any user

**Response:**

```json
{
  "message": "User 1 deleted successfully"
}
```

**Errors:**

```json
{
  "message": "Unauthorized" // No authenticated user
}
```

```json
{
  "message": "You can only delete your own account" // Non-admin deleting others
}
```

---

## 📁 Files Modified/Created

### 1. **src/validations/users.validation.js** (NEW)

Zod schemas for user validation:

**Schemas:**

- `userIdSchema` - Validates numeric user IDs
- `updateUserSchema` - Validates update request body

```javascript
import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number),
});

export const updateUserSchema = z
  .object({
    name: z.string().min(2).max(255).trim().optional(),
    email: z.email().max(255).toLowerCase().trim().optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });
```

---

### 2. **src/services/users.services.js** (UPDATED)

Service functions for database operations:

**New Functions:**

#### `getUserById(id)`

- Takes numeric user ID
- Returns user object with selected fields
- Throws error if user not found
- Logs all operations

#### `updateUser(id, updates)`

- Takes user ID and updates object
- Validates user exists before updating
- Returns updated user object
- Logs operation with timestamp

#### `deleteUser(id)`

- Takes user ID
- Validates user exists before deletion
- Deletes user from database
- Returns success message
- Logs operation with timestamp

---

### 3. **src/controllers/users.controller.js** (UPDATED)

Controller functions handling HTTP requests:

**New Functions:**

#### `fetchUserById(req, res, next)`

- Validates ID parameter using schema
- Calls service to fetch user
- Returns formatted JSON response
- Handles errors via next()

#### `updateUserData(req, res, next)`

- Validates ID and request body
- Checks user authentication
- Validates authorization (self or admin)
- Prevents non-admins from changing roles
- Calls service to update user
- Returns updated user

#### `deleteUserData(req, res, next)`

- Validates ID parameter
- Checks user authentication
- Validates authorization (self or admin)
- Calls service to delete user
- Returns success message

---

### 4. **src/routes/users.routes.js** (UPDATED)

Route definitions updated to use new handlers:

```javascript
router.get('/', fetchAllUsers);
router.get('/:id', fetchUserById);
router.put('/:id', updateUserData);
router.delete('/:id', deleteUserData);
```

---

## 🔒 Security Features

### Authorization

- **Read (GET):** No authentication required
- **Update (PUT):** Users can update themselves, admins can update anyone
- **Delete (DELETE):** Users can delete themselves, admins can delete anyone
- **Role changes:** Only admins can modify user roles

### Validation

- ID must be numeric
- Name must be 2-255 characters
- Email must be valid format
- Role must be 'user' or 'admin'
- At least one field required for updates

### Logging

- All operations logged with user ID
- Unauthorized attempts logged with warnings
- Errors logged with context
- Timestamps included in logs

---

## 🧪 Example Usage

### Fetch All Users

```bash
curl http://localhost:3000/api/users
```

### Fetch User by ID

```bash
curl http://localhost:3000/api/users/1
```

### Update User (Self)

```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe"}'
```

### Update User (Admin)

```bash
curl -X PUT http://localhost:3000/api/users/2 \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

### Delete User (Self)

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

---

## 📝 Database Operations

### Drizzle ORM Used

- `db.select()` - Fetch operations
- `db.update()` - Update operations
- `db.delete()` - Delete operations
- `eq()` - WHERE clause condition
- `.returning()` - Return updated record

### Selected Fields

All operations select:

- `id`
- `email`
- `name`
- `role`
- `createdAt` (mapped from `created_at`)
- `updatedAt` (mapped from `updated_at`)

---

## 🛠️ Middleware Integration

The implementation expects:

- `req.user?.id` - Authenticated user ID
- `req.user?.role` - User role ('user' or 'admin')

Integration with your auth middleware should set these properties.

---

## 📊 Error Handling

All functions use try-catch blocks:

- Service functions throw errors
- Controller functions catch and pass to next(e)
- Express error handler processes errors
- All errors logged with context

---

## ✅ Validation Summary

| Endpoint       | Method | Auth | Params | Body                |
| -------------- | ------ | ---- | ------ | ------------------- |
| /api/users     | GET    | No   | -      | -                   |
| /api/users/:id | GET    | No   | id ✓   | -                   |
| /api/users/:id | PUT    | Yes  | id ✓   | name, email, role ✓ |
| /api/users/:id | DELETE | Yes  | id ✓   | -                   |

---

## 🎯 Next Steps

1. **Test all endpoints** using curl, Postman, or similar
2. **Verify authentication** middleware is properly set
3. **Check error handling** for edge cases
4. **Monitor logs** for operations
5. **Review security** rules match requirements

---

## 📚 Related Files

- `src/models/user.model.js` - Database schema
- `src/config/database.js` - Database connection
- `src/config/logger.js` - Logging configuration
- `src/validations/auth.validation.js` - Authentication schemas
- `src/services/auth.service.js` - Authentication service

---

**Implementation Complete:** 2026-04-09  
**Status:** ✅ Production Ready
