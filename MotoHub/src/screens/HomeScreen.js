import React, { useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Filter, Bike, CarFront, Plus, ArrowRightLeft } from 'lucide-react-native';
import { COLORS, SIZES, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import VehicleStatusCard from '../components/VehicleStatusCard';
import ReminderCard from '../components/ReminderCard';
import { useMetrics } from '../context/MetricsContext';
import { useAuth } from '../context/AuthContext';
import EditMetricModal from '../components/EditMetricModal';
import AnimatedTouchable from '../components/AnimatedTouchable';
import AddVehicleModal from '../components/AddVehicleModal';
import { useVehicle } from '../context/VehicleContext';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import VehicleSelectorModal from '../components/VehicleSelectorModal';
import FadeInView from '../components/FadeInView';
import EmptyState from '../components/EmptyState';
import { NO_DATA_SVG } from '../constants/svgs';

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
    const { isDark } = useTheme();
    const C = getColors(isDark);

    return (
        <View style={styles.header}>
            <Text style={[styles.greeting, { color: C.black }]}>Hi, {user?.name || 'User'}</Text>

            <View style={[styles.toggleContainer, { backgroundColor: C.white, borderColor: C.border }]}>
                <AnimatedTouchable
                    style={[styles.toggleBtn, selectedType === 'bike' && { backgroundColor: isDark ? '#3D2000' : '#FFF5E0' }]}
                    onPress={() => switchType('bike')}
                >
                    <Bike size={20} color={selectedType === 'bike' ? COLORS.primary : C.textLight} />
                </AnimatedTouchable>

                <View style={[styles.toggleDivider, { backgroundColor: C.border }]} />

                <AnimatedTouchable
                    style={[styles.toggleBtn, selectedType === 'car' && { backgroundColor: isDark ? '#3D2000' : '#FFF5E0' }]}
                    onPress={() => switchType('car')}
                >
                    <CarFront size={20} color={selectedType === 'car' ? COLORS.primary : C.textLight} />
                </AnimatedTouchable>
            </View>
        </View>
    );
};

const HomeScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { isDark } = useTheme();
    const C = getColors(isDark);
    useFocusEffect(
        React.useCallback(() => {
            const highlightId = route.params?.highlightMetricId;

            // Handle Add Vehicle modal param
            if (route.params?.openAddVehicle) {
                setAddVehicleVisible(true);
                navigation.setParams({ openAddVehicle: undefined });
            }

            // Handle highlight from metrics chip: highlight the card and scroll to it.
            if (highlightId) {
                setHighlightedCardId(highlightId);
                navigation.setParams({ highlightMetricId: undefined });

                // Scroll to the card once layout positions are available
                const tryScroll = (attemptsLeft) => {
                    const targetY = cardPositions.current[highlightId];
                    if (targetY !== undefined && scrollViewRef.current) {
                        scrollViewRef.current.scrollTo({ y: Math.max(0, targetY - 20), animated: true });
                    } else if (attemptsLeft > 0) {
                        setTimeout(() => tryScroll(attemptsLeft - 1), 50);
                    }
                };
                tryScroll(10);

                // Remove highlight after 2.5s
                setTimeout(() => setHighlightedCardId(null), 2500);
            }
        }, [route.params?.highlightMetricId, route.params?.openAddVehicle])
    );

    const { metrics, updateMetric, deleteMetric, markAsDone } = useMetrics();
    const { activeVehicle, selectedType, addVehicle, vehicles, switchActiveVehicle, primaryVehicleId, setPrimaryVehicle } = useVehicle();
    const [editingMetricId, setEditingMetricId] = useState(null);
    const [addVehicleVisible, setAddVehicleVisible] = useState(false);
    const [selectorVisible, setSelectorVisible] = useState(false);

    // Highlighting Logic
    const scrollViewRef = useRef(null);
    const cardPositions = useRef({});
    const [highlightedCardId, setHighlightedCardId] = useState(null);

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
        <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
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
                            <Text style={[styles.vehicleTitleLabel, { color: C.textDark }]}>{selectedType === 'bike' ? 'Bike' : 'Car'} Number</Text>
                            <Text style={[styles.vehicleTitle, { color: C.black }]}>
                                {activeVehicle ? activeVehicle.number : 'None'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.actionButtonsRow}>
                        {hasMultiple && (
                            <AnimatedTouchable style={[styles.iconBtn, { marginRight: 8, backgroundColor: C.white, borderColor: C.border }]} onPress={handleSwapVehicle}>
                                <ArrowRightLeft size={18} color={COLORS.primary} strokeWidth={2.5} />
                            </AnimatedTouchable>
                        )}
                        <AnimatedTouchable style={[styles.iconBtn, { backgroundColor: C.white, borderColor: C.border }]} onPress={() => setAddVehicleVisible(true)}>
                            <Plus size={20} color={COLORS.primary} strokeWidth={2.5} />
                        </AnimatedTouchable>
                    </View>
                </View>

                {vehicles.length === 0 ? (
                    <EmptyState
                        illustration={NO_DATA_SVG}
                        isSvg={true}
                        title="Welcome to MotoHub!"
                        description="Add your first vehicle to start tracking maintenance and reminders."
                        action={{
                            label: "Add Vehicle",
                            onPress: () => setAddVehicleVisible(true)
                        }}
                    />
                ) : metrics.filter(m => m.saved).length === 0 ? (
                    <EmptyState
                        illustration={NO_DATA_SVG}
                        isSvg={true}
                        title="No Reminders Set"
                        description={activeVehicle 
                            ? "Go to the History tab to start tracking maintenance for this vehicle."
                            : "Add a vehicle first, then set up maintenance tracking in the History tab."
                        }
                    />
                ) : (
                    metrics.filter(m => m.saved).map((item) => (
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
                    ))
                )}
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
        flexGrow: 1,
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
