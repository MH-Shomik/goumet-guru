// modules/ui.js
import { fetchRecipeDetails } from './api.js';
import { getFavorites, saveFavorite } from './favorites.js';

const recipeGrid = document.getElementById('recipe-grid');
const resultsHeading = document.getElementById('results-heading');
const modal = document.getElementById('recipe-modal');
const modalBody = document.getElementById('modal-body');
const categoryFilter = document.getElementById('categoryFilter');

export const showLoadingState = () => {
    recipeGrid.innerHTML = Array.from({ length: 9 }).map(() => `
        <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-text"></div>
        </div>
    `).join('');
};

export const displayRecipes = (recipes) => {
    if (!recipes || recipes.length === 0) {
        resultsHeading.textContent = `No recipes found. Try another search!`;
        recipeGrid.innerHTML = '';
        return;
    }
    recipeGrid.innerHTML = recipes.map(recipe => `
        <div class="recipe-card" data-meal-id="${recipe.idMeal}">
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
            <h3>${recipe.strMeal}</h3>
        </div>
    `).join('');
};

export const showRecipeModal = async (mealID) => {
    const recipe = await fetchRecipeDetails(mealID);
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (recipe[`strIngredient${i}`]) {
            ingredients.push(`${recipe[`strIngredient${i}`]} - ${recipe[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }

    const isSaved = getFavorites().includes(recipe.idMeal);
    modalBody.innerHTML = `
        <h2>${recipe.strMeal}</h2>
        <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        <h3>Ingredients:</h3>
        <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
        <h3>Instructions:</h3>
        <p>${recipe.strInstructions}</p>
        <button id="save-to-favorites-btn" class="${isSaved ? 'saved' : ''}" data-meal-id="${recipe.idMeal}">
            ${isSaved ? '✔ Saved' : 'Save to Favorites ❤️'}
        </button>
    `;
    modal.style.display = 'block';

    if (!isSaved) {
        document.getElementById('save-to-favorites-btn').addEventListener('click', (e) => {
            saveFavorite(recipe.idMeal);
            e.target.textContent = '✔ Saved';
            e.target.classList.add('saved');
            e.target.disabled = true;
        });
    }
};

export const populateCategoryFilter = (categories) => {
    categoryFilter.innerHTML += categories.map(cat => 
        `<option value="${cat.strCategory}">${cat.strCategory}</option>`
    ).join('');
};

export const updateHeading = (text) => {
    resultsHeading.textContent = text;
};

// Close modal logic
const modalCloseBtn = document.querySelector('.close-btn');
modalCloseBtn.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
});

