"use client";

import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    blinkingArrow?: boolean;
}

export default function Button({
    children,
    className = "",
    variant = "primary",
    blinkingArrow = false,
    ...props
}: ButtonProps) {
    // Styles based on variants
    const getVariantStyles = () => {
        switch (variant) {
            case "danger":
                return "bg-gba-accent hover:bg-red-400";
            case "secondary":
                return "bg-gba-border text-gba-white hover:bg-gray-600";
            case "primary":
            default:
                return "bg-gba-bg-dark hover:bg-gba-accent";
        }
    };

    return (
        <button
            className={`gba-btn ${getVariantStyles()} ${className} flex items-center justify-center`}
            {...props}
        >
            {blinkingArrow && (
                <span
                    className="inline-block mr-2 text-gba-white"
                    style={{ animation: "menu-arrow 0.6s ease-in-out infinite" }}
                >
                    ▶
                </span>
            )}
            {children}
        </button>
    );
}
