var $mealTypeForm = document.getElementById('meal-type-form');
var $mealType = document.getElementsByName('meal-type');

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
}

$mealTypeForm.addEventListener('submit', submitAnswers);
