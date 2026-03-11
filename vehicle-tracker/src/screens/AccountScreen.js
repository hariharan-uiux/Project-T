import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, ScrollView, Alert, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useMetrics } from '../context/MetricsContext';
import { useChecklist } from '../context/ChecklistContext';
import { useDocuments } from '../context/DocumentContext';
import { COLORS, SIZES } from '../constants/theme';
import { Edit2, Shield, Info, DownloadCloud, Smartphone, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AnimatedTouchable from '../components/AnimatedTouchable';

const AccountScreen = () => {
    const { user, updateProfile } = useAuth();

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
            const keys = ['user_session', 'users_data', '@metrics', '@metricsHistory', '@checklists', '@documents'];
            const backupData = {};

            for (const key of keys) {
                const val = await AsyncStorage.getItem(key);
                if (val) backupData[key] = JSON.parse(val);
            }

            const jsonString = JSON.stringify(backupData, null, 2);
            const fileUri = FileSystem.documentDirectory + `ProjectT_Backup_${Date.now()}.json`;

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

                // Restore
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Account</Text>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>

                {/* Profile Section */}
                <View style={styles.profileHeader}>
                    <AnimatedTouchable onPress={handlePickImage} disabled={!isEditing} style={styles.avatarContainer}>
                        {photoUri ? (
                            <Image source={{ uri: photoUri }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder} />
                        )}
                    </AnimatedTouchable>

                    <View style={styles.profileInfoHeader}>
                        {isEditing ? (
                            <TextInput
                                style={styles.nameInputHeader}
                                value={name}
                                onChangeText={handleTextChange(setName)}
                                placeholder="Name"
                            />
                        ) : (
                            <Text style={styles.profileNameHeader}>{name}</Text>
                        )}
                    </View>

                    <AnimatedTouchable
                        style={styles.editButtonHeader}
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
                <View style={styles.credentialsCard}>
                    <View style={styles.credentialRow}>
                        <TextInput
                            style={styles.credentialInput}
                            value={email}
                            onChangeText={handleTextChange(setEmail)}
                            editable={isEditing}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.credentialRow}>
                        <TextInput
                            style={styles.credentialInput}
                            value={password}
                            onChangeText={handleTextChange(setPassword)}
                            editable={isEditing}
                            secureTextEntry={!isEditing}
                            placeholder="Password"
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
                    <AnimatedTouchable style={styles.menuItem}>
                        <Text style={styles.menuText}>Privacy Policy</Text>
                    </AnimatedTouchable>

                    <AnimatedTouchable style={styles.menuItem}>
                        <Text style={styles.menuText}>About us</Text>
                    </AnimatedTouchable>

                    <AnimatedTouchable style={styles.menuItem} onPress={handleExportImportOption}>
                        <Text style={styles.menuText}>Export/Import data</Text>
                    </AnimatedTouchable>

                    <View style={styles.menuItemRow}>
                        <Text style={styles.menuText}>App Version</Text>
                        <Text style={styles.versionText}>1.0 V</Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Thanks for using Project T</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SIZES.largeSpacing,
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
        marginTop: 10,
        marginBottom: 20,
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
        marginBottom: SIZES.largeSpacing,
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
        marginBottom: SIZES.largeSpacing,
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
        color: '#000',
    },
    versionText: {
        fontSize: 16,
        color: '#000',
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        color: '#999',
        fontSize: 16,
    },
});

export default AccountScreen;
