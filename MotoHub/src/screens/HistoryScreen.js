import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, History, Droplet, Wrench, Wind, Zap, Thermometer, Activity, Filter, RefreshCw, Battery, Gauge, ShieldCheck, FileText, HelpCircle } from 'lucide-react-native';
import { COLORS, SIZES, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import MetricInputCard from '../components/MetricInputCard';
import AddMetricModal from '../components/AddMetricModal';
import HistoryModal from '../components/HistoryModal';
import { useMetrics } from '../context/MetricsContext';
import { useVehicle } from '../context/VehicleContext';
import AnimatedTouchable from '../components/AnimatedTouchable';

import { useNavigation } from '@react-navigation/native';
import FadeInView from '../components/FadeInView';
import CustomAlert from '../components/CustomAlert';
import EmptyState from '../components/EmptyState';
import { NO_DATA_SVG } from '../constants/svgs';

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
    const { isDark } = useTheme();
    const C = getColors(isDark);

    const { metrics, metricsHistory, addMetric, updateMetric, deleteMetric, undoMarkDone } = useMetrics();
    const { activeVehicle } = useVehicle();
    const [modalVisible, setModalVisible] = useState(false);
    const [historyVisible, setHistoryVisible] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

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
        <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: C.black }]}>Metrics</Text>
                <AnimatedTouchable onPress={() => setHistoryVisible(true)} style={[styles.iconBtn, { backgroundColor: C.white, borderColor: C.border }]}>
                    <History size={20} color={COLORS.primary} />
                </AnimatedTouchable>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {metrics.length === 0 ? (
                    <EmptyState
                        illustration={NO_DATA_SVG}
                        isSvg={true}
                        title="No Metrics Tracked"
                        description="Tap the + button below to start tracking your vehicle's maintenance and renewals."
                    />
                ) : (
                    <>
                        {metrics.filter(m => m.saved).length > 0 && (
                            <View style={styles.metricsChipsContainer}>
                                <Text style={[styles.sectionSubtitle, { color: C.textLight }]}>Tracking:</Text>
                                <View style={styles.chipsWrap}>
                                    {metrics.filter(m => m.saved).map((item) => {
                                        const IconComponent = item.iconName && IconMap[item.iconName] ? IconMap[item.iconName] : HelpCircle;
                                        return (
                                            <AnimatedTouchable
                                                key={item.id}
                                                style={[styles.metricChip, { backgroundColor: C.white, borderColor: C.border }]}
                                                onPress={() => navigation.navigate('Home', { highlightMetricId: item.id })}
                                            >
                                                <IconComponent size={16} color={COLORS.primary} style={{ marginRight: 6 }} />
                                                <Text style={[styles.metricChipText, { color: C.textDark }]}>{item.title}</Text>
                                            </AnimatedTouchable>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        {metrics.filter(m => !m.saved).map((metric) => (
                            <View key={metric.id}>
                                <MetricInputCard
                                    metric={metric}
                                    onUpdate={handleUpdateMetric}
                                    onDelete={handleDeleteMetric}
                                />
                            </View>
                        ))}
                    </>
                )}
            </ScrollView>

            <AnimatedTouchable
                style={[styles.fab, { backgroundColor: isDark ? '#2A1A0E' : '#FFF5E0', borderColor: isDark ? '#4A2E1A' : '#FFE0B2' }]}
                onPress={() => {
                    if (activeVehicle) {
                        setModalVisible(true);
                    } else {
                        setShowAlert(true);
                    }
                }}
            >
                <Plus size={30} color={COLORS.primary} />
            </AnimatedTouchable>

            <CustomAlert
                visible={showAlert}
                title="Vehicle Required"
                message="Please add a vehicle first to start tracking metrics and reminders."
                onConfirm={() => {
                    setShowAlert(false);
                    navigation.navigate('Home', { openAddVehicle: true });
                }}
            />

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
        flexGrow: 1,
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
