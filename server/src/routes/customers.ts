import express from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  getAllSupportTickets,
  updateSupportTicketStatus,
} from '../controllers/customerController';

const router = express.Router();

router.route('/admin/customers')
  .get(protect, authorize(['admin']), getAllCustomers);

router.route('/admin/customers/:id')
  .get(protect, authorize(['admin']), getCustomerById);

router.route('/admin/customers/:id/status')
  .put(protect, authorize(['admin']), updateCustomerStatus);

router.route('/admin/support-tickets')
  .get(protect, authorize(['admin']), getAllSupportTickets);

router.route('/admin/support-tickets/:id/status')
  .put(protect, authorize(['admin']), updateSupportTicketStatus);

export default router; 