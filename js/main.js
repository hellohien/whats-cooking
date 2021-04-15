function getDishData(mealType, mainIngredient) {
  var xhrObj = new XMLHttpRequest();
  xhrObj.open('GET', 'https://api.edamam.com/search?app_id=56d29915&app_key=8a2c94a84e7c4a5a2c94ff997508b44b&from=0&to=3&calories=591-722&health=alcohol-free&mealType=' + mealType + '&q=' + mainIngredient);
  xhrObj.responseType = 'json';
  xhrObj.addEventListener('load', function () {
    console.log(xhrObj.status);
    console.log(xhrObj.response);
  });
  xhrObj.send();
}

getDishData('breakfast', 'chicken');
