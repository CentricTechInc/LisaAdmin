import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { ImageUploadPreview } from '@/components/ui/ImageUploadPreview';
import { useAuth } from '@/contexts/AuthContext';

interface AdminProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminProfileModal: React.FC<AdminProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '*************',
  });
  
  // Initialize image with user avatar or default
  const [imageName, setImageName] = useState<string>("avatar.png");

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || '',
        email: user.email || '',
        password: '*************',
      });
      
      if (user.avatar || user.profile_pic) {
          setImageName(user.avatar || user.profile_pic || "avatar.png");
      }
    }
  }, [user, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-2xl bg-[#F9FAFB] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-[#13000A]">Admin Profile</h2>
        <button
          onClick={onClose}
          className="rounded-full border border-gray-200 w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
        >
           <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </button>
      </div>

      {/* Image Upload */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 mb-2 block">Upload Your The Image</label>
        <ImageUploadPreview
            imageName={imageName}
            alt="Admin Profile"
            onFileSelect={(file) => console.log(file)}
            className="bg-white border-dashed border-2 border-gray-200 rounded-xl"
            imageWrapperClassName="w-24 h-24 rounded-2xl"
            buttonLabel="Change Image"
        />
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <FormInput
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="bg-white border-gray-200 h-12 rounded-xl"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="bg-white border-gray-200 h-12 rounded-xl"
            />
             <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="bg-white border-gray-200 h-12 rounded-xl"
            />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex justify-end">
        <Button
            variant="brand"
            className="px-8 rounded-xl h-12 font-semibold"
            onClick={onClose}
        >
            Save
        </Button>
      </div>
    </Modal>
  );
};
