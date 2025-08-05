import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Product, Category } from '../../types/product';
import { toast } from 'react-hot-toast';
import { Icons } from '../../components/icons';
import { useFormik } from 'formik';
import { productSchema } from '../../validations/productSchema';

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Product ID for editing
  const isEditMode = !!id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category_id, setCategoryId] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null); // For displaying existing image
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Các trường mới
  const [is_featured, setIsFeatured] = useState(false);
  const [is_hot, setIsHot] = useState(false);
  const [discount_percent, setDiscountPercent] = useState<string>('');
  const [original_price, setOriginalPrice] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      name: '',
      category_id: '',
      price: '',
      stock: '',
      description: '',
      is_featured: false,
      is_hot: false,
      discount_percent: '',
      original_price: '',
    },
    validationSchema: productSchema.pick(['name', 'category_id', 'price', 'stock', 'description']),
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description || '');
        formData.append('price', values.price.toString());
        formData.append('category_id', values.category_id.toString());
        formData.append('stock', values.stock.toString());
        formData.append('is_featured', is_featured.toString());
        formData.append('is_hot', is_hot.toString());
        formData.append('discount_percent', (discount_percent || '0').toString());
        if (original_price && original_price !== '') {
          formData.append('original_price', original_price.toString());
        }
        if (image) {
          formData.append('image', image);
        } else if (imageUrl) {
          formData.append('image_url', imageUrl);
        }
        if (isEditMode) {
          await api.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          toast.success('Cập nhật sản phẩm thành công!');
        } else {
          await api.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          toast.success('Tạo sản phẩm thành công!');
        }
        navigate('/admin/products');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Lưu sản phẩm thất bại');
        toast.error('Lưu sản phẩm thất bại: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        setCategories(response.data);
      } catch (err: any) {
        toast.error('Không thể tải danh mục: ' + (err.response?.data?.message || err.message));
      }
    };
    fetchCategories();

    if (isEditMode) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/products/${id}`);
          const product: Product = response.data;
          formik.setValues({
            name: product.name,
            category_id: product.category_id ? String(product.category_id) : '',
            price: product.price ? String(product.price) : '',
            stock: product.stock ? String(product.stock) : '',
            description: product.description || '',
            is_featured: product.is_featured || false,
            is_hot: product.is_hot || false,
            discount_percent: product.discount_percent ? String(product.discount_percent) : '',
            original_price: product.original_price ? String(product.original_price) : '',
          });
          setImageUrl(product.image_url || null);
          setIsFeatured(product.is_featured || false);
          setIsHot(product.is_hot || false);
          setDiscountPercent(product.discount_percent ? String(product.discount_percent) : '');
          setOriginalPrice(product.original_price ? String(product.original_price) : '');
        } catch (err: any) {
          setError(err.response?.data?.message || 'Không thể tải thông tin sản phẩm');
          toast.error('Không thể tải thông tin sản phẩm: ' + (err.response?.data?.message || err.message));
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <button onClick={() => navigate('/admin/products')} className="text-gray-600 hover:text-gray-900 mr-4">
            <Icons.ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{isEditMode ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Lỗi!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
              )}
            </div>
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                id="category_id"
                name="category_id"
                value={formik.values.category_id}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              >
                <option value="">Chọn danh mục</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {formik.touched.category_id && formik.errors.category_id && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.category_id}</div>
              )}
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                step="0.01"
              />
              {formik.touched.price && formik.errors.price && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
              )}
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Tồn kho</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
              {formik.touched.stock && formik.errors.stock && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.stock}</div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            ></textarea>
            {formik.touched.description && formik.errors.description && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
            )}
          </div>

          {/* Các trường mới cho tính năng nổi bật/hot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={is_featured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Sản phẩm nổi bật</span>
              </label>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={is_hot}
                  onChange={(e) => setIsHot(e.target.checked)}
                  className="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Sản phẩm bán chạy (HOT)</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="discount_percent" className="block text-sm font-medium text-gray-700 mb-1">Phần trăm giảm giá (%)</label>
              <input
                type="number"
                id="discount_percent"
                value={discount_percent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                min="0"
                max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="original_price" className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (trước khi giảm)</label>
              <input
                type="number"
                id="original_price"
                value={original_price}
                onChange={(e) => setOriginalPrice(e.target.value)}
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                placeholder="Giá gốc (nếu có giảm giá)"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
            />
            {(imageUrl && !image) && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Ảnh hiện tại:</p>
                <img src={imageUrl} alt="Ảnh sản phẩm hiện tại" className="h-32 w-32 object-cover rounded-lg shadow-md" />
              </div>
            )}
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Xem trước ảnh mới:</p>
                <img src={URL.createObjectURL(image)} alt="Xem trước ảnh sản phẩm mới" className="h-32 w-32 object-cover rounded-lg shadow-md" />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang lưu...' : (isEditMode ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm; 