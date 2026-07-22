


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Linking, Modal, TextInput } from 'react-native';
// import { Title, Paragraph, Button, Surface, IconButton } from 'react-native-paper';

// const ProductDetailsScreen = ({ route }) => {
//     const { product } = route.params || {};
//     const [modalVisible, setModalVisible] = useState(false);
//     const [postcode, setPostcode] = useState('');

//     const handleOpenLink = () => {
//         Linking.openURL(product.link);
//     };

//     const handleLocateStore = () => {
//     if (!postcode.trim()) return;

//     const query = `${product.store} near ${postcode.trim()}`;
//     const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    
//     Linking.openURL(mapsUrl)
//         .catch(err => console.error('Failed to open map:', err));
    
//     setModalVisible(false);
// };

//     return (
//         <View style={styles.container}>
//             <Surface style={styles.card}>
//                 <Title style={styles.title}>{product.name}</Title>
                
//                 <View style={styles.infoContainer}>
//                     <View style={styles.priceContainer}>
//                         <Text style={styles.label}>Price:</Text>
//                         <Text style={styles.price}>£{product.price.toFixed(2)}</Text>
//                     </View>
                    
//                     <View style={styles.infoRow}>
//                         <Text style={styles.label}>Store:</Text>
//                         <Text style={styles.value}>{product.store}</Text>
//                     </View>
                    
//                     <View style={styles.infoRow}>
//                         <Text style={styles.label}>Quantity:</Text>
//                         <Text style={styles.value}>{product.quantity}</Text>
//                     </View>
//                 </View>
                
//                 <View style={styles.buttonsContainer}>
//                     <Button 
//                         mode="contained" 
//                         onPress={handleOpenLink} 
//                         style={styles.viewButton}
//                         labelStyle={styles.buttonLabel}
//                     >
//                         View Product Online
//                     </Button>
                    
//                     <Button
//                         mode="contained"
//                         onPress={() => setModalVisible(true)}
//                         style={styles.locateButton}
//                         labelStyle={styles.buttonLabel}
//                         icon="map-marker"
//                     >
//                         Locate Store
//                     </Button>
//                 </View>
//             </Surface>

//             {/* Postcode Modal */}
//             <Modal
//                 visible={modalVisible}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <Surface style={styles.modalContent}>
//                         <Title style={styles.modalTitle}>Find {product?.store}</Title>
                        
//                         <TextInput
//                             style={styles.postcodeInput}
//                             placeholder="Enter your postcode"
//                             value={postcode}
//                             onChangeText={setPostcode}
//                             autoCapitalize="characters"
//                         />
                        
//                         <View style={styles.modalButtons}>
//                             <Button 
//                                 mode="outlined" 
//                                 onPress={() => setModalVisible(false)}
//                                 style={styles.cancelButton}
//                             >
//                                 Cancel
//                             </Button>
                            
//                             <Button 
//                                 mode="contained" 
//                                 onPress={handleLocateStore}
//                                 style={styles.locateModalButton}
//                                 disabled={!postcode.trim()}
//                             >
//                                 Locate
//                             </Button>
//                         </View>
                        
//                         <IconButton
//                             icon="close"
//                             size={24}
//                             onPress={() => setModalVisible(false)}
//                             style={styles.closeButton}
//                         />
//                     </Surface>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 16,
//         backgroundColor: '#f9f9f9',
//     },
//     card: {
//         padding: 20,
//         borderRadius: 12,
//         elevation: 4,
//     },
//     title: {
//         fontSize: 22,
//         fontWeight: 'bold',
//         marginBottom: 16,
//     },
//     infoContainer: {
//         marginVertical: 10,
//     },
//     infoRow: {
//         flexDirection: 'row',
//         marginVertical: 5,
//     },
//     priceContainer: {
//         flexDirection: 'row',
//         marginVertical: 5,
//     },
//     label: {
//         fontWeight: '600',
//         marginRight: 8,
//         fontSize: 16,
//         color: '#555',
//     },
//     value: {
//         fontSize: 16,
//     },
//     price: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#E91E63',
//     },
//     buttonsContainer: {
//         flexDirection: 'column',
//         marginTop: 20,
//     },
//     viewButton: {
//         marginBottom: 12,
//         backgroundColor: '#2196F3',
//         paddingVertical: 6,
//     },
//     locateButton: {
//         backgroundColor: '#4CAF50',
//         paddingVertical: 6,
//     },
//     buttonLabel: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     modalOverlay: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         width: '85%',
//         padding: 24,
//         borderRadius: 16,
//         alignItems: 'center',
//     },
//     modalTitle: {
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     postcodeInput: {
//         width: '100%',
//         height: 50,
//         borderWidth: 1,
//         borderColor: '#ddd',
//         borderRadius: 8,
//         paddingHorizontal: 16,
//         fontSize: 16,
//         backgroundColor: '#f5f5f5',
//         marginBottom: 20,
//     },
//     modalButtons: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//     },
//     cancelButton: {
//         flex: 1,
//         marginRight: 8,
//     },
//     locateModalButton: {
//         flex: 1,
//         marginLeft: 8,
//         backgroundColor: '#4CAF50',
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 8,
//         right: 8,
//     },
// });

// export default ProductDetailsScreen;


import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Linking, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const ProductDetailsScreen = ({ route }) => {
  const { product } = route.params;
  const [postcode, setPostcode] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleLocateStore = () => {
    if (!postcode.trim()) return;

    const query = `${product.store} near ${postcode.trim()}`;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    Linking.openURL(mapsUrl)
      .catch(err => console.error('Failed to open map:', err));

    setModalVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Product:</Text>
      <Text style={styles.text}>{product.name}</Text>

      <Text style={styles.label}>Quantity:</Text>
      <Text style={styles.text}>{product.quantity}</Text>

      <Text style={styles.label}>Store:</Text>
      <Text style={styles.text}>{product.store}</Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Locate Store</Text>
      </TouchableOpacity>

      {/* Postcode Input Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter your postcode:</Text>
            <TextInput
              style={styles.input}
              value={postcode}
              onChangeText={setPostcode}
              placeholder="e.g. SW1A 1AA"
            />
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Locate" onPress={handleLocateStore} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});


export default ProductDetailsScreen;
