import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, Modal, TextInput, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, X } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Video, ResizeMode } from 'expo-av';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useDocuments } from '../context/DocumentContext';
import DocumentCard from '../components/DocumentCard';
import AnimatedTouchable from '../components/AnimatedTouchable';

const DocumentScreen = () => {
    const { documents, addDocument, deleteDocument, updateDocumentTitle } = useDocuments();
    const [modalVisible, setModalVisible] = useState(false);
    const [pickedFile, setPickedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleAddDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true,
            });

            if (result.assets && result.assets.length > 0) {
                const file = result.assets[0];
                setPickedFile(file);
                // Default name without extension
                const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                setFileName(nameWithoutExt);
                setModalVisible(true);
            }
        } catch (err) {
            console.error('Unknown error: ', err);
        }
    };

    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [viewImageUri, setViewImageUri] = useState(null);
    const [viewVideoUri, setViewVideoUri] = useState(null);

    const handleViewDocument = async (doc) => {
        if (doc.type && doc.type.startsWith('image')) {
            setViewImageUri(doc.uri);
            setViewVideoUri(null);
            setViewModalVisible(true);
        } else if (doc.type && doc.type.startsWith('video')) {
            setViewVideoUri(doc.uri);
            setViewImageUri(null);
            setViewModalVisible(true);
        } else {
            try {
                const isPdf = doc.name?.toLowerCase().endsWith('.pdf') || doc.type === 'application/pdf';
                const mimeType = isPdf ? 'application/pdf' : (doc.type || '*/*');

                if (Platform.OS === 'android') {
                    const contentUri = await FileSystem.getContentUriAsync(doc.uri);
                    if (contentUri) {
                        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                            data: contentUri,
                            flags: 1,
                            type: mimeType,
                        });
                    }
                } else {
                    // on iOS sharing is required for preview
                    if (await Sharing.isAvailableAsync()) {
                        await Sharing.shareAsync(doc.uri, { UTI: isPdf ? 'com.adobe.pdf' : undefined });
                    } else {
                        alert('Preview is not available on this device');
                    }
                }
            } catch (error) {
                console.error("Error opening document:", error);
                alert('No app found to open this document.');
            }
        }
    };

    const handleSaveDocument = () => {
        if (pickedFile && fileName.trim()) {
            addDocument({
                id: Date.now(),
                name: fileName.trim(),
                uri: pickedFile.uri,
                type: pickedFile.mimeType,
                size: pickedFile.size
            });
            setModalVisible(false);
            setPickedFile(null);
            setFileName('');
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Documents</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.grid}>
                    {documents.map(doc => (
                        <DocumentCard
                            key={doc.id}
                            document={doc}
                            onDelete={deleteDocument}
                            onUpdateTitle={updateDocumentTitle}
                            onView={handleViewDocument}
                        />
                    ))}
                </View>
            </ScrollView>

            <AnimatedTouchable
                style={styles.fab}
                onPress={handleAddDocument}
            >
                <Plus size={30} color={COLORS.primary} />
            </AnimatedTouchable>

            {/* Name Input Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                statusBarTranslucent={true}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Name Document</Text>
                        <TextInput
                            style={styles.input}
                            value={fileName}
                            onChangeText={setFileName}
                            placeholder="Enter document name"
                            autoFocus
                        />
                        <AnimatedTouchable style={styles.saveBtn} onPress={handleSaveDocument}>
                            <Text style={styles.saveBtnText}>Save</Text>
                        </AnimatedTouchable>
                        <AnimatedTouchable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                            <Text style={styles.cancelBtnText}>Cancel</Text>
                        </AnimatedTouchable>
                    </View>
                </View>
            </Modal>

            {/* Image Viewer Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={viewModalVisible}
                onRequestClose={() => setViewModalVisible(false)}
                statusBarTranslucent={true}
            >
                <View style={styles.imageModalContainer}>
                    <AnimatedTouchable style={styles.closeButton} onPress={() => setViewModalVisible(false)}>
                        <X size={30} color={COLORS.white} />
                    </AnimatedTouchable>
                    {viewImageUri && (
                        <Image
                            source={{ uri: viewImageUri }}
                            style={styles.fullScreenImage}
                            resizeMode="contain"
                        />
                    )}
                    {viewVideoUri && (
                        <Video
                            style={styles.fullScreenVideo}
                            source={{ uri: viewVideoUri }}
                            useNativeControls
                            resizeMode={ResizeMode.CONTAIN}
                            isLooping
                            shouldPlay
                        />
                    )}
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: SIZES.padding,
        paddingTop: SIZES.padding / 2,
        paddingBottom: SIZES.padding,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    scrollContent: {
        paddingHorizontal: SIZES.padding,
        paddingBottom: 100,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: SIZES.padding,
        width: 60,
        height: 60,
        borderRadius: 16,
        borderCurve: 'continuous',
        backgroundColor: '#FFF5E0',
        borderWidth: 1,
        borderColor: '#FFE0B2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.cardRadius || 16,
        borderCurve: 'continuous',
        padding: 24,
        width: '85%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: COLORS.textDark,
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary,
        fontSize: 16,
        paddingVertical: 8,
        marginBottom: 20,
        color: COLORS.textDark,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        borderCurve: 'continuous',
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    saveBtnText: {
        color: COLORS.white,
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelBtn: {
        width: '100%',
        alignItems: 'center',
        padding: 10,
    },
    cancelBtnText: {
        color: COLORS.gray,
        fontSize: 14,
    },
    imageModalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 1,
        padding: 10,
    },
    fullScreenImage: {
        width: '100%',
        height: '90%',
    },
    fullScreenVideo: {
        width: '100%',
        height: '90%',
    }
});

export default DocumentScreen;
