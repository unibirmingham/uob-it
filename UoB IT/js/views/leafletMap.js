'use strict';
//alert("here map");


models.leafletMap = {};

models.leafletMap.map = {};

models.leafletMap.nearestPcsObjects = [];

//models.leafletMap.nearestPcsLayer = {};

models.leafletMap.location = [];
models.leafletMap.favorites = []; 


//kendo ui observable for UI
models.leafletMap = kendo.observable({
    onInit: function () {
   //     var map = models.leafletMap.map;
        var spinIcon;
      //  console.log(models.leafletMap.map);
        LocationService.GetLocation().then(function (location) {

            if (location && location.coords) {
                models.leafletMap.location = [location.coords.latitude, location.coords.longitude];
                //found location, add to map
                spinIcon = L.AwesomeMarkers.icon({ icon: 'male', prefix: 'fa', markerColor: 'green' });

            } else {
                //couldn't get location, use central campus - perhaps a different icon?
                spinIcon = L.AwesomeMarkers.icon({ icon: 'male', prefix: 'fa', markerColor: 'red' });
                models.leafletMap.location = LocationService.CoordCollection.CentralCampus;

            };

            models.leafletMap.map = L.map('map', { tap: false }).setView(models.leafletMap.location, 17);


            

            L.marker(models.leafletMap.location, { icon: spinIcon }).addTo(models.leafletMap.map);

            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(models.leafletMap.map);


         //   console.log(models.leafletMap.map);
      

            models.leafletMap.functions.initialiseMap();
            

        }).catch(function (error) {
            console.log(error);
        });

    },
    onShow: function () {


    },
    title: "Map"
});


models.leafletMap.functions = {

    /*
    var nearestPcsObjects;
    var map;
    var nearestPcsLayer;
    var location;
    var routeControl;
    var favorites;
    */
    /*
     Initialisation
     */

    //utility function to find a room object using roomId
    fetchItemFromRoomId: function (roomId) {
        var item = null;

        if (models.leafletMap.nearestPcsObjects) {
            var index = models.leafletMap.nearestPcsObjects.length - 1;

            do {
                if (models.leafletMap.nearestPcsObjects[index].RoomId == roomId) {
                    item = models.leafletMap.nearestPcsObjects[index];

                    break;
                }
            } while (index--)
        }

        return item;
    },

    //utility function to chick if a room id has been added to favorites. Perhaps use an associative array for lookups without looping?


    isFavorite: function (key) {

        if (models.leafletMap.favorites) {
            console.log(models.leafletMap.favorites);
            return key in models.leafletMap.favorites;
        }
        return false;
    },

    getDirections: function (originLng, originLat, destinationLng, destinationLat) {
        
        if (routeControl)
            models.leafletMap.map.removeControl(routeControl);


        routeControl = L.Routing.control({
            waypoints: [
                L.latLng(originLng, originLat),
                L.latLng(destinationLng, destinationLat)
            ],
            router: L.Routing.valhalla('valhalla-rRUHtYw', 'pedestrian' /*, { pedestrian: { step_penalty: 10, alley_factor: 0.1, driveway_factor:10 } }*/),
            formatter: new L.Routing.Valhalla.Formatter({ units: 'imperial' }),
            routeWhileDragging: false,
            autoRoute: true
        }).addTo(models.leafletMap.map);
    },

    //adds favorite to local storage 
    addFavorite: function (roomId) {

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
    },

    //removes favorite from local storage
    removeFavorite: function (roomId) {
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
    },

    //We initilaise first to try and grab favorites, then when generate map
    initialiseMap: function () {

        UserRepository.GetAllFavorites().then(function (results) {
            models.leafletMap.favorites = results;
            models.leafletMap.functions.populateMap();
        }).catch(function (error) {
            console.log(error);
            models.leafletMap.functions.populateMap();

        });
    },

    populateMap: function () {
        PcClusterService.GetNearestPCs(models.leafletMap.location).then(function (results) {
    //        console.log(results);
            models.leafletMap.nearestPcsObjects = results;

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

                var arraySize = models.leafletMap.nearestPcsObjects.length - 1;
               
                do {
                    var item = models.leafletMap.nearestPcsObjects[arraySize];
                    //   var roomId = item.RoomId;

                    var info = "<div>" + item.FacilityName + "</div><div>Availible PCs: " + item.NoOfPcsFree + "</div>";
                    //+ "<div><button href='#' onclick='javascript:addFavorite(\"" + item.RoomId + "\");'><i class='fa fa-star' class='font-size: 50px;'></i></button></div>"

                    var key = item.BuildingId + "_" + item.RoomId;

                   /* if (models.leafletMap.functions.isFavorite(key)) {
                        info += "<div><i id='" + key + "' class='fa fa-star fa-2x'></i></div>";
                    } else {
                        info += "<div><i id='" + key + "' class='fa fa-star-o fa-2x'></i></div>";
                    }*/

                 //   info += "<div><button onclick='javascript:getDirections( " + models.leafletMap.location[0] + ", " + models.leafletMap.location[1] + ", " + item.CoordinatesArray[0] + ", " + item.CoordinatesArray[1] + ");'>Directions</button></div>";


                    markStore[arraySize] = new L.Marker(
                        item.CoordinatesArray,
                        { icon: L.AwesomeMarkers.icon({ icon: '', prefix: 'fa', markerColor: PcClusterService.CalculateAvaiabilityColour(item.NoOfPcsFree), html: item.NoOfPcsFree }), NoOfPcsFree: item.NoOfPcsFree }).bindPopup(info);

                } while (arraySize--)


                //var layer = new L.LayerGroup();;
                models.leafletMap.nearestPcsLayer = new L.LayerGroup();

                markers.addLayers(markStore);


               // console.log(map);

                models.leafletMap.nearestPcsLayer.addLayer(markers).addTo(models.leafletMap.map);
            };

        }).then(function () {
            models.leafletMap.functions.attachListners();
        }).catch(function (error) {
            console.log(error);
        });



    },

    attachListners: function () {

        if (models.leafletMap.nearestPcsObjects) {
            var arraySize = models.leafletMap.nearestPcsObjects.length - 1;

            do {

                var item = models.leafletMap.nearestPcsObjects[arraySize];
                var key = item.BuildingId + "_" + item.RoomId;

                //need to use 'on' to attach event before DOM has been generated
                if (models.leafletMap.functions.isFavorite(key)) {

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
    }

};