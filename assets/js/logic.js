// mapping of known genres/spirits
const resultsArr = [
  {
    genre: "thriller",
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

// =======================================================================
// BEGIN CORE LOGIC
// =======================================================================

function search(event) {
  clearDisplay();

  // prevents submit button from trying to submit form
  event.preventDefault();

  // movie user entered
  // TODO what if movie is empty?
  const movie = $("#search-input").val();
  console.log(movie);
  console.log("anything" + event.target);

  // this is a function that performs the API call to OMDB
  let response = OMDBquery(movie);

  // If response is found in OMDB
  if (response) {
    // TODO get the genre from the response
    let genre = undefined;

    if (genre) {
      // movie/genre is good - update the div with the movie information
      updateMovieDiv(response);

      let spirit = getSpiritForGenre(genre.toLowerCase());
      if (spirit) {
        // this is a function that performs the API call to CocktailDB
        let response = cocktailDBquery(spirit);

        // If response is found in CocktailDB
        if (response) {
          updateDrinkDiv(response);
        } else {
          // error case
          let message = `Drink not found for ${spirit}`;
          updateErrorDiv(message);
        }
      } else {
        // error case
        let message = `Spirit not found for ${genre}`;
        updateErrorDiv(message);
      }
    } else {
      // error case
      let message = `Genre not found for ${movie}`;
      updateErrorDiv(message);
    }
  } else {
    // error case
    let message = `${movie} was not found in OMDB`;
    updateErrorDiv(message);
  }
}

function getSpiritForGenre(genreData) {
  for (let i = 0; i < resultsArr.length; i++) {
    if (genreData == resultsArr[i].genre) {
      return resultsArr[i].spirit;
    }
  }
  return undefined;
}

// =======================================================================
// END CORE LOGIC
// =======================================================================

// =======================================================================
// BEGIN AJAX STUFF
// =======================================================================

function OMDBquery(movie) {
  const queryURL =
    "https://www.omdbapi.com/?t=" + movie + "=&plot=short&apikey=trilogy";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    //var genre = response.Genre.split(", ")[0];
    //this is handling if there is no response back from the API
    //let response = undefined;
    console.log(response);
    return response;
  });
}

function cocktailDBquery(spirit) {
  // ==========================================
  const drinkURL =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + spirit;

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
    }).then(function(response2, error) {
      const ingredient =
        response2.drinks[Math.floor(Math.random() * response2.drinks.length)]
          .strIngredient1;
      console.log(ingredient);
      // if (error) {
      //     $("#error-div").text("Drink not found");
      // }

      return response;
    });
    //this is handling if there is no response back from the API
    let response = undefined;
  });
}
// =======================================================================
// END AJAX STUFF
// =======================================================================

// =======================================================================
// BEGIN HTML STUFF
// =======================================================================

function clearDisplay() {
  //clears inputs from previous searches
  $("#search-input").text("");
  $("#movie-div").text("");
  $("#drink-div").text("");
  $("#error-div").text("");
}

function updateMovieDiv(response) {
  // TODO implement
  // $("#movie-div").text(the content we build);
  var containerDiv = $("#movie-div");

  var titleDiv = $("<h2>").text(response.Title);
  var yearDiv = $("<div>").text(response.Year);
  var actorsDiv = $("<div>").text(response.Actors);
  var plotDiv = $("<p>").text(response.Plot);
  var genreDiv = $("<div>").text(response.genre);

  containerDiv.append(titleDiv, yearDiv, actorsDiv, genreDiv);
}

function updateDrinkDiv(response) {
  var ContainerDrinkDiv = $("#drink-div");

  var titleDrinkDiv = $("<div>").text(response.Title);
  var recipeDiv = $("<div>").text(response.recipe);
  var imgDiv = $("<img>").attr("src", response.img);
}

function updateErrorDiv(message) {
  // $("#error-div").text(message);
}

// on submit search function is run
$("#submit-form").on("submit", search);

// =======================================================================
// END HTML STUFF
// =======================================================================
// make sure the display is clear when the page loads
clearDisplay();
