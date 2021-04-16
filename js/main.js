var $mealTypeForm = document.getElementById('meal-type-form');
var $cuisineTypeForm = document.getElementById('cuisine-type-form');
var $mealType = document.getElementsByName('meal-type');
var $cuisineType = document.getElementsByName('cuisine-type');
var $startQuizButton = document.querySelector('.start-quiz-button');
var $homePage = document.querySelector('.hero-container');
var $form1 = document.querySelector('.question-1-container');
var $form2 = document.querySelector('.question-2-container');

var mealType = null;
var cuisineType = null;

function getRecipeData(mealType, cusineType) {
  var xhrRequest = new XMLHttpRequest();
  xhrRequest.open('GET', 'https://api.edamam.com/search?app_id=56d29915&app_key=8a2c94a84e7c4a5a2c94ff997508b44b&from=0&to=20&q=&mealType=' + mealType + '&cuisineType=' + cusineType);
  xhrRequest.responseType = 'json';
  xhrRequest.addEventListener('load', function () {
    console.log('xhrstatus', xhrRequest.status);
    console.log('xhresponse', xhrRequest.response);
  });
  xhrRequest.send();
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
  }
  checkMealAndCusineInfo();
}

function checkMealAndCusineInfo(event) {
  if (mealType && cuisineType) {
    getRecipeData(mealType, cuisineType);
  }
}

function changeView(view) {
  if ($homePage.getAttribute('data-view') === 'home-page') {
    $homePage.classList.add('hidden');
    $form1.classList.remove('hidden');
  }
  if (view === $form2.dataset.view) {
    $form1.classList.add('hidden');
    $form2.classList.remove('hidden');
  }
}

$mealTypeForm.addEventListener('submit', setMealAndCusineInfo);
$cuisineTypeForm.addEventListener('submit', setMealAndCusineInfo);
$startQuizButton.addEventListener('click', changeView);
