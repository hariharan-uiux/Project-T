import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutAnimation } from 'react-native';

const ChecklistContext = createContext();

export const useChecklist = () => useContext(ChecklistContext);

export const ChecklistProvider = ({ children }) => {
    const [checklists, setChecklists] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial load
    useEffect(() => {
        loadChecklists();
    }, []);

    const loadChecklists = async () => {
        try {
            const storedChecklists = await AsyncStorage.getItem('@checklists');
            if (storedChecklists) {
                setChecklists(JSON.parse(storedChecklists));
            }
        } catch (e) {
            console.error("Failed to load checklists", e);
        } finally {
            setLoading(false);
        }
    };

    const saveChecklists = async (newChecklists) => {
        try {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setChecklists(newChecklists);
            await AsyncStorage.setItem('@checklists', JSON.stringify(newChecklists));
        } catch (e) {
            console.error("Failed to save checklists", e);
        }
    };

    // Checklist Container Operations
    const addChecklist = async (title) => {
        const newId = Date.now();
        const newChecklist = {
            id: newId,
            title,
            items: []
        };
        const newChecklists = [...checklists, newChecklist];
        await saveChecklists(newChecklists);
        return newId;
    };

    const updateChecklistTitle = async (id, newTitle) => {
        const newChecklists = checklists.map(list =>
            list.id === id ? { ...list, title: newTitle } : list
        );
        await saveChecklists(newChecklists);
    };

    const deleteChecklist = async (id) => {
        const newChecklists = checklists.filter(list => list.id !== id);
        await saveChecklists(newChecklists);
    };

    // Checklist Item Operations
    const addItem = async (checklistId, text) => {
        const newChecklists = checklists.map(list => {
            if (list.id === checklistId) {
                return {
                    ...list,
                    items: [...list.items, { id: Date.now(), text, checked: false }]
                };
            }
            return list;
        });
        await saveChecklists(newChecklists);
    };

    const editItem = async (checklistId, itemId, newText) => {
        const newChecklists = checklists.map(list => {
            if (list.id === checklistId) {
                return {
                    ...list,
                    items: list.items.map(item =>
                        item.id === itemId ? { ...item, text: newText } : item
                    )
                };
            }
            return list;
        });
        await saveChecklists(newChecklists);
    };

    const toggleItem = async (checklistId, itemId) => {
        const newChecklists = checklists.map(list => {
            if (list.id === checklistId) {
                return {
                    ...list,
                    items: list.items.map(item =>
                        item.id === itemId ? { ...item, checked: !item.checked } : item
                    ).sort((a, b) => {
                        if (a.checked === b.checked) return 0;
                        return a.checked ? 1 : -1;
                    })
                };
            }
            return list;
        });
        await saveChecklists(newChecklists);
    };

    const deleteItem = async (checklistId, itemId) => {
        const newChecklists = checklists.map(list => {
            if (list.id === checklistId) {
                return {
                    ...list,
                    items: list.items.filter(item => item.id !== itemId)
                };
            }
            return list;
        });
        await saveChecklists(newChecklists);
    };

    return (
        <ChecklistContext.Provider value={{
            checklists,
            loading,
            addChecklist,
            updateChecklistTitle,
            deleteChecklist,
            addItem,
            editItem,
            toggleItem,
            deleteItem
        }}>
            {children}
        </ChecklistContext.Provider>
    );
};
