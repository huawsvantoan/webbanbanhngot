import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser, PasswordResetCode } from '../models/User';
import { sendMail } from '../utils/mailService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, address, phone, username, role } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Username, email and password are required' });
      return;
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Validate nâng cao
    if (!full_name || !full_name.trim()) {
      res.status(400).json({ message: 'Vui lòng nhập họ tên' });
      return;
    }
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(full_name.trim())) {
      res.status(400).json({ message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng' });
      return;
    }
    if (!username || !username.trim()) {
      res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập' });
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,}$/.test(username.trim())) {
      res.status(400).json({ message: 'Tên đăng nhập chỉ được chứa chữ, số, dấu gạch dưới, tối thiểu 3 ký tự, không khoảng trắng' });
      return;
    }
    if (!email || !email.trim()) {
      res.status(400).json({ message: 'Vui lòng nhập email' });
      return;
    }
    if (!/^.+@.+\..+$/.test(email)) {
      res.status(400).json({ message: 'Email không hợp lệ' });
      return;
    }
    if (!password || !password.trim()) {
      res.status(400).json({ message: 'Vui lòng nhập mật khẩu' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }
    if (!address || !address.trim()) {
      res.status(400).json({ message: 'Vui lòng nhập địa chỉ' });
      return;
    }
    if (address.trim().length < 5) {
      res.status(400).json({ message: 'Địa chỉ phải có ít nhất 5 ký tự' });
      return;
    }
    if (!phone || !phone.trim()) {
      res.status(400).json({ message: 'Vui lòng nhập số điện thoại' });
      return;
    }
    if (!/^0\d{9}$/.test(phone.trim())) {
      res.status(400).json({ message: 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số' });
      return;
    }

    const userId = await User.create({ 
      username: username || email.split('@')[0], 
      email, 
      password, 
      full_name, 
      address, 
      phone,
      role: role || 'user'
    });
    const newUser = await User.findById(userId);

    if (!newUser) {
      res.status(500).json({ message: 'User creation failed' });
      return;
    }

    // Gửi email thông báo đăng ký thành công
    await sendMail({
      to: email,
      subject: 'Chào mừng bạn đến với Cake Shop!',
      html: `
        <h2>Chào mừng bạn đến với Cake Shop!</h2>
        <p>Tài khoản của bạn đã được tạo thành công với email: <b>${email}</b></p>
        <p>Nếu không phải bạn đăng ký, vui lòng liên hệ lại với chúng tôi.</p>
        <p>Chúc bạn mua sắm vui vẻ!</p>
      `
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role }, 
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '24h' }
    );
    res.status(201).json({ message: 'User registered successfully', token, user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for email: ${email}`);

    // Validate nâng cao cho đăng nhập
    if (!email || !email.trim()) {
      res.status(400).json({ message: 'Vui lòng nhập email hoặc tên đăng nhập' });
      return;
    }
    // Nếu là email thì kiểm tra định dạng, nếu là username thì tối thiểu 3 ký tự
    if (email.includes('@')) {
      if (!/^.+@.+\..+$/.test(email)) {
        res.status(400).json({ message: 'Email không hợp lệ' });
        return;
      }
    } else {
      if (email.length < 3) {
        res.status(400).json({ message: 'Tên đăng nhập phải có ít nhất 3 ký tự' });
        return;
      }
    }
    if (!password || !password.trim()) {
      res.status(400).json({ message: 'Vui lòng nhập mật khẩu' });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    const user = await User.findByEmail(email);
    if (!user) {
      console.log(`User not found for email: ${email}`);
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    console.log(`User found: ${user.email}`);

    const isMatch = await User.verifyPassword(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for user: ${user.email}`);
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }
    console.log(`Password matched for user: ${user.email}`);

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'your-secret-key', 
      { expiresIn: '24h' }
    );
    res.status(200).json({ message: 'Logged in successfully', token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userId = req.user.id;
    const { full_name, address, phone } = req.body;

    // Validate nâng cao
    if (full_name !== undefined) {
      if (!full_name.trim()) {
        res.status(400).json({ message: 'Vui lòng nhập họ tên' });
        return;
      }
      if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(full_name.trim())) {
        res.status(400).json({ message: 'Họ tên chỉ được chứa chữ cái và khoảng trắng' });
        return;
      }
    }
    if (address !== undefined) {
      if (!address.trim()) {
        res.status(400).json({ message: 'Vui lòng nhập địa chỉ' });
        return;
      }
      if (address.trim().length < 5) {
        res.status(400).json({ message: 'Địa chỉ phải có ít nhất 5 ký tự' });
        return;
      }
    }
    if (phone !== undefined) {
      if (!phone.trim()) {
        res.status(400).json({ message: 'Vui lòng nhập số điện thoại' });
        return;
      }
      if (!/^0\d{9}$/.test(phone.trim())) {
        res.status(400).json({ message: 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số' });
        return;
      }
    }

    const updateData: Partial<IUser> = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (address !== undefined) updateData.address = address;
    if (phone !== undefined) updateData.phone = phone;

    const updated = await User.update(userId, updateData);

    if (!updated) {
      res.status(404).json({ message: 'User not found or nothing to update' });
      return;
    }

    const updatedUser = await User.findById(userId);
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // Add logic to verify old password and update with new password
    // For now, a placeholder:
    const user = await User.findById(userId);
    if (!user || !(await User.verifyPassword(oldPassword, user.password))) {
      res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
      return;
    }

    const updated = await User.updatePassword(userId, newPassword);

    if (!updated) {
      res.status(500).json({ message: 'Không thể cập nhật mật khẩu' });
      return;
    }

    res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công' });
  } catch (error) {
    console.error('Lỗi khi cập nhật mật khẩu:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật mật khẩu' });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Error fetching all users' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(parseInt(id));

    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng theo ID:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy thông tin người dùng' });
  }
};

export const updateUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: Partial<IUser> = req.body;

    const updated = await User.update(parseInt(id), updateData);

    if (!updated) {
      res.status(404).json({ message: 'Không tìm thấy người dùng hoặc không có gì để cập nhật' });
      return;
    }

    const updatedUser = await User.findById(parseInt(id));
    res.status(200).json({ message: 'Người dùng đã được cập nhật thành công', user: updatedUser });
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng theo ID:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi cập nhật thông tin người dùng' });
  }
};

export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await User.delete(parseInt(id));

    if (!deleted) {
      res.status(404).json({ message: 'Không tìm thấy người dùng để xóa' });
      return;
    }

    res.status(200).json({ message: 'Người dùng đã được xóa thành công' });
  } catch (error) {
    console.error('Lỗi khi xóa người dùng theo ID:', error);
    res.status(500).json({ message: 'Lỗi máy chủ khi xóa người dùng' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email || !/^.+@.+\..+$/.test(email)) {
      res.status(400).json({ message: 'Email không hợp lệ' });
      return;
    }
    const user = await User.findByEmail(email);
    if (user) {
      // Sinh code 6 số
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút
      await PasswordResetCode.deleteByEmail(email); // Xóa code cũ nếu có
      await PasswordResetCode.create(email, code, expiresAt);
      await sendMail({
        to: email,
        subject: 'Mã xác thực đặt lại mật khẩu - Cake Shop',
        html: `<p>Xin chào <b>${user.full_name || user.username}</b>,</p>
          <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản Cake Shop.</p>
          <p>Mã xác thực của bạn là: <b style='font-size:20px;'>${code}</b></p>
          <p>Mã có hiệu lực trong 15 phút.</p>
          <p>Nếu không phải bạn, hãy bỏ qua email này.</p>`
      });
    }
    res.json({ message: 'Nếu email tồn tại, mã xác thực đã được gửi.' });
  } catch (error) {
    console.error('Lỗi gửi mail quên mật khẩu:', error);
    res.status(500).json({ message: 'Có lỗi khi gửi mail. Vui lòng thử lại.' });
  }
};

export const verifyResetCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      res.status(400).json({ message: 'Thiếu email hoặc mã xác thực' });
      return;
    }
    const found = await PasswordResetCode.findValidCode(email, code);
    if (!found) {
      res.status(400).json({ message: 'Mã xác thực không đúng hoặc đã hết hạn' });
      return;
    }
    res.json({ message: 'Mã xác thực hợp lệ' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi khi xác thực mã. Vui lòng thử lại.' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !code || !newPassword) {
      res.status(400).json({ message: 'Thiếu thông tin' });
      return;
    }
    if (newPassword.length < 6) {
      res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      return;
    }
    const found = await PasswordResetCode.findValidCode(email, code);
    if (!found) {
      res.status(400).json({ message: 'Mã xác thực không đúng hoặc đã hết hạn' });
      return;
    }
    const user = await User.findByEmail(email);
    if (!user) {
      res.status(404).json({ message: 'Không tìm thấy người dùng' });
      return;
    }
    const updated = await User.updatePassword(user.id, newPassword);
    if (!updated) {
      res.status(500).json({ message: 'Không thể cập nhật mật khẩu' });
      return;
    }
    await PasswordResetCode.deleteByEmail(email);
    res.json({ message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi khi đặt lại mật khẩu. Vui lòng thử lại.' });
  }
}; 