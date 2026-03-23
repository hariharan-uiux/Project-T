import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Plus } from 'lucide-react-native';
import { COLORS, SIZES, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useChecklist } from '../context/ChecklistContext';
import ChecklistPreviewCard from '../components/ChecklistPreviewCard';
import ChecklistDetail from '../components/ChecklistDetail';
import AnimatedTouchable from '../components/AnimatedTouchable';
import FadeInView from '../components/FadeInView';
import EmptyState from '../components/EmptyState';
import { NO_DATA_SVG } from '../constants/svgs';

const ChecklistScreen = () => {
    const { isDark } = useTheme();
    const C = getColors(isDark);
    const {
        checklists,
        addChecklist,
        updateChecklistTitle,
        deleteChecklist,
        addItem,
        editItem,
        toggleItem,
        deleteItem
    } = useChecklist();

    const [selectedChecklistId, setSelectedChecklistId] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                if (selectedChecklistId) {
                    setSelectedChecklistId(null);
                    return true;
                }
                return false;
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [selectedChecklistId])
    );

    const handleAddChecklist = async () => {
        const newId = await addChecklist("New Checklist");
        setSelectedChecklistId(newId);
    };

    const selectedChecklist = checklists.find(c => c.id === selectedChecklistId);

    if (selectedChecklistId && selectedChecklist) {
        return (
            <ChecklistDetail
                checklist={selectedChecklist}
                onBack={() => setSelectedChecklistId(null)}
                onUpdateTitle={updateChecklistTitle}
                onDelete={(id) => { deleteChecklist(id); setSelectedChecklistId(null); }}
                onAddItem={addItem}
                onEditItem={editItem}
                onToggleItem={toggleItem}
                onDeleteItem={deleteItem}
            />
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: C.black }]}>Check List</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scrollContent, checklists.length === 0 && { flex: 1, justifyContent: 'center' }]}
            >
                {checklists.length === 0 ? (
                    <EmptyState
                        illustration={NO_DATA_SVG}
                        isSvg={true}
                        title="Your Checklist is Empty"
                        description="Start organizing your maintenance tasks by tapping the + button above."
                    />
                ) : (
                    <View style={styles.gridContainer}>
                        {checklists.map((list) => (
                            <View key={list.id} style={{ width: '48%' }}>
                                <ChecklistPreviewCard
                                    checklist={list}
                                    onPress={() => setSelectedChecklistId(list.id)}
                                />
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <AnimatedTouchable
                style={[styles.fab, { backgroundColor: isDark ? '#2A1A0E' : '#FFF5E0', borderColor: isDark ? '#4A2E1A' : '#FFE0B2' }]}
                onPress={handleAddChecklist}
            >
                <Plus size={30} color={COLORS.primary} />
            </AnimatedTouchable>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SIZES.padding,
        paddingTop: SIZES.padding / 2,
        paddingBottom: SIZES.padding,
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
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
});

export default ChecklistScreen;
