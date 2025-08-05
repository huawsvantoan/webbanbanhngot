import { Request, Response } from 'express';
import { Category, ICategory } from '../models/Category';
import { pool } from '../config/database';

// Test API để kiểm tra dữ liệu
export const testData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Kiểm tra categories
    const [categories] = await pool.query('SELECT id, name FROM categories WHERE isDeleted = 0');
    console.log('Categories:', categories);
    
    // Kiểm tra products
    const [products] = await pool.query('SELECT id, name, category_id FROM products WHERE isDeleted = 0');
    console.log('Products:', products);
    
    // Kiểm tra products theo category
    const [productsByCategory] = await pool.query(`
      SELECT 
        c.id as category_id,
        c.name as category_name,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.isDeleted = 0
      WHERE c.isDeleted = 0
      GROUP BY c.id, c.name
    `);
    console.log('Products by category:', productsByCategory);
    
    res.json({
      categories,
      products,
      productsByCategory
    });
  } catch (error) {
    console.error('Test data error:', error);
    res.status(500).json({ message: 'Error testing data' });
  }
};

// API để cập nhật category_id cho sản phẩm
export const updateProductCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    // Cập nhật category_id cho các sản phẩm dựa trên tên
    const updates = [
      // Bánh bao -> category 38 (Bánh bao)
      { name: 'Bánh bao nhân thịt', category_id: 38 },
      { name: 'Bánh bao nhân trứng muối', category_id: 38 },
      { name: 'Bánh bao chay', category_id: 38 },
      
      // Bánh bông lan -> category 20 (bánh bông loan)
      { name: 'Bánh bông lan trứng muối', category_id: 20 },
      { name: 'Bánh bông lan socola', category_id: 20 },
      { name: 'Bánh bông lan dừa', category_id: 20 },
      
      // Bánh kem -> category 11 (bánh kem)
      { name: 'Bánh kem socola', category_id: 11 },
      { name: 'Bánh kem dâu tây', category_id: 11 },
      { name: 'Bánh kem vani', category_id: 11 },
      
      // Bánh mì -> category 7 (bánh mì)
      { name: 'Bánh mì thịt nướng', category_id: 7 },
      { name: 'Bánh mì pate', category_id: 7 },
      { name: 'Bánh mì chả cá', category_id: 7 },
      { name: 'Bánh mì xúc xích', category_id: 7 },
      
      // Bánh ngọt -> category 21 (Bánh ngọt)
      { name: 'Bánh cheesecake', category_id: 21 },
      { name: 'Bánh brownie', category_id: 21 },
      { name: 'Bánh socola sữa', category_id: 21 }
    ];
    
    let updatedCount = 0;
    for (const update of updates) {
      const [result] = await pool.query(
        'UPDATE products SET category_id = ? WHERE name = ? AND isDeleted = 0',
        [update.category_id, update.name]
      );
      const affectedRows = (result as any).affectedRows || 0;
      if (affectedRows > 0) {
        updatedCount++;
        console.log(`Updated ${update.name} to category ${update.category_id}`);
      }
    }
    
    res.json({ 
      message: `Updated ${updatedCount} products`,
      updatedCount 
    });
  } catch (error) {
    console.error('Update categories error:', error);
    res.status(500).json({ message: 'Error updating categories' });
  }
};

export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const categories = await Category.findAll(includeDeleted);
    
    // Thêm số lượng sản phẩm cho mỗi category
    const categoriesWithProductCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Category.getProductCount(category.id);
        console.log(`Category ${category.name} (ID: ${category.id}) has ${productCount} products`);
        return {
          ...category,
          product_count: productCount
        };
      })
    );
    
    res.json(categoriesWithProductCount);
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

    // Soft delete all products in this category first
    const productCount = await Category.getProductCount(categoryId);
    if (productCount > 0) {
      await Category.softDeleteProductsInCategory(categoryId);
    }

    const success = await Category.delete(categoryId);
    if (!success) {
      res.status(500).json({ message: 'Failed to soft-delete category' });
      return;
    }

    res.json({ 
      message: `Category soft-deleted successfully${productCount > 0 ? ` along with ${productCount} product(s)` : ''}` 
    });
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