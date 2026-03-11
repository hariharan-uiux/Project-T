import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedTouchable = ({
    children,
    onPress,
    style,
    activeScale = 0.97,
    activeOpacity = 0.7,
    disabled = false,
    ...props
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = (e) => {
        if (disabled) return;
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: activeScale,
                useNativeDriver: true,
                speed: 30,
                bounciness: 2,
            }),
            Animated.timing(opacityAnim, {
                toValue: activeOpacity,
                duration: 50,
                useNativeDriver: true,
            })
        ]).start();
        if (props.onPressIn) props.onPressIn(e);
    };

    const handlePressOut = (e) => {
        if (disabled) return;
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
                speed: 25,
                bounciness: 6,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
        if (props.onPressOut) props.onPressOut(e);
    };

    return (
        <AnimatedPressable
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            disabled={disabled}
            style={[style, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
};

export default AnimatedTouchable;
