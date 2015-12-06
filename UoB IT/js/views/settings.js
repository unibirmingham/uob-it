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

                $("#mapRefreshMinutes").keypress(function (e) {
                    //if the letter is not digit then display error and don't type anything
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {

                        return false;
                    }
                    return true;
                });

                $("#refreshClusterInfo").keypress(function (e) {
                    //if the letter is not digit then display error and don't type anything
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {

                        return false;
                    }
                    return true;
                });

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

                var regex = new RegExp("^[0-9]+$");


                var mapRefresh = $("#mapRefreshMinutes").val();
                var clusterRefresh = $("#refreshClusterInfo").val();
                //what about validation? int only? not empty?

                console.log(regex.test(mapRefresh));
                
                settings[0].MapRefreshMinutes = regex.test(mapRefresh) ? mapRefresh : 5;
                settings[0].RefreshClusterInfo = regex.test(clusterRefresh) ? clusterRefresh : 5;

                console.log(settings);
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