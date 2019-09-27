//Hold all the station objects with their name, position, and id, indexed by the id with "place-" stripped off.
var Stations = {

        sstat: {
            name: "South Station",
            position: new google.maps.LatLng(42.352271, -71.05524200000001),
            id: "place-sstat"
        },

        andrw: {
            name: "Andrew",
            position: new google.maps.LatLng(42.330154, -71.057655),
            id: "place-andrw"
        },

        portr: {
            name: "Porter Square",
            position: new google.maps.LatLng(42.3884, -71.11914899999999),
            id: "place-portr"
        },

        harsq: {
            name: "Harvard Square",
            position: new google.maps.LatLng(42.373362, -71.118956),
            id: "place-harsq"
        },

        jfk: {
            name: "JFK/UMASS",
            position: new google.maps.LatLng(42.320685, -71.052391),
            id: "place-jfk"
        },

        shmnl: {
            name: "Savin Hill",
            position: new google.maps.LatLng(42.31129, -71.053331),
            id: "place-shmnl"
        },

        pktrm: {
            name: "Park Street",
            position: new google.maps.LatLng(42.35639457, -71.0624242),
            id: "place-pktrm"
        },

        brdwy: {
            name: "Broadway",
            position: new google.maps.LatLng(42.342622, -71.056967),
            id: "place-brdwy"
        },

        nqncy: {
            name: "North Quincy",
            position: new google.maps.LatLng(42.275275, -71.029583),
            id: "place-nqncy"
        },

        smmnl: {
            name: "Shawmut",
            position: new google.maps.LatLng(42.29312583, -71.06573796000001),
            id: "place-smmnl"
        },

        davis: {
            name: "Davis",
            position: new google.maps.LatLng(42.39674,  -71.121815),
            id: "place-davis"
        },

        alfcl: {
            name: "Alewife",
            position: new google.maps.LatLng(42.395428,  -71.142483),
            id: "place-alfcl"
        },

        knncl: {
            name: "Kendall/MIT",
            position: new google.maps.LatLng(42.36249079, -71.08617653),
            id: "place-knncl"
        },

        chmnl: {
            name: "Charles/MGH",
            position: new google.maps.LatLng(42.361166, -71.070628),
            id: "place-chmnl"
        },

        dwnxg: {
            name: "Downtown Crossing",
            position: new google.maps.LatLng(42.355518, -71.060225),
            id: "place-dwnxg"
        },

        qnctr: {
            name: "Quincy Center",
            position: new google.maps.LatLng(42.251809, -71.005409),
            id: "place-qnctr"
        },

        qamnl: {
            name: "Quincy Adams",
            position: new google.maps.LatLng(42.233391, -71.007153),
            id: "place-qamnl"
        },

        asmnl: {
            name: "Ashmont",
            position: new google.maps.LatLng(42.284652, -71.06448899999999),
            id: "place-asmnl"
        },

        wlsta: {
            name: "Wollaston",
            position: new google.maps.LatLng(42.2665139, -71.0203369),
            id: "place-wlsta"
        },

        fldcr: {
            name: "Fields Corner",
            position: new google.maps.LatLng(42.300093, -71.061667),
            id: "place-fldcr"
        },

        cntsq: {
            name: "Central Square ",
            position: new google.maps.LatLng(42.365486, -71.103802),
            id: "place-cntsq"
        },

        brntn: {
            name: "Braintree ",
            position: new google.maps.LatLng(42.2078543, -71.0011385),
            id: "place-brntn"
        }
    };

var map;
var marker;

//A single infowindow object will be updated by each
//click event
var infowindow = new google.maps.InfoWindow({
        content: "InfoWindow is blank."
    });



//Create and display the map and call the functions for the added features
function initMap() {

    //Create map with these values
    var mapOptions = {
            zoom: 12,
            center: Stations["sstat"].position
        };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //Now with the map created we can handle the next features
    placeMarkers();
    drawPolyLine();
    getLocation();
}


//Place markers on each of the subway stations using a custom marker
//with an icon from https://material.io/tools/icons/
//Also add a listener for click events on the marker and call the
//appropriate function to handle it
function placeMarkers() {

    //custom image for the marker
    var image = {
        url: 'place_marker.png',
        // This marker is 24 pixels wide by 24 pixels high.
        scaledSize: new google.maps.Size(24, 24),
        // The origin for this image is (0, 0).
        origin: new google.maps.Point(0, 0)
    };
    //Defines the clickable region of the icon (ie not the transparent outer part)
    var shape = {
        coords: [1, 1, 1, 20, 20, 20, 20, 1],
        type: 'poly'
    };

    //for each station create the marker on the map and add a listener
    for (var key in Stations) {
        marker = new google.maps.Marker({
        position: Stations[key].position,
        map: map,
        icon: image,
        shape: shape,
        title: Stations[key].name
        });
        marker.addListener('click', function() {
            displaySubwayStation(this);
        });

    };

}


//Draw a polyLine between all of the train stations to show the user the entire
//red line. Note the line forks at JFK
function drawPolyLine() {


    //Keys of the station objects in order from north to south so that the polyline
    //connects them in the right order. 
    //Note: I will draw the branch as a separate polyline.
    var stationOrderMain = [ "alfcl", "davis", "portr", "harsq", "cntsq", "knncl",
    "chmnl", "pktrm", "dwnxg", "sstat", "brdwy", "andrw", "jfk",
    "nqncy", "wlsta", "qnctr", "qamnl", "brntn"
    ];
    

    //Get the location of each station so we can draw the line.
    var stationLocations = [];
    for (var i = 0; i < stationOrderMain.length; ++i){
        stationLocations.push( Stations[ stationOrderMain[i]].position);

    };
    
    //draw the line
    var lineToDraw = new google.maps.Polyline({
        path: stationLocations,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    lineToDraw.setMap(map);     //set line to map

    //Now do the same as above for the branch that forks from JFK.
    var stationOrderBranch = [ "jfk", "shmnl", "fldcr", "smmnl", "asmnl"]
    stationLocations = [];
        for (var i = 0; i < stationOrderBranch.length; ++i){
        stationLocations.push( Stations[ stationOrderBranch[i]].position);
    };
    
    
    lineToDraw2 = new google.maps.Polyline({
        path: stationLocations,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 4
    });
    lineToDraw2.setMap(map);

}

//Get the users current location
function getLocation() {

    //Note google no longer supports this for nonsecure origins
    //learned how to test this at:
    //https://stackoverflow.com/questions/40679961/how-can-i-detect-if-chrome-thinks-the-current-page-is-a-secure-origin
    if (window.isSecureContext !== true){
        //alert("Server is not secure. Cannot use geolocation features.);
        alert("Server is not secure. Cannot use geolocation features.");
        //I originally used a default location for testing purposes but now will just display a message and stop.
        //updateMap(42.408221,  -71.116204);
        return;
    }

    //Check of the user has a geolocation available and if so call a function to redraw the map.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
        myLat = position.coords.latitude;
        myLng = position.coords.longitude;
        updateMap(myLat, myLng);
        });
    }
    else{
        //alert("Could not determine your location.");
        alert("Could not determine your location.");
    }
}

//Given a latitude and longitude position, recenter the map there, create a marker, and listen for clicks.
function updateMap(myLat, myLng) {
    //create our position and recenter map there
    myPosition =  new google.maps.LatLng(myLat, myLng);
    map.panTo(myPosition);
    marker = new google.maps.Marker({
        position: myPosition,
        title: "Current Location. Click to find nearest station."
    })

    //Add listener so that when clicks it displays an infowindow with the nearest stations
    //and draws a polyline to it.
    marker.addListener('click', function() {
        //Find the closest station and gets its name and distance.
        var result = findClosestStation(this.position);
        var closestLocation = result.station.name;
        var distance = result.distance;
        //create simple html to display in the infowindow box.
        var content = '<div id="myLocationWindow">'+
        '<p> The closest station to you is '+
        '<span id="closest">'+ closestLocation +'</span></p>'+
        '<p>The station is ' + distance.toFixed(3) + ' miles away.</p>'+
        '</div>';
        infowindow.setContent(content);
        infowindow.open(map, marker);

        //Draw a polyline to the closest station from our current location.
        locations = [this.position, result.station.position];
        var lineToDraw = new google.maps.Polyline({
            path: locations,
            geodesic: true,
            strokeColor: '#000000',
            strokeOpacity: 1.0,
            strokeWeight: 5
            });
            lineToDraw.setMap(map);
        });
        // add the marker to the map
        marker.setMap(map);
}



var info;
function displaySubwayStation(marker) {
    var station = findStationWithName(marker.title);
    var name = station.name;
    getStationData(station, marker);

}

function  getStationData(station, marker) {
    //open an HTTP request to use the MBTA redline API
    var request = new XMLHttpRequest();
    var url = "https://chicken-of-the-sea.herokuapp.com/redline/schedule.json?stop_id=" + station.id;
    request.open("GET", url, true);

    //Listen for readystatechanges to determine when the file is ready.
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200){
            //The file is ready here so we can continue
            
            info = JSON.parse(request.responseText);

            //Begin the html used for output to the info window
            var content = '<div id="station">'+
            '<h1> ' + station.name + '</h1>'+
            '<table>' + 
            '<tr id="header"><th> Departure time </th> <th> Direction</th></tr>';


            //The MBTA best practices guide at https://www.mbta.com/developers/v3-api/best-practices#tab-group
            //offers assistance on intepreting arrival and departure time and was used to determine
            //whether to show departure or arrival. (Further comments below)

            //get the total length of the predictions to determine if we have any data for this station
            var length = 0;

            //display a different warning if the received data is null as that likely means a different error.
            var noData = true;
            //a bool that is true if we have arriving only trains and need to show a warning (see further comments below)
            var arrivalOnly = false;
            if (info.data){
                noData = false;
                length = info.data.length;
                for( num in info.data){
                    d = info.data[num];
                    var direction;
                    var arrival = d.attributes.arrival_time;
                    var departure = d.attributes.departure_time;
                    var timeOutput;
                

                    //if both are null do not display this and also subtract it from the total predictions
                    if (arrival == null && departure == null){
                        length--;
                        continue;
                    }


                    if (!arrival){
                        //this must be the first stop of the trip
                        //display departure time
                        var start = departure.indexOf("T");
                        var end = departure.indexOf("-", start + 1);
                        output = departure.substring(start + 1, end);
                    }
                    else if (!departure){
                        //This is a final stop of the trip and information about it would not 
                        //normally be displayed to customers, I decided to display it as
                        //arrival time with an asterisk so user knows there is no departure
                        arrivalOnly = true;
                        var start = arrival.indexOf("T");
                        var end = arrival.indexOf("-", start + 1);
                        var output = arrival.substring(start + 1, end) + "*";

                    }

                    else {
                        //This is a mid-route stop and the best practices says to use the arrival time.
                        var start = arrival.indexOf("T");
                        var end = arrival.indexOf("-", start + 1);
                        var output = arrival.substring(start + 1, end);
                    }


                    // set the direction of the train to more useful format for rider
                    if (d.attributes.direction_id == 0)
                        direction = "Southbound (Ashmont/Braintree)";
                    else
                        direction = "Northbound (Alewife)";

                    //write a new row to our table of train times
                    content += '<tr><td class="left">' + output + '</td>' +
                    '<td class="right">' + direction + '</td></tr>';
                }
            }
            
            
            //We did not receive a valid data set from our call, there must have been an error
            if (noData)
            {
                content = '<div id="station">'+
                '<h1> ' + station.name + '</h1>'+
                '<div ="no_data">Error. No data loaded. Please wait a few seconds and try again.</div>';
            }
            //If the length is 0 we have no useful information so tell the user we have no
            //trains to display
            else if (length == 0){
                content = '<div id="station">'+
                '<h1> ' + station.name + '</h1>'+
                '<div ="no_data">No trains found.</div>';
            }

            //we have information so close the table started above and display the warning discussed above
            else{

                //do we need to display the warning?
                if (arrivalOnly) {
                    content += '</table><div id="warning">' +
                    '*Warning: \* denotes arriving train with no departure.'
                    + '</div></div>';
                }
                else {
                    content += '</table></div>';
                }
            }
            
            infowindow.setContent(content);
            infowindow.open(map, marker);
        }
        
        else if ((request.readyState == 4 && request.status != 200) )
        {
            alert("There has been an error.");
        }
    }
    request.send();

}

// For each station defined above, find the one closest to position using the google maps provided function.
function findClosestStation(position) {
    closestStation = null;
    distance = 99999;
    for (var key in Stations){
        stationPos = Stations[key].position;
        d = google.maps.geometry.spherical.computeDistanceBetween(position, stationPos);

        if ( d < distance){
            distance = d;
            closestStation = Stations[key];
        }
    }
    miles = distance * 0.00062137;      //convert returned meters to miles
    //return the closestStation as well as the distance converted to miles.
    return { station: closestStation, distance: miles };

}

//Return the key of the station with matching name.
function findStationWithName(name) {
    for (var key in Stations){
        if (Stations[key].name == name ){
            return Stations[key];   
        }
    }
}






