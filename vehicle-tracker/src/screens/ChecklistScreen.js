import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { COLORS, SIZES } from '../constants/theme';
import { useChecklist } from '../context/ChecklistContext';
import ChecklistPreviewCard from '../components/ChecklistPreviewCard';
import ChecklistDetail from '../components/ChecklistDetail';
import AnimatedTouchable from '../components/AnimatedTouchable';

const ChecklistScreen = () => {
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
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Check List</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.gridContainer}>
                    {checklists.map(list => (
                        <ChecklistPreviewCard
                            key={list.id}
                            checklist={list}
                            onPress={() => setSelectedChecklistId(list.id)}
                        />
                    ))}
                </View>
            </ScrollView>

            <AnimatedTouchable
                style={styles.fab}
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
        backgroundColor: COLORS.white,
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
