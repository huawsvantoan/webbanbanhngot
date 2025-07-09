import { Request, Response } from 'express';
import { Category, ICategory } from '../models/Category';

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const categories = await Category.findAll(includeDeleted);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    
    if (isNaN(categoryId)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const productCount = await Category.getProductCount(categoryId);
    res.json({ ...category, productCount });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Error fetching category' });
  }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image_url } = req.body;
    if (!name || name.trim().length === 0) {
      res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
      return;
    }
    if (name.trim().length < 3) {
      res.status(400).json({ message: 'Tên danh mục phải có ít nhất 3 ký tự' });
      return;
    }
    if (!/^[a-zA-ZÀ-ỹ0-9_\s]+$/.test(name.trim())) {
      res.status(400).json({ message: 'Tên danh mục chỉ được chứa chữ, số, dấu gạch dưới và khoảng trắng' });
      return;
    }
    if (description && description.length > 255) {
      res.status(400).json({ message: 'Mô tả không được vượt quá 255 ký tự' });
      return;
    }

    const categoryId = await Category.create({
      name: name.trim(),
      description: description?.trim(),
      image_url
    });

    const newCategory = await Category.findById(categoryId);
    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, description, image_url } = req.body;
    if (isNaN(categoryId)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }
    if (name !== undefined) {
      if (!name.trim()) {
        res.status(400).json({ message: 'Tên danh mục là bắt buộc' });
        return;
      }
      if (name.trim().length < 3) {
        res.status(400).json({ message: 'Tên danh mục phải có ít nhất 3 ký tự' });
        return;
      }
      if (!/^[a-zA-ZÀ-ỹ0-9_\s]+$/.test(name.trim())) {
        res.status(400).json({ message: 'Tên danh mục chỉ được chứa chữ, số, dấu gạch dưới và khoảng trắng' });
        return;
      }
    }
    if (description !== undefined && description.length > 255) {
      res.status(400).json({ message: 'Mô tả không được vượt quá 255 ký tự' });
      return;
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const success = await Category.update(categoryId, {
      name: name?.trim(),
      description: description?.trim(),
      image_url
    } as Partial<ICategory>);

    if (!success) {
      res.status(500).json({ message: 'Failed to update category' });
      return;
    }

    const updatedCategory = await Category.findById(categoryId);
    res.json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  console.log('deleteCategory controller: Request received.');
  try {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      res.status(400).json({ message: 'Invalid category ID' });
      return;
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const productCount = await Category.getProductCount(categoryId);
    if (productCount > 0) {
      res.status(400).json({ 
        message: `Cannot delete category. It contains ${productCount} product(s).` 
      });
      return;
    }

    const success = await Category.delete(categoryId);
    if (!success) {
      res.status(500).json({ message: 'Failed to soft-delete category' });
      return;
    }

    res.json({ message: 'Category soft-deleted successfully' });
  } catch (error) {
    console.error('Error soft-deleting category:', error);
    res.status(500).json({ message: 'Error soft-deleting category' });
  }
};

export const restoreCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const restored = await Category.restore(categoryId);
    if (!restored) {
      res.status(404).json({ message: 'Category not found or not deleted' });
      return;
    }
    res.json({ message: 'Category restored successfully' });
  } catch (error) {
    console.error('Error restoring category:', error);
    res.status(500).json({ message: 'Error restoring category' });
  }
};

// @desc    Permanently delete category
// @route   DELETE /api/admin/categories/:id/permanent
// @access  Admin
export const deleteCategoryPermanent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [result] = await Category.deletePermanent(Number(id));
  console.log('DELETE PERMANENT result:', result);
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Không tìm thấy category để xóa vĩnh viễn' });
  }
  return res.status(200).json({ message: 'Category đã được xóa vĩnh viễn' });
}; 