import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const SwipeableRow = ({ children, onDelete, onEdit }) => {
    const translateX = useSharedValue(0); // Tracks swipe position

    const panStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handleSwipeLeft = () => {
        translateX.value = withTiming(-150); // Reveal buttons
    };

    const handleSwipeRight = () => {
        translateX.value = withTiming(0); // Reset position
    };

    return (
        <View style={styles.rowContainer}>
            {/* Buttons Container */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onEdit} style={styles.editButton}>
                    <Text style={styles.buttonText}>✏️ Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
                    <Text style={styles.buttonText}>❌ Delete</Text>
                </TouchableOpacity>
            </View>

            {/* Swipeable Content */}
            <Animated.View style={[panStyle, styles.swipeableContent]}>
                <TouchableOpacity
                    onPressIn={handleSwipeLeft}
                    onPressOut={handleSwipeRight}
                    style={styles.rectButton}
                >
                    {children}
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 150, // Width of the buttons
        position: 'absolute',
        right: -150, // Position buttons off-screen initially
    },
    editButton: {
        flex: 1,
        backgroundColor: '#28a745',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#dc3545',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    swipeableContent: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    rectButton: {
        padding: 10,
    },
});

export default SwipeableRow;