import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@themeMode';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const systemScheme = useColorScheme(); // 'light' | 'dark' | null
    const [themeMode, setThemeModeState] = useState('system'); // 'light' | 'dark' | 'system'

    // Load saved preference on mount
    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
            if (saved === 'light' || saved === 'dark' || saved === 'system') {
                setThemeModeState(saved);
            }
        });
    }, []);

    const setThemeMode = async (mode) => {
        setThemeModeState(mode);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    };

    // Resolve isDark
    const isDark =
        themeMode === 'dark'
            ? true
            : themeMode === 'light'
            ? false
            : systemScheme === 'dark';

    return (
        <ThemeContext.Provider value={{ themeMode, setThemeMode, isDark }}>
            {children}
        </ThemeContext.Provider>
    );
};
