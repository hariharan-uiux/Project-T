import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { FileText, Trash2, Edit2 } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import AnimatedTouchable from './AnimatedTouchable';

const DocumentCard = ({ document, onDelete, onUpdateTitle, onView }) => {
    const isImage = document.type && document.type.startsWith('image');
    const [isEditing, setIsEditing] = useState(false);
    const [titleText, setTitleText] = useState(document.name);

    const handleSaveTitle = () => {
        if (titleText.trim() !== document.name) {
            onUpdateTitle(document.id, titleText.trim());
        }
        setIsEditing(false);
    };

    return (
        <AnimatedTouchable style={styles.card} onPress={() => !isEditing && onView(document)} activeOpacity={0.9}>
            <View style={styles.previewContainer}>
                {isImage ? (
                    <Image source={{ uri: document.uri }} style={styles.thumbnail} />
                ) : (
                    <View style={styles.iconPlaceholder}>
                        <FileText size={40} color={COLORS.primary} />
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                {isEditing ? (
                    <TextInput
                        style={styles.nameInput}
                        value={titleText}
                        onChangeText={setTitleText}
                        onBlur={handleSaveTitle}
                        onSubmitEditing={handleSaveTitle}
                        autoFocus
                    />
                ) : (
                    <Text style={styles.name} numberOfLines={1}>{document.name}</Text>
                )}

                <View style={styles.actions}>
                    <AnimatedTouchable onPress={() => setIsEditing(!isEditing)} style={styles.actionBtn}>
                        <Edit2 size={16} color={COLORS.primary} />
                    </AnimatedTouchable>
                    <AnimatedTouchable onPress={() => onDelete(document.id)} style={styles.actionBtn}>
                        <Trash2 size={16} color={COLORS.error || '#FF5252'} />
                    </AnimatedTouchable>
                </View>
            </View>
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.cardRadius || 16,
        borderCurve: 'continuous',
        marginBottom: SIZES.padding,
        width: '47%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    previewContainer: {
        height: 110,
        backgroundColor: '#FFF5E0',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    iconPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textDark,
        flex: 1,
        marginRight: 5,
    },
    nameInput: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textDark,
        flex: 1,
        marginRight: 5,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        padding: 0,
    },
    actions: {
        flexDirection: 'row',
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        marginLeft: 6,
    }
});

export default DocumentCard;
