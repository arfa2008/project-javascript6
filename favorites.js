// Function to fetch the favorite recipes
async function fetchFavoriteRecipes() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const recipes = await Promise.all(favorites.map(id => fetchRecipeById(id)));
    return recipes;
}

// Function to fetch a recipe by ID
async function fetchRecipeById(recipeId) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null; // Return the first meal or null if not found
}

// Function to render favorite recipes
async function renderFavoriteRecipes() {
    const favoriteRecipes = await fetchFavoriteRecipes();
    const resultsDiv = document.getElementById('favorite-results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (!favoriteRecipes.length) {
        resultsDiv.innerHTML = '<p class="text-center text-white">No favorite recipes found</p>';
        return;
    }

    favoriteRecipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('col-md-4');

        recipeCard.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${recipe.strMealThumb}" class="card-img-top" alt="${recipe.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${recipe.strMeal}</h5>
                 <p class="card-text">${recipe.strInstructions}</p>
                </div>
                <div class="card-footer">
                              <button class="btn btn-outline-danger w-100" onclick="removefav('${recipe.idMeal}')">Remove Fav</button>
                </div>
            </div>
        `;
        resultsDiv.appendChild(recipeCard);
    });
}
// Function to remove a recipe from favorites
function removefav(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    // Filter out the recipe ID
    favorites = favorites.filter(id => id !== recipeId);

    // Save the updated favorites list back to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Re-render the favorite recipes
    renderFavoriteRecipes();
}


// Function to go back to the main page
function goBack() {
    window.location.href = 'index.html'; // Redirect to main page
}

// Call the function to render favorite recipes when the page loads
renderFavoriteRecipes();

