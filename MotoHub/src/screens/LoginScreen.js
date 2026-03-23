import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { COLORS, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { Lock, Mail, Eye, EyeOff, User } from 'lucide-react-native';
import FadeInView from '../components/FadeInView';

const LoginScreen = () => {
    const navigation = useNavigation();
    const { login } = useAuth();
    const { isDark } = useTheme();
    const C = getColors(isDark);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            // Navigation handled by AppNavigator state change
        } else {
            Alert.alert('Login Failed', result.error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <FadeInView delay={100}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome Back!</Text>
                            <Text style={[styles.subtitle, { color: C.textLight }]}>Sign in to continue to MotoHub</Text>
                        </View>
                    </FadeInView>

                    <FadeInView delay={200}>
                        <View style={styles.form}>
                            <View style={[styles.inputContainer, { backgroundColor: C.white, borderColor: C.border }]}>
                                <Mail color={C.textLight} size={20} style={styles.icon} />
                                <TextInput
                                    style={[styles.input, { color: C.textDark }]}
                                    placeholder="Email Address"
                                    placeholderTextColor={C.textLight}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={[styles.inputContainer, { backgroundColor: C.white, borderColor: C.border }]}>
                                <Lock color={C.textLight} size={20} style={styles.icon} />
                                <TextInput
                                    style={[styles.input, { color: C.textDark }]}
                                    placeholder="Password"
                                    placeholderTextColor={C.textLight}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff color={C.textLight} size={20} />
                                    ) : (
                                        <Eye color={C.textLight} size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                                <Text style={styles.buttonText}>{loading ? "Signing In..." : "Sign In"}</Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={[styles.footerText, { color: C.textLight }]}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                    <Text style={styles.link}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </FadeInView>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background || '#F5F5F5',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary || '#FF6B00',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        gap: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderCurve: 'continuous',
        paddingHorizontal: 16,
        height: 56,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: COLORS.primary || '#FF6B00',
        height: 56,
        borderRadius: 12,
        borderCurve: 'continuous',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#666',
        fontSize: 16,
    },
    link: {
        color: COLORS.primary || '#FF6B00',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
