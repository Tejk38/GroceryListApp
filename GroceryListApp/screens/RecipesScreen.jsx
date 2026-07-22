

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { GroceryContext } from '../context/GroceryContext';
import { useNavigation } from '@react-navigation/native';

const RecipesScreen = () => {
    const { items } = useContext(GroceryContext);
    const [bestMatch, setBestMatch] = useState(null);
    const [otherSuggestions, setOtherSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchRecipes = async () => {
            if (items.length === 0) {
                setBestMatch(null);
                setOtherSuggestions([]);
                setLoading(false);
                return;
            }

            try {
                let allRecipes = [];
                let recipeCounts = {};

                // Fetch recipes for each item in the grocery list
                for (let item of items) {
                    const response = await fetch(
                        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${item.name}`
                    );
                    const data = await response.json();

                    if (data.meals) {
                        data.meals.forEach(meal => {
                            if (!recipeCounts[meal.idMeal]) {
                                recipeCounts[meal.idMeal] = { ...meal, matchCount: 1 };
                                allRecipes.push(recipeCounts[meal.idMeal]);
                            } else {
                                recipeCounts[meal.idMeal].matchCount += 1;
                            }
                        });
                    }
                }

                // Sort recipes by most matched ingredients
                allRecipes.sort((a, b) => b.matchCount - a.matchCount);

                // Set the best match (recipe with most matching ingredients)
                setBestMatch(allRecipes.length > 0 ? allRecipes[0] : null);

                // Set other suggested recipes
                setOtherSuggestions(allRecipes.slice(1, 5));

            } catch (error) {
                console.error('Error fetching recipes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, [items]);

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <>
                    {bestMatch && (
                        <View style={styles.bestMatchContainer}>
                            <Text style={styles.bestMatchTitle}>Best Match</Text>
                            <TouchableOpacity
                                style={styles.recipeCardLarge}
                                onPress={() =>
                                    navigation.navigate('RecipeDetails', { id: bestMatch.idMeal })
                                }
                            >
                                <Image
                                    source={{ uri: bestMatch.strMealThumb }}
                                    style={styles.recipeImageLarge}
                                />
                                <Text style={styles.recipeTitle}>{bestMatch.strMeal}</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Text style={styles.otherSuggestionsTitle}>Other Suggestions</Text>
                    {otherSuggestions.length === 0 ? (
                        <Text style={styles.noRecipesText}>No additional suggestions found.</Text>
                    ) : (
                        <FlatList
                            data={otherSuggestions}
                            keyExtractor={(recipe) => recipe.idMeal.toString()}
                            horizontal
                            renderItem={({ item: recipe }) => (
                                <TouchableOpacity
                                    style={styles.recipeCard}
                                    onPress={() =>
                                        navigation.navigate('RecipeDetails', { id: recipe.idMeal })
                                    }
                                >
                                    <Image
                                        source={{ uri: recipe.strMealThumb }}
                                        style={styles.recipeImage}
                                    />
                                    <Text style={styles.recipeTitle}>{recipe.strMeal}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#111',
    },
    bestMatchContainer: {
        marginBottom: 20,
    },
    bestMatchTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    recipeCardLarge: {
        backgroundColor: '#222',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
    },
    recipeImageLarge: {
        width: '100%',
        height: 200,
        borderRadius: 10,
    },
    otherSuggestionsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    recipeCard: {
        backgroundColor: '#222',
        marginRight: 10,
        borderRadius: 10,
        padding: 10,
        width: 150,
        alignItems: 'center',
    },
    recipeImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    recipeTitle: {
        color: '#fff',
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
    },
    noRecipesText: {
        color: 'gray',
        marginTop: 20,
        textAlign: 'center',
    },
});

export default RecipesScreen;


// import React, { useState, useEffect, useContext } from 'react';
// import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import { GroceryContext } from '../context/GroceryContext';
// import { useNavigation } from '@react-navigation/native';

// const SPOONACULAR_API_KEY = 'd1e1e86a70c346fc91e8549bc98e6441';

// const RecipesScreen = () => {
//     const { items } = useContext(GroceryContext);
//     const [recipes, setRecipes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const navigation = useNavigation();

//     useEffect(() => {
//         const fetchRecipes = async () => {
//             if (items.length === 0) {
//                 setRecipes([]);
//                 setLoading(false);
//                 return;
//             }
    
//             try {
//                 const ingredients = items.map(item => item.name).join(',+');
    
//                 // 🍴 First: Try Spoonacular
//                 const spoonacularResponse = await fetch(
//                     `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&ranking=1&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`
//                 );
//                 const spoonacularData = await spoonacularResponse.json();
    
//                 if (spoonacularData && spoonacularData.length > 0) {
//                     // Sort recipes by the number of ingredients matched and take the top 5
//                     const sortedRecipes = spoonacularData
//                         .sort((a, b) => b.usedIngredientCount - a.usedIngredientCount)
//                         .slice(0, 5);
    
//                     setRecipes(sortedRecipes.map(r => ({ 
//                         id: r.id, 
//                         title: r.title, 
//                         image: r.image, 
//                         source: 'spoonacular' 
//                     })));
//                 } else {
//                     // 🍛 Fallback: TheMealDB
//                     let allMeals = [];
//                     let seenIds = new Set();
    
//                     for (let item of items) {
//                         const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${item.name}`);
//                         const data = await res.json();
    
//                         if (data.meals) {
//                             data.meals.forEach(meal => {
//                                 if (!seenIds.has(meal.idMeal)) {
//                                     seenIds.add(meal.idMeal);
//                                     allMeals.push({ 
//                                         id: meal.idMeal, 
//                                         title: meal.strMeal, 
//                                         image: meal.strMealThumb, 
//                                         source: 'themealdb' 
//                                     });
//                                 }
//                             });
//                         }
//                     }
    
//                     // Limit the meals to 5 and set them
//                     setRecipes(allMeals.slice(0, 5));
//                 }
//             } catch (error) {
//                 console.error('Error fetching recipes:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
    
//         fetchRecipes();
//     }, [items]);
    

//     return (
//         <View style={styles.container}>
//             {loading ? (
//                 <ActivityIndicator size="large" color="#007bff" />
//             ) : (
//                 <>
//                     <Text style={styles.title}>Top 5 Recipes from Your Ingredients</Text>
//                     {recipes.length === 0 ? (
//                         <Text style={styles.noRecipesText}>No recipes found.</Text>
//                     ) : (
//                         <FlatList
//                             data={recipes}
//                             keyExtractor={(recipe) => recipe.id.toString()}
//                             renderItem={({ item }) => (
//                                 <TouchableOpacity
//                                     style={styles.recipeCard}
//                                     onPress={() =>
//                                         navigation.navigate('RecipeDetails', { id: item.id })
//                                     }
//                                 >
//                                     <Image
//                                         source={{ uri: item.image }}
//                                         style={styles.recipeImage}
//                                     />
//                                     <Text style={styles.recipeTitle}>{item.title}</Text>
//                                 </TouchableOpacity>
//                             )}
//                         />
//                     )}
//                 </>
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 20, backgroundColor: '#111' },
//     title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
//     recipeCard: {
//         backgroundColor: '#222',
//         borderRadius: 10,
//         marginBottom: 15,
//         padding: 10,
//         alignItems: 'center',
//     },
//     recipeImage: {
//         width: '100%',
//         height: 150,
//         borderRadius: 10,
//     },
//     recipeTitle: {
//         color: '#fff',
//         fontSize: 16,
//         marginTop: 8,
//         textAlign: 'center',
//     },
//     noRecipesText: {
//         color: 'gray',
//         textAlign: 'center',
//         marginTop: 30,
//     },
// });

// export default RecipesScreen;


