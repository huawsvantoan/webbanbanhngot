import express from 'express';
import { createContact, getContacts, deleteContact } from '../controllers/contactController';
import { protect, isAdmin } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, createContact); // Khách gửi liên hệ (phải đăng nhập)
router.get('/', protect, isAdmin, getContacts); // Admin xem danh sách
router.delete('/:id', protect, isAdmin, deleteContact);

export default router; 