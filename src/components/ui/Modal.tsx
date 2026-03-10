"use client";

import React, { useEffect } from "react";
import TypewriterText from "../TypewriterText";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children?: React.ReactNode;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
}: ModalProps) {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                style={{ animation: "overlay-fade 0.3s ease-out" }}
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className="dialog-box relative z-10 w-full max-w-md w-full"
                style={{ animation: "modal-open 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }}
            >
                {/* Header decoration */}
                <div className="absolute -top-3 -left-3 w-6 h-6 bg-gba-accent pixel-border flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full opacity-50" />
                </div>

                {/* Close Button "X" */}
                <button
                    onClick={onClose}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-gba-border pixel-border flex items-center justify-center text-gba-white hover:bg-gba-accent transition-colors z-20"
                >
                    <span className="text-[12px] font-bold">×</span>
                </button>

                <div className="mt-2">
                    {title && (
                        <h3 className="text-[10px] text-gba-gold underline mb-3 text-center tracking-widest leading-relaxed">
                            {title}
                        </h3>
                    )}

                    {description && (
                        <div className="min-h-[40px] mb-4">
                            <TypewriterText
                                text={description}
                                speed={30}
                                className="text-[8px] leading-[18px] text-gba-text"
                            />
                        </div>
                    )}

                    <div className="mt-4 pt-4 border-t-2 border-dashed border-gba-window-border">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
