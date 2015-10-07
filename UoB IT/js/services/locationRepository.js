var LocationRepository;

app.registerInitialise(function () {

    LocationRepository = (function () {

        var cacheKeys = { AllPCs: "%LOCATION_REPOSITORY_GET_ALL_PCS" };

        var forceRefreshKeys = {};

        var pcsUrl = "http://www.birmingham.ac.uk/web_services/Clusters.svc/nearestpc";

        var pcUrlCreator = function (coords) {
            if (coords == undefined || coords.length != 1) {
                console.log("invalid coords array passed into pcUrlCreator");
                coords = [52.45049111433046, -1.9307774305343628];
            }

            return pcsUrl + "?lat=" + coords[0] + "&long=" + coords[1];
        }


        var getDataRemote = Promise.method(function (url) {
            return new Promise(function(resolve, reject) {
                $.getJSON(url, function(data) {
                    resolve(data);
                }).error(function(jqXhr, textStatus, errorThrown) {
                    reject({ jqXhr, textStatus, errorThrown });
                });
            });
        });

        var getData = Promise.method(function(url, key) {
            
            return LocalStorageService.GetItem(key).then(function (storedData) {
              //  console.log("return LocalStorageService.GetItem(key).");
              //  console.log(storedData);
                var ignoreLocal = forceRefreshKeys[key] == undefined ? false : forceRefreshKeys[key];

                if (forceRefreshKeys[key])
                   forceRefreshKeys[key] = false;

                

                return new Promise(function(resolve, reject) {
                    if (storedData != null && !ignoreLocal) {
                        resolve(storedData.data);
                    } else {

                        if (ignoreLocal)
                            ignoreLocal = false;

                        getDataRemote(url).then(function(data) {

                            LocalStorageService.StoreOrUpdate(key, { data }).then(function(results) {
                                resolve(results.data);
                            }).catch(function(error) {
                                reject(error);
                            });
                        });
                    };
                }); 
            }).catch(function(error) {
                console.log(error);
            });


        });

        var getPhoneLocation = Promise.method(function() {
            //var result;
            return new Promise(function (resolve, reject) { // create a new promise
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) { // send the callback to getCurrentPosition()
                        resolve(position); // when the callback is invoked resolve using the result of showPosition()
                    }, function (positionError) { // error callback
                     
                        reject(positionError); // reject using the PositionError from the callback
                    });
                } else {
                    alert("Geolocation is not supported by this browser.");
                    reject('not supported'); // if not supported reject
                }
            });
        });


        var getAllPCs = Promise.method(function() {

            return new Promise(function (resolve, reject) {
                getPhoneLocation().then(function (data) {

                    resolve(getData(pcUrlCreator(data), cacheKeys.AllPCs));
                }).catch(function(error) {
                    reject(error);
                });
            });

        });

        var forceRefresh = function(key) {

            forceRefreshKeys[key] = true;
        };

        return {
            GetAllPCs: getAllPCs,
            GetLocation: getPhoneLocation,
            RefreshData: forceRefresh,
            CacheKeys: cacheKeys
        }

    })();

})