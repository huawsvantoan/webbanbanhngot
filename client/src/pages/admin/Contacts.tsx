import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get('/contacts');
      setContacts(res.data);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (contact: Contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    try {
      await api.delete(`/contacts/${contactToDelete.id}`);
      toast.success('Xóa liên hệ thành công!');
      setShowDeleteModal(false);
      setContactToDelete(null);
      fetchContacts();
    } catch {
      toast.error('Xóa liên hệ thất bại!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Quản lý liên hệ</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Đang tải...</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">Chưa có liên hệ nào.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chủ đề</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tin nhắn</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{c.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-600 underline">{c.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{c.subject}</td>
                      <td className="px-6 py-4 whitespace-pre-line max-w-xs break-words">{c.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(c.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          className="text-red-600 hover:text-red-900 font-semibold"
                          onClick={() => handleDelete(c)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {/* Modal xác nhận xóa */}
        {showDeleteModal && contactToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2 text-red-600">Xác nhận xóa liên hệ</h3>
              <p className="mb-4">Bạn có chắc chắn muốn xóa liên hệ của <b>{contactToDelete.name}</b> không?</p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Đóng
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={confirmDelete}
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts; 