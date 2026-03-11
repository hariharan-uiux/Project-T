import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Trash2, Calendar, ArrowRightLeft, Droplet, Wrench, Wind, Zap, Thermometer, Activity, Filter, RefreshCw, Battery, Gauge, ShieldCheck, FileText, HelpCircle } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { VEHICLE_METRICS } from '../constants/metricsData';

const IconMap = {
    Droplet, Wrench, Wind, Zap, Thermometer, Activity, Filter, RefreshCw, Battery, Gauge, ShieldCheck, FileText
};

const InputField = ({ label, value, onChangeText, placeholder, isDate, isKm, unit, onUnitToggle }) => {
    const [showDatePicker, setShowDatePicker] = React.useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const dateStr = selectedDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '.'); // Format as DD.MM.YYYY
            onChangeText(dateStr);
        }
    };

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.gray}
                    keyboardType={isKm ? "numeric" : "default"}
                    editable={!isDate} // Disable text input for date
                />
                {isKm && (
                    <TouchableOpacity style={styles.suffix} onPress={onUnitToggle}>
                        <View style={styles.divider} />
                        <Text style={styles.suffixText}>{unit === 'mi' ? 'Miles' : 'Kilo Meter'}</Text>
                        <ArrowRightLeft size={16} color={COLORS.primary} style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                )}
                {isDate && (
                    <TouchableOpacity
                        style={styles.iconSuffix}
                        onPress={() => Platform.OS !== 'web' && setShowDatePicker(true)}
                    // On Web, the DateTimePicker below covers this or we rely on it being present
                    >
                        <Calendar size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
                {/* Web Overlay: Render input over the whole container or button */}
                {isDate && Platform.OS === 'web' && (
                    <DateTimePicker
                        value={value ? new Date(value.split('.').reverse().join('-')) : new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            opacity: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer'
                        }}
                    />
                )}
            </View>
            {showDatePicker && isDate && Platform.OS !== 'web' && (
                <DateTimePicker
                    value={value ? new Date(value.split('.').reverse().join('-')) : new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                />
            )}
        </View>
    );
};

const MetricInputCard = ({ metric, onUpdate, onDelete }) => {
    const handleUnitToggle = () => {
        const newUnit = metric.unit === 'mi' ? 'km' : 'mi';
        onUpdate(metric.id, 'unit', newUnit);
    };

    let iconToRender = metric.iconName;
    if (!iconToRender) {
        const schemaMatch = VEHICLE_METRICS.find(m => metric.title && metric.title.toLowerCase() === m.name.toLowerCase());
        if (schemaMatch && schemaMatch.iconName) {
            iconToRender = schemaMatch.iconName;
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {iconToRender && IconMap[iconToRender] ? (
                        <View style={{ marginRight: 8 }}>
                            {React.createElement(IconMap[iconToRender], { size: 20, color: COLORS.primary })}
                        </View>
                    ) : (
                        <HelpCircle size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
                    )}
                    <Text style={styles.title}>{metric.title}</Text>
                </View>
                <TouchableOpacity onPress={() => onDelete(metric.id)} style={styles.iconBtn}>
                    <Trash2 size={18} color={COLORS.textLight || '#999'} />
                </TouchableOpacity>
            </View>

            {metric.inputs?.includes('last_done_km') && (
                <InputField
                    label={`Last Done (${metric.unit === 'mi' ? 'MI' : 'KM'})`}
                    value={metric.last_done_km}
                    onChangeText={(text) => onUpdate(metric.id, 'last_done_km', text)}
                    placeholder="0.00"
                    isKm
                    unit={metric.unit}
                    onUnitToggle={handleUnitToggle}
                />
            )}
            {metric.inputs?.includes('interval_km') && (
                <InputField
                    label={`Interval (${metric.unit === 'mi' ? 'MI' : 'KM'})`}
                    value={metric.interval_km}
                    onChangeText={(text) => onUpdate(metric.id, 'interval_km', text)}
                    placeholder="0.00"
                    isKm
                    unit={metric.unit}
                    onUnitToggle={handleUnitToggle}
                />
            )}
            {metric.inputs?.includes('last_done_date') && (
                <InputField
                    label="Last Done Date"
                    value={metric.last_done_date}
                    onChangeText={(text) => onUpdate(metric.id, 'last_done_date', text)}
                    placeholder="DD.MM.YYYY"
                    isDate
                />
            )}
            {metric.inputs?.includes('interval_months') && (
                <InputField
                    label="Interval (Months)"
                    value={metric.interval_months}
                    onChangeText={(text) => onUpdate(metric.id, 'interval_months', text)}
                    placeholder="e.g. 6"
                />
            )}
            {metric.inputs?.includes('expiry_date') && (
                <InputField
                    label="Expiry Date"
                    value={metric.expiry_date}
                    onChangeText={(text) => onUpdate(metric.id, 'expiry_date', text)}
                    placeholder="DD.MM.YYYY"
                    isDate
                />
            )}

            {!metric.inputs && (
                <>
                    <InputField
                        label={`Recorded ${metric.unit === 'mi' ? 'MI' : 'KM'}`}
                        value={metric.recordedKm}
                        onChangeText={(text) => onUpdate(metric.id, 'recordedKm', text)}
                        placeholder="0.00"
                        isKm
                        unit={metric.unit}
                        onUnitToggle={handleUnitToggle}
                    />
                    <InputField
                        label={`Change ${metric.unit === 'mi' ? 'MI' : 'KM'}`}
                        value={metric.changeKm}
                        onChangeText={(text) => onUpdate(metric.id, 'changeKm', text)}
                        placeholder="0.00"
                        isKm
                        unit={metric.unit}
                        onUnitToggle={handleUnitToggle}
                    />
                    <InputField
                        label="Change Date"
                        value={metric.changeDate}
                        onChangeText={(text) => onUpdate(metric.id, 'changeDate', text)}
                        placeholder="DD.MM.YYYY"
                        isDate
                    />
                </>
            )}

            <TouchableOpacity
                style={styles.saveButton}
                onPress={() => onUpdate(metric.id, 'saved', true)}
            >
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
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
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: SIZES.cardRadius || 16,
        borderCurve: 'continuous',
        padding: SIZES.padding,
        marginBottom: SIZES.baseSpacing,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.baseSpacing,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textDark,
    },
    inputContainer: {
        marginBottom: SIZES.baseSpacing,
    },
    label: {
        fontSize: 14,
        color: COLORS.textDark,
        marginBottom: SIZES.smallSpacing,
        fontWeight: '500',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.inputRadius || 30,
        borderCurve: 'continuous',
        // Pill shape
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: COLORS.white,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textDark,
        height: '100%',
    },
    suffix: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: COLORS.gray,
        marginRight: 10,
    },
    suffixText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '500',
    },
    iconSuffix: {
        padding: 5,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 25,
        borderCurve: 'continuous',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SIZES.smallSpacing,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default MetricInputCard;
