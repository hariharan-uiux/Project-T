import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Image, TextInput, Alert, TouchableOpacity, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useMetrics } from '../context/MetricsContext';
import { useChecklist } from '../context/ChecklistContext';
import { useDocuments } from '../context/DocumentContext';
import { COLORS, SIZES, getColors } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { Edit2, Shield, Info, DownloadCloud, Smartphone, X, Sun, Moon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedTouchable from '../components/AnimatedTouchable';
import FadeInView from '../components/FadeInView';

const THEME_OPTIONS = [
    { key: 'light', icon: Sun },
    { key: 'system', icon: Smartphone },
    { key: 'dark', icon: Moon },
];

const AccountScreen = () => {
    const { user, updateProfile } = useAuth();
    const { themeMode, setThemeMode, isDark } = useTheme();
    const C = getColors(isDark);

    // For import/export we might need to access the contexts or just AsyncStorage directly
    // Let's use AsyncStorage directly for a full backup/restore for simplicity.

    // Local state for editing
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [photoUri, setPhotoUri] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                if (isEditing) {
                    // Cancel editing and revert changes
                    setName(user?.name || '');
                    setEmail(user?.email || '');
                    setPassword(user?.password || '');
                    setPhotoUri(user?.photo || null);
                    setHasChanges(false);
                    setIsEditing(false);
                    return true; // Prevent default behavior
                }
                return false; // Use default behavior
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [isEditing, user])
    );

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPassword(user.password || '');
            setPhotoUri(user.photo || null);
            setHasChanges(false);
        }
    }, [user]);

    const handleTextChange = (setter) => (val) => {
        setter(val);
        setHasChanges(true);
    };

    const handlePickImage = async () => {
        if (!isEditing) return;
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
            setHasChanges(true);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        const result = await updateProfile({ name, email, password, photo: photoUri });
        setLoading(false);

        if (result && result.success) {
            setIsEditing(false);
            setHasChanges(false);
        } else {
            Alert.alert("Error", result?.error || "Failed to update profile");
        }
    };

    const handleExport = async () => {
        try {
            setLoading(true);
            // Gather all data
            const keys = [
                'user_session', 'users_data', '@metrics', '@metricsHistory', 
                '@checklists', '@documents', '@activeVehicleId', '@selectedType', 
                '@vehicles', '@primaryVehicleId'
            ];
            const backupData = {};

            for (const key of keys) {
                const val = await AsyncStorage.getItem(key);
                if (val) backupData[key] = JSON.parse(val);
            }

            // Embed profile images
            if (backupData['users_data']) {
                for (let u of backupData['users_data']) {
                    if (u.photo && (u.photo.startsWith('file://') || u.photo.startsWith('content://'))) {
                        try {
                            u.photoBase64 = await FileSystem.readAsStringAsync(u.photo, { encoding: FileSystem.EncodingType.Base64 });
                        } catch (err) { console.log('Failed to export photo:', err); }
                    }
                }
            }
            if (backupData['user_session']) {
                let u = backupData['user_session'];
                if (u.photo && (u.photo.startsWith('file://') || u.photo.startsWith('content://'))) {
                    try {
                        u.photoBase64 = await FileSystem.readAsStringAsync(u.photo, { encoding: FileSystem.EncodingType.Base64 });
                    } catch (err) { console.log('Failed to export photo:', err); }
                }
            }

            // Embed documents
            if (backupData['@documents']) {
                for (let doc of backupData['@documents']) {
                    if (doc.uri && (doc.uri.startsWith('file://') || doc.uri.startsWith('content://'))) {
                        try {
                            doc.fileBase64 = await FileSystem.readAsStringAsync(doc.uri, { encoding: FileSystem.EncodingType.Base64 });
                        } catch (err) { console.log('Failed to export doc:', err); }
                    }
                }
            }

            const jsonString = JSON.stringify(backupData, null, 2);
            const fileUri = FileSystem.documentDirectory + `MotoHub_Backup_${Date.now()}.json`;

            await FileSystem.writeAsStringAsync(fileUri, jsonString, {
                encoding: FileSystem.EncodingType.UTF8
            });

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri);
            } else {
                Alert.alert("Error", "Sharing is not available on this device");
            }
        } catch (e) {
            Alert.alert("Export Error", e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setLoading(true);
                const fileUri = result.assets[0].uri;

                let content;
                if (fileUri.startsWith('content://')) {
                    // For Android content URIs, use legacy API to read directly
                    content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
                } else {
                    content = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.UTF8 });
                }

                const parsedData = JSON.parse(content);

                // Validate if it's our backup structure loosely
                if (typeof parsedData !== 'object') throw new Error("Invalid backup file format");

                // Restore images
                if (parsedData['users_data']) {
                    for (let u of parsedData['users_data']) {
                        if (u.photoBase64) {
                            try {
                                const newPath = FileSystem.documentDirectory + `profile_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                                await FileSystem.writeAsStringAsync(newPath, u.photoBase64, { encoding: FileSystem.EncodingType.Base64 });
                                u.photo = newPath;
                                delete u.photoBase64;
                            } catch (err) { console.log('Failed to import photo:', err); }
                        }
                    }
                }
                if (parsedData['user_session']) {
                    let u = parsedData['user_session'];
                    if (u.photoBase64) {
                        try {
                            const newPath = FileSystem.documentDirectory + `profile_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
                            await FileSystem.writeAsStringAsync(newPath, u.photoBase64, { encoding: FileSystem.EncodingType.Base64 });
                            u.photo = newPath;
                            delete u.photoBase64;
                        } catch (err) { console.log('Failed to import user photo:', err); }
                    }
                }
                
                // Restore documents
                if (parsedData['@documents']) {
                    for (let doc of parsedData['@documents']) {
                        if (doc.fileBase64) {
                            try {
                                const ext = doc.type ? (doc.type.split('/')[1] || 'ext') : 'ext';
                                const newPath = FileSystem.documentDirectory + `doc_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
                                await FileSystem.writeAsStringAsync(newPath, doc.fileBase64, { encoding: FileSystem.EncodingType.Base64 });
                                doc.uri = newPath;
                                delete doc.fileBase64;
                            } catch (err) { console.log('Failed to import doc:', err); }
                        }
                    }
                }

                // Restore to AsyncStorage
                for (const key of Object.keys(parsedData)) {
                    await AsyncStorage.setItem(key, JSON.stringify(parsedData[key]));
                }

                Alert.alert("Import Successful", "Data has been restored. Please restart the app for changes to fully take effect.");
            }
        } catch (e) {
            Alert.alert("Import Error", "Failed to import data: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExportImportOption = () => {
        Alert.alert(
            "Export / Import Data",
            "Store your data to a local file or restore from a previous backup.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Import", onPress: handleImport },
                { text: "Export", onPress: handleExport }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: C.background }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={C.background} />
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: C.black }]}>Account</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* Profile Section */}
                <View style={styles.profileHeader}>
                        <AnimatedTouchable onPress={handlePickImage} disabled={!isEditing} style={styles.avatarContainer}>
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.avatar} />
                            ) : (
                                <View style={[styles.avatarPlaceholder, { backgroundColor: isDark ? '#3A3A3A' : '#D9D9D9' }]} />
                            )}
                        </AnimatedTouchable>

                        <View style={styles.profileInfoHeader}>
                            {isEditing ? (
                                <TextInput
                                    style={[styles.nameInputHeader, { color: C.black, borderBottomColor: C.border }]}
                                    value={name}
                                    onChangeText={handleTextChange(setName)}
                                    placeholder="Name"
                                    placeholderTextColor={C.textLight}
                                />
                            ) : (
                                <Text style={[styles.profileNameHeader, { color: C.black }]}>{name}</Text>
                            )}
                        </View>

                        <AnimatedTouchable
                            style={[styles.editButtonHeader, { backgroundColor: C.white, borderColor: C.border }]}
                            onPress={() => {
                                if (isEditing) {
                                    // Cancel editing and revert changes
                                    setName(user?.name || '');
                                    setEmail(user?.email || '');
                                    setPassword(user?.password || '');
                                    setPhotoUri(user?.photo || null);
                                    setHasChanges(false);
                                    setIsEditing(false);
                                } else {
                                    setIsEditing(true);
                                }
                            }}
                        >
                            {isEditing ? (
                                <X color={COLORS.error || '#FF3B30'} size={20} />
                            ) : (
                                <Edit2 color={COLORS.primary || '#FF6B00'} size={20} />
                            )}
                        </AnimatedTouchable>
                    </View>


                {/* Email / Password Card */}
                <View style={[styles.credentialsCard, { backgroundColor: isDark ? '#1E1E1E' : '#F9F9F9', borderColor: C.border }]}>
                        <View style={styles.credentialRow}>
                            <TextInput
                                style={[styles.credentialInput, { color: C.black }]}
                                value={email}
                                onChangeText={handleTextChange(setEmail)}
                                editable={isEditing}
                                placeholder="Email"
                                placeholderTextColor={C.textLight}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={[styles.divider, { backgroundColor: C.border }]} />
                        <View style={styles.credentialRow}>
                            <TextInput
                                style={[styles.credentialInput, { color: C.black }]}
                                value={password}
                                onChangeText={handleTextChange(setPassword)}
                                editable={isEditing}
                                secureTextEntry={!isEditing}
                                placeholder="Password"
                                placeholderTextColor={C.textLight}
                            />
                        </View>
                    </View>


                {/* Bottom Action Buttons */}
                {isEditing && (
                    <View style={styles.actionButtonsContainer}>
                            <AnimatedTouchable
                                style={[styles.actionButton, styles.cancelButton]}
                                onPress={() => {
                                    // Default cancel editing behaviour
                                    setName(user?.name || '');
                                    setEmail(user?.email || '');
                                    setPassword(user?.password || '');
                                    setPhotoUri(user?.photo || null);
                                    setHasChanges(false);
                                    setIsEditing(false);
                                }}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </AnimatedTouchable>

                            <AnimatedTouchable
                                style={[
                                    styles.actionButton,
                                    styles.saveButtonPrimary,
                                    (!hasChanges || loading) && { backgroundColor: COLORS.gray || '#999' }
                                ]}
                                onPress={handleSave}
                                disabled={!hasChanges || loading}
                            >
                                <Text style={styles.saveButtonText}>
                                    {loading ? "Saving..." : "Save"}
                                </Text>
                            </AnimatedTouchable>
                    </View>
                )}

                {/* Options Menu */}
                <View style={styles.menuContainer}>
                    {/* Appearance Toggle */}
                    <View style={[styles.menuItemRow, { marginBottom: SIZES.smallSpacing }]}>
                        <Text style={[styles.menuText, { color: C.black }]}>Appearance</Text>
                        <View style={[styles.segmentedControl, { backgroundColor: C.surface, borderColor: C.border }]}>
                            {THEME_OPTIONS.map((opt) => {
                                const isActive = themeMode === opt.key;
                                return (
                                    <TouchableOpacity
                                        key={opt.key}
                                        onPress={() => setThemeMode(opt.key)}
                                        style={[
                                            styles.segment,
                                            isActive && styles.segmentActive,
                                        ]}
                                    >
                                        <opt.icon 
                                            color={isActive ? '#FFFFFF' : C.textLight} 
                                            size={20} 
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <AnimatedTouchable style={styles.menuItem}>
                        <Text style={[styles.menuText, { color: C.black }]}>Privacy Policy</Text>
                    </AnimatedTouchable>

                    <AnimatedTouchable style={styles.menuItem}>
                        <Text style={[styles.menuText, { color: C.black }]}>About us</Text>
                    </AnimatedTouchable>

                    <AnimatedTouchable style={styles.menuItem} onPress={handleExportImportOption}>
                        <Text style={[styles.menuText, { color: C.black }]}>Export/Import data</Text>
                    </AnimatedTouchable>

                    <View style={styles.menuItemRow}>
                        <Text style={[styles.menuText, { color: C.black }]}>App Version</Text>
                        <Text style={[styles.versionText, { color: C.black }]}>1.0 V</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: isDark ? '#555555' : '#999' }]}>Thanks for using MotoHub</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SIZES.padding,
        paddingTop: SIZES.padding / 2,
        paddingBottom: SIZES.smallSpacing,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    scrollContainer: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 100, // Space for tab bar
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.baseSpacing,
    },
    avatarContainer: {
        marginRight: SIZES.baseSpacing,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderCurve: 'continuous',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderCurve: 'continuous',
        backgroundColor: '#D9D9D9',
    },
    profileInfoHeader: {
        flex: 1,
        justifyContent: 'center',
    },
    profileNameHeader: {
        fontSize: 20,
        color: '#000',
    },
    nameInputHeader: {
        fontSize: 20,
        color: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        padding: 0,
    },
    editButtonHeader: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderCurve: 'continuous',
        borderWidth: 1,
        borderColor: '#E3E3E3',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        gap: SIZES.baseSpacing,
        marginTop: 5,
        marginBottom: 10,
    },
    actionButton: {
        flex: 1,
        borderRadius: 25,
        borderCurve: 'continuous',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary || '#FF6B00',
    },
    saveButtonPrimary: {
        backgroundColor: COLORS.primary || '#FF6B00',
    },
    cancelButtonText: {
        color: COLORS.primary || '#FF6B00',
        fontWeight: 'bold',
        fontSize: 16,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    credentialsCard: {
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: '#F9F9F9',
        marginBottom: SIZES.baseSpacing,
        overflow: 'hidden',
    },
    credentialRow: {
        paddingVertical: SIZES.baseSpacing,
        paddingHorizontal: SIZES.baseSpacing,
    },
    credentialInput: {
        fontSize: 16,
        color: '#000',
        padding: 0,
    },
    divider: {
        height: 1,
        backgroundColor: '#E3E3E3',
        marginHorizontal: SIZES.baseSpacing,
    },
    menuContainer: {
        marginBottom: SIZES.baseSpacing,
    },
    menuItem: {
        paddingVertical: SIZES.baseSpacing,
        marginBottom: SIZES.smallSpacing,
    },
    menuItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SIZES.baseSpacing,
        marginBottom: SIZES.smallSpacing,
    },
    menuText: {
        fontSize: 18,
    },
    versionText: {
        fontSize: 16,
    },
    segmentedControl: {
        flexDirection: 'row',
        borderRadius: 10,
        borderCurve: 'continuous',
        borderWidth: 1,
        overflow: 'hidden',
        padding: 3,
        gap: 3,
    },
    segment: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 7,
        borderCurve: 'continuous',
        justifyContent: 'center',
        alignItems: 'center',
    },
    segmentActive: {
        backgroundColor: COLORS.primary,
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        fontSize: 16,
    },
});

export default AccountScreen;
