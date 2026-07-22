import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View, Button, Alert, Modal, TextInput, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { AuthContext } from './AuthContext'; // Adjust the path as needed

export const GroceryContext = createContext();

export const GroceryProvider = ({ children }) => {
    const [items, setItems] = useState([]);
    const [deletedLists, setDeletedLists] = useState([]);
    const [loadingItems, setLoadingItems] = useState(true);
    
    useEffect(() => {
        const loadItems = async () => {
            try {
                const savedItems = await AsyncStorage.getItem('groceryItems');
                if (savedItems) setItems(JSON.parse(savedItems));
            } catch (error) {
                console.error("Failed to load items:", error);
            }
            setLoadingItems(false); // Setting loading to false after loading items
        };
        loadItems();
    }, []);

    // Saving items to AsyncStorage whenever there is a change
    useEffect(() => {
        const saveItems = async () => {
            try {
                await AsyncStorage.setItem('groceryItems', JSON.stringify(items));
            } catch (error) {
                console.error("Failed to save items:", error);
            }
        };
        saveItems();
    }, [items]);

    const addItem = (newItem) => {
        const existingItem = items.find(item => item.name.toLowerCase() === newItem.name.toLowerCase());
    
        if (!existingItem) {
            // Adding item only if it doesn't already exist
            const updatedItems = [...items, newItem];
            setItems(updatedItems);
        }
    };

    const updateItem = (itemName, newQuantity) => {
        const updatedItems = items.map((item) =>
            item.name === itemName ? { ...item, quantity: newQuantity } : item
        );
        setItems(updatedItems);
    };

    const deleteItem = (itemName) => {
        const deletedItem = items.find((item) => item.name === itemName);
        const updatedItems = items.filter((item) => item.name !== itemName);
        setItems(updatedItems);

        // Updating deleted lists
        if (deletedItem) {
            const updatedDeletedLists = [
                ...deletedLists,
                { ...deletedItem, deletedAt: new Date() },
            ];
            setDeletedLists(updatedDeletedLists);
        }
    };

    const clearItems = () => {
        setItems([]);
    };

    // Clearing the grocery list
    const clearList = () => {
        if (items.length > 0) {
            setDeletedLists((prevHistory) => [...prevHistory, items]);
            setItems([]);
        }
    };

    return (
        <GroceryContext.Provider value={{ items, setItems,clearItems, addItem, updateItem, deleteItem, clearList, deletedLists, loadingItems }}>
        {children}
    </GroceryContext.Provider>
    );
};