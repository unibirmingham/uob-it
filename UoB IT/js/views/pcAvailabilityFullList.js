'use strict';

var fullPcList;
var location;

models.pcAvailability = kendo.observable({
    onInit: function () {

    },
    onShow: function () {

    },
    title: "PC Availibility List",
});


models.pcAvailability.FullList = {
    dataSource: {
        type: 'json',
        transport: {
            read: function (options) {
              
                LocationService.GetLocation().then(function (location) {
                 
                    if (location && location.coords)
                        location = [location.coords.latitude, location.coords.longitude];
                    else
                        location = LocationService.CoordCollection.CentralCampus;

                }).then(function () {
                    LocationService.GetAllPCs(location).then(function (pcData) {

                        options.success(pcData);

                    }).catch(function (pcFetchError) {
                        options.error(pcFetchError);
                    });
                }).catch(function (locationError) {
                    options.error(locationError);
                    console.log(locationError);
                });
            }
        }
    }
};


models.pcAvailability.FavoriteList = {
    dataSource: {
        type: 'json',
        transport: {
            read: function (options) {

                UserRepository.GetAllFavorites().then(function (favorites) {

                    options.success(favorites);


                }).catch(function (locationError) {
                    options.error(locationError);
                    console.log(locationError);
                });
            }
        }
    }
};


/*new kendo.data.DataSource({
        transport: {
            read: function (options) {
                LocationService.GetLocation().then(function (location) {

                    if (location && location.coords)
                        location = [location.coords.latitude, location.coords.longitude];
                    else
                        location = LocationService.CoordCollection.CentralCampus;

                    console.log(location);

                }).then(function () {
                    LocationService.GetAllPCs(location).then(function (pcData) {

                        options.success(pcData);

                    }).catch(function (pcFetchError) {
                        options.error(pcFetchError);
                    });
                }).catch(function (locationError) {
                    options.error(locationError);
                });
            }
        }
    })*/