import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Bike, CarFront, Plus, ArrowRightLeft } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import VehicleStatusCard from '../components/VehicleStatusCard';
import ReminderCard from '../components/ReminderCard';
import { useMetrics } from '../context/MetricsContext';
import { useAuth } from '../context/AuthContext';
import EditMetricModal from '../components/EditMetricModal';
import AnimatedTouchable from '../components/AnimatedTouchable';
import AddVehicleModal from '../components/AddVehicleModal';
import VehicleSelectorModal from '../components/VehicleSelectorModal';
import { useVehicle } from '../context/VehicleContext';
import { useRoute, useFocusEffect } from '@react-navigation/native';

// Dummy data based on the image
const REMINDERS_DATA = [
    {
        id: 1,
        title: 'Oil Change',
        recordedKm: '1500',
        changeKm: '3000',
        changeDate: '26.04.2024'
    },
    {
        id: 2,
        title: 'Chain Lube',
        recordedKm: '1500',
        changeKm: '3000',
        changeDate: '26.04.2024'
    },
    {
        id: 3,
        title: 'Brake Pads',
        recordedKm: '1500',
        changeKm: '3000',
        changeDate: '26.04.2024'
    },
    {
        id: 4,
        title: 'Tyre air pressure',
        recordedKm: '1500',
        changeKm: '3000',
        changeDate: '26.04.2024'
    }
];

const Header = () => {
    const { user } = useAuth();
    const { selectedType, switchType } = useVehicle();

    return (
        <View style={styles.header}>
            <Text style={styles.greeting}>Hi, {user?.name || 'User'}</Text>

            <View style={styles.toggleContainer}>
                <AnimatedTouchable
                    style={[styles.toggleBtn, selectedType === 'bike' && styles.toggleBtnActive]}
                    onPress={() => switchType('bike')}
                >
                    <Bike size={20} color={selectedType === 'bike' ? COLORS.primary : COLORS.textLight} />
                </AnimatedTouchable>

                <View style={styles.toggleDivider} />

                <AnimatedTouchable
                    style={[styles.toggleBtn, selectedType === 'car' && styles.toggleBtnActive]}
                    onPress={() => switchType('car')}
                >
                    <CarFront size={20} color={selectedType === 'car' ? COLORS.primary : COLORS.textLight} />
                </AnimatedTouchable>
            </View>
        </View>
    );
};

const HomeScreen = () => {
    const route = useRoute();
    const { metrics, updateMetric, deleteMetric, markAsDone } = useMetrics();
    const { activeVehicle, selectedType, addVehicle, vehicles, switchActiveVehicle, primaryVehicleId, setPrimaryVehicle } = useVehicle();
    const [editingMetricId, setEditingMetricId] = useState(null);
    const [addVehicleVisible, setAddVehicleVisible] = useState(false);
    const [selectorVisible, setSelectorVisible] = useState(false);

    // Highlighting Logic
    const scrollViewRef = useRef(null);
    const cardPositions = useRef({});
    const [highlightedCardId, setHighlightedCardId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            if (route.params?.highlightMetricId && Object.keys(cardPositions.current).length > 0) {
                const targetId = route.params.highlightMetricId;
                const targetY = cardPositions.current[targetId];

                if (targetY !== undefined && scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({ y: targetY - 20, animated: true });
                    setHighlightedCardId(targetId);

                    // Clear route params so it doesn't flash every time we come back
                    if (route.params) {
                        route.params.highlightMetricId = null;
                    }

                    setTimeout(() => {
                        setHighlightedCardId(null);
                    }, 2000);
                }
            }
        }, [route.params?.highlightMetricId, Object.keys(cardPositions.current).length])
    );

    const editingMetric = metrics.find(m => m.id === editingMetricId);

    const handleAddVehicle = async (data) => {
        await addVehicle(data);
        setAddVehicleVisible(false);
    };

    const typeVehicles = vehicles.filter(v => v.type === selectedType);
    const hasMultiple = typeVehicles.length > 1;

    const handleSwapVehicle = () => {
        if (hasMultiple) {
            setSelectorVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Header />

                <VehicleStatusCard metrics={metrics} />

                <View style={[styles.vehicleTitleRow, { alignItems: 'flex-end', paddingBottom: 5 }]}>
                    <View style={styles.vehicleTitleTrigger}>
                        <View>
                            <Text style={styles.vehicleTitleLabel}>{selectedType === 'bike' ? 'Bike' : 'Car'} Number</Text>
                            <Text style={styles.vehicleTitle}>
                                {activeVehicle ? activeVehicle.number : 'None'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.actionButtonsRow}>
                        {hasMultiple && (
                            <AnimatedTouchable style={[styles.iconBtn, { marginRight: 8 }]} onPress={handleSwapVehicle}>
                                <ArrowRightLeft size={18} color={COLORS.primary} strokeWidth={2.5} />
                            </AnimatedTouchable>
                        )}
                        <AnimatedTouchable style={styles.iconBtn} onPress={() => setAddVehicleVisible(true)}>
                            <Plus size={20} color={COLORS.primary} strokeWidth={2.5} />
                        </AnimatedTouchable>
                    </View>
                </View>

                {metrics.filter(m => m.saved).map((item) => (
                    <View
                        key={item.id}
                        onLayout={(event) => {
                            const { y } = event.nativeEvent.layout;
                            cardPositions.current[item.id] = y;
                        }}
                    >
                        <ReminderCard
                            metric={item}
                            isHighlighted={highlightedCardId === item.id}
                            onEdit={(id) => setEditingMetricId(id)}
                            onMarkDone={(id) => markAsDone(id)}
                        />
                    </View>
                ))}
            </ScrollView>

            <EditMetricModal
                visible={!!editingMetricId}
                metric={editingMetric}
                onClose={() => setEditingMetricId(null)}
                onUpdate={updateMetric}
                onDelete={deleteMetric}
            />

            <AddVehicleModal
                visible={addVehicleVisible}
                onClose={() => setAddVehicleVisible(false)}
                onSave={handleAddVehicle}
                vehicleType={selectedType}
            />
            <VehicleSelectorModal
                visible={selectorVisible}
                onClose={() => setSelectorVisible(false)}
                vehicles={typeVehicles}
                activeId={activeVehicle?.id}
                onSelect={switchActiveVehicle}
                primaryId={primaryVehicleId}
                onSetPrimary={setPrimaryVehicle}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        padding: SIZES.padding,
        paddingBottom: 100, // Space for tab bar
    },
    header: {
        marginBottom: SIZES.baseSpacing,
        marginTop: SIZES.smallSpacing,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: 20,
        borderCurve: 'continuous',
        backgroundColor: COLORS.white,
    },
    toggleBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderCurve: 'continuous',
    },
    toggleBtnActive: {
        backgroundColor: '#FFF5E0', // Light orange background for active
    },
    toggleDivider: {
        width: 1,
        height: 20,
        backgroundColor: COLORS.gray,
    },
    vehicleTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SIZES.smallSpacing,
        marginTop: SIZES.smallSpacing,
    },
    vehicleTitleTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    vehicleTitleLabel: {
        fontSize: 12,
        color: COLORS.textDark,
        marginBottom: 2,
        fontWeight: '600',
    },
    vehicleTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
});

export default HomeScreen;
