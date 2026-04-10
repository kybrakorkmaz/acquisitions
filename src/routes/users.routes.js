import express from 'express';
import {fetchAllUsers, fetchUserById, updateUserData, deleteUserData} from "#controllers/users.controller.js";
import {requireAdmin, requireAuthOrAdmin} from "#middleware/permissions.middleware.js";
import {authenticateStrict} from "#middleware/authenticate.middleware.js";

const router = express.Router();

// Get all users - no auth required
router.get('/', fetchAllUsers);

// Get user by ID - requires authentication and authorization (own data or admin)
router.get('/:id', authenticateStrict, requireAuthOrAdmin, fetchUserById);

// Update user - requires authentication and authorization (own data or admin)
router.put('/:id', authenticateStrict, requireAuthOrAdmin, updateUserData);

// Delete user - requires authentication and admin role
router.delete('/:id', authenticateStrict, requireAdmin, deleteUserData);

export default router;