import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { BannerModel, CreateBannerData } from '../models/Banner';

// @desc    Get all banners (Public)
// @route   GET /api/banners
// @access  Public
export const getPublicBanners = asyncHandler(async (req: Request, res: Response) => {
  const banners = await BannerModel.getActiveBanners();
  res.status(200).json(banners);
});

// @desc    Get all banners (Admin)
// @route   GET /api/admin/banners
// @access  Admin
export const getBanners = asyncHandler(async (req: Request, res: Response) => {
  const banners = await BannerModel.getAllBanners();
  res.status(200).json(banners);
});

// @desc    Get all deleted banners (Admin)
// @route   GET /api/admin/banners/deleted
// @access  Admin
export const getDeletedBanners = asyncHandler(async (req: Request, res: Response) => {
  const banners = await BannerModel.getDeletedBanners();
  res.status(200).json(banners);
});

// @desc    Create new banner
// @route   POST /api/admin/banners
// @access  Admin
export const createBanner = asyncHandler(async (req: Request, res: Response) => {
  console.log('Create banner request body:', req.body); // Debug log
  const { title, description, image_url, link_url, is_active } = req.body;
  let { position } = req.body;

  if (!title || title.trim().length < 3) {
    return res.status(400).json({ message: 'Tiêu đề phải có ít nhất 3 ký tự' });
  }
  if (!/^[a-zA-ZÀ-ỹ0-9_\s]+$/.test(title.trim())) {
    return res.status(400).json({ message: 'Tiêu đề chỉ được chứa chữ, số, dấu gạch dưới và khoảng trắng' });
  }
  if (description && description.length > 255) {
    return res.status(400).json({ message: 'Mô tả không được vượt quá 255 ký tự' });
  }
  if (image_url) {
    // Chấp nhận đường dẫn tương đối bắt đầu bằng /
    if (image_url.startsWith('/')) {
      // Kiểm tra định dạng file hợp lệ
      if (!/\.(jpg|jpeg|png|webp|gif|avif)$/i.test(image_url)) {
        return res.status(400).json({ message: 'Đường dẫn hình ảnh không hợp lệ (định dạng file không được hỗ trợ)' });
      }
    }
    // Chấp nhận URL tuyệt đối
    else if (image_url.startsWith('http://') || image_url.startsWith('https://')) {
      // Bớt strict validation cho URL
    }
    // Chấp nhận blob URL (cho preview)
    else if (image_url.startsWith('blob:')) {
      // Không cần validate blob URL
    }
    // Chấp nhận đường dẫn upload từ server
    else if (image_url.includes('uploads/')) {
      // Đường dẫn từ upload server
    }
    else {
      return res.status(400).json({ message: 'Đường dẫn hình ảnh không hợp lệ' });
    }
  }

  // Kiểm tra vị trí trùng lặp và tự động sửa
  if (position) {
    const existingBanner = await BannerModel.getBannerByPosition(position);
    if (existingBanner) {
      // Tự động tìm vị trí tiếp theo có sẵn
      const nextAvailablePosition = await BannerModel.getNextAvailablePosition();
      console.log(`Vị trí ${position} đã được sử dụng, tự động chuyển sang vị trí ${nextAvailablePosition}`);
      position = nextAvailablePosition;
    }
  }

  const bannerData: CreateBannerData = {
    title,
    description,
    image_url,
    link_url: link_url || null,
    position: position || 1,
    is_active: is_active !== undefined ? is_active : 1,
  };

  const newBanner = await BannerModel.createBanner(bannerData);
  return res.status(201).json(newBanner);
});

// @desc    Update banner
// @route   PUT /api/admin/banners/:id
// @access  Admin
export const updateBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = { ...req.body };

  // Kiểm tra vị trí trùng lặp khi update
  if (updateData.position) {
    const existingBanner = await BannerModel.getBannerByPosition(updateData.position);
    if (existingBanner && existingBanner.id !== parseInt(id)) {
      // Tự động tìm vị trí tiếp theo có sẵn
      const nextAvailablePosition = await BannerModel.getNextAvailablePosition();
      console.log(`Vị trí ${updateData.position} đã được sử dụng, tự động chuyển sang vị trí ${nextAvailablePosition}`);
      updateData.position = nextAvailablePosition;
    }
  }

  const updatedBanner = await BannerModel.updateBanner(parseInt(id), updateData);

  if (!updatedBanner) {
    return res.status(404).json({ message: 'Không tìm thấy banner' });
  }

  return res.status(200).json(updatedBanner);
});

// @desc    Soft delete banner
// @route   DELETE /api/admin/banners/:id
// @access  Admin
export const softDeleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const success = await BannerModel.softDeleteBanner(parseInt(id));

  if (!success) {
    return res.status(404).json({ message: 'Không tìm thấy banner' });
  }

  return res.status(200).json({ message: 'Banner đã được xóa thành công' });
});

// @desc    Hard delete banner
// @route   DELETE /api/admin/banners/:id/hard
// @access  Admin
export const hardDeleteBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const success = await BannerModel.hardDeleteBanner(parseInt(id));

  if (!success) {
    return res.status(404).json({ message: 'Không tìm thấy banner' });
  }

  return res.status(200).json({ message: 'Banner đã được xóa vĩnh viễn' });
});

// @desc    Restore banner
// @route   POST /api/admin/banners/:id/restore
// @access  Admin
export const restoreBanner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const success = await BannerModel.restoreBanner(parseInt(id));

  if (!success) {
    return res.status(404).json({ message: 'Không tìm thấy banner' });
  }

  return res.status(200).json({ message: 'Banner đã được khôi phục thành công' });
});

// @desc    Fix duplicate positions
// @route   POST /api/admin/banners/fix-positions
// @access  Admin
export const fixDuplicatePositions = asyncHandler(async (req: Request, res: Response) => {
  await BannerModel.fixDuplicatePositions();
  const banners = await BannerModel.getAllBanners();
  return res.status(200).json({ 
    message: 'Đã tự động sửa vị trí trùng lặp',
    banners 
  });
}); 