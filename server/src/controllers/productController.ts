import { Request, Response } from 'express';
import { Product, IProduct } from '../models/Product';
import multer from 'multer';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, './uploads/'); // Directory where uploaded files will be stored
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

export const upload = multer({ storage: storage });

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const categoryId = req.query.category ? Number(req.query.category) : undefined;
    const products = await Product.findAll({ includeDeleted, search, categoryId });
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
    const { name, description, price, category_id, stock } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const productId = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category_id: parseInt(category_id),
      image_url,
      stock: parseInt(stock),
    });
    const newProduct = await Product.findById(productId);
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, stock } = req.body;
    const productId = parseInt(id);
    const image_url = req.file ? `/uploads/${req.file.filename}` : req.body.image_url; // Keep existing image if no new file

    const updateData: Partial<IProduct> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category_id !== undefined) updateData.category_id = parseInt(category_id);
    if (image_url !== undefined) updateData.image_url = image_url;
    if (stock !== undefined) updateData.stock = parseInt(stock);

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