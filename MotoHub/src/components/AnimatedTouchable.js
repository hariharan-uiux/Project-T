import React from 'react';
import { Pressable } from 'react-native';

// Animations removed — plain Pressable with no scale/opacity effects.
const AnimatedTouchable = ({ children, onPress, style, disabled = false, ...props }) => {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={style}
            {...props}
        >
            {children}
        </Pressable>
    );
};

export default AnimatedTouchable;
