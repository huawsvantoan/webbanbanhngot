import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  getUsers,
  deleteUser,
  updateUserRole,
  restoreUser,
  deleteUserPermanent,
} from '../controllers/userController';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.route('/').get(protect, authorize(['admin']), getAllUsers);
router.route('/:id')
  .get(protect, authorize(['admin']), getUserById)
  .put(protect, authorize(['admin']), updateUserStatus)
  .delete(protect, authorize(['admin']), deleteUser);

// router.get('/', protect, authorize(['admin']), getUsers); // XÓA HOẶC COMMENT DÒNG NÀY

router.put('/:id/role', protect, authorize(['admin']), updateUserRole);

router.put('/:id/restore', protect, authorize(['admin']), asyncHandler(restoreUser));

router.delete('/:id/permanent', protect, authorize(['admin']), deleteUserPermanent);

export default router; 