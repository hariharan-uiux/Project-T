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
    // Remember last active vehicle per type: { bike: id1, car: id2 }
    const [lastActiveIds, setLastActiveIds] = useState({ bike: null, car: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const storedVehiclesStr = await AsyncStorage.getItem('@vehicles');
            const storedType = await AsyncStorage.getItem('@selectedType');
            const storedActiveId = await AsyncStorage.getItem('@activeVehicleId');
            const storedPrimaryId = await AsyncStorage.getItem('@primaryVehicleId');
            const storedLastActiveIds = await AsyncStorage.getItem('@lastActiveIds');

            let parsedVehicles = [];
            if (storedVehiclesStr) {
                parsedVehicles = JSON.parse(storedVehiclesStr);
                setVehicles(parsedVehicles);
            }

            if (storedPrimaryId) {
                setPrimaryVehicleId(storedPrimaryId);
            }

            let parsedLastActiveIds = { bike: null, car: null };
            if (storedLastActiveIds) {
                parsedLastActiveIds = JSON.parse(storedLastActiveIds);
                setLastActiveIds(parsedLastActiveIds);
            }

            // Initialization logic: Prioritize primary vehicle, then active vehicle, then default to type
            if (parsedVehicles.length > 0) {
                let targetVehicleId = null;
                let targetType = 'bike';

                if (storedPrimaryId) {
                    const primaryV = parsedVehicles.find(v => v.id === storedPrimaryId);
                    if (primaryV) {
                        targetVehicleId = primaryV.id;
                        targetType = primaryV.type;
                    }
                }

                if (!targetVehicleId && storedActiveId) {
                    const activeV = parsedVehicles.find(v => v.id === storedActiveId);
                    if (activeV) {
                        targetVehicleId = activeV.id;
                        targetType = activeV.type;
                    }
                }

                if (targetVehicleId) {
                    setActiveVehicleId(targetVehicleId);
                    setSelectedType(targetType);
                    
                    const newLastActive = { ...parsedLastActiveIds, [targetType]: targetVehicleId };
                    setLastActiveIds(newLastActive);

                    await AsyncStorage.setItem('@activeVehicleId', targetVehicleId);
                    await AsyncStorage.setItem('@selectedType', targetType);
                    await AsyncStorage.setItem('@lastActiveIds', JSON.stringify(newLastActive));
                } else if (storedType) {
                    setSelectedType(storedType);
                }
            } else if (storedType) {
                setSelectedType(storedType);
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

        // Try to restore last active for this type
        const memoryId = lastActiveIds[type];
        const verifyExists = memoryId ? vehicles.find(v => v.id === memoryId) : null;

        if (verifyExists) {
            setActiveVehicleId(memoryId);
            await AsyncStorage.setItem('@activeVehicleId', memoryId);
        } else {
            // Auto-select the first vehicle of this type if no memory
            const firstOfType = vehicles.find(v => v.type === type);
            if (firstOfType) {
                setActiveVehicleId(firstOfType.id);
                // Also save memory
                const newMemory = { ...lastActiveIds, [type]: firstOfType.id };
                setLastActiveIds(newMemory);
                await AsyncStorage.setItem('@activeVehicleId', firstOfType.id);
                await AsyncStorage.setItem('@lastActiveIds', JSON.stringify(newMemory));
            } else {
                setActiveVehicleId(null);
                await AsyncStorage.removeItem('@activeVehicleId');
            }
        }
    };

    const switchActiveVehicle = async (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setActiveVehicleId(id);
        await AsyncStorage.setItem('@activeVehicleId', id);

        // Update memory for current type
        const newMemory = { ...lastActiveIds, [selectedType]: id };
        setLastActiveIds(newMemory);
        await AsyncStorage.setItem('@lastActiveIds', JSON.stringify(newMemory));
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
