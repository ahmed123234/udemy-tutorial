import { useState, useEffect } from "react";
// we don't want to exsuaste our database with queries for every single keystrog that the user writes in the search input we don't need to have too many database quires 
export function useDebounce<T>(value: T, delay?: number): T {
    const [debounceValue, setDebounceValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounceValue(value), delay || 500);

        return () => {
            clearTimeout(timer);
        }

    }, [value, delay]);
    return debounceValue;
}