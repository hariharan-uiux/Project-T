import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutAnimation } from 'react-native';

import { useVehicle } from './VehicleContext';

const MetricsContext = createContext();

export const useMetrics = () => useContext(MetricsContext);

export const MetricsProvider = ({ children }) => {
    const { activeVehicle } = useVehicle();
    const [allMetrics, setAllMetrics] = useState([]);
    const [allMetricsHistory, setAllMetricsHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // Derived arrays for the current vehicle
    const metrics = allMetrics.filter(m => m.vehicleId === activeVehicle?.id);
    const metricsHistory = allMetricsHistory.filter(h => h.vehicleId === activeVehicle?.id);

    // Initial load (Get)
    useEffect(() => {
        loadMetrics();
    }, []);

    const loadMetrics = async () => {
        try {
            const storedMetrics = await AsyncStorage.getItem('@metrics');
            const storedHistory = await AsyncStorage.getItem('@metricsHistory');

            if (storedMetrics) {
                setAllMetrics(JSON.parse(storedMetrics));
            }
            if (storedHistory) {
                setAllMetricsHistory(JSON.parse(storedHistory));
            }
        } catch (e) {
            console.error("Failed to load metrics", e);
        } finally {
            setLoading(false);
        }
    };

    // Save (Post/Update)
    const saveAllMetrics = async (newAllMetrics) => {
        try {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setAllMetrics(newAllMetrics);
            await AsyncStorage.setItem('@metrics', JSON.stringify(newAllMetrics));
        } catch (e) {
            console.error("Failed to save metrics", e);
        }
    };

    const addMetric = async (metric) => {
        if (!activeVehicle) return; // Do not add if no vehicle exists
        const newMetric = { ...metric, saved: false, vehicleId: activeVehicle.id };
        const newAllMetrics = [newMetric, ...allMetrics];
        await saveAllMetrics(newAllMetrics);
    };

    const updateMetric = async (id, field, value) => {
        const newAllMetrics = allMetrics.map(m => m.id === id ? { ...m, [field]: value } : m);
        await saveAllMetrics(newAllMetrics);
    };

    const deleteMetric = async (id) => {
        const newAllMetrics = allMetrics.filter(m => m.id !== id);
        await saveAllMetrics(newAllMetrics);
    };

    // Toggle saved state
    const toggleSaveMetric = async (id, isSaved) => {
        const newAllMetrics = allMetrics.map(m => m.id === id ? { ...m, saved: isSaved } : m);
        await saveAllMetrics(newAllMetrics);
    };

    // Mark as Done
    const markAsDone = async (id) => {
        const metricToComplete = metrics.find(m => m.id === id);
        if (!metricToComplete) return;

        // 1. Move a copy to history with a completion timestamp
        const completedRecord = {
            ...metricToComplete,
            historyId: Date.now() + '_' + id,
            completionTimestamp: Date.now(),
            completionDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
        };

        const newHistory = [completedRecord, ...allMetricsHistory];

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        setAllMetricsHistory(newHistory);
        await AsyncStorage.setItem('@metricsHistory', JSON.stringify(newHistory));

        // 2. Reset the current metric for the next interval
        const newAllMetrics = allMetrics.map(m => {
            if (m.id === id) {
                const resetMetric = { ...m };
                resetMetric.saved = false;
                return resetMetric;
            }
            return m;
        });

        await saveAllMetrics(newAllMetrics);
    };

    // Undo Mark as Done
    const undoMarkDone = async (historyId) => {
        const historyItem = metricsHistory.find(h => h.historyId === historyId);
        if (!historyItem) return;

        // Check if within 30 mins
        if (Date.now() - historyItem.completionTimestamp > 30 * 60 * 1000) {
            console.error("Cannot undo after 30 minutes");
            return;
        }

        // 1. Remove from history
        const newHistory = allMetricsHistory.filter(h => h.historyId !== historyId);

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setAllMetricsHistory(newHistory);
        await AsyncStorage.setItem('@metricsHistory', JSON.stringify(newHistory));

        // 2. Restore the metric in active metrics to saved = true
        const newAllMetrics = allMetrics.map(m => {
            if (m.id === historyItem.id) {
                return { ...m, saved: true };
            }
            return m;
        });

        await saveAllMetrics(newAllMetrics);
    };

    return (
        <MetricsContext.Provider value={{
            metrics,
            metricsHistory,
            loading,
            addMetric,
            updateMetric,
            deleteMetric,
            toggleSaveMetric,
            markAsDone,
            undoMarkDone
        }}>
            {children}
        </MetricsContext.Provider>
    );
};
