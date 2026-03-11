import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import MetricInputCard from './MetricInputCard';

const EditMetricModal = ({ visible, onClose, metric, onUpdate, onDelete }) => {
    if (!metric) return null;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                {/* Close modal when tapping outside the content */}
                <TouchableOpacity style={styles.touchableOverlay} onPress={onClose} activeOpacity={1} />
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Edit Metric</Text>
                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <X size={24} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>
                    <MetricInputCard
                        metric={metric}
                        onUpdate={(id, field, value) => {
                            onUpdate(id, field, value);
                            if (field === 'saved' && value === true) {
                                onClose(); // Close modal when clicking save
                            }
                        }}
                        onDelete={(id) => {
                            onDelete(id);
                            onClose();
                        }}
                    />
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
    touchableOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalContent: {
        width: '100%',
        alignSelf: 'center',
        backgroundColor: COLORS.background, // Adds a backing so the header blends
        borderRadius: 20,
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
        fontWeight: 'bold',
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
    }
});

export default EditMetricModal;
