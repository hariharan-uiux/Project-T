import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X, Droplet, Wrench, Wind, Zap, Thermometer, Activity, Filter, RefreshCw, Battery, Gauge, ShieldCheck, FileText, HelpCircle, Search, ChevronRight } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

import { VEHICLE_METRICS } from '../constants/metricsData';

// Map iconName strings from the data schema to actual Lucide component references
const IconMap = {
    Droplet,
    Wrench,
    Wind,
    Zap,
    Thermometer,
    Activity,
    Filter,
    RefreshCw,
    Battery,
    Gauge,
    ShieldCheck,
    FileText
};

const AddMetricModal = ({ visible, onClose, onSelect, title = "Add Metrics" }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMetrics = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return VEHICLE_METRICS.filter(metric =>
            metric.name.toLowerCase().includes(query) ||
            metric.category.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.touchableOverlay} onPress={onClose} activeOpacity={1} />
                <View style={styles.modalContent}>
                    <View style={styles.dragHandle} />

                    <View style={styles.headerRow}>
                        <Text style={styles.header}>{title}</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <X size={20} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.searchContainer}>
                        <Search size={20} color={COLORS.gray} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search metrics..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={COLORS.gray}
                        />
                    </View>

                    <ScrollView style={{ width: '100%', flex: 1 }} showsVerticalScrollIndicator={false}>
                        {filteredMetrics.map((metric) => {
                            const IconComponent = metric.iconName && IconMap[metric.iconName] ? IconMap[metric.iconName] : HelpCircle;

                            return (
                                <TouchableOpacity
                                    key={metric.id}
                                    style={styles.listTile}
                                    onPress={() => onSelect(metric)}
                                >
                                    <View style={styles.iconContainer}>
                                        <IconComponent size={24} color={COLORS.primary} />
                                    </View>
                                    <View style={styles.listTileContent}>
                                        <Text style={styles.listTileTitle}>{metric.name}</Text>
                                        <Text style={styles.listTileCategory}>{metric.category.charAt(0).toUpperCase() + metric.category.slice(1)}</Text>
                                    </View>
                                    <View style={styles.listTileTrailing}>
                                        <ChevronRight size={20} color={COLORS.gray} />
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
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
    touchableOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: SIZES.padding * 1.5,
        paddingTop: 15,
        paddingBottom: 40,
        alignItems: 'center',
        height: '80%',
    },
    dragHandle: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: COLORS.border,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textDark,
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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: COLORS.white,
        borderRadius: SIZES.inputRadius || 14,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: COLORS.lightGray,
        paddingHorizontal: 15,
        marginBottom: 20,
        height: 50,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textDark,
    },
    listTile: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 16,
        borderCurve: 'continuous',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF2E9', // Light Primary Tint
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    listTileContent: {
        flex: 1,
    },
    listTileTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 4,
    },
    listTileCategory: {
        fontSize: 13,
        color: COLORS.gray,
    },
    listTileTrailing: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default AddMetricModal;
