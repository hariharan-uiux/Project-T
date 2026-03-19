import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, Calendar, Undo2 } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { formatNumber } from '../utils/numberFormat';
import FadeInView from './FadeInView';

const HistoryModal = ({ visible, onClose, history, onUndo }) => {
    const { isDark } = useTheme();
    const C = getColors(isDark);
    const UNDO_WINDOW = 30 * 60 * 1000;
    return (
        <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
            <FadeInView style={styles.overlay} translate={0} duration={300} trigger={visible}>
                <TouchableOpacity style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}} activeOpacity={1} onPress={onClose} />
                <FadeInView style={[styles.modalContent, { backgroundColor: C.background }]} translate={30} duration={450} delay={100} trigger={visible}>
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: C.textDark }]}>Completed Metrics</Text>
                        <TouchableOpacity onPress={onClose} style={[styles.iconBtn, { backgroundColor: C.white, borderColor: C.border }]}>
                            <X size={20} color={C.textLight} />
                        </TouchableOpacity>
                    </View>

                    {history.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: C.textLight }]}>No completed metrics yet.</Text>
                        </View>
                    ) : (
                        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                            {history.map((item) => {
                                const canUndo = item.completionTimestamp && (Date.now() - item.completionTimestamp < UNDO_WINDOW);
                                return (
                                    <View key={item.historyId} style={[styles.historyCard, { backgroundColor: C.white, borderColor: C.border }]}>
                                        <View style={styles.cardHeader}>
                                            <Text style={[styles.title, { color: C.textDark }]}>{item.title}</Text>
                                            <View style={styles.headerRight}>
                                                <Text style={styles.dateText}>{item.completionDate}</Text>
                                                {canUndo && (
                                                    <TouchableOpacity style={[styles.iconBtn, { marginLeft: 10, backgroundColor: C.white, borderColor: C.border }]} onPress={() => onUndo(item.historyId)}>
                                                        <Undo2 size={18} color={COLORS.primary} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </View>
                                        {item.tracking_type === 'km_interval' && item.last_done_km && (
                                            <Text style={[styles.statLine, { color: C.textLight }]}>Recorded at: {formatNumber(item.last_done_km)} {item.unit?.toUpperCase() || 'KM'}</Text>
                                        )}
                                        {item.tracking_type === 'date_interval' && item.last_done_date && (
                                            <Text style={[styles.statLine, { color: C.textLight }]}>Last Done Date: {item.last_done_date}</Text>
                                        )}
                                        {item.tracking_type === 'expiry_date' && item.expiry_date && (
                                            <Text style={[styles.statLine, { color: C.textLight }]}>Expired on: {item.expiry_date}</Text>
                                        )}
                                        {!item.tracking_type && item.recordedKm && (
                                            <Text style={[styles.statLine, { color: C.textLight }]}>Recorded: {formatNumber(item.recordedKm)} KM</Text>
                                        )}
                                    </View>
                                );
                            })}
                        </ScrollView>
                    )}
                </FadeInView>
            </FadeInView>
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
