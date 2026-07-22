import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { GroceryContext } from '../context/GroceryContext';

const RecipeDetailsScreen = ({ route }) => {
    const { id } = route.params;
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ingredientQuantities, setIngredientQuantities] = useState({});
    const { items, addItem } = useContext(GroceryContext);

    useEffect(() => {
        const fetchRecipeDetails = async () => {
            try {
                const response = await fetch(
                    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
                );
                const data = await response.json();
                setRecipe(data.meals[0]);
            } catch (error) {
                console.error('Error fetching recipe details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetails();
    }, [id]);

    // Function to extract ingredients from API response
    const getIngredients = () => {
        if (!recipe) return [];

        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = recipe[`strIngredient${i}`];
            const measure = recipe[`strMeasure${i}`];

            if (ingredient) {
                ingredients.push({ name: ingredient, measure: measure.trim() || 'N/A' });
            }
        }
        return ingredients;
    };

    // Function to check if an ingredient is already in the grocery list
    const isInGroceryList = (ingredientName) => {
        return items.some(item => item.name.toLowerCase() === ingredientName.toLowerCase());
    };

    // Function to add ingredient to grocery list
    const handleAddToGroceryList = (ingredient) => {
        if (!ingredientQuantities[ingredient.name] || ingredientQuantities[ingredient.name] <= 0) {
            Alert.alert("Error", "Please enter a valid quantity.");
            return;
        }

        addItem({ name: ingredient.name, quantity: parseInt(ingredientQuantities[ingredient.name]) });
        Alert.alert("Success", `${ingredient.name} added to grocery list!`);
    };

    return (
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#111' }}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : recipe ? (
                <>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>{recipe.strMeal}</Text>
                    <Image 
                        source={{ uri: recipe.strMealThumb }} 
                        style={{ width: '100%', height: 250, borderRadius: 10, marginVertical: 10 }} 
                    />

                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Ingredients:</Text>
                    
                    {getIngredients().map((ingredient, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Text style={{ color: '#ccc', flex: 1 }}>{ingredient.name} ({ingredient.measure})</Text>

                            {!isInGroceryList(ingredient.name) && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TextInput
                                        style={{
                                            backgroundColor: '#fff',
                                            width: 50,
                                            height: 30,
                                            textAlign: 'center',
                                            marginRight: 5,
                                        }}
                                        keyboardType="numeric"
                                        placeholder="Qty"
                                        onChangeText={(text) =>
                                            setIngredientQuantities(prev => ({ ...prev, [ingredient.name]: text }))
                                        }
                                        value={ingredientQuantities[ingredient.name] || ""}
                                    />
                                    <TouchableOpacity
                                        onPress={() => handleAddToGroceryList(ingredient)}
                                        style={{
                                            backgroundColor: '#28a745',
                                            paddingVertical: 5,
                                            paddingHorizontal: 10,
                                            borderRadius: 5,
                                        }}
                                    >
                                        <Text style={{ color: '#fff' }}>Add</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))}

<Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Instructions:</Text>
{recipe.strInstructions
    .split(/(?<=\.)\s+/) // Splitting at full stops followed by spaces
    .filter(step => step.trim()) // Remove empty steps
    .map((step, index) => (
        <Text key={index} style={{ color: '#ccc', marginBottom: 5 }}>
            <Text style={{ fontWeight: 'bold', color: '#ffcc00' }}>Step {index + 1}:</Text> {step.trim()}
        </Text>
    ))}
                </>
            ) : (
                <Text style={{ color: 'gray', marginTop: 20 }}>Recipe not found.</Text>
            )}
        </ScrollView>
    );
};

export default RecipeDetailsScreen;

// import React, { useEffect, useState, useContext } from 'react';
// import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
// import { GroceryContext } from '../context/GroceryContext';

// const SPOONACULAR_API_KEY = 'd1e1e86a70c346fc91e8549bc98e6441'; 

// const RecipeDetailsScreen = ({ route }) => {
//     const { id, source } = route.params;
//     const [recipe, setRecipe] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [ingredientQuantities, setIngredientQuantities] = useState({});
//     const { items, addItem } = useContext(GroceryContext);

//     useEffect(() => {
//         const fetchRecipeDetails = async () => {
//             try {
//                 let data;

//                 if (source === 'spoonacular') {
//                     const response = await fetch(
//                         `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=false&apiKey=${SPOONACULAR_API_KEY}`
//                     );
//                     data = await response.json();
//                 } else {
//                     const response = await fetch(
//                         `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
//                     );
//                     const result = await response.json();
//                     data = result.meals[0];
//                 }

//                 setRecipe(data);
//             } catch (error) {
//                 console.error('Error fetching recipe details:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRecipeDetails();
//     }, [id, source]);

//     const getIngredients = () => {
//         if (!recipe) return [];

//         if (source === 'spoonacular') {
//             return recipe.extendedIngredients.map(ing => ({
//                 name: ing.name,
//                 measure: `${ing.amount} ${ing.unit}`.trim()
//             }));
//         } else {
//             const ingredients = [];
//             for (let i = 1; i <= 20; i++) {
//                 const ingredient = recipe[`strIngredient${i}`];
//                 const measure = recipe[`strMeasure${i}`];
//                 if (ingredient) {
//                     ingredients.push({ name: ingredient, measure: measure.trim() || 'N/A' });
//                 }
//             }
//             return ingredients;
//         }
//     };

//     const isInGroceryList = (ingredientName) => {
//         return items.some(item => item.name.toLowerCase() === ingredientName.toLowerCase());
//     };

//     const handleAddToGroceryList = (ingredient) => {
//         const quantity = ingredientQuantities[ingredient.name];
//         if (!quantity || parseInt(quantity) <= 0) {
//             Alert.alert("Error", "Please enter a valid quantity.");
//             return;
//         }

//         addItem({ name: ingredient.name, quantity: parseInt(quantity) });
//         Alert.alert("Success", `${ingredient.name} added to grocery list!`);
//     };

//     return (
//         <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#111' }}>
//             {loading ? (
//                 <ActivityIndicator size="large" color="#007bff" />
//             ) : recipe ? (
//                 <>
//                     <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>
//                         {source === 'spoonacular' ? recipe.title : recipe.strMeal}
//                     </Text>
//                     <Image
//                         source={{ uri: source === 'spoonacular' ? recipe.image : recipe.strMealThumb }}
//                         style={{ width: '100%', height: 250, borderRadius: 10, marginVertical: 10 }}
//                     />

//                     <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Ingredients:</Text>

//                     {getIngredients().map((ingredient, index) => (
//                         <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
//                             <Text style={{ color: '#ccc', flex: 1 }}>{ingredient.name} ({ingredient.measure})</Text>

//                             {!isInGroceryList(ingredient.name) && (
//                                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//                                     <TextInput
//                                         style={{
//                                             backgroundColor: '#fff',
//                                             width: 50,
//                                             height: 30,
//                                             textAlign: 'center',
//                                             marginRight: 5,
//                                         }}
//                                         keyboardType="numeric"
//                                         placeholder="Qty"
//                                         onChangeText={(text) =>
//                                             setIngredientQuantities(prev => ({ ...prev, [ingredient.name]: text }))
//                                         }
//                                         value={ingredientQuantities[ingredient.name] || ""}
//                                     />
//                                     <TouchableOpacity
//                                         onPress={() => handleAddToGroceryList(ingredient)}
//                                         style={{
//                                             backgroundColor: '#28a745',
//                                             paddingVertical: 5,
//                                             paddingHorizontal: 10,
//                                             borderRadius: 5,
//                                         }}
//                                     >
//                                         <Text style={{ color: '#fff' }}>Add</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             )}
//                         </View>
//                     ))}

//                     <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>Instructions:</Text>
//                     {source === 'spoonacular' ? (
//                         <Text style={{ color: '#ccc', marginBottom: 5 }}>{recipe.instructions || 'No instructions available.'}</Text>
//                     ) : (
//                         recipe.strInstructions
//                             .split(/(?<=\.)\s+/)
//                             .filter(step => step.trim())
//                             .map((step, index) => (
//                                 <Text key={index} style={{ color: '#ccc', marginBottom: 5 }}>
//                                     <Text style={{ fontWeight: 'bold', color: '#ffcc00' }}>Step {index + 1}:</Text> {step.trim()}
//                                 </Text>
//                             ))
//                     )}
//                 </>
//             ) : (
//                 <Text style={{ color: 'gray', marginTop: 20 }}>Recipe not found.</Text>
//             )}
//         </ScrollView>
//     );
// };

// export default RecipeDetailsScreen;
