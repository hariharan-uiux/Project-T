import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutAnimation } from 'react-native';

const VehicleContext = createContext();

export const useVehicle = () => useContext(VehicleContext);

export const VehicleProvider = ({ children }) => {
    // Array of vehicle objects: { id, type: 'bike' | 'car', number, name, odometer }
    const [vehicles, setVehicles] = useState([]);
    // 'bike' or 'car'
    const [selectedType, setSelectedType] = useState('bike');
    // specific vehicle id
    const [activeVehicleId, setActiveVehicleId] = useState(null);
    const [primaryVehicleId, setPrimaryVehicleId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const storedVehicles = await AsyncStorage.getItem('@vehicles');
            const storedType = await AsyncStorage.getItem('@selectedType');
            const storedActiveId = await AsyncStorage.getItem('@activeVehicleId');
            const storedPrimaryId = await AsyncStorage.getItem('@primaryVehicleId');

            if (storedVehicles) {
                setVehicles(JSON.parse(storedVehicles));
            }
            if (storedType) {
                setSelectedType(storedType);
            }
            if (storedPrimaryId) {
                setPrimaryVehicleId(storedPrimaryId);
            }

            // Initialize active vehicle according to primary
            if (storedVehicles) {
                const parsedVehicles = JSON.parse(storedVehicles);
                if (storedPrimaryId) {
                    const primaryV = parsedVehicles.find(v => v.id === storedPrimaryId);
                    if (primaryV) {
                        setActiveVehicleId(primaryV.id);
                        setSelectedType(primaryV.type);
                        await AsyncStorage.setItem('@activeVehicleId', primaryV.id);
                        await AsyncStorage.setItem('@selectedType', primaryV.type);
                        setLoading(false);
                        return;
                    }
                }
            }

            if (storedActiveId) {
                setActiveVehicleId(storedActiveId);
            }
        } catch (e) {
            console.error("Failed to load vehicles", e);
        } finally {
            setLoading(false);
        }
    };

    const saveVehicles = async (newVehicles) => {
        try {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setVehicles(newVehicles);
            await AsyncStorage.setItem('@vehicles', JSON.stringify(newVehicles));
        } catch (e) {
            console.error("Failed to save vehicles", e);
        }
    };

    const switchType = async (type) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedType(type);
        await AsyncStorage.setItem('@selectedType', type);

        // Auto-select the first vehicle of this type if activeVehicleId isn't of this type
        const firstOfType = vehicles.find(v => v.type === type);
        if (firstOfType) {
            setActiveVehicleId(firstOfType.id);
            await AsyncStorage.setItem('@activeVehicleId', firstOfType.id);
        } else {
            setActiveVehicleId(null);
            await AsyncStorage.removeItem('@activeVehicleId');
        }
    };

    const switchActiveVehicle = async (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveVehicleId(id);
        await AsyncStorage.setItem('@activeVehicleId', id);
    };

    const setPrimaryVehicle = async (id) => {
        setPrimaryVehicleId(id);
        if (id) {
            await AsyncStorage.setItem('@primaryVehicleId', id);
        } else {
            await AsyncStorage.removeItem('@primaryVehicleId');
        }
    };

    const addVehicle = async (vehicleData) => {
        const newVehicle = {
            id: Date.now().toString(),
            ...vehicleData
        };
        const newVehicles = [newVehicle, ...vehicles];
        await saveVehicles(newVehicles);

        // If they add a vehicle of a different type, switch to it, otherwise just set it as active
        if (vehicleData.type !== selectedType) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setSelectedType(vehicleData.type);
            await AsyncStorage.setItem('@selectedType', vehicleData.type);
        }

        await switchActiveVehicle(newVehicle.id);

        return newVehicle.id;
    };

    // Calculate the currently active vehicle based on selectedType and activeVehicleId
    const activeVehicle = vehicles.find(v => v.id === activeVehicleId) || vehicles.find(v => v.type === selectedType) || null;

    return (
        <VehicleContext.Provider value={{
            vehicles,
            selectedType,
            activeVehicle,
            loading,
            switchType,
            switchActiveVehicle,
            addVehicle,
            primaryVehicleId,
            setPrimaryVehicle
        }}>
            {children}
        </VehicleContext.Provider>
    );
};
