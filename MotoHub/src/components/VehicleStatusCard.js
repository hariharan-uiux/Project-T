import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, BadgeAlert, Battery, AlertTriangle, MessageSquare } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { getWeather } from '../utils/weatherService';
import { useVehicle } from '../context/VehicleContext';
import { useTheme } from '../context/ThemeContext';

const VehicleStatusCard = ({ metrics }) => {
    const { activeVehicle } = useVehicle();
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const { isDark } = useTheme();

    useEffect(() => {
        fetchWeatherData();
    }, [metrics]);

    const fetchWeatherData = async () => {
        const data = await getWeather();
        if (data && !data.error) {
            setWeather(data);
        }
        setLoading(false);
    };

    const remindersCount = metrics.filter(m => m.saved).length;

    const getWeatherIcon = (condition) => {
        if (!condition) return <Sun size={24} color={COLORS.primary} />;
        const c = condition.toLowerCase();
        if (c.includes('rain')) return <CloudRain size={24} color={COLORS.primary} />;
        if (c.includes('snow')) return <CloudSnow size={24} color={COLORS.primary} />;
        if (c.includes('cloud')) return <Cloud size={24} color={COLORS.primary} />;
        if (c.includes('thunder')) return <CloudLightning size={24} color={COLORS.primary} />;
        return <Sun size={24} color={COLORS.primary} />;
    };

    const textColor = isDark ? '#FFFFFF' : '#000000';
    const subTextColor = isDark ? '#AAAAAA' : '#1A1A1A';
    const cardBg = isDark ? '#2A1A0E' : '#FFF2E9';
    const cardBorder = isDark ? '#4A2E1A' : '#FBE4D5';
    const dividerColor = isDark ? '#4A2E1A' : '#F5E4D8';

    return (
        <View style={[styles.container, { backgroundColor: cardBg, borderColor: cardBorder }]}>
            {/* Top Row: Vehicle Status & Weather */}
            <View style={styles.topRow}>
                <View style={styles.titleRow}>
                    <Battery size={20} color={textColor} style={{ marginRight: 8 }} />
                    <Text style={[styles.titleText, { color: textColor }]}>Vehicle Status</Text>
                </View>
                <View style={styles.weatherRow}>
                    {getWeatherIcon(weather?.condition)}
                    <Text style={styles.weatherText}>
                        {weather ? `${weather.temp}° C` : '--° C'}
                    </Text>
                </View>
            </View>

            {/* Divider */}
            <View style={[styles.horizontalDivider, { backgroundColor: dividerColor }]} />

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
                {/* Left section: Health */}
                <View style={styles.healthSection}>
                    <View style={styles.badgeRow}>
                        <View style={styles.badgeIcon}>
                            <Text style={styles.badgeText}>A+</Text>
                        </View>
                        <Text style={styles.excellentText}>Excellent</Text>
                    </View>
                    <Text style={[styles.subText, { color: subTextColor }]}>
                        {activeVehicle ? `${activeVehicle.name || 'Vehicle'} (${activeVehicle.number})` : 'Vehicle name (vehicle number)'}
                    </Text>
                </View>

                {/* Vertical Divider */}
                <View style={[styles.verticalDivider, { backgroundColor: dividerColor }]} />

                {/* Right section: Reminders */}
                <View style={styles.remindersSection}>
                    <View style={styles.remindersTop}>
                        <MessageSquare size={18} color={textColor} style={{ marginRight: 6 }} />
                        <Text style={[styles.remindersTitle, { color: textColor }]}>Reminders</Text>
                    </View>
                    <Text style={[styles.remindersCount, { color: subTextColor }]}>
                        {remindersCount.toString().padStart(2, '0')}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.cardRadius || 20,
        borderCurve: 'continuous',
        padding: SIZES.padding,
        marginBottom: SIZES.padding,
        borderWidth: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    weatherRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    weatherText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginLeft: 6,
    },
    horizontalDivider: {
        height: 1,
        marginBottom: 15,
        marginHorizontal: -5,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    healthSection: {
        flex: 1.5,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    badgeIcon: {
        borderWidth: 1.5,
        borderColor: COLORS.primary,
        borderRadius: 4,
        borderCurve: 'continuous',
        paddingHorizontal: 4,
        paddingVertical: 1,
        marginRight: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    excellentText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    subText: {
        fontSize: 12,
    },
    verticalDivider: {
        width: 1,
        height: '100%',
        marginHorizontal: 15,
    },
    remindersSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    remindersTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    remindersTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    remindersCount: {
        fontSize: 14,
    }
});

export default VehicleStatusCard;
