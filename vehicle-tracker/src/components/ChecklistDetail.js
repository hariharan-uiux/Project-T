import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit2, Trash2, X as XIcon, Plus, ChevronLeft, Circle, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import AnimatedTouchable from './AnimatedTouchable';

const ChecklistDetail = ({ checklist, onBack, onUpdateTitle, onDelete, onAddItem, onEditItem, onToggleItem, onDeleteItem }) => {
    const [newItemText, setNewItemText] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [titleText, setTitleText] = useState(checklist?.title || '');
    const [showAddInput, setShowAddInput] = useState(false);

    // Track which item is currently being edited
    const [editingItemId, setEditingItemId] = useState(null);
    const [editingItemText, setEditingItemText] = useState('');

    if (!checklist) return null;

    const handleAddItem = () => {
        if (newItemText.trim()) {
            onAddItem(checklist.id, newItemText.trim());
            setNewItemText('');
        }
    };

    const handleTitleSave = () => {
        if (titleText.trim() !== checklist.title && titleText.trim() !== '') {
            onUpdateTitle(checklist.id, titleText.trim());
        } else {
            setTitleText(checklist.title); // reset to original if empty
        }
        setIsEditingTitle(false);
    };

    const handleItemEditStart = (item) => {
        setEditingItemId(item.id);
        setEditingItemText(item.text);
    };

    const handleItemEditSave = (itemId) => {
        if (editingItemText.trim() !== '') {
            onEditItem(checklist.id, itemId, editingItemText.trim());
        }
        setEditingItemId(null);
        setEditingItemText('');
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <AnimatedTouchable onPress={onBack} style={styles.backButton}>
                            <ChevronLeft size={32} color={COLORS.primary} strokeWidth={2.5} />
                        </AnimatedTouchable>
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
                    </View>

                    <View style={styles.headerActions}>
                        <AnimatedTouchable onPress={() => setIsEditingTitle(!isEditingTitle)} style={styles.actionBtn}>
                            <Edit2 size={24} color={COLORS.primary} strokeWidth={2.5} />
                        </AnimatedTouchable>
                        <AnimatedTouchable onPress={() => { onDelete(checklist.id); onBack(); }} style={styles.actionBtn}>
                            <Trash2 size={24} color={COLORS.primary} strokeWidth={2.5} />
                        </AnimatedTouchable>
                    </View>
                </View>

                {/* List */}
                <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
                    {[...(checklist.items || [])].sort((a, b) => {
                        if (a.checked === b.checked) return 0;
                        return a.checked ? 1 : -1;
                    }).map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <AnimatedTouchable onPress={() => onToggleItem(checklist.id, item.id)} style={styles.checkboxWrapper}>
                                {item.checked ?
                                    <CheckCircle2 size={26} color={COLORS.white} fill={COLORS.primary} strokeWidth={2} /> :
                                    <Circle size={26} color={COLORS.primary} strokeWidth={2.5} />
                                }
                            </AnimatedTouchable>

                            {editingItemId === item.id ? (
                                <TextInput
                                    style={[styles.itemText, { borderBottomWidth: 1, borderBottomColor: COLORS.primary }]}
                                    value={editingItemText}
                                    onChangeText={setEditingItemText}
                                    onBlur={() => handleItemEditSave(item.id)}
                                    onSubmitEditing={() => handleItemEditSave(item.id)}
                                    autoFocus
                                />
                            ) : (
                                <Text
                                    style={[styles.itemText, item.checked && styles.itemTextChecked]}
                                    onPress={() => handleItemEditStart(item)}
                                >
                                    {item.text}
                                </Text>
                            )}

                            <AnimatedTouchable onPress={() => onDeleteItem(checklist.id, item.id)} style={styles.actionBtnIcon}>
                                <XIcon size={24} color={COLORS.textLight} strokeWidth={2.5} />
                            </AnimatedTouchable>
                        </View>
                    ))}
                    {showAddInput && (
                        <View style={styles.itemRow}>
                            <Circle size={26} color={COLORS.textLight} strokeWidth={2} style={styles.checkboxWrapper} />
                            <TextInput
                                style={styles.addItemInputInner}
                                value={newItemText}
                                onChangeText={setNewItemText}
                                placeholder="New item..."
                                placeholderTextColor={COLORS.textLight}
                                onSubmitEditing={handleAddItem}
                                autoFocus
                            />
                            {newItemText.length > 0 ? (
                                <AnimatedTouchable onPress={handleAddItem} style={styles.actionBtnIcon}>
                                    <Plus size={24} color={COLORS.primary} strokeWidth={2.5} />
                                </AnimatedTouchable>
                            ) : (
                                <AnimatedTouchable onPress={() => setShowAddInput(false)} style={styles.actionBtnIcon}>
                                    <XIcon size={24} color={COLORS.textLight} strokeWidth={2.5} />
                                </AnimatedTouchable>
                            )}
                        </View>
                    )}
                </ScrollView>

                {!showAddInput && (
                    <AnimatedTouchable
                        style={styles.fab}
                        onPress={() => setShowAddInput(true)}
                    >
                        <Plus size={30} color={COLORS.primary} />
                    </AnimatedTouchable>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding,
        paddingTop: Platform.OS === 'android' ? 10 : SIZES.padding,
        paddingBottom: SIZES.padding,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: 10,
        marginLeft: -10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.black,
        flex: 1,
    },
    titleInput: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.black,
        flex: 1,
        padding: 0,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionBtn: {
        marginLeft: 15,
        padding: 4,
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        paddingTop: 10,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    checkboxWrapper: {
        marginRight: 15,
    },
    itemText: {
        flex: 1,
        fontSize: 16,
        color: COLORS.black,
    },
    itemTextChecked: {
        color: COLORS.gray,
        textDecorationLine: 'line-through',
    },
    actionBtnIcon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: SIZES.padding,
        width: 60,
        height: 60,
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: '#FFF5E0',
        borderWidth: 1,
        borderColor: '#FFE0B2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addItemInputInner: {
        flex: 1,
        fontSize: 16,
        color: COLORS.black,
        paddingVertical: 4,
    }
});

export default ChecklistDetail;
