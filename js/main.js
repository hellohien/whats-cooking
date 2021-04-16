var $mealTypeForm = document.getElementById('meal-type-form');
var $mealType = document.getElementsByName('meal-type');
var $startQuizButton = document.querySelector('.start-quiz-button');
var $homePage = document.querySelector('.hero-container');
var $form1 = document.querySelector('.question-1-container');
var $form2 = document.querySelector('.question-2-container');

function getRecipeData(mealType) {
  var xhrObj = new XMLHttpRequest();
  xhrObj.open('GET', 'https://api.edamam.com/search?app_id=56d29915&app_key=8a2c94a84e7c4a5a2c94ff997508b44b&q=&mealType=' + mealType);
  xhrObj.responseType = 'json';
  xhrObj.addEventListener('load', function () {
    console.log('xhrstatus', xhrObj.status);
    console.log('xhresponse', xhrObj.response);
  });
  xhrObj.send();
}

function submitAnswers(event) {
  event.preventDefault();
  var mealType = null;
  if (event.target.getAttribute('id') === 'meal-type-form') {
    for (var i = 0; i < $mealType.length; i++) {
      if ($mealType[i].checked) {
        mealType = $mealType[i].getAttribute('id');
      }
    }
    getRecipeData(mealType);
  }
  changeView('question-2');
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

$mealTypeForm.addEventListener('submit', submitAnswers);
$startQuizButton.addEventListener('click', changeView);
