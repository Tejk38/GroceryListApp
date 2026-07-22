import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const ItemInput = ({ onAddItem }) => {
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAddItem = () => {
    if (item.trim() && quantity.trim()) {
      onAddItem({ name: item, quantity: parseInt(quantity, 10) });
      setItem('');
      setQuantity('');
    }
  };
  

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 8,
  },
});

export default ItemInput;