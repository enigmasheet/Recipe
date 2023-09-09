// Define global variables
let recipes = [];
let currentCategory = 'All';
let recipeContainer; // Define the recipeContainer variable

// Function to add a new recipe
function addRecipe(recipeData) {
    recipes.push(recipeData);
    saveRecipesToJSON();
    displayRecipes(currentCategory); // Refresh the recipes display
}

// Function to save recipes to JSON in localStorage
function saveRecipesToJSON() {
    const recipesJSON = JSON.stringify(recipes);
    localStorage.setItem('recipes', recipesJSON);
}

// Function to load recipes from JSON in localStorage
function loadRecipesFromJSON() {
    const recipesJSON = localStorage.getItem('recipes');
    if (recipesJSON) {
        recipes = JSON.parse(recipesJSON);
    }
}

// Function to display recipes based on category
function displayRecipes(category) {
    recipeContainer.innerHTML = ' '; // Clear existing content

    const filteredRecipes = recipes.filter(
        recipe => category === 'All' || recipe.recipeCategory === category
    );

    if (filteredRecipes.length === 0) {
        recipeContainer.innerHTML = '<p>No recipes available in this category.</p>';
    } else {
        filteredRecipes.forEach((recipe, index) => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('recipe-card');
            recipeCard.innerHTML = `
                <h3>${recipe.recipeName}</h3>
                <img src="${recipe.recipeImage}" alt="${recipe.recipeName}">
                <p><strong>Category:</strong> ${recipe.recipeCategory}</p>
                <p><strong>Ingredients:</strong></p>
                <ul>${Array.isArray(recipe.recipeIngredients) ? recipe.recipeIngredients.map(ingredient => `<li>${ingredient}</li>`).join('') : ''}</ul>
                <p><strong>Instructions:</strong></p>
                <ol>${Array.isArray(recipe.recipeInstructions) ? recipe.recipeInstructions.map(instruction => `<li>${instruction}</li>`).join('') : ''}</ol>
                <button class="delete-recipe" data-index="${index}">Delete</button>
            `;
            recipeContainer.appendChild(recipeCard);

            // Add event listener to the delete button
            const deleteButton = recipeCard.querySelector('.delete-recipe');
            deleteButton.addEventListener('click', () => {
                deleteRecipe(index);
            });
        });
    }
}

// Function to delete a recipe by index
function deleteRecipe(index) {
    if (index >= 0 && index < recipes.length) {
        recipes.splice(index, 1);
        saveRecipesToJSON();
        displayRecipes(currentCategory);
    }
}

// Function to handle category selection and update the display
function selectCategory(category) {
    currentCategory = category;
    displayRecipes(category);
}

// Event listener for category links
document.querySelectorAll('.category').forEach(categoryLink => {
    categoryLink.addEventListener('click', event => {
        const category = event.target.textContent;
        selectCategory(category);
    });
});

// Add event listener to the container for all "Recipe Detail" buttons
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('toggle-details')) {
        const index = event.target.getAttribute('data-index');
        const detailsDiv = event.target.nextElementSibling; // Get the next sibling (recipe-details div)

        // Toggle the visibility of the details div
        if (detailsDiv.style.display === 'none' || detailsDiv.style.display === '') {
            detailsDiv.style.display = 'block';
        } else {
            detailsDiv.style.display = 'none';
        }
    }
});

// Add a submit event listener to the form
// Add a submit event listener to the form
const recipeForm = document.getElementById('recipe-form');
if (recipeForm) {
    recipeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(recipeForm);

        // Convert form data to a recipe object
        const recipeData = {
            recipeName: formData.get('recipeName'),
            recipeImage: formData.get('recipeImage'),
            recipeCategory: formData.get('recipeCategory'),
            recipeIngredients: formData
                .get('recipeIngredients')
                .split('\n')
                .map((ingredient) => ingredient.trim()), // Split ingredients by lines
            recipeInstructions: formData
                .get('recipeInstructions')
                .split('\n')
                .map((instruction) => instruction.trim()), // Split instructions by lines
        };
        const notification = document.getElementById('notification');
    notification.textContent = 'Recipe added successfully!';
    setTimeout(() => {
        notification.textContent = '';
    }, 3000); // Clear the notification after 3 seconds

        addRecipe(recipeData);
        recipeForm.reset();
    });
   recipeForm.addEventListener('Add Recipe', (event) => {
        recipeForm.reset();
   });
}



// Load recipes when the page loads
document.addEventListener('DOMContentLoaded', () => {
    recipeContainer = document.getElementById('recipe-container'); // Define recipeContainer
    loadRecipesFromJSON();
    displayRecipes(currentCategory);
});
