import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { BlogPost, IBlogPost } from '../models/BlogPost';

// @desc    Get all blog posts
// @route   GET /api/admin/blog
// @access  Admin
export const getBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  const includeDeleted = req.query.includeDeleted === 'true';
  const posts = await BlogPost.findAll(includeDeleted);
  
  // Map lại dữ liệu cho đúng FE mong đợi
  const mapped = posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.content?.slice(0, 100) || '', // Tạo excerpt từ content
    image: post.image_url,
    status: post.status,
    author_id: post.user_id,
    author_name: post.author_name || 'Không rõ',
    created_at: post.created_at,
    updated_at: post.updated_at,
    tags: [], // Không có tags trong DB
    view_count: post.view_count || 0,
    isDeleted: post.isDeleted,
  }));
  
  return res.status(200).json(mapped);
});

// @desc    Get single blog post
// @route   GET /api/admin/blog/:id
// @access  Admin
export const getBlogPostById = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  const includeDeleted = req.query.includeDeleted === 'true';
  const post = await BlogPost.findById(id, includeDeleted);
  if (!post) {
    return res.status(404).json({ message: 'Không tìm thấy bài viết blog' });
  }
  
  // Map lại dữ liệu cho đúng FE mong đợi
  const mapped = {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.content?.slice(0, 100) || '', // Tạo excerpt từ content
    image: post.image_url,
    status: post.status,
    author_id: post.user_id,
    author_name: post.author_name || 'Không rõ',
    created_at: post.created_at,
    updated_at: post.updated_at,
    tags: [], // Không có tags trong DB
    view_count: post.view_count || 0,
    isDeleted: post.isDeleted,
  };
  
  return res.status(200).json(mapped);
});

// @desc    Create new blog post
// @route   POST /api/admin/blog
// @access  Admin
export const createBlogPost = asyncHandler(async (req: Request, res: Response) => {
  // Lấy user_id từ token (middleware protect đã gán req.user)
  const user_id = req.user?.id;
  const { title, content, image, status } = req.body;
  
  if (!title || title.trim().length < 5) {
    return res.status(400).json({ message: 'Tiêu đề phải có ít nhất 5 ký tự' });
  }
  
  if (!content || content.replace(/<[^>]*>/g, '').trim().length === 0) {
    return res.status(400).json({ message: 'Nội dung không được để trống' });
  }
  
  // Tạo slug từ title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  const postData = {
    user_id,
    title: title.trim(),
    slug,
    content: content, // Không trim HTML content
    image_url: image || '',
    status: status || 'draft',
  };
  
  const postId = await BlogPost.create(postData);
  const newPost = await BlogPost.findById(postId, true); // includeDeleted = true để lấy bài viết mới tạo
  
  if (!newPost) {
    return res.status(500).json({ message: 'Lỗi khi tạo bài viết' });
  }
  
  // Map lại dữ liệu cho đúng FE mong đợi
  const mapped = {
    id: newPost.id,
    title: newPost.title,
    content: newPost.content,
    excerpt: newPost.content?.slice(0, 100) || '', // Tạo excerpt từ content
    image: newPost.image_url,
    status: newPost.status,
    author_id: newPost.user_id,
    author_name: newPost.author_name || 'Không rõ',
    created_at: newPost.created_at,
    updated_at: newPost.updated_at,
    tags: [], // Không có tags trong DB
    view_count: newPost.view_count || 0,
    isDeleted: newPost.isDeleted,
  };
  
  return res.status(201).json(mapped);
});

// @desc    Update blog post
// @route   PUT /api/admin/blog/:id
// @access  Admin
export const updateBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  
  const { title, content, image, status } = req.body;
  
  if (!title || title.trim().length < 5) {
    return res.status(400).json({ message: 'Tiêu đề phải có ít nhất 5 ký tự' });
  }
  
  if (!content || content.replace(/<[^>]*>/g, '').trim().length === 0) {
    return res.status(400).json({ message: 'Nội dung không được để trống' });
  }
  
  const updateData: any = {
    title: title.trim(),
    content: content, // Không trim HTML content
    image_url: image || '',
    status: status || 'draft',
  };
  
  const success = await BlogPost.update(id, updateData);
  if (!success) {
    return res.status(404).json({ message: 'Không tìm thấy bài viết blog' });
  }
  
  const updatedPost = await BlogPost.findById(id, true); // includeDeleted = true để lấy cả bài viết đã xóa
  if (!updatedPost) {
    return res.status(500).json({ message: 'Lỗi khi cập nhật bài viết' });
  }
  
  // Map lại dữ liệu cho đúng FE mong đợi
  const mapped = {
    id: updatedPost.id,
    title: updatedPost.title,
    content: updatedPost.content,
    excerpt: updatedPost.content?.slice(0, 100) || '', // Tạo excerpt từ content
    image: updatedPost.image_url,
    status: updatedPost.status,
    author_id: updatedPost.user_id,
    author_name: updatedPost.author_name || 'Không rõ',
    created_at: updatedPost.created_at,
    updated_at: updatedPost.updated_at,
    tags: [], // Không có tags trong DB
    view_count: updatedPost.view_count || 0,
    isDeleted: updatedPost.isDeleted,
  };
  
  return res.status(200).json(mapped);
});

// @desc    Delete blog post (soft delete)
// @route   DELETE /api/admin/blog/:id
// @access  Admin
export const deleteBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  
  const success = await BlogPost.delete(id);
  if (!success) {
    return res.status(404).json({ message: 'Không tìm thấy bài viết blog' });
  }
  
  return res.status(200).json({ message: 'Xóa bài viết thành công' });
});

// @desc    Restore blog post
// @route   PUT /api/admin/blog/:id/restore
// @access  Admin
export const restoreBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  
  const success = await BlogPost.restore(id);
  if (!success) {
    return res.status(404).json({ message: 'Không tìm thấy bài viết blog' });
  }
  
  return res.status(200).json({ message: 'Khôi phục bài viết thành công' });
});

// @desc    Delete blog post permanently
// @route   DELETE /api/admin/blog/:id/permanent
// @access  Admin
export const deleteBlogPostPermanent = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  
  await BlogPost.deletePermanent(id);
  return res.status(200).json({ message: 'Xóa vĩnh viễn bài viết thành công' });
});

// @desc    Get public blog posts
// @route   GET /api/blog
// @access  Public
export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const posts = await BlogPost.findAll(false); // Chỉ lấy bài viết đã publish
  
  // Map lại dữ liệu cho đúng FE mong đợi
  const mapped = posts
    .filter(post => post.status === 'published')
    .map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || post.content?.slice(0, 100) || '',
      image: post.image_url,
      status: post.status,
      author_id: post.user_id,
      author_name: post.author_name || 'Không rõ',
      created_at: post.created_at,
      updated_at: post.updated_at,
      tags: Array.isArray(post.tags) ? post.tags : (typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : []),
      view_count: post.view_count || 0,
      isDeleted: post.isDeleted,
    }));
  
  return res.status(200).json(mapped);
}); 