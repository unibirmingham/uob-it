'use strict';
//alert("here map");
var nearestPcsObjects;
var map;
var nearestPcsLayer;
var location;
var routeControl;
var favorites;


//utility function to find a room object using roomId
var fetchItemFromRoomId = function (roomId) {
    var item = null;

    if (nearestPcsObjects) {
        var index = nearestPcsObjects.length - 1;

        do {
            if (nearestPcsObjects[index].RoomId == roomId) {
                item = nearestPcsObjects[index];

                break;
            }
        } while (index--)
    }

    return item;
}

//utility function to chick if a room id has been added to favorites. Perhaps use an associative array for lookups without looping?
var isFavorite = function (roomId) {
    if (favorites) {

        console.log("in isFavorite");
        
        var index = favorites.rows.length - 1;
        var result = false;
        do {

            if (favorites.rows[index].doc.RoomId == roomId) {
                result = true;
                break;
            }
        } while (index--)

        return result;
    }

    return false;
}

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

//adds favorite to local storage 
var addFavorite = function (roomId) {

    var item = fetchItemFromRoomId(roomId);

    if (item) {
        console.log(item);
        UserRepository.AddFavorite(item).then(function (result) {
            var domItem = $("#" + roomId);

            domItem.removeClass("fa-star-o");
            domItem.addClass("fa-star");
            domItem.unbind('click');
            domItem.click(function () {
                removeFavorite(domItem.roomId);
            });

        }).catch(function (error) {
            console.log(error);
        });
    } else {
        //error popup?
    }
};

//removes favorite from local storage
var removeFavorite = function (roomId) {
    var item = fetchItemFromRoomId(roomId);

    UserRepository.RemoveFavorite(item).then(function (result) {
        var domItem = $("#" + roomId);

        domItem.removeClass("fa-star");
        domItem.addClass("fa-star-o");
        domItem.unbind('click');
        domItem.click(function (roomId) {
            addFavorite(roomId);
        });
    }).catch(function (error) {
        console.log(error);
    });;
};

//We initilaise first to try and grab favorites, then when generate map
var initialiseMap = function () {
    UserRepository.GetAllFavorites().then(function(results) {
        favorites = results;
        populateMap();
    }).catch(function (error) {
        console.log(error);
        populateMap();
    });
};

var populateMap = function() {
    LocationRepository.GetAllPCs(location).then(function (results) {

        nearestPcsObjects = results;

        if (results) {

            var markers = L.markerClusterGroup({
                maxClusterRadius: 90,
                spiderfyDistanceMultiplier: 2,
                iconCreateFunction: function (cluster) {
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

                var info = "<div>" + item.FacilityName + "</div><div>Availible PCs: " + item.NoOfPcsFree + "</div>";
                //+ "<div><button href='#' onclick='javascript:addFavorite(\"" + item.RoomId + "\");'><i class='fa fa-star' class='font-size: 50px;'></i></button></div>"

                if (isFavorite(item.RoomId))
                    info += "<div><i id='" + item.RoomId + "' onclick='javascript:removeFavorite(\"" + item.RoomId + "\");' class='fa fa-star fa-2x star-icon-full'></i></div>";
                else
                    info += "<div><i id='" + item.RoomId + "' onclick='javascript:addFavorite(\"" + item.RoomId + "\");' class='fa fa-star-o fa-2x'></i></div>";

                info += "<div><button onclick='javascript:getDirections( " + location[0] + ", " + location[1] + ", " + item.CoordinatesArray[0] + ", " + item.CoordinatesArray[1] + ");'>Directions</button></div>";


                markStore[arraySize] = new L.Marker(
                    item.CoordinatesArray,
                    { icon: L.AwesomeMarkers.icon({ icon: '', prefix: 'fa', markerColor: markercolour(item.NoOfPcsFree), html: item.NoOfPcsFree }), NoOfPcsFree: item.NoOfPcsFree }).bindPopup(info);

            } while (arraySize--)

            nearestPcsLayer = new L.LayerGroup();

            markers.addLayers(markStore);

            nearestPcsLayer.addLayer(markers).addTo(map);
        };

    }).catch(function (error) {
        console.log(error);
    });
}

//kendo ui observable for UI
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

            map = L.map('map', { tap: false }).setView(location, 17);

            L.marker(location, { icon: spinIcon }).addTo(map);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            initialiseMap();
        });

    },
    onShow: function () {
    },
    title: "Map"
});

app.registerTimedWatcher({ every: 5, then: function () { LocationRepository.RefreshData(LocationRepository.CacheKeys.AllPCs); } })