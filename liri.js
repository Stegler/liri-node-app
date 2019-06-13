require("dotenv").config();

//VARIABLES//
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var fs = require('fs');
var spotify = new Spotify(keys.spotify);
var searchType = process.argv[2];
var searchInput = process.argv.splice(3).join();

// If else statements

//OMDB//
if (searchType === 'movie-this') {
    movieThis(searchInput);
}
//BANDS IN  TOWN//
else if (searchType === 'concert-this') {
    concertThis(searchInput);
}
//SPOTIFY//
else if (searchType === 'spotify-this-song') {
    spotifyTrack(searchInput);
}
else if (searchType === 'do-what-it-says') {
    doWhatItSays(searchInput);
}
else {
    console.log('please choose a valid command');
}

// OMDB Function
function movieThis(movie) {

    var movieQuery = movie || "Mr. Nobody"

    axios.get("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&tomatoes=true&apikey=trilogy").then(function (response) {

        var divider = "\n------------------------------------------------------------\n\n";
        var jsonData = response.data;

        if (jsonData.title != undefined) {
        }
        else {
        }

        var movieData = [
            "Title: " + jsonData.Title,
            "Year: " + jsonData.Year,
            "imdb Rating: " + jsonData.imdbRating,
            "Country: " + jsonData.Country,
            "Language: " + jsonData.Language,
            "Plot: " + jsonData.Plot,
            "Cast: " + jsonData.Actors,
        ].join("\n\n");

        fs.appendFile("log.txt", movieData + divider, function (err) {
            if (err) throw err;
            console.log(divider + movieData);
        });
    })
};

// Spotify function
function spotifyTrack(track) {

    console.log(track);

    spotify.search({ type: "track", query: track }, function (err, response) {
        if (err) {
            return console.log("Error occured: " + err);
        }

        var jsonData = response.tracks;
        console.log(jsonData);

        for (var i = 0; i < 5; i++) {
            var divider = "\n-----------------------------------------------------------\n\n";
            var trackInfo = [
                "\nArtist: " + jsonData.items[i].artists[0].name,
                "\nTrack Name: " + jsonData.items[i].name,
                "\nAlbum Name: " + jsonData.items[i].album.name,
                "\nPreview Track: " + jsonData.items[i].preview_url,
            ]

            console.log(divider + trackInfo);

            fs.appendFile("log.txt", trackInfo + divider, function (err) {
                if (err) throw err;
                console.log(divider + trackInfo);
            });
        }
    })

};

// Bands in town function
function concertThis(concert) {

    var concertQuery = concert || "'The Sign' by Ace of Base";

    axios.get("https://rest.bandsintown.com/artists/" + concertQuery + "/events?app_id=codingbootcamp").then(function (response) {

        var jsonData = response.data;

        for (var i = 0; i < jsonData.length; i++) {
            var divider = "\n-----------------------------------------------------------\n\n";
            var concertFind = [
                "\nVenue Name: " + jsonData[i].venue.name,
                "\nLocation: " + jsonData[i].venue.city,
                "\nDate of Concert: " + moment(jsonData[i].datatime).format("L"),
            ].join("\n\n")

            fs.appendFile("log.txt", concertFind + divider, function (err) {
                if (err) throw err;
                console.log(divider + concertFind);
            });

            console.log(divider + concertFind);

        };
    });
};

// Do What It Says function
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, response) {
        if (err) throw err

        var responseArr = response.split(",");
        console.log("");
        console.log("---MAIN--CONTENT---");
        console.log("");

        for (var i = 0; i < responseArr.length; i++) {
            if (responseArr[i] === "movie-this") {
                movieThis(searchType);
            } else if (responseArr[i] === "spotify-this-song") {
                spotifyTrack(searchType);
            } else if (responseArr[i] === "concert-this") {
                concertThis(searchType);
            } else {
                console.log("Command is not valid!");
            }
        }
    })
}

