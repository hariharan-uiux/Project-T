import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Circle, CheckCircle2 } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import AnimatedTouchable from './AnimatedTouchable';

const ChecklistPreviewCard = ({ checklist, onPress }) => {
    const { isDark } = useTheme();
    const C = getColors(isDark);
    // Show up to 3 items
    const previewItems = checklist.items ? checklist.items.slice(0, 3) : [];
    const hasMore = checklist.items && checklist.items.length > 3;

    return (
        <AnimatedTouchable style={[styles.card, { backgroundColor: C.surface, borderColor: C.border }]} onPress={onPress}>
            <Text style={[styles.title, { color: C.black, borderBottomColor: C.border }]} numberOfLines={1}>{checklist.title}</Text>

            <View style={styles.listContainer}>
                {previewItems.map(item => (
                    <View key={item.id} style={styles.itemRow}>
                        {item.checked ?
                            <CheckCircle2 size={20} color={COLORS.white} fill={COLORS.primary} strokeWidth={2} style={styles.icon} /> :
                            <Circle size={20} color={COLORS.primary} fill="rgba(255, 107, 0, 0.05)" strokeWidth={2.5} style={styles.icon} />
                        }
                        <Text style={[styles.itemText, { color: C.black }, item.checked && styles.itemTextChecked]} numberOfLines={1}>
                            {item.text}
                        </Text>
                    </View>
                ))}
                {hasMore && (
                    <View style={styles.moreRow}>
                        <Circle size={20} color="transparent" style={styles.icon} />
                        <Text style={[styles.moreText, { color: C.textLight }]}>...</Text>
                    </View>
                )}
            </View>
        </AnimatedTouchable>
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
    card: {
        backgroundColor: COLORS.surface, // Better contrast in inverted modes
        borderRadius: SIZES.cardRadius || 20,
        borderCurve: 'continuous',
        padding: 15,
        marginBottom: SIZES.padding,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...SHADOWS.medium, // More shadow pop
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    listContainer: {
        marginTop: 5,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    icon: {
        marginRight: 8,
    },
    itemText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.black,
    },
    itemTextChecked: {
        color: COLORS.gray,
    },
    moreRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    moreText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.gray,
        letterSpacing: 2,
    }
});

export default ChecklistPreviewCard;
