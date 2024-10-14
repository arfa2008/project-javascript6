// Function to get query parameters from the URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Function to fetch a recipe by ID
async function fetchRecipeById(recipeId) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null; // Return the first meal or null if not found
}

// Function to render the full recipe details
async function renderRecipeDetails() {
    const recipeId = getQueryParam('id');
    const recipe = await fetchRecipeById(recipeId);
    
    if (recipe) {
        const titleElement = document.getElementById('recipe-title');
        const detailsElement = document.getElementById('recipe-details');

        titleElement.innerText = recipe.strMeal;
        detailsElement.innerHTML = `
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="width: 36%;">
            <div class="element">
            <h3 class="instruction">Instructions:</h3>
            <p>${recipe.strInstructions}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${getIngredientsList(recipe).join('')}
            </ul>
            </div>
        `;
    } else {
        document.getElementById('recipe-details').innerHTML = '<p class="text-center text-white">Recipe not found</p>';
    }
}

// Function to get the list of ingredients
function getIngredientsList(recipe) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`<li>${measure} ${ingredient}</li>`);
        }
    }
    return ingredients;
}

// Function to go back to the previous page
function goBack() {
    window.history.back(); // Go back to the previous page
}

// Call the function to render recipe details when the page loads
renderRecipeDetails();
