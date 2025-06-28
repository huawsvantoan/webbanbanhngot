import React from 'react';

interface AdminSectionProps {
  title: string;
  children: React.ReactNode;
}

const AdminSection: React.FC<AdminSectionProps> = ({ title, children }) => {
  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-gray-50">
      <h2 className="text-4xl font-extrabold text-pink-600 mb-8 tracking-tight text-center drop-shadow-lg">{title}</h2>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminSection; 