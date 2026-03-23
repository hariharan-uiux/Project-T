import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { COLORS, SIZES, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { User, Lock, Mail, Eye, EyeOff } from 'lucide-react-native';
import FadeInView from '../components/FadeInView';

const SignUpScreen = () => {
    const navigation = useNavigation();
    const { register } = useAuth();
    const { isDark } = useTheme();
    const C = getColors(isDark);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await register(name, email, password);
        setLoading(false);

        if (result.success) {
            // Navigation handled by AppNavigator state change
        } else {
            Alert.alert('Registration Failed', result.error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: C.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <FadeInView delay={100}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={[styles.subtitle, { color: C.textLight }]}>Sign up to start tracking your vehicle metrics with MotoHub</Text>
                        </View>
                    </FadeInView>

                    <FadeInView delay={200}>
                        <View style={styles.form}>
                            <View style={[styles.inputContainer, { backgroundColor: C.white, borderColor: C.border }]}>
                                <User color={C.textLight} size={20} style={styles.icon} />
                                <TextInput style={[styles.input, { color: C.textDark }]} placeholder="Full Name" placeholderTextColor={C.textLight} value={name} onChangeText={setName} autoCapitalize="words" />
                            </View>

                            <View style={[styles.inputContainer, { backgroundColor: C.white, borderColor: C.border }]}>
                                <Mail color={C.textLight} size={20} style={styles.icon} />
                                <TextInput style={[styles.input, { color: C.textDark }]} placeholder="Email Address" placeholderTextColor={C.textLight} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                            </View>

                            <View style={[styles.inputContainer, { backgroundColor: C.white, borderColor: C.border }]}>
                                <Lock color={C.textLight} size={20} style={styles.icon} />
                                <TextInput style={[styles.input, { color: C.textDark }]} placeholder="Password" placeholderTextColor={C.textLight} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff color={C.textLight} size={20} /> : <Eye color={C.textLight} size={20} />}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                                <Text style={styles.buttonText}>{loading ? "Creating Account..." : "Sign Up"}</Text>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={[styles.footerText, { color: C.textLight }]}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.link}>Sign In</Text>
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

export default SignUpScreen;
