import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { X, Hash, Gauge, Bike, CarFront } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import AnimatedTouchable from './AnimatedTouchable';
import { formatNumber, unformatNumber } from '../utils/numberFormat';

const AddVehicleModal = ({ visible, onClose, onSave, vehicleType }) => {
    const isBike = vehicleType === 'bike';
    const typeName = isBike ? 'bike' : 'car';

    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [odometer, setOdometer] = useState('');

    const handleSave = () => {
        if (number && name && odometer) {
            onSave({
                type: vehicleType,
                number,
                name,
                odometer: unformatNumber(odometer)
            });
            // Reset fields
            setNumber('');
            setName('');
            setOdometer('');
        }
    };

    const handleClose = () => {
        setNumber('');
        setName('');
        setOdometer('');
        onClose();
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Add new {typeName}</Text>
                        <AnimatedTouchable onPress={handleClose} style={styles.closeBtn}>
                            <X size={24} color={COLORS.textLight} />
                        </AnimatedTouchable>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{isBike ? 'Bike' : 'Car'} number</Text>
                        <View style={styles.inputWrapper}>
                            <Hash size={20} color={COLORS.textDark} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter ${typeName} number`}
                                placeholderTextColor={COLORS.textLight}
                                value={number}
                                onChangeText={setNumber}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>{isBike ? 'Bike' : 'Car'} name</Text>
                        <View style={styles.inputWrapper}>
                            {isBike ? (
                                <Bike size={20} color={COLORS.textDark} style={styles.inputIcon} />
                            ) : (
                                <CarFront size={20} color={COLORS.textDark} style={styles.inputIcon} />
                            )}
                            <TextInput
                                style={styles.input}
                                placeholder={`Enter ${typeName} name`}
                                placeholderTextColor={COLORS.textLight}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Current odometer reading</Text>
                        <View style={styles.inputWrapper}>
                            <Gauge size={20} color={COLORS.textDark} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter current reading"
                                placeholderTextColor={COLORS.textLight}
                                value={odometer}
                                onChangeText={(text) => setOdometer(formatNumber(text))}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <AnimatedTouchable
                        style={[styles.saveButton, { opacity: (number && name && odometer) ? 1 : 0.6 }]}
                        onPress={handleSave}
                        disabled={!number || !name || !odometer}
                    >
                        <Text style={styles.saveButtonText}>Save {typeName}</Text>
                    </AnimatedTouchable>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: SIZES.padding,
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.cardRadius || 20,
        borderCurve: 'continuous',
        padding: SIZES.padding,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: COLORS.black,
    },
    closeBtn: {
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
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: 20,
        marginHorizontal: -SIZES.padding,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.black,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: SIZES.inputRadius || 14,
        borderCurve: 'continuous',
        paddingHorizontal: 15,
        backgroundColor: COLORS.white,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: COLORS.black,
    },
    saveButton: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.inputRadius || 14,
        borderCurve: 'continuous',
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AddVehicleModal;
