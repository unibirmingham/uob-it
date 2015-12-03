'use strict';
app.registerInitialise(function () {

});
models.settings = kendo.observable({
    onShow: function () {

        //populate setting fields
        UserRepository.GetSettings().then(function (settings) {

            if (settings && settings.length > 0)
            {
                console.log(settings[0]);

                $("#mapRefreshMinutes").val(settings[0].MapRefreshMinutes);
                $("#refreshClusterInfo").val(settings[0].RefreshClusterInfo);
            }

            
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
    },
    save: function () {
        UserRepository.GetSettings().then(function (settings) {
            console.log(settings);
            if (settings && settings.length > 0) {
                console.log(settings[0]);

                //what about validation? int only? not empty?
                settings[0].MapRefreshMinutes = $("#mapRefreshMinutes").val();
                settings[0].RefreshClusterInfo = $("#refreshClusterInfo").val();


                UserRepository.SaveSettings(settings).then(function (result) {
                    console.log(result);
                }).catch(function (saveSettingsError) {
                    console.log(saveSettingsError);
                });


            }
        }).catch(function (fetchSettingsError) {
            console.log(fetchSettingsError);
        });


    }
});