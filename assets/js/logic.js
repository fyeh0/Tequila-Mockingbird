// mapping of known genres/spirits
const resultsArr = [
  {
    genre: "sci-fi",
    spirit: "rum"
  },
  {
    genre: "action",
    spirit: "vodka"
  },
  {
    genre: "western",
    spirit: "whiskey"
  },
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
    spirit: "champagne"
  },
  {
    genre: "horror",
    spirit: "gin"
  },
  {
    genre: "drama",
    spirit: "red wine"
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
    spirit: "tequila"
  },
  {
    genre: "musical",
    spirit: "champagne"
  }
];

// =======================================================================
// BEGIN CORE LOGIC
// =======================================================================
$('.carousel').carousel({
  interval: 3000
})

function search(event) {
  clearDisplay();

  // prevents submit button from trying to submit form
  event.preventDefault();

  // movie user entered
  const movie = $("#search-input").val();

  // this is a function that performs the AJAX call to OMDB
  OMDBquery(movie);
}

// this function is performing logic to use the movie response from OMDB, it will display the responses to the divs.
function handleMovieResponse(response) {
  console.log("handleMovieResponse");
  console.log(response);
  const genreArr = response.Genre.split(", ");
  var genreData;
  // spliting the response to return 1 result, each movie can have multiple genres
  for (let i = 0; i < genreArr.length; i++) {
    if (genreArr[i] == "Western") {
      genreData = genreArr[i].split();
      console.log(genreData);
    } else if (genreArr[i] == "Romance") {
      genreData = genreArr[i].split();
      console.log(genreData);
    } else if (genreArr[i] == "Horror") {
      genreData = genreArr[i].split();
      console.log(genreData);
    } else if (genreArr[i] == "Sci-Fi") {
      genreData = genreArr[i].split();
      console.log(genreData);
    } else {
      genreData = response.Genre.split(", ");
    }
  }

  // checks if there is at least one genre associated with this movie
  if (genreData.length > 0) {
    // the div gets updated with the movie information
    updateMovieDiv(response);

    //calls getSpiritForGenre with our genreData gathered above
    let spirit = getSpiritForGenre(genreData);
    if (spirit) {
      // If spirit is found in our array then it is sent to cocktailDBquery to return a drink
      cocktailDBquery(spirit);
    } else {
      // error case
      let message = `Spirit not found for ${response.Genre}`;
      updateErrorDiv(message);
    }
  } else {
    // error case
    let message = `Genre not found for ${movie}`;
    updateErrorDiv(message);
  }
}

// uses the responses from the cocktailBD AJAX call
function handleDrinkResponse(cocktailName, response) {
  console.log("found recipe: " + cocktailName);
  console.log(response);
  if (response.drinks && response.drinks.length > 0) {
    console.log("first element...");
    console.log(response.drinks[0]);
    updateDrinkDiv(response.drinks[0]);
  } else {
    // error case
    let message = `Recipe not found for ${cocktailName}`;
    updateErrorDiv(message);
  }
}

// Uses genreData called from handleMovieResponse() then compares it to our resultsArr[] by looping through it
// and returns a matching spirit if found, or undefined if not found
function getSpiritForGenre(genreData) {
  // remember that each movie can have multiple genres.  it's possible that some of them are not included
  // in the resultsArr[], so we keep looking until we find one that we can recognize
  for (let genreIndex = 0; genreIndex < genreData.length; genreIndex++) {
    const genre = genreData[genreIndex].toLowerCase();

    console.log("searching for genre: " + genre);
    for (let i = 0; i < resultsArr.length; i++) {
      if (genre == resultsArr[i].genre) {
        console.log("found spirit for genre: " + genre);
        return resultsArr[i].spirit;
      }
    }

    console.log("did not find spirit for genre: " + genre);
  }
  //if we find no matching genres
  return undefined;
}

// =======================================================================
// END CORE LOGIC
// =======================================================================

// =======================================================================
// BEGIN AJAX STUFF
// =======================================================================

function OMDBquery(movie) {
  console.log("searching for movie: " + movie);
  const queryURL =
    "https://www.omdbapi.com/?t=" + movie + "=&plot=short&apikey=trilogy";
  $.ajax({
    url: queryURL,
    method: "GET"
  })
    .then(function (response) {
      handleMovieResponse(response);
    })
    .catch(function (error) {
      // error case
      let message = `${movie} was not found in OMDB`;
      updateErrorDiv(message);
    });
}

function cocktailDBquery(spirit) {
  console.log("searching for spirit: " + spirit);
  const spiritUrl =
    "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + spirit;

  $.ajax({
    url: spiritUrl,
    method: "GET"
  })
    .then(function (spiritResponse) {
      const randomIndex = Math.floor(
        Math.random() * spiritResponse.drinks.length
      );
      const cocktailId = spiritResponse.drinks[randomIndex].idDrink;
      const cocktailName = spiritResponse.drinks[randomIndex].strDrink;
      console.log("found drink: " + cocktailName);
      console.log(spiritResponse);

      const cocktailUrl =
        "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" +
        cocktailId;
      $.ajax({
        url: cocktailUrl,
        method: "GET"
      })
        .then(function (cocktailResponse) {
          handleDrinkResponse(cocktailName, cocktailResponse);
        })
        .catch(function (error) {
          // error case
          let message = `Recipe not found for ${cocktailName}`;
          updateErrorDiv(message);
        });
      //this is handling if there is no response back from the API
      let response = undefined;
    })
    .catch(function (error) {
      // error case
      let message = `Drink not found for ${spirit}`;
      updateErrorDiv(message);
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
  $("#movie").empty();
  var movieDiv = $("#movie");
  var imgURL = response.Poster;
  var titleDiv = $("<h3>").text(response.Title);
  var yearDiv = $("<div>").text(response.Year);
  var actorsDiv = $("<div>").text(response.Actors);
  var genreDiv = $("<div>").text(response.Genre);
  var imageDiv = $("<img>").attr("src", imgURL);
  var plotDiv = $("<div>").text(response.Plot);
  imageDiv.addClass("img-thumbnail");
  movieDiv.append(titleDiv, yearDiv, actorsDiv, genreDiv, plotDiv, imageDiv);
}

function updateDrinkDiv(response) {
  $("#recipetext").empty();
  console.log("updateDrinkDiv");
  const recipeContainer = $("#recipetext");
  const ingredUl = $("<ul>");
  var titleDiv = $("<h3>").text(response.strDrink);
  recipeContainer.attr("class", "clear-fix");
  recipeContainer.append(titleDiv);
  recipeContainer.append(ingredUl);
  let ingredientList = getIngredientList(response);
  var imgURL = response.strDrinkThumb;
  var imageDiv = $("<img>").attr("src", imgURL);
  imageDiv.addClass("img-thumbnail");
  for (let i = 0; i < ingredientList.length; i++) {
    let recipeDiv = $(`<li>${ingredientList[i]}</li>`);
    console.log(ingredientList[i]);
    ingredUl.append(recipeDiv);
  }
  recipeContainer.append(imageDiv);
}

function getIngredientList(response) {
  let ingredientList = [];
  appendIngredient(
    ingredientList,
    response.strIngredient1,
    response.strMeasure1
  );
  appendIngredient(
    ingredientList,
    response.strIngredient2,
    response.strMeasure2
  );
  appendIngredient(
    ingredientList,
    response.strIngredient3,
    response.strMeasure3
  );
  appendIngredient(
    ingredientList,
    response.strIngredient4,
    response.strMeasure4
  );
  appendIngredient(
    ingredientList,
    response.strIngredient5,
    response.strMeasure5
  );
  appendIngredient(
    ingredientList,
    response.strIngredient6,
    response.strMeasure6
  );
  appendIngredient(
    ingredientList,
    response.strIngredient7,
    response.strMeasure7
  );
  appendIngredient(
    ingredientList,
    response.strIngredient8,
    response.strMeasure8
  );
  appendIngredient(
    ingredientList,
    response.strIngredient9,
    response.strMeasure9
  );
  appendIngredient(
    ingredientList,
    response.strIngredient10,
    response.strMeasure10
  );
  appendIngredient(
    ingredientList,
    response.strIngredient11,
    response.strMeasure11
  );
  appendIngredient(
    ingredientList,
    response.strIngredient12,
    response.strMeasure12
  );
  appendIngredient(
    ingredientList,
    response.strIngredient13,
    response.strMeasure13
  );
  appendIngredient(
    ingredientList,
    response.strIngredient14,
    response.strMeasure14
  );
  appendIngredient(
    ingredientList,
    response.strIngredient15,
    response.strMeasure15
  );
  return ingredientList;
}

function appendIngredient(ingredientList, ingredient, measure) {
  if (ingredient && ingredient != "") {
    if (!measure.endsWith(" ")) {
      measure += " ";
    }

    ingredientList.push(measure + ingredient);
  }
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
