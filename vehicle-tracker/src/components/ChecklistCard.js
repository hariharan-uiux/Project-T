import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Edit2, Trash2, CheckSquare, Square, Plus } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import AnimatedTouchable from './AnimatedTouchable';

const ChecklistCard = ({ checklist, onUpdateTitle, onDelete, onAddItem, onToggleItem, onDeleteItem }) => {
    const [newItemText, setNewItemText] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleText, setTitleText] = useState(checklist.title);

    const handleAddItem = () => {
        if (newItemText.trim()) {
            onAddItem(checklist.id, newItemText.trim());
            setNewItemText('');
        }
    };

    const handleTitleSave = () => {
        if (titleText.trim() !== checklist.title) {
            onUpdateTitle(checklist.id, titleText.trim());
        }
        setIsEditingTitle(false);
    };

    return (
        <View style={styles.card}>
            {/* Header: Title + Actions */}
            <View style={styles.header}>
                {isEditingTitle ? (
                    <TextInput
                        style={styles.titleInput}
                        value={titleText}
                        onChangeText={setTitleText}
                        onBlur={handleTitleSave}
                        onSubmitEditing={handleTitleSave}
                        autoFocus
                    />
                ) : (
                    <Text style={styles.title}>{checklist.title}</Text>
                )}

                <View style={styles.headerActions}>
                    <AnimatedTouchable onPress={() => setIsEditingTitle(!isEditingTitle)} style={styles.actionBtn}>
                        <Edit2 size={18} color={COLORS.primary} />
                    </AnimatedTouchable>
                    <AnimatedTouchable onPress={() => onDelete(checklist.id)} style={styles.actionBtn}>
                        <Trash2 size={18} color={COLORS.error || '#FF5252'} />
                    </AnimatedTouchable>
                </View>
            </View>

            {/* Checklist Items */}
            <View style={styles.listContainer}>
                {checklist.items && checklist.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                        <AnimatedTouchable onPress={() => onToggleItem(checklist.id, item.id)}>
                            {item.checked ?
                                <CheckSquare size={20} color={COLORS.primary} /> :
                                <Square size={20} color={COLORS.gray || '#CCC'} />
                            }
                        </AnimatedTouchable>
                        <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
                            {item.text}
                        </Text>
                        <AnimatedTouchable onPress={() => onDeleteItem(checklist.id, item.id)}>
                            <Trash2 size={16} color={COLORS.lightGray || '#EEE'} />
                        </AnimatedTouchable>
                    </View>
                ))}
            </View>

            {/* Add New Item Input */}
            <View style={styles.addItemRow}>
                <TextInput
                    style={styles.addItemInput}
                    value={newItemText}
                    onChangeText={setNewItemText}
                    placeholder="Add item..."
                    placeholderTextColor={COLORS.gray || '#999'}
                    onSubmitEditing={handleAddItem}
                />
                {newItemText.length > 0 && (
                    <AnimatedTouchable onPress={handleAddItem}>
                        <Plus size={20} color={COLORS.primary} />
                    </AnimatedTouchable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.cardRadius || 20,
        borderCurve: 'continuous',
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        borderWidth: 1,
        borderColor: COLORS.border || '#F0F0F0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FAF0E6',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark || '#333',
        flex: 1,
    },
    titleInput: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark || '#333',
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        padding: 0,
    },
    headerActions: {
        flexDirection: 'row',
    },
    actionBtn: {
        marginLeft: 10,
        padding: 4,
    },
    listContainer: {
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    itemText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: COLORS.textDark || '#333',
    },
    itemTextChecked: {
        textDecorationLine: 'line-through',
        color: COLORS.gray || '#999',
    },
    addItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    addItemInput: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textDark || '#333',
        paddingVertical: 5,
    },
});

export default ChecklistCard;
