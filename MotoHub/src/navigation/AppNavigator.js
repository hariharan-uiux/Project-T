import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, History, PlusCircle, CheckSquare, User, Bike, FileText } from 'lucide-react-native';
import { View, TouchableOpacity, Image, ActivityIndicator, Platform, StatusBar } from 'react-native';
import { COLORS, SIZES, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
    LoginScreen,
    SignUpScreen,
    HomeScreen,
    HistoryScreen,
    ChecklistScreen,
    AccountScreen,
    DocumentScreen
} from '../screens';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    return (
        <View style={{
            position: 'absolute',
            bottom: 15,
            width: '100%',
            paddingHorizontal: 40,
            alignItems: 'center',
        }}>
            <View style={{
                flexDirection: 'row',
                backgroundColor: 'rgba(242, 113, 53, 0.95)',
                borderRadius: 35,
                height: 65,
                paddingHorizontal: 0,
                elevation: 10,
                // shadowColor: '#000',
                // shadowOffset: { width: 0, height: 10 },
                // shadowOpacity: 0.3,
                // shadowRadius: 15,
                justifyContent: 'space-evenly',
                alignItems: 'center',
                width: '100%',
                maxWidth: 340,
            }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;
                    const Icon = options.tabBarIcon;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            onPress={onPress}
                            style={{
                                width: 52,
                                height: 65, // Exact match to parent height
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 58,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.35)' : 'transparent',
                            }}>
                                {Icon && Icon({ focused: isFocused, color: isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)' })}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

function MainTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: (props) => <Home {...props} size={24} strokeWidth={props.focused ? 2.5 : 2} />,
                }}
            />
            <Tab.Screen
                name="Metrics"
                component={HistoryScreen}
                options={{
                    tabBarIcon: (props) => <Bike {...props} size={24} strokeWidth={props.focused ? 2.5 : 2} />,
                }}
            />
            <Tab.Screen
                name="Checklist"
                component={ChecklistScreen}
                options={{
                    tabBarIcon: (props) => <CheckSquare {...props} size={24} strokeWidth={props.focused ? 2.5 : 2} />,
                }}
            />
            <Tab.Screen
                name="Documents"
                component={DocumentScreen}
                options={{
                    tabBarIcon: (props) => <FileText {...props} size={24} strokeWidth={props.focused ? 2.5 : 2} />,
                }}
            />
            <Tab.Screen
                name="You"
                component={AccountScreen}
                options={{
                    tabBarIcon: (props) => <User {...props} size={24} strokeWidth={props.focused ? 2.5 : 2} />,
                }}
            />
        </Tab.Navigator>
    );
}

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
);

export default function AppNavigator() {
    const { user, loading } = useAuth();
    const { isDark } = useTheme();
    const C = getColors(isDark);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: C.background }}>
                <Image
                    source={require('../../assets/icon.png')}
                    style={{ width: 120, height: 120 }}
                    resizeMode="contain"
                />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
            {user ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
    );
}

const styles = {
    shadow: {
    }
}
