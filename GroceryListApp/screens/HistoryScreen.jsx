import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { GroceryContext } from '../context/GroceryContext';

const HistoryScreen = () => {
    const { deletedLists } = useContext(GroceryContext);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Deleted Lists</Text>
            <FlatList
                data={deletedLists}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text>{item.name} - Quantity: {item.quantity}</Text>
                        <Text>Deleted At: {new Date(item.deletedAt).toLocaleString()}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyList}>No deleted lists found.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    emptyList: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#aaa',
    },
});

export default HistoryScreen;