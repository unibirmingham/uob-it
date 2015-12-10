'use strict';
models.settings = kendo.observable({
    onShow: function () {
      
        //populate setting fields
        UserRepository.GetSettings().then(function (settings) {

            if (settings && settings.data.length > 0)
            {

                //allow only itns to be placed into the following text boxes
                $("#mapRefreshMinutes").keypress(function (e) {
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {

                        return false;
                    }
                    return true;
                });

                $("#refreshClusterInfo").keypress(function (e) {
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {

                        return false;
                    }
                    return true;
                });

                //populate text boxes with values
                $("#mapRefreshMinutes").val(settings.data[0].MapRefreshMinutes);
                $("#refreshClusterInfo").val(settings.data[0].RefreshClusterInfo);
            }

            
        }).catch(function (fetchSettingsError) {

            console.log("dsfsdfd");
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
          
            if (settings && settings.data.length > 0) {

                //regex to check that strings only contain values
                var regex = new RegExp("^[0-9]+$");


                var mapRefresh = $("#mapRefreshMinutes").val();
                var clusterRefresh = $("#refreshClusterInfo").val();
                
                settings.data[0].MapRefreshMinutes = regex.test(mapRefresh) ? mapRefresh : 5;
                settings.data[0].RefreshClusterInfo = regex.test(clusterRefresh) ? clusterRefresh : 5;

               
                UserRepository.SaveSettings(settings).then(function (result) {
               
                    //if settings are successfully saved, push updated timedWatcher to app TimeWatcher store
                    if(result && result.length > 0)
                    {
                        app.registerTimedWatcher({ every: result[0].MapRefreshMinutes, then: function () { RemoteServiceManager.RefreshData(PcClusterService.CacheKeys.AllPCs); } });
                        app.registerTimedWatcher({ every: result[0].RefreshClusterInfo, then: function () { RemoteServiceManager.RefreshData(PcClusterService.CacheKeys.PcCounts); } });
                    }

                }).catch(function (saveSettingsError) {
                    console.log(saveSettingsError);
                });


            }
        }).catch(function (fetchSettingsError) {
            console.log(fetchSettingsError);
        });


    }
});