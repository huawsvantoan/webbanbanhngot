import { Request, Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const cart = await Cart.findByUserId(userId);

    if (!cart) {
      res.status(200).json({ cart: null, items: [], total: 0 });
      return;
    }

    const cartItems = await Cart.getItems(cart.id);
    let total = 0;

    for (const item of cartItems) {
      total += item.quantity * item.price;
    }

    res.status(200).json({ cart, items: cartItems, total });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      res.status(400).json({ message: 'Product ID and quantity are required and must be positive' });
      return;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({ message: 'Not enough stock available' });
      return;
    }

    let cart = await Cart.findByUserId(userId);
    if (!cart) {
      const cartId = await Cart.create(userId);
      cart = await Cart.findById(cartId);
      if (!cart) {
        res.status(500).json({ message: 'Failed to create cart' });
        return;
      }
    }

    const existingCartItem = await Cart.getItemByProductId(cart.id, productId);

    if (existingCartItem) {
      const newQuantity = existingCartItem.quantity + quantity;
      if (product.stock < newQuantity) {
        res.status(400).json({ message: 'Not enough stock for combined quantity' });
        return;
      }
      await Cart.updateItem(existingCartItem.id, newQuantity);
    } else {
      await Cart.addItem(cart.id, productId, quantity, product.price);
    }

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      res.status(400).json({ message: 'Product ID and quantity are required and must be positive' });
      return;
    }

    const cart = await Cart.findByUserId(userId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const product = await Product.findById(parseInt(productId));
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (product.stock < quantity) {
      res.status(400).json({ message: 'Not enough stock available' });
      return;
    }

    const updated = await Cart.updateItemByProductId(cart.id, parseInt(productId), quantity);
    if (!updated) {
      res.status(404).json({ message: 'Cart item not found or nothing to update' });
      return;
    }

    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const { productId } = req.params;

    if (!productId) {
      res.status(400).json({ message: 'Product ID is required' });
      return;
    }

    const cart = await Cart.findByUserId(userId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const removed = await Cart.removeItem(cart.id, parseInt(productId));
    if (!removed) {
      res.status(404).json({ message: 'Cart item not found or nothing to remove' });
      return;
    }

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.id;
    const cart = await Cart.findByUserId(userId);

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const cleared = await Cart.clearItems(cart.id);
    if (!cleared) {
      res.status(404).json({ message: 'Cart not found or nothing to clear' });
      return;
    }

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

// Cập nhật số lượng cart item theo cart item id
export const updateCartItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;
    const { id } = req.params; // cart item id
    const { quantity } = req.body;
    if (!id || !quantity || quantity <= 0) {
      res.status(400).json({ message: 'Cart item ID and quantity are required and must be positive' });
      return;
    }
    // Tìm cart của user
    const cart = await Cart.findByUserId(userId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    // Kiểm tra cart item có thuộc cart này không
    const cartItems = await Cart.getItems(cart.id);
    const cartItem = cartItems.find(item => item.id === parseInt(id));
    if (!cartItem) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }
    // Kiểm tra tồn kho
    if (cartItem.product.stock < quantity) {
      res.status(400).json({ message: 'Not enough stock available' });
      return;
    }
    const updated = await Cart.updateItem(parseInt(id), quantity);
    if (!updated) {
      res.status(404).json({ message: 'Cart item not found or nothing to update' });
      return;
    }
    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart item by id:', error);
    res.status(500).json({ message: 'Error updating cart item by id' });
  }
};

// Xóa cart item theo cart item id
export const removeCartItemById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const userId = req.user.id;
    const { id } = req.params; // cart item id
    if (!id) {
      res.status(400).json({ message: 'Cart item ID is required' });
      return;
    }
    // Tìm cart của user
    const cart = await Cart.findByUserId(userId);
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    // Kiểm tra cart item có thuộc cart này không
    const cartItems = await Cart.getItems(cart.id);
    const cartItem = cartItems.find(item => item.id === parseInt(id));
    if (!cartItem) {
      res.status(404).json({ message: 'Cart item not found' });
      return;
    }
    // Xóa cart item
    const removed = await Cart.removeItemById(parseInt(id));
    if (!removed) {
      res.status(404).json({ message: 'Cart item not found or nothing to remove' });
      return;
    }
    res.status(200).json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item by id:', error);
    res.status(500).json({ message: 'Error removing cart item by id' });
  }
};