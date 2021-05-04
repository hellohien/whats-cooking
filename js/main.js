var $startQuizButton = document.querySelector('.start-quiz-button');
var $restartQuizButton = document.querySelector('.restart-quiz-button');
var $pageContainer = document.getElementsByClassName('page-container');
var $question1 = document.querySelector('.question-1-details');
var $question2 = document.querySelector('.question-2-details');
var $recommendedDishWrapper = document.querySelector('.recommended-dish-wrapper');
var $favoritesButton = document.querySelector('.favorites-button');
var $favoritedDish = document.querySelector('.favorited-dish');
var $favoriteButtonIcon = document.getElementsByClassName('fas');

var mealType = null;
var cuisineType = null;

function getRecipeData(mealType, cusineType) {
  var xhrRequest = new XMLHttpRequest();
  xhrRequest.open('GET', 'https://api.edamam.com/search?app_id=56d29915&app_key=8a2c94a84e7c4a5a2c94ff997508b44b&from=0&to=30&q=&mealType=' + mealType + '&cuisineType=' + cusineType);
  xhrRequest.responseType = 'json';
  xhrRequest.addEventListener('load', function () {
    var randomIndex = Math.floor(Math.random() * xhrRequest.response.hits.length);
    var recipeName = xhrRequest.response.hits[randomIndex].recipe.label;
    var ingredients = xhrRequest.response.hits[randomIndex].recipe.ingredientLines;
    var imageSrc = xhrRequest.response.hits[randomIndex].recipe.image;
    var getInstructionsUrl = xhrRequest.response.hits[randomIndex].recipe.url;
    var recipeObj = {
      name: recipeName,
      ingredient: ingredients,
      imageUrl: imageSrc,
      instructionsUrl: getInstructionsUrl,
      isFav: false,
      recipeId: data.nextRecipeId
    };
    data.nextRecipeId++;
    data.recipes.unshift(recipeObj);
    $recommendedDishWrapper.prepend(recommendedDish(recipeObj, recipeObj.isFav));
  });
  xhrRequest.send();
}

function recommendedDish(recipeObj, isFavorite) {
  var $dishWrapper = document.createElement('div');
  $dishWrapper.setAttribute('class', 'row column-full dish-wrapper');

  var $dishImageWrapper = document.createElement('div');
  $dishImageWrapper.setAttribute('class', 'column-half dish-image-wrapper');
  $dishWrapper.appendChild($dishImageWrapper);

  var $dishDescriptionWrapper = document.createElement('div');
  $dishDescriptionWrapper.setAttribute('class', 'column-half dish-description-wrapper');
  $dishWrapper.appendChild($dishDescriptionWrapper);

  var $favoriteIconButton = document.createElement('button');
  $favoriteIconButton.setAttribute('class', 'favorite-button');
  $dishDescriptionWrapper.appendChild($favoriteIconButton);

  var $favoriteIcon = document.createElement('i');
  $favoriteIcon.setAttribute('data-view', recipeObj.recipeId);
  $favoriteIcon.setAttribute('class', 'fas fa-heart');
  $favoriteIconButton.appendChild($favoriteIcon);

  var $dishDescription = document.createElement('div');
  $dishDescription.setAttribute('class', 'dish-description');
  $dishDescriptionWrapper.appendChild($dishDescription);

  var $dishImage = document.createElement('img');
  $dishImage.setAttribute('class', 'dish-image');
  $dishImage.src = recipeObj.imageUrl;
  $dishImageWrapper.appendChild($dishImage);

  var $recipeName = document.createElement('h2');
  $recipeName.textContent = recipeObj.name;
  $dishDescription.appendChild($recipeName);

  var $ingredientHeading = document.createElement('p');
  $ingredientHeading.textContent = 'Ingredients:';
  $dishDescription.appendChild($ingredientHeading);

  var $ingredientList = document.createElement('ul');
  $dishDescription.appendChild($ingredientList);

  for (var k = 0; k < recipeObj.ingredient.length; k++) {
    var $ingredient = document.createElement('li');
    $ingredient.textContent = recipeObj.ingredient[k];
    $ingredientList.appendChild($ingredient);
  }

  var $getInstructionsLink = document.createElement('a');
  $getInstructionsLink.textContent = 'Get Instructions';
  $getInstructionsLink.target = '_blank';
  $getInstructionsLink.setAttribute('class', 'get-instructions-link');
  $getInstructionsLink.href = recipeObj.instructionsUrl;
  $dishDescription.appendChild($getInstructionsLink);

  if (isFavorite) {
    $favoriteIcon.classList.add('favorited');
  }

  return $dishWrapper;
}

function setMealAndCusineInfo(event) {
  if (event.target.className.includes('meal-type')) {
    mealType = event.target.textContent;
    changeView('question-2');
  } else if (event.target.className.includes('cuisine-type')) {
    cuisineType = event.target.textContent;
    changeView('recommended-dish');
  }
  checkMealAndCusineInfo(mealType, cuisineType);
}

function checkMealAndCusineInfo() {
  if (mealType && cuisineType) {
    getRecipeData(mealType, cuisineType);
  }
}

function changeView(view) {
  for (var i = 0; i < $pageContainer.length; i++) {
    if ($pageContainer[i].dataset.view === view) {
      $pageContainer[i].classList.remove('hidden');
    } else {
      $pageContainer[i].classList.add('hidden');
    }
  }
}

function getDataValue() {
  var dataView = event.target.getAttribute('data-view');
  changeView(dataView);
}

function resetData() {
  mealType = null;
  cuisineType = null;
  $recommendedDishWrapper.innerHTML = '';
  changeView('home-page');
}

function addFavorite(event) {
  if (event.target.matches('i')) {
    var recipeId = Number(event.target.getAttribute('data-view'));
    for (var i = 0; i < data.recipes.length; i++) {
      if (data.recipes[i].recipeId === recipeId) {
        console.log('addFavorite');
        event.target.classList.add('favorited');
        data.recipes[i].isFav = true;
        $favoritedDish.prepend(recommendedDish(data.recipes[i], true));
        return;
      }
    }
  }
}

function removeFavorite(event) {
  if (event.target.matches('i')) {
    var recipeId = Number(event.target.getAttribute('data-view'));
    for (var i = 0; i < data.recipes.length; i++) {
      if (data.recipes[i].recipeId === recipeId) {
        console.log('removeFavorite');
        event.target.classList.remove('favorited');

      }
    }
  }
}

function toggleFavorite(event) {
  var recipeId = Number(event.target.getAttribute('data-view'));
  for (var i = 0; i < data.recipes.length; i++) {
    if (data.recipes[i].recipeId === recipeId && data.recipes[i].isFav) {
      removeFavorite(event);
    } else if (data.recipes[i].recipeId === recipeId && !data.recipes[i].isFav) {
      addFavorite(event);
    }
  }
}

function renderFavorites() {
  $favoritedDish.innerHTML = '';
  for (var i = 0; i < data.recipes.length; i++) {
    $favoritedDish.appendChild(recommendedDish(data.recipes[i], true));
    $favoriteButtonIcon[i].classList.add('favorited');
  }
}

$question1.addEventListener('click', setMealAndCusineInfo);
$question2.addEventListener('click', setMealAndCusineInfo);
$startQuizButton.addEventListener('click', getDataValue);
$restartQuizButton.addEventListener('click', resetData);
$favoritesButton.addEventListener('click', getDataValue);
$recommendedDishWrapper.addEventListener('click', toggleFavorite);
$favoritedDish.addEventListener('click', removeFavorite);
window.addEventListener('DOMContentLoaded', function () {
  for (var i = 0; i < data.recipes.length; i++) {
    if (data.recipes.length !== 0) {
      data.recipes.splice(i, 1);
      $favoritedDish.children[i].remove();
    }
  }
});
renderFavorites();
