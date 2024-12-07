async function fetchFavoriteRecipes() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const recipes = await Promise.all(favorites.map(id => fetchRecipeById(id)));
    return recipes.filter(recipe => recipe !== null); // Filter out null results
}

async function fetchRecipeById(recipeId) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error('Error fetching recipe:', error);
        return null; // Return null on error to handle gracefully
    }
}

async function renderFavoriteRecipes() {
    const favoriteRecipes = await fetchFavoriteRecipes();
    const resultsDiv = document.getElementById('favorite-results');
    resultsDiv.innerHTML = '';

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
                    <p class="card-text">${recipe.strInstructions.substring(0, 100)}...</p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-outline-danger w-100" onclick="removefav('${recipe.idMeal}')">Remove Fav</button>
                   <button class="btn btn-outline-secondary w-100" onclick="viewRecipe('${recipe.idMeal}')">View All</button>

                </div>
            </div>
        `;
        resultsDiv.appendChild(recipeCard);
    });
}

function removefav(recipeId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(id => id !== recipeId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderFavoriteRecipes();
}

function goBack() {
    window.location.href = 'index.html';
}

// Initialize the rendering of favorite recipes
renderFavoriteRecipes();
