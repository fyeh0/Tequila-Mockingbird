$.ajax({
  url: "https://www.omdbapi.com/?t=inception&y=&plot=short&apikey=trilogy",
  method: "GET"
}).then(function(response) {
  console.log(response);
});

$.ajax({
  url: "https://www.thecocktaildb.com/api/json/v1/1/search.php?i=vodka",
  method: "GET"
}).then(function(response) {
  console.log(response);
});
