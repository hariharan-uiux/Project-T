import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, History, PlusCircle, CheckSquare, User, Bike, FileText } from 'lucide-react-native';
import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';

import { COLORS, SIZES } from '../constants/theme';
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

const CustomTabBarIcon = ({ focused, icon: Icon, color }) => {
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 58,
            height: 40,
            borderRadius: 20,
            backgroundColor: focused ? 'rgba(255, 255, 255, 0.35)' : 'transparent',
            marginBottom: 2,
        }}>
            <Icon color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
        </View>
    );
};

function MainTabs() {
    return (
        <Tab.Navigator
            tabBar={(props) => (
                <View style={{
                    position: 'absolute',
                    bottom: 15,
                    width: '100%',
                    paddingHorizontal: 20, // Space on right and left
                    alignItems: 'center', // Center the pill
                }}>
                    <BottomTabBar {...props} />
                </View>
            )}
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: 'rgba(242, 113, 53, 0.95)', // Vibrant Orange Glass
                    borderRadius: 35,
                    height: 65,
                    borderTopWidth: 0,
                    paddingBottom: 0,
                    paddingHorizontal: 8,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 15,
                    borderWidth: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%', 
                    maxWidth: 340, // Max pill width for large screens
                },
                tabBarItemStyle: {
                    width: 52, // Tight width per icon to make the overall bar much shorter
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                headerShown: false,
                tabBarActiveTintColor: '#FFFFFF',
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: (props) => <CustomTabBarIcon {...props} icon={Home} />,
                }}
            />
            <Tab.Screen
                name="Metrics"
                component={HistoryScreen}
                options={{
                    tabBarLabel: "Metrics",
                    tabBarIcon: (props) => <CustomTabBarIcon {...props} icon={Bike} />,
                }}
            />
            <Tab.Screen
                name="Checklist"
                component={ChecklistScreen}
                options={{
                    tabBarLabel: "List",
                    tabBarIcon: (props) => <CustomTabBarIcon {...props} icon={CheckSquare} />,
                }}
            />
            <Tab.Screen
                name="Documents"
                component={DocumentScreen}
                options={{
                    tabBarLabel: "Docs",
                    tabBarIcon: (props) => <CustomTabBarIcon {...props} icon={FileText} />,
                }}
            />
            <Tab.Screen
                name="You"
                component={AccountScreen}
                options={{
                    tabBarLabel: "You",
                    tabBarIcon: (props) => <CustomTabBarIcon {...props} icon={User} />,
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

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
            {user ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
    );
}

const styles = {
    shadow: {
    }
}
