// script.js (Main Controller)
import * as api from './modules/api.js';
import * as ui from './modules/ui.js';
import { getFavorites } from './modules/favorites.js';

// --- DOM Elements ---
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const categoryFilter = document.getElementById('categoryFilter');
const showFavoritesBtn = document.getElementById('showFavoritesBtn');
const recipeGrid = document.getElementById('recipe-grid');
const paginationContainer = document.getElementById('pagination-container');

// --- State Management ---
let allRecipes = [];
let currentPage = 1;
const recipesPerPage = 12;

// --- Functions ---
const handleSearch = async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    ui.showLoadingState();
    ui.updateHeading(`Searching for "${query}"...`);
    
    // Search by name and ingredient and combine results
    const nameResults = await api.fetchRecipesByName(query);
    const ingredientResults = await api.fetchRecipesByIngredient(query);
    
    // Combine and remove duplicates
    const combined = [...(nameResults || []), ...(ingredientResults || [])];
    const uniqueRecipes = Array.from(new Set(combined.map(r => r.idMeal)))
                           .map(id => combined.find(r => r.idMeal === id));

    allRecipes = uniqueRecipes;
    currentPage = 1;
    renderPage(currentPage);
    ui.updateHeading(`Showing results for "${query}"`);
};

const handleCategoryFilter = async (e) => {
    const category = e.target.value;
    if (!category) return;

    ui.showLoadingState();
    ui.updateHeading(`Fetching ${category} recipes...`);
    allRecipes = await api.fetchRecipesByCategory(category);
    currentPage = 1;
    renderPage(currentPage);
    ui.updateHeading(`Showing ${category} recipes`);
};

const handleRandomRecipe = async () => {
    ui.showLoadingState();
    ui.updateHeading('Finding a surprise recipe...');
    const recipe = await api.fetchRandomRecipe();
    allRecipes = [recipe];
    currentPage = 1;
    renderPage(currentPage);
    ui.updateHeading('Your Random Recipe!');
};

const displayFavorites = async () => {
    ui.showLoadingState();
    ui.updateHeading("Loading your favorites...");
    const favIds = getFavorites();
    if (favIds.length === 0) {
        ui.updateHeading("You have no favorite recipes yet.");
        recipeGrid.innerHTML = '';
        paginationContainer.innerHTML = '';
        return;
    }
    const favRecipes = await Promise.all(favIds.map(id => api.fetchRecipeDetails(id)));
    allRecipes = favRecipes;
    currentPage = 1;
    renderPage(currentPage);
    ui.updateHeading("Your Favorite Recipes ❤️");
};

// --- Pagination Logic ---
const renderPage = (page) => {
    const start = (page - 1) * recipesPerPage;
    const end = page * recipesPerPage;
    const recipesToShow = allRecipes.slice(start, end);
    ui.displayRecipes(recipesToShow);
    renderPaginationControls();
};

const renderPaginationControls = () => {
    const totalPages = Math.ceil(allRecipes.length / recipesPerPage);
    paginationContainer.innerHTML = '';
    if (totalPages <= 1) return;

    if (currentPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '◀ Previous';
        prevBtn.classList.add('pagination-btn');
        prevBtn.addEventListener('click', () => {
            currentPage--;
            renderPage(currentPage);
        });
        paginationContainer.appendChild(prevBtn);
    }

    if (currentPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next ▶';
        nextBtn.classList.add('pagination-btn');
        nextBtn.addEventListener('click', () => {
            currentPage++;
            renderPage(currentPage);
        });
        paginationContainer.appendChild(nextBtn);
    }
};


// --- Event Listeners ---
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (e) => e.key === 'Enter' && handleSearch());
randomBtn.addEventListener('click', handleRandomRecipe);
categoryFilter.addEventListener('change', handleCategoryFilter);
showFavoritesBtn.addEventListener('click', displayFavorites);
recipeGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.recipe-card');
    if (card) {
        ui.showRecipeModal(card.dataset.mealId);
    }
});

// --- Initial Load ---
const initializeApp = async () => {
    const categories = await api.fetchCategories();
    ui.populateCategoryFilter(categories);
};

initializeApp();