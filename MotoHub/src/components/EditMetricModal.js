import React from 'react';
import { Modal, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Plus, X } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import MetricInputCard from './MetricInputCard';
import FadeInView from './FadeInView';

const EditMetricModal = ({ visible, onClose, metric, onUpdate, onDelete }) => {
    const { isDark } = useTheme();
    const C = getColors(isDark);
    if (!metric) return null;

    return (
        <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose} statusBarTranslucent={true}>
            <FadeInView style={styles.overlay} translate={0} duration={300} trigger={visible}>
                <TouchableOpacity style={styles.touchableOverlay} onPress={onClose} activeOpacity={1} />
                <FadeInView style={[styles.modalContent, { backgroundColor: C.background }]} translate={25} duration={400} delay={100} trigger={visible}>
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: C.black }]}>Edit Metric</Text>
                        <TouchableOpacity style={[styles.closeBtn, { backgroundColor: C.white, borderColor: C.border }]} onPress={onClose}>
                            <X size={24} color={C.textLight} />
                        </TouchableOpacity>
                    </View>
                    <MetricInputCard
                        metric={metric}
                        onUpdate={(id, field, value) => {
                            onUpdate(id, field, value);
                            if (field === 'saved' && value === true) {
                                onClose();
                            }
                        }}
                        onDelete={(id) => {
                            onDelete(id);
                            onClose();
                        }}
                    />
                </FadeInView>
            </FadeInView>
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
