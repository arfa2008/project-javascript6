
async function fetchRecipes(query = '') {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await response.json();
    return data.meals;
}

function renderRecipes(recipes) {
    const resultsDiv = document.getElementById('recipe-results');
    resultsDiv.innerHTML = ''; 

    if (!recipes) {
        resultsDiv.innerHTML = '<p class="text-center text-white">No recipes found</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('col-md-4', 'mb-4'); 

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

function viewRecipe(recipeId) {
    window.location.href = `recipe.html?id=${recipeId}`; 
}

async function loadAllRecipes() {
    const recipes = await fetchRecipes(); 
    renderRecipes(recipes); 
}
