/*
    Location repository.
    All location based operations should go here e.g. fetch phone location, get pc locations etc
 */

var LocationRepository;

app.registerInitialise(function () {

    LocationRepository = (function () {

        //key array for cache items
        var cacheKeys = { AllPCs: "%LOCATION_REPOSITORY_GET_ALL_PCS" };

        //default location coords which point to the center of campus
        var coordCollection = { CentralCampus: [52.45049111433046, -1.9307774305343628] };

        var forceRefreshKeys = {};

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

        //fetched data from a remote source
        var getDataRemote = Promise.method(function (url) {
            return new Promise(function (resolve, reject) {
                return $.getJSON(url, function (data) {
                    resolve(data);
                }).error(function (jqXhr, textStatus, errorThrown) {
                    reject({ jqXhr, textStatus, errorThrown });
                });
            });
        });

        //Checks local storage for a copy of the desired data, if it doesnt
        //exist, it'll pull it in from the passed in service url
        //and put it to local storage using the defined key
        var getData = Promise.method(function (url, key) {

            return LocalStorageService.GetItem(key).then(function (storedData) {

                var ignoreLocal = forceRefreshKeys[key] == undefined ? false : forceRefreshKeys[key];

                if (forceRefreshKeys[key])
                    forceRefreshKeys[key] = false;



                return new Promise(function (resolve, reject) {
                    if (storedData != null && !ignoreLocal) {
                        resolve(storedData.data);
                    } else {

                        if (ignoreLocal)
                            ignoreLocal = false;

                        return getDataRemote(url).then(function (data) {


                            LocalStorageService.StoreOrUpdate(key, { data }).then(function (results) {
                                resolve(results.data);
                            }).catch(function (error) {
                                reject(error);
                            });
                        });
                    };
                });


            }).catch(function () {
                return new Promise(function (resolve, reject) {
                    return getDataRemote(url).then(function (data) {
                        return LocalStorageService.StoreOrUpdate(key, { data }).then(function (results) {
                            resolve(results);
                        }).catch(function (error) {
                            reject(error);
                        });
                    });
                });
            });

        });

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
                return getData(pcUrlCreator(location), cacheKeys.AllPCs).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {

                        reject(error);
                    });

            });

        });

        //adds a key to the refresh array. On the next local storage request
        //for the specified key, a remote fetch will occur, the results
        //being pushed back to local storage
        var forceRefresh = function (key) {

            forceRefreshKeys[key] = true;
        };

        //accessors
        return {
            GetAllPCs: getAllPCs,
            GetLocation: getPhoneLocation,
            RefreshData: forceRefresh,
            CacheKeys: cacheKeys,
            CoordCollection: coordCollection
        }

    })();

})