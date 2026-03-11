import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Edit2, CheckCircle, Droplet, Wrench, Wind, Zap, Thermometer, Activity, Filter, RefreshCw, Battery, Gauge, ShieldCheck, FileText, HelpCircle } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { VEHICLE_METRICS } from '../constants/metricsData';
import AnimatedTouchable from './AnimatedTouchable';
import { formatNumber } from '../utils/numberFormat';

const IconMap = {
    Droplet, Wrench, Wind, Zap, Thermometer, Activity, Filter, RefreshCw, Battery, Gauge, ShieldCheck, FileText
};

const StatItem = ({ label, value, unitLabel }) => (
    <View style={styles.statContainer}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.pill}>
            <Text style={styles.statValue}>{value ? formatNumber(value) : '-'}</Text>
            {unitLabel && value ? (
                <View style={styles.unitContainer}>
                    <Text style={styles.unit}>|{unitLabel.toUpperCase()}</Text>
                </View>
            ) : null}
        </View>
    </View>
);

const StatItemPlain = ({ label, value }) => (
    <View style={styles.statContainer}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.pillPlain}>
            <Text style={styles.statValuePlain}>{value ? formatNumber(value) : '-'}</Text>
        </View>
    </View>
);

const ReminderCard = ({ metric, onEdit, onMarkDone, isHighlighted, ...oldProps }) => {
    // If it's a legacy pre-JSON schema item without type mappings
    if (!metric || (!metric.tracking_type && oldProps.title)) {
        const legacyMetric = metric || oldProps;

        let iconToRender = legacyMetric.iconName;
        if (!iconToRender) {
            const schemaMatch = VEHICLE_METRICS.find(m => legacyMetric.title && legacyMetric.title.toLowerCase() === m.name.toLowerCase());
            if (schemaMatch && schemaMatch.iconName) {
                iconToRender = schemaMatch.iconName;
            }
        }

        const IconComponent = iconToRender && IconMap[iconToRender] ? IconMap[iconToRender] : null;

        return (
            <View style={[styles.container, isHighlighted && styles.highlightedCard]}>
                <View style={styles.header}>
                    <View style={styles.titleRow}>
                        {IconComponent && (
                            <IconComponent size={20} color={COLORS.primary} />
                        )}
                        <Text style={styles.title}>{legacyMetric.title}</Text>
                    </View>
                    <View style={styles.actionButtons}>
                        {onMarkDone && (
                            <AnimatedTouchable onPress={() => onMarkDone(legacyMetric.id)} style={[styles.iconBtn, { marginRight: 8 }]}>
                                <CheckCircle color={COLORS.primary} size={20} />
                            </AnimatedTouchable>
                        )}
                        <AnimatedTouchable onPress={() => onEdit(legacyMetric.id)} style={styles.iconBtn}>
                            <Edit2 color={COLORS.textLight} size={20} />
                        </AnimatedTouchable>
                    </View>
                </View>
                <View style={styles.divider} />

                <View style={styles.statsRow}>
                    <StatItem label="Recorded" value={legacyMetric.recordedKm} unitLabel={legacyMetric.unit || 'km'} />
                    <StatItem label="Change" value={legacyMetric.changeKm} unitLabel={legacyMetric.unit || 'km'} />
                    <StatItemPlain label="Change Date" value={legacyMetric.changeDate} />
                </View>
            </View>
        );
    }

    const getStats = () => {
        switch (metric.tracking_type) {
            case 'km_interval':
                return (
                    <View style={styles.statsRow}>
                        <StatItem label="Last Done" value={metric.last_done_km} unitLabel={metric.unit || 'km'} />
                        <StatItem label="Interval" value={metric.interval_km} unitLabel={metric.unit || 'km'} />
                    </View>
                );
            case 'date_interval':
                return (
                    <View style={styles.statsRow}>
                        <StatItemPlain label="Last Done" value={metric.last_done_date} />
                        <StatItemPlain label="Interval" value={metric.interval_months ? `${metric.interval_months} mo` : '-'} />
                    </View>
                );
            case 'expiry_date':
                return (
                    <View style={styles.statsRow}>
                        <StatItemPlain label="Expiry Date" value={metric.expiry_date} />
                    </View>
                );
            default:
                // Fallback rendering
                return (
                    <View style={styles.statsRow}>
                        <StatItem label="Recorded" value={metric.recordedKm} unitLabel={metric.unit || 'km'} />
                        <StatItem label="Change" value={metric.changeKm} unitLabel={metric.unit || 'km'} />
                        <StatItemPlain label="Change Date" value={metric.changeDate} />
                    </View>
                );
        }
    };

    let iconToRender = metric.iconName;
    if (!iconToRender) {
        const schemaMatch = VEHICLE_METRICS.find(m => metric.title && metric.title.toLowerCase() === m.name.toLowerCase());
        if (schemaMatch && schemaMatch.iconName) {
            iconToRender = schemaMatch.iconName;
        }
    }

    const IconComponent = iconToRender && IconMap[iconToRender] ? IconMap[iconToRender] : null;

    return (
        <View style={[styles.container, isHighlighted && styles.highlightedCard]}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    {IconComponent && (
                        <IconComponent size={20} color={COLORS.primary} />
                    )}
                    <Text style={styles.title}>{metric.title}</Text>
                </View>
                <View style={styles.actionButtons}>
                    {onMarkDone && (
                        <AnimatedTouchable onPress={() => onMarkDone(metric.id)} style={[styles.iconBtn, { marginRight: 8 }]}>
                            <CheckCircle color={COLORS.textLight} size={20} />
                        </AnimatedTouchable>
                    )}
                    <AnimatedTouchable onPress={() => onEdit(metric.id)} style={styles.iconBtn}>
                        <Edit2 color={COLORS.textLight} size={20} />
                    </AnimatedTouchable>
                </View>
            </View>
            <View style={styles.divider} />
            {getStats()}
        </View>
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
        backgroundColor: COLORS.surface,
        padding: SIZES.padding,
        borderRadius: SIZES.cardRadius || 12,
        borderCurve: 'continuous',
        marginBottom: SIZES.padding,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    highlightedCard: {
        backgroundColor: '#FFF2E9',
        borderColor: COLORS.primary,
        borderWidth: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.baseSpacing,
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: SIZES.smallSpacing,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: SIZES.baseSpacing,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: SIZES.baseSpacing, // Space between the two columns
    },
    statContainer: {
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.black,
        marginBottom: SIZES.smallSpacing,
    },
    pill: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.inputRadius || 12,
        borderCurve: 'continuous',
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pillPlain: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.inputRadius || 12,
        borderCurve: 'continuous',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.black,
        textAlign: 'center',
        flex: 1,
    },
    unitContainer: {
        position: 'absolute',
        right: 14,
    },
    unit: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    statValuePlain: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.black,
        textAlign: 'center',
    }
});

export default ReminderCard;
