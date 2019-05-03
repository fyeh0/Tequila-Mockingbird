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
  const movie = $("#search-input").val();

  // this is a function that performs the AJAX call to OMDB
  OMDBquery(movie);
}

// this function is performing logic to use the movie response from OMDB, it will display the responses to the divs.
function handleMovieResponse(response) {
  console.log("handleMovieResponse");
  console.log(response);

  // spliting the response to return 1 result, each movie can have multiple genres
  let genreData = response.Genre.split(", ");
  console.log(genreData);

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
    .then(function(response) {
      handleMovieResponse(response);
    })
    .catch(function(error) {
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
    .then(function(spiritResponse) {
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
        .then(function(cocktailResponse) {
          handleDrinkResponse(cocktailName, cocktailResponse);
        })
        .catch(function(error) {
          // error case
          let message = `Recipe not found for ${cocktailName}`;
          updateErrorDiv(message);
        });
      //this is handling if there is no response back from the API
      let response = undefined;
    })
    .catch(function(error) {
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
  //TODO Set what is displayed as a default
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
  imageDiv.addClass("img-thumbnail");
  movieDiv.append(titleDiv, yearDiv, actorsDiv, genreDiv, imageDiv);

  // TODO implement this function to display the data to the user
  // Response from cocktailDB included below so we don't have to keep looking up the JSON object values

  /*
Actors: "Roy Scheider, Robert Shaw, Richard Dreyfuss, Lorraine Gary"
Awards: "Won 3 Oscars. Another 11 wins & 18 nominations."
BoxOffice: "N/A"
Country: "USA"
DVD: "11 Jul 2000"
Director: "Steven Spielberg"
Genre: "Adventure, Drama, Thriller"
Language: "English"
Metascore: "87"
Plot: "When a killer shark unleashes chaos on a beach community, it's up to a local sheriff, a marine biologist, and an old seafarer to hunt the beast down."
Poster: "https://m.media-amazon.com/images/M/MV5BMmVmODY1MzEtYTMwZC00MzNhLWFkNDMtZjAwM2EwODUxZTA5XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg"
Production: "Universal Pictures"
Rated: "PG"
Ratings: Array(3)
    0: {Source: "Internet Movie Database", Value: "8.0/10"}
    1: {Source: "Rotten Tomatoes", Value: "97%"}
    2: {Source: "Metacritic", Value: "87/100"}
    length: 3
Released: "20 Jun 1975"
Response: "True"
Runtime: "124 min"
Title: "Jaws"
Type: "movie"
Website: "http://www.jaws25.com/"
Writer: "Peter Benchley (screenplay), Carl Gottlieb (screenplay), Peter Benchley (based on the novel by)"
Year: "1975"
imdbID: "tt0073195"
imdbRating: "8.0"
imdbVotes: "507,046"  
 */
}

function updateDrinkDiv(response) {
  $("#recipetext").empty();
  console.log("updateDrinkDiv");
  // TODO implement this function to display the data to the user
  // Response from cocktailDB included below so we don't have to keep looking up the JSON object values

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

  /*
dateModified: "2015-08-18 14:42:59"
idDrink: "11007"
strAlcoholic: "Alcoholic"
strCategory: "Ordinary Drink"
strDrink: "Margarita"
strDrinkAlternate: null
strDrinkDE: null
strDrinkES: null
strDrinkFR: null
strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/wpxpvu1439905379.jpg"
strDrinkZH-HANS: null
strDrinkZH-HANT: null
strGlass: "Cocktail glass"
strIBA: "Contemporary Classics"
strIngredient1: "Tequila"
strIngredient2: "Triple sec"
strIngredient3: "Lime juice"
strIngredient4: "Salt"
strIngredient5: ""
strIngredient6: ""
strIngredient7: ""
strIngredient8: ""
strIngredient9: ""
strIngredient10: ""
strIngredient11: ""
strIngredient12: ""
strIngredient13: ""
strIngredient14: ""
strIngredient15: ""
strInstructions: "Rub the rim of the glass with the lime slice to make the salt stick to it. Take care to moisten only the outer rim and sprinkle the salt on it. The salt should present to the lips of the imbiber and never mix into the cocktail. Shake the other ingredients with ice, then carefully pour into the glass."
strInstructionsDE: null
strInstructionsES: null
strInstructionsFR: null
strInstructionsZH-HANS: null
strInstructionsZH-HANT: null
strMeasure1: "1 1/2 oz "
strMeasure2: "1/2 oz "
strMeasure3: "1 oz "
strMeasure4: ""
strMeasure5: ""
strMeasure6: ""
strMeasure7: ""
strMeasure8: ""
strMeasure9: ""
strMeasure10: ""
strMeasure11: ""
strMeasure12: ""
strMeasure13: ""
strMeasure14: ""
strMeasure15: ""
strTags: "IBA,ContemporaryClassic"
strVideo: null
   */
}

// function getIngredientList(response) {
//   let ingredientList = [];
//   for (let i = 1; i <= 15; i++) {
//     let ingredient = eval(`response.strIngredient${i}`);
//     let measure = eval(`response.strMeasure${i}`);
//     if (ingredient && ingredient != "") {
//       if (!measure.endsWith(" ")) {
//         measure += " ";
//       }

//       ingredientList.push(measure + ingredient);
//     }
//   }
//   return ingredientList;
// }

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

