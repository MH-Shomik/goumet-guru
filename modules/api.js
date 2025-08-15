// modules/api.js
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const fetchRecipesByIngredient = async (query) => {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${query}`);
    const data = await response.json();
    return data.meals || [];
};

export const fetchRecipesByName = async (query) => {
    const response = await fetch(`${API_BASE_URL}/search.php?s=${query}`);
    const data = await response.json();
    return data.meals || [];
};

export const fetchRecipesByCategory = async (category) => {
    const response = await fetch(`${API_BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
};

export const fetchRecipeDetails = async (mealID) => {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${mealID}`);
    const data = await response.json();
    return data.meals[0];
};

export const fetchRandomRecipe = async () => {
    const response = await fetch(`${API_BASE_URL}/random.php`);
    const data = await response.json();
    return data.meals[0];
};

export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories.php`);
    const data = await response.json();
    return data.categories || [];
};