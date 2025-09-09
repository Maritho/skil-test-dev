import React, { ReactNode } from 'react';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    {{}}
    return (
        <div
            className="fixed inset-0 bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
            className="bg-white p-6 rounded-lg min-w-[300px] max-w-[90vw] shadow-lg relative"
            onClick={e => e.stopPropagation()}
            >
            {title && (
                <div className="mb-4 font-bold text-[32px]">
                {title}
                </div>
            )}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-2xl bg-transparent border-none cursor-pointer"
                aria-label="Close"
                type="button"
            >
                &times;
            </button>
            {children}
            </div>
        </div>
    );
};

export default Modal;
