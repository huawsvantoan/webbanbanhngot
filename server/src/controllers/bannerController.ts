import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

// Placeholder for Banner Model (will be created later)
interface Banner {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  button_text: string;
  button_link: string;
  position: number;
  is_active: boolean;
}

// Mock database for now
let banners: Banner[] = [
  {
    id: 1,
    title: 'Banner 1',
    subtitle: 'Subtitle 1',
    description: 'Description for banner 1',
    image: '/images/default-cake.jpg',
    button_text: 'Shop Now',
    button_link: '/products',
    position: 1,
    is_active: true,
  },
  {
    id: 2,
    title: 'Banner 2',
    subtitle: 'Subtitle 2',
    description: 'Description for banner 2',
    image: '/images/default-cake.jpg',
    button_text: 'Learn More',
    button_link: '/about',
    position: 2,
    is_active: false,
  },
];

// @desc    Get all banners
// @route   GET /api/admin/banners
// @access  Admin
export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json(banners);
});

// @desc    Create new banner
// @route   POST /api/admin/banners
// @access  Admin
export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  const { title, subtitle, description, image, button_text, button_link, position, is_active } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: 'Tiêu đề phải có ít nhất 3 ký tự' });
  }
  if (!/^[a-zA-ZÀ-ỹ0-9_\s]+$/.test(title.trim())) {
    return res.status(400).json({ message: 'Tiêu đề chỉ được chứa chữ, số, dấu gạch dưới và khoảng trắng' });
  }
  if (description && description.length > 255) {
    return res.status(400).json({ message: 'Mô tả không được vượt quá 255 ký tự' });
  }
  if (image && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(image)) {
    return res.status(400).json({ message: 'Đường dẫn hình ảnh không hợp lệ (phải là URL ảnh)' });
  }

  const newBanner: Banner = {
    id: banners.length > 0 ? Math.max(...banners.map(b => b.id)) + 1 : 1,
    title,
    subtitle,
    description,
    image,
    button_text,
    button_link,
    position: position || banners.length + 1,
    is_active: is_active !== undefined ? is_active : true,
  };

  banners.push(newBanner);
  return res.status(201).json(newBanner);
});

// @desc    Update banner
// @route   PUT /api/admin/banners/:id
// @access  Admin
export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, subtitle, description, image, button_text, button_link, position, is_active } = req.body;

  let banner = banners.find(b => b.id === parseInt(id));

  if (!banner) {
    return res.status(404).json({ message: 'Không tìm thấy banner' });
  }

  banner.title = title || banner.title;
  banner.subtitle = subtitle || banner.subtitle;
  banner.description = description || banner.description;
  banner.image = image || banner.image;
  banner.button_text = button_text || banner.button_text;
  banner.button_link = button_link || banner.button_link;
  banner.position = position !== undefined ? position : banner.position;
  banner.is_active = is_active !== undefined ? is_active : banner.is_active;

  return res.status(200).json(banner);
});

// @desc    Delete banner
// @route   DELETE /api/admin/banners/:id
// @access  Admin
export const deleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const initialLength = banners.length;
  banners = banners.filter(banner => banner.id !== parseInt(id));

  if (banners.length === initialLength) {
    return res.status(404).json({ message: 'Không tìm thấy banner' });
  }

  return res.status(200).json({ message: 'Banner đã được xóa thành công' });
}); 