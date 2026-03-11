import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, Calendar, Undo2 } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

const HistoryModal = ({ visible, onClose, history, onUndo }) => {
    // 30 minutes in milliseconds
    const UNDO_WINDOW = 30 * 60 * 1000;
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Completed Metrics</Text>
                        <TouchableOpacity onPress={onClose} style={styles.iconBtn}>
                            <X size={20} color={COLORS.gray} />
                        </TouchableOpacity>
                    </View>

                    {history.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No completed metrics yet.</Text>
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                            {history.map((item) => {
                                const canUndo = item.completionTimestamp && (Date.now() - item.completionTimestamp < UNDO_WINDOW);

                                return (
                                    <View key={item.historyId} style={styles.historyCard}>
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.title}>{item.title}</Text>
                                            <View style={styles.headerRight}>
                                                <Text style={styles.dateText}>{item.completionDate}</Text>
                                                {canUndo && (
                                                    <TouchableOpacity
                                                        style={[styles.iconBtn, { marginLeft: 10 }]}
                                                        onPress={() => onUndo(item.historyId)}
                                                    >
                                                        <Undo2 size={18} color={COLORS.primary} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>

                                        {/* Subtitle based on tracking type to give context to what was entered */}
                                        {item.tracking_type === 'km_interval' && item.last_done_km && (
                                            <Text style={styles.statLine}>Recorded at: {item.last_done_km} {item.unit?.toUpperCase() || 'KM'}</Text>
                                        )}
                                        {item.tracking_type === 'date_interval' && item.last_done_date && (
                                            <Text style={styles.statLine}>Last Done Date: {item.last_done_date}</Text>
                                        )}
                                        {item.tracking_type === 'expiry_date' && item.expiry_date && (
                                            <Text style={styles.statLine}>Expired on: {item.expiry_date}</Text>
                                        )}
                                        {!item.tracking_type && item.recordedKm && (
                                            <Text style={styles.statLine}>Recorded: {item.recordedKm} KM</Text>
                                        )}
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.background, // Or white
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: SIZES.padding * 1.5,
        paddingBottom: 40,
        maxHeight: '80%',
        minHeight: '50%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: COLORS.gray,
    },
    list: {
        width: '100%',
    },
    historyCard: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 15,
        borderCurve: 'continuous',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
        flex: 1,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
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
    dateText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    statLine: {
        fontSize: 14,
        color: COLORS.gray,
        marginTop: 4,
    }
});

export default HistoryModal;
