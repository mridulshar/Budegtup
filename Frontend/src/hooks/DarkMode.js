import { useState, useEffect } from 'react';

const useDarkMode = () => {
   
    const [isDarkMode, setDarkMode] = useState(() => {
        const storedMode = localStorage.getItem('isDarkMode');
        return storedMode ? JSON.parse(storedMode) : false;
    });

    useEffect(() => {
        const body = document.body;
        if (isDarkMode) {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => setDarkMode(prevMode => !prevMode);

    return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;