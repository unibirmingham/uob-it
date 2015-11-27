'use strict';
app.registerInitialise(function () {

});
models.settings = kendo.observable({
    onShow: function () {

        //populate setting fields
        UserRepository.GetSettings().then(function (settings) {
            console.log(settings);
        }).catch(function (fetchSettingsError) {
            console.log(fetchSettingsError);
        });

        //get localstorage size
        LocalStorageService.LocalStorageSpace().then(function (spaceAvailable) {
            $("#localCacheSize").html(spaceAvailable);
        }).catch(function (spaceAvailableFetchError) {
            console.log(spaceAvailableFetchError);
        });

        //hook up clear cache events
        $("#clearCacheButton").click(function () {
            LocalStorageService.Clear().then(function () {
                LocalStorageService.LocalStorageSpace().then(function (spaceAvailable) {
                    $("#localCacheSize").html(spaceAvailable);
                }).catch(function (spaceAvailableFetchError) {
                    console.log(spaceAvailableFetchError);
                });
            }).catch(function (clearCacheError) {
                console.log(clearCacheError);
            });
        });
    }
});