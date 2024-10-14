// JavaScript

// Function to fetch recipes from TheMealDB API
async function fetchRecipes(query = '') {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    return data.meals;
}

// Function to render recipe data
function renderRecipes(recipes) {
    const resultsDiv = document.getElementById('recipe-results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!recipes) {
        resultsDiv.innerHTML = '<p class="text-center text-white">No recipes found</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('col-md-4', 'mb-4'); // Add Bootstrap classes for styling

        recipeCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${recipe.strMealThumb}" class="card-img-top" alt="${recipe.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.strMeal}</h5>
                    <p class="card-text">${recipe.strInstructions.slice(0, 100)}...</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-outline-primary w-100 me-2" onclick="addToFavorites('${recipe.idMeal}')">Add to Favorites</button>
                    <button class="btn btn-outline-secondary w-100" onclick="viewRecipe('${recipe.idMeal}')">View All</button>
                </div>
            </div>
        `;
        resultsDiv.appendChild(recipeCard);
    });
}

// Function to handle form submission for search
document.getElementById('recipe-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const query = document.getElementById('recipe-name').value.trim();
    if (!query) {
        alert('Please enter a recipe name to search.');
        return;
    }
    const recipes = await fetchRecipes(query);
    renderRecipes(recipes);
});

// Function to add a recipe to favorites (stored in local storage)
function addToFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(recipeId)) {
        favorites.push(recipeId);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('Recipe added to favorites!');
    } else {
        alert('This recipe is already in your favorites!');
    }
}

// Function to view the complete recipe
function viewRecipe(recipeId) {
    window.location.href = `recipe.html?id=${recipeId}`; // Redirect to recipe detail page
}

// Function to load and display all recipes on page load
async function loadAllRecipes() {
    const recipes = await fetchRecipes(); // Fetch all recipes without a search query
    renderRecipes(recipes); // Render all recipes on the page
}
