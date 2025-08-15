// modules/favorites.js
const FAVORITES_KEY = 'favoriteRecipes';

export const getFavorites = () => {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
};

export const saveFavorite = (mealID) => {
    const favorites = getFavorites();
    if (!favorites.includes(mealID)) {
        favorites.push(mealID);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        return true;
    }
    return false;
};