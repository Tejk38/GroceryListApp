
// import React, { useState } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
// import { Card } from 'react-native-paper';
// import { Linking, Platform } from 'react-native';

// const [modalVisible, setModalVisible] = useState(false);
// const [postcode, setPostcode] = useState('');

// const openMapsToNearestGroceryStore = () => {
//     const query = "grocery store";
//     const mapUrl = Platform.select({
//         ios: `maps:?q=${query}`,
//         android: `geo:0,0?q=${query}`,
//         default: `https://www.google.com/maps/search/?api=1&query=${query}`
//     });

//     Linking.canOpenURL(mapUrl)
//         .then(supported => {
//             if (supported) {
//                 return Linking.openURL(mapUrl);
//             } else {
//                 // Fallback to web URL if app-specific URLs aren't supported
//                 return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
//             }
//         })
//         .catch(err => console.error('An error occurred', err));
// };

// // Simple function to locate specific store
// const locateSpecificStore = (storeName, postcode = "") => {
//     const query = postcode.trim() ? `${storeName} near ${postcode.trim()}` : storeName;
//     const mapUrl = Platform.select({
//         ios: `maps:?q=${encodeURIComponent(query)}`,
//         android: `geo:0,0?q=${encodeURIComponent(query)}`,
//         default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
//     });

//     Linking.canOpenURL(mapUrl)
//         .then(supported => {
//             if (supported) {
//                 return Linking.openURL(mapUrl);
//             } else {
//                 return Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
//             }
//         })
//         .catch(err => console.error('An error occurred', err));
// };


// const ProductListScreen = ({ route, navigation }) => {
//     const { products, totals } = route.params || { products: [], totals: {} };

    
//     if (!products || products.length === 0) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.emptyText}>No products to display.</Text>
//                 <TouchableOpacity 
//                 style={styles.locateButton} 
//                 onPress={openMapsToNearestGroceryStore}
//               >
//                 <Text style={styles.locateButtonText}>Locate Nearest Grocery Store</Text>
//               </TouchableOpacity>
//             </View>
//         );
//     }
//     const groupedProducts = Object.entries(
//         products.reduce((acc, product) => {
//             if (!acc[product.store]) {
//                 acc[product.store] = [];
//             }
//             acc[product.store].push(product);
//             return acc;
//         }, {})
//     );

//     const [expandedStores, setExpandedStores] = useState({});

    
//     const toggleStore = (store) => {
//         setExpandedStores((prev) => ({
//             ...prev,
//             [store]: !prev[store],
//         }));
//     };

//     const handleCardPress = (product) => {
//         navigation.navigate('ProductDetails', { product });
//     };

//     return (
//         <View style={styles.container}>
//           <FlatList
//             data={groupedProducts}
//             keyExtractor={([store]) => store}
//             renderItem={({ item: [store, products] }) => {
//               const isExpanded = expandedStores[store];
//               const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);
              
//               return (
//                 <Card key={store} style={styles.storeCard}>
//                   <TouchableOpacity onPress={() => toggleStore(store)} style={styles.topSection}>
//                     <Text style={styles.storeName}>{store}</Text>
//                   </TouchableOpacity>
                  
//                   <View style={styles.middleSection}>
//                     <Image
//                       source={{ uri: 'https://media.gettyimages.com/id/119453743/photo/grocery-store-aisle.jpg?s=612x612&w=0&k=20&c=AD7SugX7t2g1hS7_YnpRmCt9MDK6f_H2-lLUPEzUiYI=' }}
//                       style={styles.storeImage}
//                     />
//                   </View>
                  
//                   <View style={styles.bottomSection}>
//                     <Text style={styles.quantity}>Total Items: {totalItems}</Text>
//                     <Text style={styles.price}>Total: £{totals[store]?.toFixed(2)}</Text>
//                   </View>
                  
//                   {/* Simple Locate Store Button */}
//                   <TouchableOpacity 
//                     style={styles.locateStoreButton}
//                     onPress={() => locateSpecificStore(store)}
//                   >
//                     <Text style={styles.locateButtonText}>Locate {store}</Text>
//                   </TouchableOpacity>
                  
//                   {isExpanded && (
//                     <FlatList
//                       data={products}
//                       keyExtractor={(item, index) => index.toString()}
//                       renderItem={({ item }) => (
//                         <TouchableOpacity onPress={() => handleCardPress(item)}>
//                           <View style={styles.productItem}>
//                             <Text style={styles.productName}>{item.name} (×{item.quantity})</Text>
//                             <Text style={styles.productPrice}>£{(item.price * item.quantity).toFixed(2)}</Text>
//                           </View>
//                         </TouchableOpacity>
//                       )}
//                       contentContainerStyle={styles.productList}
//                       scrollEnabled={false}
//                     />
//                   )}
//                 </Card>
//               );
//             }}
//             contentContainerStyle={{ paddingBottom: 20 }}
//           />
//         </View>
//       );
// };


import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, Modal, Platform, Linking } from 'react-native';
import { Card } from 'react-native-paper';

const ProductListScreen = ({ route, navigation }) => {
  const { products, totals } = route.params || { products: [], totals: {} };

  const [expandedStores, setExpandedStores] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  const openMapsToNearestGroceryStore = () => {
    const query = "grocery store";
    const mapUrl = Platform.select({
      ios: `maps:?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`
    });

    Linking.canOpenURL(mapUrl)
      .then(supported => supported ? Linking.openURL(mapUrl) : Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`))
      .catch(err => console.error('An error occurred', err));
  };

  const locateSpecificStore = (storeName) => {
    setSelectedStore(storeName);
    setModalVisible(true);
  };

  const handleLocateStore = () => {
    const query = postcode.trim() ? `${selectedStore} near ${postcode.trim()}` : selectedStore;
    const mapUrl = Platform.select({
      ios: `maps:?q=${encodeURIComponent(query)}`,
      android: `geo:0,0?q=${encodeURIComponent(query)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    });

    Linking.openURL(mapUrl)
      .catch(err => console.error('Failed to open map:', err));

    setModalVisible(false);
    setPostcode('');
    setSelectedStore('');
  };

  const toggleStore = (store) => {
    setExpandedStores((prev) => ({
      ...prev,
      [store]: !prev[store],
    }));
  };

  const handleCardPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  if (!products || products.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No products to display.</Text>
        <TouchableOpacity style={styles.locateButton} onPress={openMapsToNearestGroceryStore}>
          <Text style={styles.locateButtonText}>Locate Nearest Grocery Store</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const groupedProducts = Object.entries(
    products.reduce((acc, product) => {
      if (!acc[product.store]) acc[product.store] = [];
      acc[product.store].push(product);
      return acc;
    }, {})
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groupedProducts}
        keyExtractor={([store]) => store}
        renderItem={({ item: [store, products] }) => {
          const isExpanded = expandedStores[store];
          const totalItems = products.reduce((sum, product) => sum + product.quantity, 0);

          return (
            <Card key={store} style={styles.storeCard}>
              <TouchableOpacity onPress={() => toggleStore(store)} style={styles.topSection}>
                <Text style={styles.storeName}>{store}</Text>
              </TouchableOpacity>

              <View style={styles.middleSection}>
                <Image
                  source={{ uri: 'https://media.gettyimages.com/id/119453743/photo/grocery-store-aisle.jpg?s=612x612&w=0&k=20&c=AD7SugX7t2g1hS7_YnpRmCt9MDK6f_H2-lLUPEzUiYI=' }}
                  style={styles.storeImage}
                />
              </View>

              <View style={styles.bottomSection}>
                <Text style={styles.quantity}>Total Items: {totalItems}</Text>
                <Text style={styles.price}>Total: £{totals[store]?.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.locateStoreButton}
                onPress={() => locateSpecificStore(store)}
              >
                <Text style={styles.locateButtonText}>Locate {store}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <FlatList
                  data={products}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleCardPress(item)}>
                      <View style={styles.productItem}>
                        <Text style={styles.productName}>{item.name} (×{item.quantity})</Text>
                        <Text style={styles.productPrice}>£{(item.price * item.quantity).toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.productList}
                  scrollEnabled={false}
                />
              )}
            </Card>
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Postcode Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setPostcode('');
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter your postcode</Text>
            <TextInput
              style={styles.postcodeInput}
              placeholder="e.g. SW1A 1AA"
              value={postcode}
              onChangeText={setPostcode}
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleLocateStore}>
              <Text style={styles.modalButtonText}>Locate Store</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
    modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  postcodeInput: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',  
    },
    emptyText: {
        fontSize: 18,
        color: '#aaa',
        textAlign: 'center',
        marginTop: 50,
    },
    storeCard: {
        marginBottom: 20,
        borderRadius: 12,
        backgroundColor: '#fff', 
        elevation: 8,  
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    topSection: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        backgroundColor: '#007bff', 
    },
    locateButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    locateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    storeName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    middleSection: {
        height: 170,
        justifyContent: 'center',
        alignItems: 'center',
    },
    storeImage: {
        width: '70%', height: 150, resizeMode: 'cover', borderRadius: 10 
        
    },
    bottomSection: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        backgroundColor: '#f9f9f9', 
    },
    quantity: {
        fontSize: 18,
        color: '#666',
    },
    addButton: {
        padding: 10,
        backgroundColor: '#28a745',
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
    },
    productList: {
        marginTop: 10,
        paddingHorizontal: 10,
    },
    productItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    productName: {
        fontSize: 16,
        color: '#333',
    },
    productPrice: {
        fontSize: 16,
        color: '#007bff',
    },
    // Style for new locate store button
    locateStoreButton: {
        backgroundColor: '#ff6b6b',
        padding: 10,
        margin: 10,
        borderRadius: 20,
        alignItems: 'center',
    },
});

export default ProductListScreen;
