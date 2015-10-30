'use strict';

var fullPcList;
var location;

models.pcAvailabilityFullList = kendo.observable({
    onInit: function () {

    },
    onShow: function () {

    },
    title: "PC Availibility List",
});

window.PcAvailability = {
    dataSource: new kendo.data.DataSource({
        transport: {
            read: function (options) {
                LocationRepository.GetLocation().then(function (location) {

                    if (location && location.coords)
                        location = [location.coords.latitude, location.coords.longitude];
                    else
                        location = LocationRepository.CoordCollection.CentralCampus;

                    console.log(location);

                }).then(function () {
                    LocationRepository.GetAllPCs(location).then(function (pcData) {

                        options.success(pcData);

                    }).catch(function (pcFetchError) {
                        options.error(pcFetchError);
                    });
                }).catch(function (locationError) {
                    options.error(locationError);
                });
            }
        }
    })
};