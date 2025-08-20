import { Request, Response } from 'express';
import { Order, IOrderItem } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Payment } from '../models/Payment';
import { User } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';
import fetch from 'node-fetch';

export const getUserOrders = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const orders = await Order.findByUserId(req.user.id);

    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await Order.getItems(order.id);
        return { ...order, items: items || [] };
      })
    );

    return res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({ message: 'Error fetching orders' });
  }
});

export const getAllOrders = asyncHandler(async (_req: Request, res: Response) => {
  try {
    const orders = await Order.findAll();
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return res.status(500).json({ message: 'Error fetching all orders' });
  }
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await Order.findById(parseInt(id));
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  const items = await Order.getItems(order.id);
  return res.json({ ...order, items: items || [] });
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = req.user.id;
    const { shipping_address, phone, name, note, payment_method } = req.body;
    // Xóa xử lý payment_proof, upload file

    if (!shipping_address || !phone || !name) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ địa chỉ, số điện thoại và họ tên.' });
    }

    const cart = await Cart.findByUserId(userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItems = await Cart.getItems(cart.id);
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total_amount = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item.product_id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product ${item.product_id}` });
      }
      total_amount += item.quantity * item.price;
    }

    // Deduct stock and create order
    const orderItemsData: Omit<IOrderItem, 'id' | 'created_at' | 'updated_at' | 'order_id'>[] = [];
    for (const item of cartItems) {
      await Product.update(item.product_id, { stock: Number(item.product_stock) - Number(item.quantity) } as Partial<Product>);
      orderItemsData.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });
    }

    // Chỉ còn 2 phương thức: cod, vnpay
    let initialStatus: 'pending' | 'processing' = 'pending';
    if (payment_method === 'vnpay') {
      initialStatus = 'pending';
    }

    const orderId = await Order.create({
      user_id: userId,
      total_amount,
      shipping_address,
      phone,
      name,
      note,
      payment_method: payment_method || 'cod',
      payment_proof: null,
      status: initialStatus,
    }, orderItemsData);

    // Tạo payment record nếu thanh toán VNPAY
    if (payment_method === 'vnpay') {
      await Payment.create({
        order_id: orderId,
        payment_method: 'vnpay',
        amount: total_amount
      });
    }

    await Cart.clearItems(cart.id);

    const newOrder = await Order.findById(orderId);
    return res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ message: 'Error creating order' });
  }
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const orderId = parseInt(id);
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Kiểm tra logic ràng buộc trạng thái
    const statusValidation = validateStatusTransition(order.status, status);
    if (!statusValidation.allowed) {
      return res.status(400).json({ message: statusValidation.message });
    }
    
    // Chỉ cho phép user hủy đơn của chính mình khi trạng thái là pending hoặc processing
    if (status === 'cancelled') {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      // Admin có thể hủy bất kỳ đơn nào
      if (req.user.role !== 'admin') {
        if (order.user_id !== req.user.id) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        if (order.status !== 'pending' && order.status !== 'processing') {
          return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng khi đang chờ xử lý hoặc đang xử lý.' });
        }
      }

      // Kiểm tra và hoàn tiền VNPAY nếu đã thanh toán
      if (order.payment_method === 'vnpay') {
        const payment = await Payment.findByOrderId(orderId);
        if (payment && payment.status === 'completed') {
          try {
            // Gọi API hoàn tiền VNPAY
            const refundResponse = await fetch(`${req.protocol}://${req.get('host')}/api/payment/vnpay/refund`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': req.headers.authorization || ''
              },
              body: JSON.stringify({
                orderId: orderId,
                reason: note || 'Order cancelled by user'
              })
            });

            if (!refundResponse.ok) {
              console.error('VNPAY refund failed:', await refundResponse.text());
              return res.status(500).json({ message: 'Không thể hoàn tiền VNPAY. Vui lòng liên hệ admin.' });
            }

            const refundResult = await refundResponse.json();
            console.log('VNPAY refund successful:', refundResult);
          } catch (error) {
            console.error('Error processing VNPAY refund:', error);
            return res.status(500).json({ message: 'Lỗi hoàn tiền VNPAY. Vui lòng liên hệ admin.' });
          }
        }
      }
    }
    
    // Cập nhật trạng thái
    const updated = await Order.updateStatus(orderId, status, note);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found or status not updated' });
    }
    const updatedOrder = await Order.findById(orderId);
    return res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({ message: 'Error updating order status' });
  }
});

// Hàm kiểm tra logic chuyển đổi trạng thái
const validateStatusTransition = (currentStatus: string, newStatus: string) => {
  // Không thể thay đổi trạng thái đã hoàn thành hoặc đã hủy
  if (currentStatus === 'completed') {
    return {
      allowed: false,
      message: 'Không thể thay đổi trạng thái đơn hàng đã hoàn thành'
    };
  }
  
  if (currentStatus === 'cancelled') {
    return {
      allowed: false,
      message: 'Không thể thay đổi trạng thái đơn hàng đã hủy'
    };
  }

  // Logic chuyển đổi trạng thái hợp lệ - Admin chỉ có thể tiến hành đơn hàng, không thể hủy
  const validTransitions: Record<string, string[]> = {
    pending: ['processing'], // Chỉ có thể chuyển sang đang xử lý
    processing: ['shipped'], // Chỉ có thể chuyển sang đã giao cho đơn vị vận chuyển
    shipped: ['delivered'], // Chỉ có thể chuyển sang đã giao hàng
    delivered: ['completed'], // Chỉ có thể chuyển sang hoàn thành
    completed: [], // Không thể thay đổi
    cancelled: [] // Không thể thay đổi
  };

  const allowedTransitions = validTransitions[currentStatus];
  if (!allowedTransitions.includes(newStatus)) {
    const statusLabels: Record<string, string> = {
      pending: 'Chờ xác nhận',
      processing: 'Đang xử lý',
      shipped: 'Đã giao cho đơn vị vận chuyển',
      delivered: 'Đã giao hàng',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    
    return {
      allowed: false,
      message: `Không thể chuyển từ "${statusLabels[currentStatus]}" sang "${statusLabels[newStatus]}"`
    };
  }

  return { allowed: true, message: '' };
};

export const createDirectOrder = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { customer_name, customer_phone, customer_address, products, payment_method, total_amount } = req.body;

    console.log('Received direct order request:', {
      customer_name,
      customer_phone,
      customer_address,
      products_count: products?.length,
      payment_method,
      total_amount
    });

    if (!customer_name || !customer_phone || !products || products.length === 0) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin khách hàng và sản phẩm.' });
    }

    // Tạo user tạm thời cho khách hàng trực tiếp
    const tempUser = {
      username: `guest_${Date.now()}`,
      email: `guest_${Date.now()}@direct.com`,
      password: 'temp_password',
      full_name: customer_name,
      phone: customer_phone,
      address: customer_address || '',
      role: 'user'
    };

    // Tạo user trong database
    const userId = await User.create(tempUser);

    // Kiểm tra stock và tính tổng tiền
    let calculatedTotal = 0;
    const orderItemsData = [];

    for (const item of products) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res.status(400).json({ message: `Sản phẩm ID ${item.product_id} không tồn tại` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Không đủ hàng cho sản phẩm ${product.name}` });
      }
      
      calculatedTotal += item.price * item.quantity;
      orderItemsData.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      });

      // Cập nhật stock
      await Product.update(item.product_id, { stock: product.stock - item.quantity } as Partial<Product>);
    }

    // Kiểm tra tổng tiền
    if (Math.abs(calculatedTotal - total_amount) > 1000) { // Cho phép sai số 1000đ
      return res.status(400).json({ message: 'Tổng tiền không khớp với giá trị sản phẩm' });
    }

    // Tạo đơn hàng
    const orderId = await Order.create({
      user_id: userId,
      total_amount: calculatedTotal,
      shipping_address: customer_address || 'Mua trực tiếp tại cửa hàng',
      phone: customer_phone,
      name: customer_name,
      note: 'Đơn hàng tạo trực tiếp tại cửa hàng',
      payment_method: payment_method || 'cash',
      status: 'completed', // Đơn hàng trực tiếp thường hoàn thành ngay
    }, orderItemsData);

    // Tạo payment record nếu thanh toán chuyển khoản
    if (payment_method === 'transfer') {
      await Payment.create({
        order_id: orderId,
        payment_method: 'transfer',
        amount: calculatedTotal,
        transaction_id: `TRANSFER_${Date.now()}`
      });
    }

    const newOrder = await Order.findById(orderId);
    return res.status(201).json({ 
      message: 'Đơn hàng tạo thành công', 
      order: newOrder 
    });
  } catch (error) {
    console.error('Error creating direct order:', error);
    return res.status(500).json({ message: 'Lỗi tạo đơn hàng' });
  }
});