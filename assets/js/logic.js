// mapping of known genres/spirits
const resultsArr = [{
        genre: "thiller",
        spirit: "bourbon",
    },
    {
        genre: "comedy",
        spirit: "beer",
    },
    {
        genre: "romance",
        spirit: "red wine",
    },
    {
        genre: "horror",
        spirit: "gin",
    },
    {
        genre: "drama",
        spirit: "tequila",
    },
    {
        genre: "crime",
        spirit: "scotch",
    },
    {
        genre: "fantasy",
        spirit: "rum",
    },
    {
        genre: "mystery",
        spirit: "whiskey",
    },
    {
        genre: "family",
        spirit: "juice",
    },
    {
        genre: "musical",
        spirit: "champagne",
    },
];

// =======================================================================
// BEGIN CORE LOGIC
// =======================================================================

function search() {
    clearDisplay();

    // prevents submit button from trying to submit form
    event.preventDefault();

    // movie user entered 
    // TODO what if movie is empty?
    const movie = $("#search-input").val();

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
    const queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=trilogy";

    //this is handling if there is no response back from the API
    let response = undefined;

    // expectation is one genre per movie
    // ______________________
    // TODO ajax call, what do to if movie not found?
    //_________________________
    // ==========================================
    return response;
}

function cocktailDBquery(spirit) {
    // ==========================================
    const queryURL = "cocktail db url goes here" + spirit;

    //this is handling if there is no response back from the API
    let response = undefined;

    // expectation is multiple drink options per spirit
    //TODO_________________
    //ajax call to cocktaildb
    // ==========================================


    return response;
}

// =======================================================================
// END AJAX STUFF
// =======================================================================

// =======================================================================
// BEGIN HTML STUFF
// =======================================================================

function clearDisplay() {
    //clears inputs from previous searches
    // $("#search-input").text("");
    // $("#movie-div").text("");
    // $("#drink-div").text("");
    // $("#error-div").text("");
}

function updateMovieDiv(response) {
    // TODO implement
    // $("#movie-div").text(the content we build);
}

function updateDrinkDiv(response) {
    // TODO implement
    // $("#drink-div").text(the content we build);
}

function updateErrorDiv(message) {
    // $("#error-div").text(message);
}

// on submit search function is run
$("#submit").on("click", search)

// =======================================================================
// END HTML STUFF
// =======================================================================

// make sure the display is clear when the page loads
clearDisplay();
