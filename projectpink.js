$.ajax({
  url: "https://www.omdbapi.com/?t=inception&y=&plot=short&apikey=trilogy",
  method: "GET"
}).then(function(response) {
  console.log(response);
  var containerDiv = $(".container");

  var titleDiv = $("<div>").text(response.Title);
  var yearDiv = $("<div>").text(response.Year);
  var actorsDiv = $("<div>").text(response.Actors);
  var genreDiv = $("<div>").text(response.Genre);

  containerDiv.append(titleDiv, yearDiv, actorsDiv, genreDiv);
});

$.ajax({
  url: "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=vodka",
  method: "GET"
}).then(function(response) {
  console.log(response);
});
