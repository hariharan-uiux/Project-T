import React from 'react';
import { View, Text, StyleSheet, Modal, FlatList, TouchableOpacity } from 'react-native';
import { X, Check, Star } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import AnimatedTouchable from './AnimatedTouchable';

const VehicleSelectorModal = ({ visible, onClose, vehicles, onSelect, activeId, primaryId, onSetPrimary }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
                <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Select Vehicle</Text>
                        <AnimatedTouchable onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={COLORS.textLight} />
                        </AnimatedTouchable>
                    </View>

                    <View style={styles.divider} />

                    <FlatList
                        data={vehicles}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => {
                            const isActive = item.id === activeId;
                            const isPrimary = item.id === primaryId;
                            return (
                                <View style={[styles.itemRow, isActive && styles.itemRowActive]}>
                                    <AnimatedTouchable
                                        style={styles.itemContent}
                                        onPress={() => {
                                            onSelect(item.id);
                                            onClose();
                                        }}
                                    >
                                        <View>
                                            <Text style={[styles.itemNumber, isActive && styles.itemNumberActive]}>
                                                {item.number}
                                            </Text>
                                            <Text style={styles.itemName}>{item.name}</Text>
                                        </View>
                                        {isActive && <Check size={20} color={COLORS.primary} style={{ marginRight: 10 }} />}
                                    </AnimatedTouchable>

                                    <View style={styles.verticalDivider} />

                                    <AnimatedTouchable
                                        style={styles.starBtn}
                                        onPress={() => onSetPrimary(isPrimary ? null : item.id)}
                                    >
                                        <Star
                                            size={24}
                                            color={isPrimary ? COLORS.primary : COLORS.textLight}
                                            fill={isPrimary ? COLORS.primary : 'transparent'}
                                        />
                                    </AnimatedTouchable>
                                </View>
                            );
                        }}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No vehicles added yet</Text>
                        }
                    />
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: SIZES.padding,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.cardRadius || 20,
        borderCurve: 'continuous',
        padding: SIZES.padding,
        maxHeight: '60%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    closeBtn: {
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
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: 10,
        marginHorizontal: -SIZES.padding,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: SIZES.inputRadius || 14,
        borderCurve: 'continuous',
        marginBottom: 8,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    itemRowActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#FFF2E9',
    },
    itemNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 2,
    },
    itemNumberActive: {
        color: COLORS.primary,
    },
    itemName: {
        fontSize: 12,
        color: COLORS.textDark,
    },
    itemContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    verticalDivider: {
        width: 1,
        height: '80%',
        backgroundColor: COLORS.border,
        marginHorizontal: 10,
    },
    starBtn: {
        padding: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: COLORS.textLight,
        padding: 20,
    }
});

export default VehicleSelectorModal;
