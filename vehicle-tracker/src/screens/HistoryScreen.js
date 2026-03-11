import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, History, Droplet, Wrench, Wind, Zap, Thermometer, Activity, Filter, RefreshCw, Battery, Gauge, ShieldCheck, FileText, HelpCircle } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import MetricInputCard from '../components/MetricInputCard';
import AddMetricModal from '../components/AddMetricModal';
import HistoryModal from '../components/HistoryModal';
import { useMetrics } from '../context/MetricsContext';
import AnimatedTouchable from '../components/AnimatedTouchable';

import { useNavigation } from '@react-navigation/native';

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

const HistoryScreen = () => {
    const navigation = useNavigation();
    const { metrics, metricsHistory, addMetric, updateMetric, deleteMetric, undoMarkDone } = useMetrics();
    const [modalVisible, setModalVisible] = useState(false);
    const [historyVisible, setHistoryVisible] = useState(false);

    const handleAddMetric = (metric) => {
        const newMetric = {
            id: Date.now() + '_' + metric.id,
            title: metric.name,
            categoryId: metric.category,
            tracking_type: metric.tracking_type,
            inputs: metric.inputs,
            unit: metric.unit,
            iconName: metric.iconName,
            // Dynamic form fields initialized
            last_done_km: '',
            interval_km: metric.default_interval?.interval_km ? String(metric.default_interval.interval_km) : '',
            last_done_date: '',
            interval_months: metric.default_interval?.interval_months ? String(metric.default_interval.interval_months) : '',
            expiry_date: '',
            saved: false
        };
        addMetric(newMetric);
        setModalVisible(false);
    };

    const handleUpdateMetric = (id, field, value) => {
        updateMetric(id, field, value);
    };

    const handleDeleteMetric = (id) => {
        deleteMetric(id);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Start tracking</Text>
                <AnimatedTouchable onPress={() => setHistoryVisible(true)} style={styles.iconBtn}>
                    <History size={20} color={COLORS.primary} />
                </AnimatedTouchable>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {metrics.filter(m => m.saved).length > 0 && (
                    <View style={styles.metricsChipsContainer}>
                        <Text style={styles.sectionSubtitle}>Tracking:</Text>
                        <View style={styles.chipsWrap}>
                            {metrics.filter(m => m.saved).map((item) => {
                                const IconComponent = item.iconName && IconMap[item.iconName] ? IconMap[item.iconName] : HelpCircle;
                                return (
                                    <AnimatedTouchable
                                        key={item.id}
                                        style={styles.metricChip}
                                        onPress={() => navigation.navigate('Home', { highlightMetricId: item.id })}
                                    >
                                        <IconComponent size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                                        <Text style={styles.metricChipText}>{item.title}</Text>
                                    </AnimatedTouchable>
                                );
                            })}
                        </View>
                    </View>
                )}

                {metrics.filter(m => !m.saved).map(metric => (
                    <MetricInputCard
                        key={metric.id}
                        metric={metric}
                        onUpdate={handleUpdateMetric}
                        onDelete={handleDeleteMetric}
                    />
                ))}
            </ScrollView>

            <AnimatedTouchable
                style={styles.fab}
                onPress={() => setModalVisible(true)}
            >
                <Plus size={30} color={COLORS.primary} />
            </AnimatedTouchable>

            <AddMetricModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSelect={handleAddMetric}
            />

            <HistoryModal
                visible={historyVisible}
                onClose={() => setHistoryVisible(false)}
                history={metricsHistory}
                onUndo={undoMarkDone}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    header: {
        paddingHorizontal: SIZES.padding,
        paddingTop: SIZES.padding / 2,
        paddingBottom: SIZES.padding,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    scrollContent: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 100, // Space for tab bar
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
    metricsChipsContainer: {
        marginBottom: 20,
    },
    sectionSubtitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.gray,
        marginBottom: 10,
    },
    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    metricChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    metricChipIcon: {
        color: COLORS.primary,
        marginRight: 6,
        fontSize: 18,
        lineHeight: 18,
    },
    metricChipText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.textDark,
    }
});

export default HistoryScreen;
