import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { BlogPost } from '../models/BlogPost';

// Mock database for now
let blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Bài viết Blog đầu tiên',
    content: 'Đây là nội dung của bài viết blog đầu tiên. Nó rất thú vị!',
    excerpt: 'Nội dung tóm tắt cho bài viết đầu tiên.',
    image: '/images/default-blog.jpg',
    status: 'published',
    author_id: 1,
    author_name: 'Admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['tin tức', 'sản phẩm mới'],
    view_count: 150,
  },
  {
    id: 2,
    title: 'Cách làm bánh ngọt ngon tại nhà',
    content: 'Tìm hiểu các bí quyết để làm những chiếc bánh ngọt tuyệt vời ngay tại bếp của bạn.',
    excerpt: 'Hướng dẫn chi tiết làm bánh ngọt.',
    image: '/images/default-blog.jpg',
    status: 'draft',
    author_id: 1,
    author_name: 'Admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: ['hướng dẫn', 'nấu ăn'],
    view_count: 50,
  },
];

// @desc    Get all blog posts
// @route   GET /api/admin/blog
// @access  Admin
export const getBlogPosts = asyncHandler(async (req: Request, res: Response) => {
  // const includeDeleted = req.query.includeDeleted === 'true';
  const posts = await BlogPost.findAll(true); // Luôn lấy tất cả bài viết để test
  console.log('DEBUG getBlogPosts - TEST ALL posts:', posts);
  // Map lại dữ liệu cho đúng FE mong đợi
  const mapped = posts.map(post => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.content?.slice(0, 100) || '',
    image: post.image_url,
    status: post.status,
    author_id: post.user_id,
    author_name: '',
    created_at: post.created_at,
    updated_at: post.updated_at,
    tags: [],
    view_count: 0,
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
  const post = await BlogPost.findById(id);
  if (!post) {
    return res.status(404).json({ message: 'Không tìm thấy bài viết blog' });
  }
  // Map lại dữ liệu cho đúng FE mong đợi
  const mapped = {
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.content?.slice(0, 100) || '',
    image: post.image_url,
    status: post.status,
    author_id: post.user_id,
    author_name: '',
    created_at: post.created_at,
    updated_at: post.updated_at,
    tags: [],
    view_count: 0,
  };
  return res.status(200).json(mapped);
});

// @desc    Create new blog post
// @route   POST /api/admin/blog
// @access  Admin
export const createBlogPost = asyncHandler(async (req: Request, res: Response) => {
  // Lấy user_id từ token (middleware protect đã gán req.user)
  const user_id = req.user?.id;
  const { title, slug, content, image_url, status } = req.body;
  if (!title || title.trim().length < 5) {
    return res.status(400).json({ message: 'Tiêu đề phải có ít nhất 5 ký tự' });
  }
  if (!/^[a-zA-ZÀ-ỹ0-9_\s]+$/.test(title.trim())) {
    return res.status(400).json({ message: 'Tiêu đề chỉ được chứa chữ, số, dấu gạch dưới và khoảng trắng' });
  }
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Nội dung không được để trống' });
  }
  if (image_url && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(image_url)) {
    return res.status(400).json({ message: 'Đường dẫn hình ảnh không hợp lệ (phải là URL ảnh)' });
  }
  if (!user_id) {
    return res.status(400).json({ message: 'Không xác định được user_id' });
  }
  const newId = await BlogPost.create({
    user_id,
    title,
    slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
    content,
    image_url: image_url || '',
    status: status || 'draft',
  });
  const newPost = await BlogPost.findById(newId);
  return res.status(201).json(newPost);
});

// @desc    Update blog post
// @route   PUT /api/admin/blog/:id
// @access  Admin
export const updateBlogPost = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  const { title, slug, content, image_url, status } = req.body;
  const success = await BlogPost.update(id, {
    title, slug, content, image_url, status
  } as any);
  if (!success) {
    return res.status(404).json({ message: 'Không tìm thấy bài viết blog' });
  }
  const updated = await BlogPost.findById(id);
  return res.status(200).json(updated);
});

// @desc    Delete blog post
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
  return res.status(200).json({ message: 'Bài viết blog đã được xóa mềm thành công' });
});

// @desc    Get public blog posts
// @route   GET /api/blog
// @access  Public
export const getBlogsPublic = asyncHandler(async (req: Request, res: Response) => {
  // Chỉ lấy bài viết chưa xóa mềm
  const posts = await BlogPost.findAll(false); // false = không lấy bài đã xóa mềm
  // Chỉ lấy bài viết đã publish
  const mapped = posts
    .filter(post => {
      const status = (post.status || '').toLowerCase().trim();
      return (status === 'published' || status === 'đã đăng') && post.isDeleted === 0;
    })
    .map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.content?.slice(0, 100) || '',
      image: post.image_url,
      status: post.status,
      author_id: post.user_id,
      author_name: '',
      created_at: post.created_at,
      updated_at: post.updated_at,
      tags: [],
      view_count: 0,
    }));
  return res.status(200).json(mapped);
});

export const getBlogs = async (req: Request, res: Response) => {
  return res.status(200).json([]);
};

export const restoreBlogPost = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID không hợp lệ' });
  }
  const success = await BlogPost.restore(id);
  if (success) {
    return res.status(200).json({ message: 'Khôi phục bài viết blog thành công' });
  } else {
    return res.status(404).json({ message: 'Bài viết blog không tìm thấy hoặc chưa bị xóa' });
  }
};

// @desc    Permanently delete blog post
// @route   DELETE /api/admin/blog/:id/permanent
// @access  Admin
export const deleteBlogPostPermanent = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  // Xóa hoàn toàn khỏi DB
  const [result] = await BlogPost.deletePermanent(Number(id));
  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Không tìm thấy bài viết blog để xóa vĩnh viễn' });
  }
  return res.status(200).json({ message: 'Bài viết blog đã được xóa vĩnh viễn' });
}); 