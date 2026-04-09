import express from 'express';
import {fetchAllUsers, fetchUserById, updateUserData, deleteUserData} from "#controllers/users.controller.js";
import {requireAdmin, requireAuthOrAdmin} from "#middleware/permissions.middleware.js";

const router = express.Router();

// Get all users - no auth required
router.get('/', fetchAllUsers);

// Get user by ID - only admin or own user
router.get('/:id', requireAuthOrAdmin, fetchUserById);

// Update user - only own user or admin
router.put('/:id', requireAuthOrAdmin, updateUserData);

// Delete user - only admin
router.delete('/:id', requireAdmin, deleteUserData);

export default router;