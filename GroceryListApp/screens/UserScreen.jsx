import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const UserScreen = () => {
    const { user, logout, updateProfileImage } = useContext(AuthContext); // Assuming you have a method to update profile image
    const [imageUri, setImageUri] = useState(user?.profilePic || ''); // default to current profile picture if available
    const navigation = useNavigation();

    const handleLogout = async () => {
        await logout();
        navigation.replace('LoginScreen');
    };

    const pickImage = async () => {
     
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Permission denied', 'You need to grant permission to access the media library.');
            return;
        }

        
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // to make the image square
            quality: 1,
        });

        if (!pickerResult.cancelled) {
            setImageUri(pickerResult.uri); // Update the image URI
            updateProfileImage(pickerResult.uri); // Assuming updateProfileImage is a function that updates the image in AuthContext or Firebase
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                {imageUri ? (
                    <Image source={{ uri: imageUri }} style={styles.profileImage} />
                ) : (
                    <Ionicons name="person-circle" size={105} color="#ccc" />
                )}
                {/* Pencil Icon Button */}
                <TouchableOpacity style={styles.editButton} onPress={pickImage}>
                    <Ionicons name="pencil" size={25} color="white" />
                </TouchableOpacity>
                <Text style={styles.title}>Welcome {user?.username}</Text>
            </View>

            <View style={styles.detailsContainer}>
                <View style={styles.field}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{user?.email}</Text>
                </View>
                <View style={styles.field}>
                    <Text style={styles.label}>Deleted Lists:</Text>
                    <Text style={styles.value}>
                        {user?.deletedLists?.join(', ') || 'No deleted lists'}
                    </Text>
                </View>
            </View>

            <View style={styles.logoutContainer}>
                <Button title="Logout" onPress={handleLogout} color="#ff6347" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    profileContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: 40,
        width: '100%',
        position: 'relative', // Add relative positioning to position the pencil button correctly
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: '#ff6347',
    },
    editButton: {
        position: 'absolute', // Absolute positioning to place the pencil icon
        bottom: 5, // Space from the bottom of the image
        right: 5,  // Space from the right side of the image
        backgroundColor: '#ff6347', // Button color
        borderRadius: 20, // Rounded button
        padding: 5, // Padding around the icon
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    detailsContainer: {
        width: '100%',
        paddingHorizontal: 15,
    },
    field: {
        flexDirection: 'row',
        marginBottom: 12,
        justifyContent: 'space-between',
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
    },
    value: {
        fontSize: 16,
        color: '#777',
        flex: 1,
        textAlign: 'right',
    },
    logoutContainer: {
        marginTop: 40,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UserScreen;
