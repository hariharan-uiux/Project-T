import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const userData = await AsyncStorage.getItem('user_session');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (e) {
            console.error("Failed to load user", e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            // Retrieve all users
            const usersJson = await AsyncStorage.getItem('users_data');
            const users = usersJson ? JSON.parse(usersJson) : [];

            // Find matching user
            const foundUser = users.find(u => u.email === email && u.password === password);

            if (foundUser) {
                await AsyncStorage.setItem('user_session', JSON.stringify(foundUser));
                setUser(foundUser);
                return { success: true };
            } else {
                return { success: false, error: 'Invalid email or password' };
            }
        } catch (e) {
            console.error("Login error", e);
            return { success: false, error: 'An error occurred during login' };
        }
    };

    const register = async (name, email, password) => {
        try {
            // Retrieve all users
            const usersJson = await AsyncStorage.getItem('users_data');
            const users = usersJson ? JSON.parse(usersJson) : [];

            // Check if email already exists
            if (users.some(u => u.email === email)) {
                return { success: false, error: 'Email already registered' };
            }

            const newUser = { name, email, password };
            const updatedUsers = [...users, newUser];

            // Save new user list
            await AsyncStorage.setItem('users_data', JSON.stringify(updatedUsers));

            // Auto login
            await AsyncStorage.setItem('user_session', JSON.stringify(newUser));
            setUser(newUser);

            return { success: true };
        } catch (e) {
            console.error("Registration error", e);
            return { success: false, error: 'An error occurred during registration' };
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user_session');
            setUser(null);
        } catch (e) {
            console.error("Logout error", e);
        }
    };

    const updateProfile = async (updatedData) => {
        try {
            if (!user) return;

            const newUser = { ...user, ...updatedData };

            // Update session
            setUser(newUser);
            await AsyncStorage.setItem('user_session', JSON.stringify(newUser));

            // Update in users list
            const usersJson = await AsyncStorage.getItem('users_data');
            let users = usersJson ? JSON.parse(usersJson) : [];
            const userIndex = users.findIndex(u => u.email === user.email);

            if (userIndex !== -1) {
                users[userIndex] = newUser;
                await AsyncStorage.setItem('users_data', JSON.stringify(users));
            }

            return { success: true };
        } catch (e) {
            console.error("Update profile error", e);
            return { success: false, error: 'Failed to update profile' };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
