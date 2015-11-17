'use strict';
//alert("here map");
var nearestPcsObjects;
var map;
var nearestPcsLayer;
var location;
var routeControl;
var favorites;

/*
 Initialisation
 */
app.registerTimedWatcher({ every: 5, then: function () { RemoteServiceManager.RefreshData(PcClusterService.CacheKeys.AllPCs); } });

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


var isFavorite = function (key) {

    if (favorites) {
        console.log(favorites);
        return key in favorites;
    }
    return false;
}

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

        var key = item.BuildingId + "_" + item.RoomId;

        // console.log(item);
        UserRepository.AddFavorite(item).then(function (result) {
          //  alert("here in Add");
            var $domItem = $("#" + key);

            $domItem.removeClass("fa-star-o");
            $domItem.addClass("fa-star");
            $domItem.unbind('click');

            $domItem.click(function () {
                removeFavorite(roomId);
            });

        }).catch(function (error) {
            console.log(error);
        });
    } else {
        //error popup?
        console.log("addFavorite error!");
        console.log(roomId);
    }
};

//removes favorite from local storage
var removeFavorite = function (roomId) {
    var item = fetchItemFromRoomId(roomId);

    if (item) {

        var key = item.BuildingId + "_" + item.RoomId;

        UserRepository.RemoveFavorite(item).then(function (result) {

            var $domItem = $("#" + key);

            $domItem.removeClass("fa-star");
            $domItem.addClass("fa-star-o");
            $domItem.unbind('click');

            $domItem.click(function () { addFavorite(roomId); });

        }).catch(function (error) {
            console.log(error);
        });
    } else {
        //error popup?
        console.log("removeFavorite error! " + roomId);
    }
};

//We initilaise first to try and grab favorites, then when generate map
var initialiseMap = function () {
    UserRepository.GetAllFavorites().then(function (results) {
        favorites = results;
        populateMap();
    }).catch(function (error) {
        console.log(error);
        populateMap();

    });
};

var populateMap = function () {
    PcClusterService.GetNearestPCs(location).then(function (results) {
        console.log(results);
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

                    return new L.DivIcon({ html: '<div><span>' + n + '</span></div>', className: PcClusterService.CalculateClusterStyle(n), iconSize: new L.Point(40, 40) });

                }

            });

            var markStore = [];

            var arraySize = nearestPcsObjects.length - 1;

            do {
                var item = nearestPcsObjects[arraySize];
                //   var roomId = item.RoomId;

                var info = "<div>" + item.FacilityName + "</div><div>Availible PCs: " + item.NoOfPcsFree + "</div>";
                //+ "<div><button href='#' onclick='javascript:addFavorite(\"" + item.RoomId + "\");'><i class='fa fa-star' class='font-size: 50px;'></i></button></div>"

                var key = item.BuildingId + "_" + item.RoomId;

                if (isFavorite(key)) {
                    info += "<div><i id='" + key + "' class='fa fa-star fa-2x'></i></div>";
                } else {
                    info += "<div><i id='" + key + "' class='fa fa-star-o fa-2x'></i></div>";
                }

                info += "<div><button onclick='javascript:getDirections( " + location[0] + ", " + location[1] + ", " + item.CoordinatesArray[0] + ", " + item.CoordinatesArray[1] + ");'>Directions</button></div>";


                markStore[arraySize] = new L.Marker(
                    item.CoordinatesArray,
                    { icon: L.AwesomeMarkers.icon({ icon: '', prefix: 'fa', markerColor: PcClusterService.CalculateAvaiabilityColour(item.NoOfPcsFree), html: item.NoOfPcsFree }), NoOfPcsFree: item.NoOfPcsFree }).bindPopup(info);

            } while (arraySize--)

            nearestPcsLayer = new L.LayerGroup();

            markers.addLayers(markStore);

            nearestPcsLayer.addLayer(markers).addTo(map);
        };

    }).then(function () {
        attachListners();
    }).catch(function (error) {
        console.log(error);
    });



};

var attachListners = function () {

    if (nearestPcsObjects) {
        var arraySize = nearestPcsObjects.length - 1;

        do {

            var item = nearestPcsObjects[arraySize];
            var key = item.BuildingId + "_" + item.RoomId;

            //need to use 'on' to attach event before DOM has been generated
            if (isFavorite(key)) {

                $('body').on('click', "#" + key, function () {
                    removeFavorite(item.RoomId);
                });
            } else {

                $('body').on('click', "#" + key, function () {
                    addFavorite(item.RoomId);
                });
            }
        } while (arraySize--);
    };
};


//kendo ui observable for UI
models.leafletMap = kendo.observable({
    onInit: function () {

        var spinIcon;

        LocationService.GetLocation().then(function (location) {

            if (location && location.coords) {
                location = [location.coords.latitude, location.coords.longitude];
                //found location, add to map
                spinIcon = L.AwesomeMarkers.icon({ icon: 'male', prefix: 'fa', markerColor: 'green' });

            } else {
                //couldn't get location, use central campus - perhaps a different icon?
                spinIcon = L.AwesomeMarkers.icon({ icon: 'male', prefix: 'fa', markerColor: 'red' });
                location = LocationService.CoordCollection.CentralCampus;

            };

            map = L.map('map', { tap: false }).setView(location, 17);

            L.marker(location, { icon: spinIcon }).addTo(map);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            initialiseMap();

        }).catch(function (error) {
            console.log(error);
        });

    },
    onShow: function () {


    },
    title: "Map"
});

