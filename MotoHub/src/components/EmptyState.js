import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { COLORS, SIZES } from '../constants/theme';
import FadeInView from './FadeInView';
import AnimatedTouchable from './AnimatedTouchable';

const { width } = Dimensions.get('window');

const EmptyState = ({ illustration, title, description, trigger, action, isSvg = false }) => {
    return (
        <View style={styles.container}>
            <FadeInView delay={200} translate={20} trigger={trigger} style={styles.content}>
                {isSvg ? (
                    <View style={styles.svgContainer}>
                        <SvgXml xml={illustration} width={width * 0.8} height={width * (0.8 * 500/750)} />
                    </View>
                ) : (
                    <Image
                        source={illustration}
                        style={styles.image}
                        resizeMode="contain"
                    />
                )}
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>

                {action && (
                    <AnimatedTouchable 
                        style={styles.actionButton}
                        onPress={action.onPress}
                    >
                        <Text style={styles.actionButtonText}>{action.label}</Text>
                    </AnimatedTouchable>
                )}
            </FadeInView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SIZES.padding * 2,
        paddingTop: 40,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    image: {
        width: width * 0.7,
        height: width * 0.7,
        marginBottom: 20,
    },
    svgContainer: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 25,
        borderCurve: 'continuous',
        elevation: 2,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EmptyState;
