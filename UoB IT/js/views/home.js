'use strict';

app.registerPostInitialise(function() {
    //LocationService.RefreshData(LocationService.CacheKeys.AllPCs);
});

models.home = kendo.observable({
    onShow: function () {
        console.log(app.isOnline());
        if (app.isOnline()) {
            PcClusterService.GetCampusPcCounts().then(function(counts) {
                if (counts && Object.keys(counts.Clusters).length > 0) {
                    console.log(counts);

                    var totalPcsAvailable = 0;

                    for (var key in counts.Clusters) {
                        if (counts.Clusters.hasOwnProperty(key)) {
                            totalPcsAvailable += counts.Clusters[key].AvailablePCs;

                        }
                    };

                    $("#homePcCount").html(totalPcsAvailable);
                }
            }).catch(function(error) {

            });
        }
        // setResidence(app.data.residence);

        // $("#home-logo").one("load", function() {
        // After the logo has loaded, we'll have the height of the top div, so we can add a height to the lower div and use percentage heights on the icons
        // 	$('#icons-container').height($('#home-container').outerHeight(true) - $('#logo-container').outerHeight(true));
        //  }).each(function() {
        // 	if(this.complete) $(this).load();
        // });
        //     var obj = { stuff: "dfsfdsdfsdfsdsf" }
        //   LocalStorageService.StoreOrUpdate("dfsfddddsdfs", obj);
    }//,
   // title: "gggg"
});

