const resultsArr = [
  {
    genre: "action",
    spirit: "bourbon"
  },
  {
    genre: "comedy",
    spirit: "beer"
  },
  {
    genre: "romance",
    spirit: "red wine"
  },
  {
    genre: "horror",
    spirit: "gin"
  },
  {
    genre: "drama",
    spirit: "tequila"
  },
  {
    genre: "crime",
    spirit: "scotch"
  },
  {
    genre: "fantasy",
    spirit: "rum"
  },
  {
    genre: "mystery",
    spirit: "whiskey"
  },
  {
    genre: "family",
    spirit: "juice"
  },
  {
    genre: "musical",
    spirit: "champagne"
  }
];
var spiritName;
$.ajax({
  url: "https://www.omdbapi.com/?t=inception&y=&plot=short&apikey=trilogy",
  method: "GET"
}).then(function(response) {
  var genre = response.Genre.split(", ")[0];
  var containerDiv = $(".container");

  var titleDiv = $("<div>").text(response.Title);
  var yearDiv = $("<div>").text(response.Year);
  var actorsDiv = $("<div>").text(response.Actors);
  var genreDiv = $("<div>").text(genre);

  containerDiv.append(titleDiv, yearDiv, actorsDiv, genreDiv);

  f1(genre);
});
function f1(genre) {
  console.log(genre);
  for (let i = 0; i < resultsArr.length; i++) {
    if (resultsArr[i].genre == genre) {
      spiritName = resultsArr[i].spirit;
      console.log(spiritName + "hello");
    }
  }
  const drinkURL =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=vodka";
  $.ajax({
    url: drinkURL,
    method: "GET"
  }).then(function(response1) {
    const cocktail =
      response1.drinks[Math.floor(Math.random() * response1.drinks.length)]
        .strDrink;
    console.log(cocktail);
    const drinkURL2 =
      "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=" + cocktail;
    $.ajax({
      url: drinkURL2,
      method: "GET"
    }).then(function(response2) {
      const ingredient =
        response2.drinks[Math.floor(Math.random() * response2.drinks.length)]
          .strIngredient1;
      console.log(ingredient);
    });
  });
}
