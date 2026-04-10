import { db } from '#config/database.js';
import { users } from '#models/user.model.js';
import logger from '#config/logger.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users);
    logger.info(allUsers);
    return allUsers;
  } catch (e) {
    logger.error('Error getting users', e);
    throw e;
  }
};

export const getUserById = async id => {
  try {
    const user = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, id));

    if (!user || user.length === 0) {
      logger.warn(`User with ID ${id} not found`);
      throw new Error(`User with ID ${id} not found`);
    }

    logger.info(`User ${id} retrieved successfully`);
    return user[0];
  } catch (e) {
    logger.error(`Error getting user by ID ${id}`, e);
    throw e;
  }
};

export const updateUser = async (id, updates) => {
  try {
    // Check if user exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id));

    if (!existingUser || existingUser.length === 0) {
      logger.warn(`User with ID ${id} not found for update`);
      throw new Error(`User with ID ${id} not found`);
    }

    // Update user
    const updatedUser = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        createdAt: users.created_at,
        updatedAt: users.updated_at,
      });

    logger.info(`User ${id} updated successfully`);
    return updatedUser[0];
  } catch (e) {
    logger.error(`Error updating user with ID ${id}`, e);
    throw e;
  }
};

export const deleteUser = async id => {
  try {
    // Check if user exists
    const existingUser = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id));

    if (!existingUser || existingUser.length === 0) {
      logger.warn(`User with ID ${id} not found for deletion`);
      throw new Error(`User with ID ${id} not found`);
    }

    // Delete user
    await db.delete(users).where(eq(users.id, id));

    logger.info(`User ${id} deleted successfully`);
    return { message: `User ${id} deleted successfully` };
  } catch (e) {
    logger.error(`Error deleting user with ID ${id}`, e);
    throw e;
  }
};
