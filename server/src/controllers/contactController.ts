import { Request, Response } from 'express';
import Contact from '../models/Contact';

export const createContact = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }
    const contact = await Contact.create({ name, email, subject, message });
    return res.status(201).json(contact);
  } catch (error) {
    console.error('Contact create error:', error);
    return res.status(500).json({ message: 'Gửi liên hệ thất bại.' });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await Contact.findAll({ order: [['createdAt', 'DESC']] });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Không lấy được danh sách liên hệ.' });
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Contact.destroy({ where: { id } });
    if (deleted) {
      return res.json({ message: 'Xóa liên hệ thành công.' });
    }
    return res.status(404).json({ message: 'Không tìm thấy liên hệ.' });
  } catch (error) {
    return res.status(500).json({ message: 'Xóa liên hệ thất bại.' });
  }
}; 