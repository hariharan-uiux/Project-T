import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutAnimation } from 'react-native';

const DocumentContext = createContext();

export const useDocuments = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial load
    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const storedDocs = await AsyncStorage.getItem('@documents');
            if (storedDocs) {
                setDocuments(JSON.parse(storedDocs));
            }
        } catch (e) {
            console.error("Failed to load documents", e);
        } finally {
            setLoading(false);
        }
    };

    const saveDocuments = async (newDocs) => {
        try {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setDocuments(newDocs);
            await AsyncStorage.setItem('@documents', JSON.stringify(newDocs));
        } catch (e) {
            console.error("Failed to save documents", e);
        }
    };

    const addDocument = async (doc) => {
        const newDocs = [...documents, doc];
        await saveDocuments(newDocs);
    };

    const deleteDocument = async (id) => {
        const newDocs = documents.filter(d => d.id !== id);
        await saveDocuments(newDocs);
    };

    const updateDocumentTitle = async (id, newTitle) => {
        const newDocs = documents.map(d =>
            d.id === id ? { ...d, name: newTitle } : d
        );
        await saveDocuments(newDocs);
    };

    return (
        <DocumentContext.Provider value={{
            documents,
            loading,
            addDocument,
            deleteDocument,
            updateDocumentTitle
        }}>
            {children}
        </DocumentContext.Provider>
    );
};
