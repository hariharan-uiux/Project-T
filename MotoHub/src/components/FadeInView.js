import React from 'react';
import { View } from 'react-native';

// Animations removed — renders children instantly with no fade or slide.
const FadeInView = ({ children, style, onLayout, ...rest }) => {
    return (
        <View style={style} onLayout={onLayout}>
            {children}
        </View>
    );
};

export default FadeInView;
