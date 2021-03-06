/*
    Location repository.
    All location based operations should go here e.g. fetch phone location, get pc locations etc
 */

var LocationService;

app.registerInitialise(function () {

    LocationService = (function () {

        //key array for cache items
        var cacheKeys = { AllPCs: "%LOCATION_REPOSITORY_GET_ALL_PCS" };

        //default location coords which point to the center of campus
        var coordCollection = { CentralCampus: [52.45049111433046, -1.9307774305343628] };

        //pc availibility service endpoint. perhaps push these things to config service?
        var pcsUrl = "http://www.birmingham.ac.uk/web_services/Clusters.svc/nearestpc";

        //generates the service url for PC location based upon current or a default location
        var pcUrlCreator = function (coords) {
            if (coords == null || coords.length != 1) {
                console.log("invalid coords array passed into pcUrlCreator: " + coords);
                coords = [52.45049111433046, -1.9307774305343628];
            }

            return pcsUrl + "?lat=" + coords[0] + "&long=" + coords[1];
        }

        //returns the phones current location
        var getPhoneLocation = Promise.method(function () {

            return new Promise(function (resolve, reject) { // create a new promise
                if (navigator.geolocation) {
                    return navigator.geolocation.getCurrentPosition(function (position) { // send the callback to getCurrentPosition()
                        resolve(position); // when the callback is invoked resolve using the result of showPosition()
                    }, function (positionError) { // error callback

                        reject(positionError); // reject using the PositionError from the callback
                    });
                } else {
                    reject('not supported'); // if not supported reject
                }
            });
        });

        //returns all PCs using the phones location to populate distance
        var getAllPCs = Promise.method(function (location) {

            return new Promise(function (resolve, reject) {
                    // resolve(data)
                return RemoteServiceManager.FetchRemoteCache(pcUrlCreator(location), cacheKeys.AllPCs).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {

                        reject(error);
                    });

            });

        });

        //accessors
        return {
            GetAllPCs: getAllPCs,
            GetLocation: getPhoneLocation,
            CacheKeys: cacheKeys,
            CoordCollection: coordCollection
        }

    })();
})