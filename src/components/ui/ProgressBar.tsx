"use client";

import { useMemo } from "react";

interface ProgressBarProps {
    value: number;
    max: number;
    label?: string;
    color?: string;
    className?: string;
}

export default function ProgressBar({
    value,
    max,
    label = "HP",
    color = "bg-[#58a858]",
    className = "",
}: ProgressBarProps) {
    const percentage = useMemo(() => {
        return Math.min(Math.max((value / max) * 100, 0), 100);
    }, [value, max]);

    const isLow = percentage < 25;
    const isMedium = percentage >= 25 && percentage < 50;

    // Dynamic color based on low health if not overridden
    const activeColor = isLow ? "bg-gba-accent" : isMedium ? "bg-gba-gold" : color;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <div className="flex justify-between items-end mb-1">
                    <span className="text-[6px] text-gba-bg-darker">{label}</span>
                    <span className={`text-[7px] tracking-[-1px] ${isLow ? 'text-gba-accent' : 'text-gba-text'}`}>
                        {value}/{max}
                    </span>
                </div>
            )}
            <div className="h-[8px] bg-gba-border rounded-none overflow-hidden pixel-border relative">
                <div
                    className={`h-full ${activeColor} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                >
                    {/* Highlight effect */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-30" />
                </div>
            </div>
        </div>
    );
}
