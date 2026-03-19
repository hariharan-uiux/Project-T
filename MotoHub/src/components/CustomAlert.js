import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import AnimatedTouchable from './AnimatedTouchable';
import FadeInView from './FadeInView';

const CustomAlert = ({ visible, title, message, onConfirm, buttonLabel = "Add Vehicle" }) => {
    const { isDark } = useTheme();
    const C = getColors(isDark);

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onConfirm}
            statusBarTranslucent={true}
        >
            <FadeInView style={styles.overlay} translate={0} duration={300}>
                <FadeInView style={[styles.alertContainer, { backgroundColor: C.white, borderColor: isDark ? C.border : 'rgba(0,0,0,0.05)' }]} translate={25} duration={400} delay={50}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#2A1A0E' : '#FFF2E9' }]}>
                        <AlertCircle size={36} color={COLORS.primary} />
                    </View>
                    
                    <Text style={[styles.title, { color: C.textDark }]}>{title}</Text>
                    <Text style={[styles.message, { color: C.textLight }]}>{message}</Text>
                    
                    <AnimatedTouchable style={styles.button} onPress={onConfirm}>
                        <Text style={styles.buttonText}>{buttonLabel}</Text>
                    </AnimatedTouchable>
                </FadeInView>
            </FadeInView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.cardRadius || 24,
        borderCurve: 'continuous',
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignItems: 'center',
        ...SHADOWS.large,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF2E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.textDark,
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: COLORS.textLight || '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 54,
        width: '100%',
        borderRadius: 16,
        borderCurve: 'continuous',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default CustomAlert;
