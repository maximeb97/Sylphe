import { useEffect, useState } from "react";

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

export default function useKonamiCode(onSuccess: () => void) {
    useEffect(() => {
        let index = 0;

        const onKeyDown = (e: KeyboardEvent) => {
            // Allow lowercase and uppercase letters
            const key = e.key;
            const expectedKey = KONAMI_CODE[index];

            const isMatch =
                key === expectedKey ||
                key === expectedKey.toLowerCase() ||
                key === expectedKey.toUpperCase();

            if (isMatch) {
                index++;
                if (index === KONAMI_CODE.length) {
                    onSuccess();
                    index = 0;
                }
            } else {
                index = 0;
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onSuccess]);
}
