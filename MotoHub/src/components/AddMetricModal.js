import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { X, Droplet, Wrench, Wind, Zap, Thermometer, Activity, Filter, RefreshCw, Battery, Gauge, ShieldCheck, FileText, HelpCircle, Search, ChevronRight } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useMetrics } from '../context/MetricsContext';
import FadeInView from './FadeInView';

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
    const { metrics } = useMetrics();
    const { isDark } = useTheme();
    const C = getColors(isDark);
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
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <FadeInView style={styles.overlay} translate={0} duration={300} trigger={visible}>
                <TouchableOpacity style={styles.touchableOverlay} onPress={onClose} activeOpacity={1} />
                <FadeInView style={[styles.modalContent, { backgroundColor: C.surface }]} translate={30} duration={400} delay={100} trigger={visible}>
                    <View style={[styles.dragHandle, { backgroundColor: C.border }]} />

                    <View style={styles.headerRow}>
                        <Text style={[styles.header, { color: C.textDark }]}>{title}</Text>
                        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: C.white, borderColor: C.border }]} onPress={onClose}>
                            <X size={20} color={C.textLight} />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.searchContainer, { backgroundColor: C.white, borderColor: C.lightGray }]}>
                        <Search size={20} color={C.textLight} style={styles.searchIcon} />
                        <TextInput
                            style={[styles.searchInput, { color: C.textDark }]}
                            placeholder="Search metrics..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor={C.textLight}
                        />
                    </View>

                    <ScrollView style={{ width: '100%', flex: 1 }} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
                        {filteredMetrics.map((metric) => {
                            const IconComponent = metric.iconName && IconMap[metric.iconName] ? IconMap[metric.iconName] : HelpCircle;
                            const isAdded = metrics.some(m => m.title === metric.name || (m.id && m.id.endsWith(`_${metric.id}`)));

                            return (
                                <TouchableOpacity
                                    key={metric.id}
                                    style={[styles.listTile, { backgroundColor: C.white, borderColor: C.border }, isAdded && { opacity: 0.5, backgroundColor: C.surface }]}
                                    onPress={() => !isAdded && onSelect(metric)}
                                    disabled={isAdded}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2A1A0E' : '#FFF2E9' }]}>
                                        <IconComponent size={24} color={isAdded ? C.textLight : COLORS.primary} />
                                    </View>
                                    <View style={styles.listTileContent}>
                                        <Text style={[styles.listTileTitle, { color: C.textDark }, isAdded && { color: C.textLight }]}>{metric.name}</Text>
                                        <Text style={[styles.listTileCategory, { color: C.textLight }]}>{metric.category.charAt(0).toUpperCase() + metric.category.slice(1)}</Text>
                                    </View>
                                    <View style={styles.listTileTrailing}>
                                        {isAdded ? (
                                            <Text style={{ color: C.textLight, fontSize: 12 }}>Added</Text>
                                        ) : (
                                            <ChevronRight size={20} color={C.textLight} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
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
