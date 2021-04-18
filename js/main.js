var $mealTypeForm = document.getElementById('meal-type-form');
var $cuisineTypeForm = document.getElementById('cuisine-type-form');
var $mealType = document.getElementsByName('meal-type');
var $cuisineType = document.getElementsByName('cuisine-type');
var $startQuizButton = document.querySelector('.start-quiz-button');
var $restartQuizButton = document.querySelector('.restart-quiz-button');
var $homePage = document.querySelector('.hero-container');
var $form1 = document.querySelector('.question-1-container');
var $form2 = document.querySelector('.question-2-container');
var $recommendedDishContainer = document.querySelector('.recommended-dish-container');
var $dishDescription = document.querySelector('.dish-description');
var $dishImageWrapper = document.querySelector('.dish-image-wrapper');

var mealType = null;
var cuisineType = null;

function getRecipeData(mealType, cusineType) {
  var xhrRequest = new XMLHttpRequest();
  xhrRequest.open('GET', 'https://api.edamam.com/search?app_id=56d29915&app_key=8a2c94a84e7c4a5a2c94ff997508b44b&from=0&to=20&q=&mealType=' + mealType + '&cuisineType=' + cusineType);
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
      instructionsUrl: getInstructionsUrl
    };

    recommendedDish(recipeObj);
  });
  xhrRequest.send();
}

function recommendedDish(recipeObj) {
  var $dishImage = document.createElement('img');
  $dishImage.setAttribute('class', 'dish-image');
  $dishImage.src = recipeObj.imageUrl;
  $dishImageWrapper.appendChild($dishImage);

  var $recipeName = document.createElement('h2');
  $recipeName.textContent = recipeObj.name;
  $dishDescription.appendChild($recipeName);

  var $ingredientHeading = document.createElement('p');
  $ingredientHeading.textContent = 'Ingredients';
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

}

function setMealAndCusineInfo(event) {
  event.preventDefault();
  if (event.target.getAttribute('id') === 'meal-type-form') {
    for (var mealIndex = 0; mealIndex < $mealType.length; mealIndex++) {
      if ($mealType[mealIndex].checked) {
        mealType = $mealType[mealIndex].getAttribute('id');
      }
    }
    changeView('question-2');
  } else if (event.target.getAttribute('id') === 'cuisine-type-form') {
    for (var cuisineIndex = 0; cuisineIndex < $cuisineType.length; cuisineIndex++) {
      if ($cuisineType[cuisineIndex].checked) {
        cuisineType = $cuisineType[cuisineIndex].getAttribute('id');
      }
    }
    changeView('recommended-dish');
  }
  checkMealAndCusineInfo();
}

function checkMealAndCusineInfo(event) {
  if (mealType && cuisineType) {
    getRecipeData(mealType, cuisineType);
  }
}

function changeView(view) {
  if (view === 'home-page') {
    $recommendedDishContainer.classList.add('hidden');
    $homePage.classList.remove('hidden');
  } else if (view === 'question-1') {
    $homePage.classList.add('hidden');
    $form1.classList.remove('hidden');
  } else if (view === 'question-2') {
    $form1.classList.add('hidden');
    $form2.classList.remove('hidden');
  } else if (view === 'recommended-dish') {
    $form2.classList.add('hidden');
    $recommendedDishContainer.classList.remove('hidden');
  }
}

function getDataValue() {
  var dataView = event.target.getAttribute('data-view');
  changeView(dataView);
}

$mealTypeForm.addEventListener('submit', setMealAndCusineInfo);
$cuisineTypeForm.addEventListener('submit', setMealAndCusineInfo);
$startQuizButton.addEventListener('click', getDataValue);
$restartQuizButton.addEventListener('click', getDataValue);
