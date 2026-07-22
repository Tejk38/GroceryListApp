// import React, { useState, useContext } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Linking, Alert, Clipboard } from 'react-native';
// import { GroceryContext } from '../context/GroceryContext';
// import { collection, addDoc } from 'firebase/firestore';
// import { db, auth } from '../firebaseConfig';
// import { AuthContext } from '../context/AuthContext';

// // Fetching product details from Open Food Facts API
// const fetchProductDetails = async (barcode) => {
//   try {
//     const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
//     const data = await response.json();

//     // Check if the product exists in the response
//     if (data.status === 1 && data.product) {
//       return data.product; // Return the product data
//     } else {
//       throw new Error('Product not found');
//     }
//   } catch (error) {
//     console.error('Error fetching product details:', error);
//     throw new Error('Error fetching product details');
//   }
// };

// const ScannerScreen = ({ navigation }) => {
//   const [barcode, setBarcode] = useState('');
//   const [productData, setProductData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // Get grocery context and user context
//   const { addItem } = useContext(GroceryContext);
//   const { user } = useContext(AuthContext);

//   const handleFetchProductData = async () => {
//     if (!barcode) return; // Don't fetch if barcode is empty

//     setLoading(true);
//     setError(null); // Reset error state before fetching

//     try {
//       // Send the barcode data to Open Food Facts API
//       const productDetails = await fetchProductDetails(barcode);
//       setProductData(productDetails); // Update the state with the product details
//     } catch (error) {
//       setError(error.message); // Set error message if there's an issue
//       setProductData(null); // Reset product data on error
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Function to copy product details to clipboard
//   const handleCopyProductDetails = () => {
//     if (productData) {
//       const productDetails = `
//         Name: ${productData.product_name}
//         Brand: ${productData.brands}
//         Description: ${productData.ingredients_text}
//         Link: ${productData.url}
//       `;

//       // Copy product details to clipboard
//       Clipboard.setString(productDetails);
//       Alert.alert('Copied to Clipboard', 'Product details have been copied to your clipboard!');
//     }
//   };
  
//   // NEW FUNCTION: Add the scanned product to grocery list
//   const addToGroceryList = async () => {
//     if (!productData || !productData.product_name) {
//       Alert.alert("Error", "No valid product found to add");
//       return;
//     }
    
//     if (!user) {
//       Alert.alert("Error", "You need to log in to save items.");
//       return;
//     }
    
//     try {
//       const newItem = { 
//         name: productData.product_name, 
//         quantity: 1 
//       };
      
//       // Add to Firebase
//       const docRef = await addDoc(collection(db, "users", user.uid, "groceryItems"), newItem);
      
//       // Add to local state via context
//       addItem({ id: docRef.id, ...newItem });
      
//       Alert.alert(
//         "Success", 
//         `${productData.product_name} added to your grocery list!`,
//         [
//           { 
//             text: "Go to List", 
//             onPress: () => navigation.navigate('ItemList')
//           },
//           { 
//             text: "Stay Here", 
//             style: "cancel" 
//           }
//         ]
//       );
//     } catch (error) {
//       console.error("Error adding scanned item:", error);
//       Alert.alert("Error", "Failed to add item to your grocery list");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Enter Barcode Number</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter barcode number"
//         keyboardType="numeric"
//         value={barcode}
//         onChangeText={setBarcode}
//       />

//       <TouchableOpacity onPress={handleFetchProductData} style={styles.fetchButton}>
//         <Text style={styles.fetchButtonText}>Fetch Product</Text>
//       </TouchableOpacity>

//       {loading && <ActivityIndicator size="large" style={styles.loading} />}

//       {error && <Text style={styles.errorText}>{error}</Text>}

//       {productData && (
//         <View style={styles.productInfo}>
//           <Text style={styles.productTitle}>Product Details:</Text>
//           <Text>Name: {productData.product_name}</Text>
//           <Text>Brand: {productData.brands}</Text>
//           <Text>Description: {productData.ingredients_text}</Text>
//           <Text>Link: <Text style={styles.link} onPress={() => { Linking.openURL(productData.url); }}>{productData.url}</Text></Text>
          
//           {/* Add to Grocery List Button */}
//           <TouchableOpacity onPress={addToGroceryList} style={styles.addButton}>
//             <Text style={styles.addButtonText}>Add to Grocery List</Text>
//           </TouchableOpacity>
          
//           {/* Copy Button */}
//           <TouchableOpacity onPress={handleCopyProductDetails} style={styles.copyButton}>
//             <Text style={styles.copyButtonText}>Copy Product Details</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   header: { fontSize: 24, marginBottom: 20 },
//   input: {
//     width: '100%',
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingLeft: 10,
//     marginBottom: 20,
//   },
//   fetchButton: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     width: '100%',
//     alignItems: 'center',
//   },
//   fetchButtonText: { color: 'white', fontSize: 16 },
//   loading: { marginTop: 20 },
//   errorText: { color: 'red', marginTop: 10 },
//   productInfo: { marginTop: 20, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5, width: '100%' },
//   productTitle: { fontSize: 18, fontWeight: 'bold' },
//   link: { color: 'blue' },
//   addButton: {
//     marginTop: 10,
//     backgroundColor: '#ff9500',
//     padding: 10,
//     borderRadius: 5,
//     width: '100%',
//     alignItems: 'center',
//   },
//   addButtonText: { color: 'white', fontSize: 16 },
//   copyButton: {
//     marginTop: 10,
//     backgroundColor: '#28a745',
//     padding: 10,
//     borderRadius: 5,
//     width: '100%',
//     alignItems: 'center',
//   },
//   copyButtonText: { color: 'white', fontSize: 16 },
// });

// export default ScannerScreen;



import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Linking, Alert, Clipboard, Image } from 'react-native';
import { GroceryContext } from '../context/GroceryContext';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { AuthContext } from '../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode as atob } from 'base-64'; 

// Fetching product details from Open Food Facts API
const fetchProductDetails = async (barcode) => {
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await response.json();

    if (data.status === 1 && data.product) {
      return data.product;
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw new Error('Error fetching product details');
  }
};

const ScannerScreen = ({ navigation }) => {
  const [barcode, setBarcode] = useState('');
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  // Get grocery context and user context
  const { addItem } = useContext(GroceryContext);
  const { user } = useContext(AuthContext);

  // Handle image picker
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      extractBarcodeFromImage(result.uri); // to extract barcode
    }
  };

  // get barcode from the uploaded image
  const extractBarcodeFromImage = async (uri) => {
    try {
      
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      
      const barcodeExtracted = decodeBarcode(base64Data); 
      setBarcode(barcodeExtracted); 
    } catch (error) {
      console.error('Error extracting barcode:', error);
      setError('Failed to extract barcode from image');
    }
  };

  // Simulate a barcode extraction process 
  const decodeBarcode = (base64Data) => {
   
    return '1234567890'; 
  };

  const handleFetchProductData = async () => {
    if (!barcode) return; // Don't fetch if barcode is empty

    setLoading(true);
    setError(null);

    try {
      const productDetails = await fetchProductDetails(barcode);
      setProductData(productDetails);
    } catch (error) {
      setError(error.message);
      setProductData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyProductDetails = () => {
    if (productData) {
      const productDetails = `
        Name: ${productData.product_name}
        Brand: ${productData.brands}
        Description: ${productData.ingredients_text}
        Link: ${productData.url}
      `;

      Clipboard.setString(productDetails);
      Alert.alert('Copied to Clipboard', 'Product details have been copied to your clipboard!');
    }
  };

  const addToGroceryList = async () => {
    if (!productData || !productData.product_name) {
      Alert.alert("Error", "No valid product found to add");
      return;
    }

    if (!user) {
      Alert.alert("Error", "You need to log in to save items.");
      return;
    }

    try {
      const newItem = { 
        name: productData.product_name, 
        quantity: 1 
      };

      const docRef = await addDoc(collection(db, "users", user.uid, "groceryItems"), newItem);
      addItem({ id: docRef.id, ...newItem });

      Alert.alert(
        "Success", 
        `${productData.product_name} added to your grocery list!`,
        [
          { 
            text: "Go to List", 
            onPress: () => navigation.navigate('ItemList')
          },
          { 
            text: "Stay Here", 
            style: "cancel" 
          }
        ]
      );
    } catch (error) {
      console.error("Error adding scanned item:", error);
      Alert.alert("Error", "Failed to add item to your grocery list");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload a Barcode Image</Text>

      {/* Image picker button */}
      <TouchableOpacity onPress={handlePickImage} style={styles.pickImageButton}>
        <Text style={styles.pickImageButtonText}>Pick an Image</Text>
      </TouchableOpacity>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Barcode number"
        keyboardType="numeric"
        value={barcode}
        onChangeText={setBarcode}
      />

      <TouchableOpacity onPress={handleFetchProductData} style={styles.fetchButton}>
        <Text style={styles.fetchButtonText}>Fetch Product</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" style={styles.loading} />}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {productData && (
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>Product Details:</Text>
          <Text>Name: {productData.product_name}</Text>
          <Text>Brand: {productData.brands}</Text>
          <Text>Description: {productData.ingredients_text}</Text>
          <Text>Link: <Text style={styles.link} onPress={() => { Linking.openURL(productData.url); }}>{productData.url}</Text></Text>

          <TouchableOpacity onPress={addToGroceryList} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add to Grocery List</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleCopyProductDetails} style={styles.copyButton}>
            <Text style={styles.copyButtonText}>Copy Product Details</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 24, marginBottom: 20 },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  fetchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  fetchButtonText: { color: 'white', fontSize: 16 },
  loading: { marginTop: 20 },
  errorText: { color: 'red', marginTop: 10 },
  productInfo: { marginTop: 20, padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5, width: '100%' },
  productTitle: { fontSize: 18, fontWeight: 'bold' },
  link: { color: 'blue' },
  addButton: {
    marginTop: 10,
    backgroundColor: '#ff9500',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontSize: 16 },
  copyButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  copyButtonText: { color: 'white', fontSize: 16 },
  pickImageButton: {
    backgroundColor: '#ff5733',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  pickImageButtonText: { color: 'white', fontSize: 16 },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});

export default ScannerScreen;
