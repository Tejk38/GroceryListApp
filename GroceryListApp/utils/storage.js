import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@grocery_list';

export const saveList = async (list) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save list:', e);
  }
};


export const loadList = async () => {
  try {
    const list = await AsyncStorage.getItem(STORAGE_KEY);
    return list ? JSON.parse(list) : [];
  } catch (e) {
    console.error('Failed to load list:', e);
    return [];
  }
};