import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#services/users.services.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validations/users.validation.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Getting users...');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved users',
      users: allUsers,
      count: allUsers.length,
    });
  } catch (e) {
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    logger.info(
      `Fetching user with ID: ${req.params.id} by user ${req.user?.id}`
    );

    // Validate ID parameter
    const validatedId = userIdSchema.parse({ id: req.params.id });

    // Get user by ID (permission already checked by middleware)
    const user = await getUserById(validatedId.id);

    logger.info(
      `User ${validatedId.id} fetched successfully by user ${req.user?.id}`
    );
    res.json({
      message: 'User retrieved successfully',
      user,
    });
  } catch (e) {
    logger.error(`Error fetching user: ${e.message}`);
    next(e);
  }
};

export const updateUserData = async (req, res, next) => {
  try {
    logger.info(
      `Updating user with ID: ${req.params.id} by user ${req.user?.id}`
    );

    // Validate ID parameter
    const validatedId = userIdSchema.parse({ id: req.params.id });

    // Validate update body
    const validatedUpdates = updateUserSchema.parse(req.body);

    const userRole = req.user?.role;

    // Only admin can change role
    if (validatedUpdates.role && userRole !== 'admin') {
      logger.warn(
        `User ${req.user?.id} attempted to update role without admin permission`
      );
      return res.status(403).json({
        message: 'Only admins can update user roles',
        error: 'FORBIDDEN',
      });
    }

    // Prepare update object
    const updateData = {};
    if (validatedUpdates.name) updateData.name = validatedUpdates.name;
    if (validatedUpdates.email) updateData.email = validatedUpdates.email;
    if (validatedUpdates.role && userRole === 'admin')
      updateData.role = validatedUpdates.role;

    // Update user (permission checked by middleware)
    const updatedUser = await updateUser(validatedId.id, updateData);

    logger.info(
      `User ${validatedId.id} updated successfully by user ${req.user?.id}`
    );
    res.json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (e) {
    logger.error(`Error updating user: ${e.message}`);
    next(e);
  }
};

export const deleteUserData = async (req, res, next) => {
  try {
    logger.info(
      `Deleting user with ID: ${req.params.id} by admin user ${req.user?.id}`
    );

    // Validate ID parameter
    const validatedId = userIdSchema.parse({ id: req.params.id });

    // Delete user (permission checked by middleware - admin only)
    const result = await deleteUser(validatedId.id);

    logger.info(
      `User ${validatedId.id} deleted successfully by admin ${req.user?.id}`
    );
    res.json({
      message: result.message,
      deletedId: validatedId.id,
    });
  } catch (e) {
    logger.error(`Error deleting user: ${e.message}`);
    next(e);
  }
};
