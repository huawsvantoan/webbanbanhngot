import { Request, Response } from 'express';
import { Product, IProduct } from '../models/Product';
import multer from 'multer';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './uploads/'); // Directory where uploaded files will be stored
  },
  filename: (_req, file, cb) => {
    // Đổi tên file: timestamp-originalname-khong-dau
    const ext = file.originalname.split('.').pop();
    const base = file.originalname
      .replace(/\s+/g, '-')         // thay dấu cách bằng dấu gạch ngang
      .replace(/[^a-zA-Z0-9-_]/g, '') // loại bỏ ký tự đặc biệt
      .replace(/-+/g, '-');         // loại bỏ nhiều dấu gạch ngang liên tiếp
    cb(null, `${Date.now()}-${base}.${ext}`);
  },
});

export const upload = multer({ storage: storage });

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const categoryId = req.query.category ? Number(req.query.category) : undefined;
    const featured = req.query.featured !== undefined ? req.query.featured === 'true' : undefined;
    const hot = req.query.hot !== undefined ? req.query.hot === 'true' : undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;
    
    const products = await Product.findAll({ 
      includeDeleted, 
      search, 
      categoryId, 
      featured, 
      hot, 
      limit, 
      offset 
    });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(parseInt(id));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    // Tăng lượt xem khi xem chi tiết sản phẩm (bỏ qua lỗi nếu có)
    try {
      await Product.incrementViewCount(parseInt(id));
    } catch (viewError) {
      console.warn('Failed to increment view count:', viewError);
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Error fetching product by ID' });
  }
};

export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    const products = await Product.search(query as string);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ message: 'Error searching products' });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const { 
      name, 
      description, 
      price, 
      category_id, 
      stock, 
      is_featured, 
      is_hot, 
      discount_percent, 
      original_price 
    } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Validate required fields
    if (!name || !price || !category_id || !stock) {
      res.status(400).json({ message: 'Missing required fields: name, price, category_id, stock' });
      return;
    }

    const productData = {
      name,
      description: description || '',
      price: parseFloat(price),
      category_id: parseInt(category_id),
      image_url: image_url || '/images/default-cake.jpg',
      stock: parseInt(stock),
      is_featured: is_featured === 'true' || is_featured === true || false,
      is_hot: is_hot === 'true' || is_hot === true || false,
      discount_percent: discount_percent ? parseInt(discount_percent) : 0,
      original_price: original_price ? parseFloat(original_price) : null,
    };

    console.log('Product data to create:', productData);

    const productId = await Product.create(productData);
    const newProduct = await Product.findById(productId);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product: ' + error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      category_id, 
      stock, 
      is_featured, 
      is_hot, 
      discount_percent, 
      original_price 
    } = req.body;
    const productId = parseInt(id);
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url; // Keep existing image if no new file

    const updateData: Partial<IProduct> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category_id !== undefined) updateData.category_id = parseInt(category_id);
    if (image_url !== undefined) updateData.image_url = image_url;
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (is_featured !== undefined) updateData.is_featured = is_featured === 'true' || is_featured === true;
    if (is_hot !== undefined) updateData.is_hot = is_hot === 'true' || is_hot === true;
    if (discount_percent !== undefined) updateData.discount_percent = parseInt(discount_percent);
    if (original_price !== undefined) updateData.original_price = original_price ? parseFloat(original_price) : undefined;

    const updated = await Product.update(productId, updateData);
    if (!updated) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    const updatedProduct = await Product.findById(productId);
    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Product.delete(parseInt(id));
    if (!deleted) {
      res.status(404).json({ message: 'Product not found or already deleted' });
      return;
    }
    res.status(200).json({ message: 'Product soft-deleted successfully' });
  } catch (error) {
    console.error('Error soft-deleting product:', error);
    res.status(500).json({ message: 'Error soft-deleting product' });
  }
};

export const restoreProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const restored = await Product.restore(parseInt(id));
    if (!restored) {
      res.status(404).json({ message: 'Product not found or not deleted' });
      return;
    }
    res.status(200).json({ message: 'Product restored successfully' });
  } catch (error) {
    console.error('Error restoring product:', error);
    res.status(500).json({ message: 'Error restoring product' });
  }
};

export const deleteProductPermanent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const [result] = await Product.deletePermanent(Number(id));
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa vĩnh viễn' });
  }
  return res.status(200).json({ message: 'Sản phẩm đã được xóa vĩnh viễn' });
}; 

// Các controller mới cho tính năng nổi bật/hot
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 6;
    const products = await Product.getFeaturedProducts(limit);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    // Trả về mảng rỗng thay vì lỗi 500
    res.status(200).json([]);
  }
};

export const getHotProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 6;
    const products = await Product.getHotProducts(limit);
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching hot products:', error);
    // Trả về mảng rỗng thay vì lỗi 500
    res.status(200).json([]);
  }
};

export const toggleFeatured = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(parseInt(id));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    const updated = await Product.update(parseInt(id), { 
      is_featured: !product.is_featured 
    } as Partial<IProduct>);
    
    if (!updated) {
      res.status(500).json({ message: 'Failed to update product' });
      return;
    }
    
    res.status(200).json({ 
      message: 'Product featured status updated successfully',
      is_featured: !product.is_featured 
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ message: 'Error updating featured status' });
  }
};

export const toggleHot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(parseInt(id));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    const updated = await Product.update(parseInt(id), { 
      is_hot: !product.is_hot 
    } as Partial<IProduct>);
    
    if (!updated) {
      res.status(500).json({ message: 'Failed to update product' });
      return;
    }
    
    res.status(200).json({ 
      message: 'Product hot status updated successfully',
      is_hot: !product.is_hot 
    });
  } catch (error) {
    console.error('Error toggling hot status:', error);
    res.status(500).json({ message: 'Error updating hot status' });
  }
}; 