import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';

const AddItemModal = ({ visible, onClose, onAddItem }) => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddItem = () => {
    if (!item.trim()) {
      alert("Item name cannot be empty!");
      return;
    }

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert("Please enter a valid quantity!");
      return;
    }

    onAddItem({ name: item.trim(), quantity: parsedQuantity });
    setItem('');
    setQuantity('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Item</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            placeholderTextColor="#aaa"
            value={item}
            onChangeText={setItem}
          />

          <TextInput
            style={styles.input}
            placeholder="Enter quantity"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.addButton]} onPress={handleAddItem}>
              <Text style={styles.buttonText}>Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    borderRadius: 5,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    marginRight: 5,
  },
  addButton: {
    backgroundColor: '#28a745',
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AddItemModal;
