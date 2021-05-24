var $startQuizButton = document.querySelector('.start-quiz-button');
var $restartQuizButton = document.querySelector('.restart-quiz-button');
var $pageContainer = document.getElementsByClassName('page-container');
var $question1 = document.querySelector('.question-1-details');
var $question2 = document.querySelector('.question-2-details');
var $recommendedDishWrapper = document.querySelector('.recommended-dish-wrapper');
var $favoritesButton = document.querySelector('.nav-favorite-button');
var $favoritedDish = document.querySelector('.favorited-dish');
var $modalContainer = document.querySelector('.modal-container');
var $modalCloseButton = document.querySelector('.close-modal-button');
var $viewFavoriteButton = document.querySelector('.view-favorites-button');

var mealType = null;
var cuisineType = null;
var clickCounter = 0;

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
      isFavorite: false,
      recipeId: data.nextRecipeId
    };
    data.nextRecipeId++;
    data.recipes.unshift(recipeObj);
    $recommendedDishWrapper.prepend(recommendedDish(recipeObj, recipeObj.isFavorite));
  });
  xhrRequest.send();
}

function recommendedDish(recipeObj, isFavorite) {
  if (!recipeObj) {
    return;
  }

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
  $favoriteIcon.setAttribute('class', 'fas fa-heart');
  $favoriteIcon.setAttribute('data-view', recipeObj.recipeId);
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
  clickCounter = 0;
}

function renderFavorites() {
  $favoritedDish.innerHTML = '';
  for (var i = 0; i < data.recipes.length; i++) {
    if (!data.recipes[i]) {
      return;
    }
    $favoritedDish.appendChild(recommendedDish(data.recipes[i], true));
  }
}

function showModal() {
  $modalContainer.classList.remove('hidden');
}

function hideModal() {
  $modalContainer.classList.add('hidden');
}

function addFavorite(event) {
  if (event.target.matches('i')) {
    if (clickCounter === 0) {
      clickCounter += 1;
      event.target.classList.add('favorited');
      var recipe = data.recipes.concat(data.recipes[0]);
      data.recipes = recipe;
      $favoritedDish.prepend(recommendedDish(data.recipes[0], true));
    } else {
      showModal();
    }
  }
}

function removeFavorite(event) {
  if (event.target.matches('i')) {
    for (var i = 0; i < data.recipes.length; i++) {
      var recipeId = parseInt(event.target.getAttribute('data-view'));
      if (data.recipes[i].recipeId === recipeId) {
        $favoritedDish.removeChild($favoritedDish.children[i]);
        data.recipes.splice(i, 1);
        return;
      }
    }
  }
}

$question1.addEventListener('click', setMealAndCusineInfo);
$question2.addEventListener('click', setMealAndCusineInfo);
$startQuizButton.addEventListener('click', getDataValue);
$restartQuizButton.addEventListener('click', resetData);
$favoritesButton.addEventListener('click', getDataValue);
$recommendedDishWrapper.addEventListener('click', addFavorite);
$favoritedDish.addEventListener('click', removeFavorite);
$modalCloseButton.addEventListener('click', hideModal);
$viewFavoriteButton.addEventListener('click', getDataValue);
renderFavorites();
