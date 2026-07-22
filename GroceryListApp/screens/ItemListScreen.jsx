

import { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
    Modal,
    Button,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, doc, updateDoc, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { AuthContext } from '../context/AuthContext';
import { GroceryContext } from '../context/GroceryContext';

const ItemListScreen = ({ navigation }) => {
    const { items, setItems, addItem, updateItem, deleteItem, deletedLists, addToDeletedList } = useContext(GroceryContext);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('1');
    const [editedItemName, setEditedItemName] = useState('');
    const [showHistory, setShowHistory] = useState(false);
    
    const { user } = useContext(AuthContext);

    const fetchPrices = async () => {
       

        console.log(items); 
        if (items.some(item => !item.name)) {
            Alert.alert("Error", "Some items are missing a name.");
            return;
        }

        setLoading(true);
        try {
            //10.232.201.107
            //localhost
            const response = await fetch('http://10.232.201.107:3000/api/scrape', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items }),
            });
            const data = await response.json();
            if (!response.ok) {
                console.error("Error details:", data);
                Alert.alert("Error", "Failed to fetch product prices.");
            } else {
                navigation.navigate('ProductList', { products: data.products, totals: data.totals });
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            Alert.alert("Error", "Failed to fetch product prices.");
        }
        setLoading(false);
    };

    // Fetch only the logged-in user's items
    useEffect(() => {
        const fetchItems = async () => {
            if (!user) return;

            try {
                const itemsRef = collection(db, "users", user.uid, "groceryItems");
                const querySnapshot = await getDocs(itemsRef);
                
                const userItems = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setItems(userItems);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [user]);

    // Handle adding items
    const handleAddItem = async () => {
        if (!newItemName.trim()) {
            Alert.alert("Error", "Item name cannot be empty.");
            return;
        }

        if (!user) {
            Alert.alert("Error", "You need to log in to save items.");
            return;
        }

        const existingItem = items.find(item => item.name.toLowerCase() === newItemName.toLowerCase());

        if (existingItem) {
            await updateItem(existingItem.name, parseInt(newItemQuantity));
        } else {
            const newItem = { name: newItemName, quantity: parseInt(newItemQuantity) };

            try {
                const docRef = await addDoc(collection(db, "users", user.uid, "groceryItems"), newItem);
                addItem({ id: docRef.id, ...newItem });
            } catch (error) {
                console.error("Error adding item:", error);
            }
        }

        setNewItemName('');
        setNewItemQuantity('1');
        setModalVisible(false);
    };

    // Handle editing an item
    const handleEditItem = async () => {
        if (!currentItem || !currentItem.id) {
            Alert.alert("Error", "Item ID is missing, cannot update.");
            return;
        }

        if (!editedItemName.trim()) {
            Alert.alert("Error", "Item name cannot be empty.");
            return;
        }

        if (!user) {
            Alert.alert("Error", "You need to log in to edit items.");
            return;
        }

        try {
            const updatedItem = { name: editedItemName, quantity: parseInt(newItemQuantity) };
            const itemRef = doc(db, "users", user.uid, "groceryItems", currentItem.id);

            await updateDoc(itemRef, updatedItem);

            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === currentItem.id ? { ...item, ...updatedItem } : item
                )
            );

            setEditModalVisible(false);
            Alert.alert("Success", "Item updated successfully!");
        } catch (error) {
            console.error("Error editing item:", error);
            Alert.alert("Error", "Could not edit item.");
        }

        setCurrentItem(null);
        setEditedItemName('');
        setNewItemQuantity('1');
    };

    // Handle deleting an item
    const handleDeleteItem = async (item) => {
        if (!user) return;

        try {
            const itemRef = doc(db, "users", user.uid, "groceryItems", item.id);
            await deleteDoc(itemRef);

            setItems(prevItems => prevItems.filter(i => i.id !== item.id));
            addToDeletedList({ ...item, deletedAt: new Date().toISOString() });

            Alert.alert("Deleted", "Item removed successfully!");
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    };

    return (
        <View style={styles.container}>
            {showHistory && (
                <View style={styles.historySection}>
                    <Text style={styles.historyTitle}>History</Text>
                    <FlatList
                        data={deletedLists}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.deletedListItem}>
                                <Text>{item.name} - Quantity: {item.quantity}</Text>
                                <Text>Deleted At: {new Date(item.deletedAt).toLocaleString()}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.emptyList}>No deleted items found.</Text>}
                    />
                </View>
            )}

            <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                        <View style={styles.actions}>
                            <Button title="Edit" onPress={() => {
                                setCurrentItem(item);
                                setEditedItemName(item.name);
                                setNewItemQuantity(item.quantity.toString());
                                setEditModalVisible(true);
                            }} />
                            <Button title="Delete" onPress={() => handleDeleteItem(item)} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyList}>No items added yet.</Text>}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle" size={60} color="#28a745" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.priceButton} onPress={fetchPrices}>
                <Text style={styles.buttonText}>{loading ? "Loading..." : "Get Prices"}</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder="Item Name"
                        value={newItemName}
                        onChangeText={setNewItemName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Quantity"
                        value={newItemQuantity}
                        onChangeText={setNewItemQuantity}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Button title="Add Item" onPress={handleAddItem} />
                    <Button title="Cancel" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>

            <Modal visible={editModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder="Item Name"
                        value={editedItemName}
                        onChangeText={setEditedItemName}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Quantity"
                        value={newItemQuantity}
                        onChangeText={setNewItemQuantity}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Button title="Save Changes" onPress={handleEditItem} />
                    <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    historySection: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    deletedListItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    itemText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
    },
    addButton: {
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    priceButton: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 5,
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        width: '80%',
        borderRadius: 5,
    },
    emptyList: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#aaa',
    },
    container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
    addButton: { position: 'absolute', bottom: 30,margin:20,right:10},
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center',   padding: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, width: '80%' }
});

export default ItemListScreen;
