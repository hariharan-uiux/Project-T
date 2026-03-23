import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, SHADOWS, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

const FuelPriceCard = () => {
    const { isDark } = useTheme();
    const C = getColors(isDark);
    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#1A1200' : COLORS.cardBackground, borderColor: isDark ? '#4A3000' : '#FFE0B2' }]}>
            <Text style={[styles.title, { color: C.textLight }]}>Today's fuel Price</Text>

            <View style={styles.row}>
                <View>
                    <Text style={[styles.locationLabel, { color: C.textDark }]}>Your Location,</Text>
                    <Text style={[styles.locationValue, { color: C.textLight }]}>Indian OIL</Text>
                </View>
                <Text style={styles.price}>₹ 103.45</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.cardBackground,
        padding: SIZES.padding,
        borderRadius: SIZES.radius + 5,
        borderCurve: 'continuous',
        marginBottom: SIZES.padding * 1.5,
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    title: {
        fontSize: SIZES.body,
        color: COLORS.textLight,
        marginBottom: SIZES.padding,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    locationLabel: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 2,
    },
    locationValue: {
        fontSize: SIZES.body,
        color: COLORS.textLight,
    },
    price: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default FuelPriceCard;
