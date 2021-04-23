/* exported data */
var data = {
  view: 'favorites',
  recipes: [],
  nextRecipeId: 1
};

var previousDataJSON = localStorage.getItem('recipe-favorites-local-storage');
if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
}

window.addEventListener('beforeunload', function (event) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('recipe-favorites-local-storage', dataJSON);
});
