import React from 'react';
import Modal from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isProcessing?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isProcessing = false,
  variant = 'danger'
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
      <div className="mt-2">
        <p className="text-sm text-gray-500">{message}</p>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          onClick={onClose}
          disabled={isProcessing}
        >
          {cancelText}
        </Button>
        <Button
          type="button"
          className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none ${
            variant === 'danger'
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : confirmText}
        </Button>
      </div>
    </Modal>
  );
};
