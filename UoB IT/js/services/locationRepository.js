/*
    Location repository.
    All location based operations should go here e.g. fetch phone location, get pc locations etc
 */

var LocationRepository;

app.registerInitialise(function () {
   
    LocationRepository = (function () {

        //default location coords which point to the center of campus
        var coordCollection = { CentralCampus: [52.45049111433046, -1.9307774305343628] };

        var forceRefreshKeys = {};


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



        //adds a key to the refresh array. On the next local storage request
        //for the specified key, a remote fetch will occur, the results
        //being pushed back to local storage
        var forceRefresh = function (key) {

            forceRefreshKeys[key] = true;
        };

        //accessors
        return {

            GetLocation: getPhoneLocation,
            RefreshData: forceRefresh,
            CoordCollection: coordCollection
        }

    })();
})