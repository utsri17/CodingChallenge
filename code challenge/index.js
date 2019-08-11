
 // Solution- Coding Challenge
 
'use strict'


/**
 * Module dependencies.
 * @private
 */

var express = require('express')
var app = express()
var fs = require('fs');
var GeoPoint = require('geopoint');
var geodist = require('geodist');

//Starting Node server


app.set('port', (process.env.PORT || 4000))
app.use(express.static(__dirname + '/public'))
app.get('/', function(request, response) {
    response.send('')
})
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
})

/**
 * Helper Variable Declaration 
 * @private
 */
var dataSet;
var output = [];


//Data Ingestion 

/**
 * File Ingestion logic
 * Add the FilePath and Geo Coordinates of the area from where search is happening 
 * Can be replaces with relevant API 
 * Constant Declared as per Specification
 */

const FilePath = __dirname + '/lib/Customers _Assignment_Coding Challenge.txt' //file path of csv
const searchFromLat = '53.339428';
const searchFromLong = '-6.257664';
try {
    var data = fs.readFileSync(FilePath, 'utf8');
    var Result = searchingAlgo(data.toString(), searchFromLat, searchFromLong, 100);
} catch (e) {
    console.log('Error:', e.stack);
}

// Search Algorithm

/*
 *Input Params: dataSet, searchingFromLatitude, searchingFromLongitude, searchDistance
 *dataSet : data in String Format
 *searchingFromLatitude : Latitude Value from where search is made
 *searchingFromLongitude : Longitude Value from where search is made
 *searchDistance: Search Radius
 */

function searchingAlgo(dataSet, searchingFromLatitude, searchingFromLongitude, searchDistance) {

    var lines = dataSet.split('\n');
    var Arr = dataSet.replace(/(\r\n|\n|\r)/gm, "lineEnd").split('lineEnd');
    for (var records in Arr) {

        var UserInFo = JSON.parse(Arr[records]);
        var distance = findDistance(searchingFromLatitude, searchingFromLongitude, UserInFo.latitude, UserInFo.longitude);
        if (distance <= searchDistance) {
            output.push({
                "User_Id": parseInt(UserInFo.user_id),
                "Name": UserInFo.name
            });
        }
    }
    output.sort((a, b) => a.User_Id - b.User_Id);
    console.log(output);
    return output;
}

// Distance between two geoPoints
function findDistance(X1, X2, Y1, Y2) {
    var dist = geodist([X1, X2], [Y1, Y2], {
        unit: 'km'
    })
    return dist;
}