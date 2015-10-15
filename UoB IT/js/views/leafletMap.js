'use strict';
//alert("here map");
var nearestPcsObjects;
var map;
var nearestPcsLayer;
var location;

//Returns a style which colours a marker based upon value passed in
var clusterStyle = function (value) {
    var style = 'marker-cluster marker-cluster-';
    if (value < 10) {
        style += 'small';
    } else if (value < 100) {
        style += 'medium';
    } else {
        style += 'large';
    }

    return style;
};

//Returns a colour to be applied to awesome font marker which is determined by value passed in
var markercolour = function (value) {

    var colour;

    if (value > 40) {
        colour = "green";
    } else if (value > 10) {
        colour = "orange";
    } else {
        colour = "red";
    }
    return colour;
};



models.leafletMap = kendo.observable({
    onInit: function () {

        var spinIcon;

        LocationRepository.GetLocation().then(function (location) {

            if (location && location.coords) {
                location = [location.coords.latitude, location.coords.longitude];
                //found location, add to map
                spinIcon = L.AwesomeMarkers.icon({ icon: 'male', prefix: 'fa', markerColor: 'green' });

            } else {
                //couldn't get location, use central campus - perhaps a different icon?
                spinIcon = L.AwesomeMarkers.icon({ icon: 'male', prefix: 'fa', markerColor: 'red' });
                location = LocationRepository.CoordCollection.CentralCampus;
               
            };

            map = L.map('map', {tap: false}).setView(location, 17);

            L.marker(location, { icon: spinIcon }).addTo(map);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            populateMap();
        });
 
    },
    onShow: function () {
    },
    title: "Map"
});



var populateMap = function () {
    console.log("populateMap");
    var favorites;
    
   UserRepository.GetAllFavorites().then(function(results) {
        favorites = results;
    }).catch(function (error) {
        console.log("populateMap: ");
        console.log(error);
    });

    console.log(favorites);

    LocationRepository.GetAllPCs(location).then(function (results) {

      //  alert(results);
        nearestPcsObjects = results;


        if (results) {


            var markers = L.markerClusterGroup({
                maxClusterRadius: 90,
                spiderfyDistanceMultiplier: 2,
                iconCreateFunction: function(cluster) {
                    var markers = cluster.getAllChildMarkers();

                    var n = 0;
                    for (var i = 0; i < markers.length; i++) {
                        n += markers[i].options.NoOfPcsFree;
                    }

                    return new L.DivIcon({ html: '<div><span>' + n + '</span></div>', className: clusterStyle(n), iconSize: new L.Point(40, 40) });

                }

            });


            var markStore = [];


            var arraySize = nearestPcsObjects.length - 1;

            do {
                var item = nearestPcsObjects[arraySize];

                var info = "<div>" + item.FacilityName + "</div><div>Availible PCs: " + item.NoOfPcsFree + "</div>"
                         + "<div><button href='#' onclick='javascript:addFavorite(\"" + item.RoomId + "\");'><i class='fa fa-star' class='font-size: 50px;'></i></button></div>"
                         + "<div><button onclick='javascript:getDirections( " + location[0] + ", " + location[1] + ", " + item.CoordinatesArray[0] + ", " + item.CoordinatesArray[1] + ");'>Directions</button></div>";


                markStore[arraySize] = new L.Marker(
                    item.CoordinatesArray,
                    { icon: L.AwesomeMarkers.icon({ icon: '', prefix: 'fa', markerColor: markercolour(item.NoOfPcsFree), html: item.NoOfPcsFree }), NoOfPcsFree: item.NoOfPcsFree }).bindPopup(info);

            } while (arraySize--)

            nearestPcsLayer = new L.LayerGroup();

            markers.addLayers(markStore);

            nearestPcsLayer.addLayer(markers).addTo(map);
        };

    }).catch(function(error) {
        console.log(error);
    });
};

var routeControl;


var getDirections = function (originLng, originLat, destinationLng, destinationLat) {

    if (routeControl)
        map.removeControl(routeControl);


    routeControl = L.Routing.control({
        waypoints: [
            L.latLng(originLng, originLat),
            L.latLng(destinationLng, destinationLat)
        ],
        router: L.Routing.valhalla('valhalla-rRUHtYw', 'pedestrian' /*, { pedestrian: { step_penalty: 10, alley_factor: 0.1, driveway_factor:10 } }*/),
        formatter: new L.Routing.Valhalla.Formatter({ units: 'imperial' }),
        routeWhileDragging: false,
        autoRoute: true
    }).addTo(map);
}

var addFavorite = function (roomId) {
    var item;

    if (nearestPcsObjects) {
        var index = nearestPcsObjects.length - 1;

      

        do {
            if (nearestPcsObjects[index].RoomId == roomId) {
                item = nearestPcsObjects[index];

                break;
            }
        } while (index--)
    }

    if (item) {
        console.log(item);
        UserRepository.AddFavorite(item).then(function (result) {

           // if (result.ok)
            console.log(result.ok);
        }).catch(function(error) {
            console.log(error);
        });
    } else {
        //error popup?
    }
};

var removeFavorite = function(item)
{
    UserRepository.RemoveFavorite(item).then(function (result) {
        
    }).catch(function (error) {
        console.log(error);
    });;
};

app.registerTimedWatcher({ every: 5, then: function () { LocationRepository.RefreshData(LocationRepository.CacheKeys.AllPCs); } })