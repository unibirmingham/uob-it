var LocationRepository;

app.registerInitialise(function() {
    console.log("in locationRepository registerInitialise");
    LocationRepository = (function () {

        var cacheKeys = { AllPCs: "%LOCATION_REPOSITORY_GET_ALL_PCS" };

        var centralCampus = [52.45049111433046, -1.9307774305343628];
        var pcsUrl = "http://www.birmingham.ac.uk/web_services/Clusters.svc/nearestpc?lat=" + centralCampus[0] + "&long=" + centralCampus[1];


        var getData = function (url, key) {
            console.log(key);
            var storedData = LocalStorageService.GetItem(key);

            if (storedData != null)
                return storedData;

            $.getJSON(url, function (data) {

                if (data == undefined) {
                
                    return null;
                } else {

                    return LocalStorageService.StoreOrUpdate(key, { data });
                }

            });
        }

        var getAllPCs = function () {
            return getData(pcsUrl, cacheKeys.AllPCs);
        };

        return {
            GetAllPCs: getAllPCs
        }

    })();

})