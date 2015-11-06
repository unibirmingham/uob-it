'use strict';

var fullPcList;
var location;

models.pcClusters = kendo.observable({
    onInit: function () {

    },
    onShow: function () {

    }
});


models.pcClusters.Campuses = {
    title: "Campuses",
    onShow: function () {

        models.pcClusters.Campuses.dataSource = new kendo.data.DataSource({
            type: 'json',
            transport: {
                read: function(options) {

                    PcClusterService.GetCampuses().then(function(campuses) {
                 
                        $("#lastUpdated").html("last updated " + moment.duration(moment().utc().diff(campuses.lastUpdated), "minutes").humanize());

                        options.success(campuses.data);
                        
                    }).catch(function(pcFetchError) {
                        options.error(pcFetchError);
                    });
                }
            }
        });
    
        $("#pcCampuses").data("kendoMobileListView").setDataSource(models.pcClusters.Campuses.dataSource);
       

       /* PcClusterService.FetchAllCampusContent().then(function (campuses) {
            console.log("here!");
        }).catch(function (error) {
            console.log(error);
        });*/
    }
};

models.pcClusters.Buildings = {
    selectedBuildingId: -1,
    title: "Buildings",
    onShow: function (e) {

        var campusId = e.view.params.campusId;

        if (campusId) {
            models.pcClusters.Buildings.dataSource = new kendo.data.DataSource({
                type: 'json',
                transport: {
                    read: function (options) {
                        PcClusterService.GetCampusBuildings(campusId).then(function (buildingData) {
                            options.success(buildingData);
                        }).catch(function (pcFetchError) {
                            options.error(pcFetchError);
                        });

                    }
                }
            });

            PcClusterService.GetCampus(campusId).then(function (campus) {
                $("#buildingsMainTitle").append(" <span style='font-size: smaller;'>(" + campus.MapName + ")</span>");
            }).catch(function (nameError) {
                console.log(nameError);
            });

            //because we need a passed in param to fetch the correct building data, we need to have the datasource definition
            //in onShow, then we manually bind the result to the correct template control
            $("#pcBuildings").data("kendoMobileListView").setDataSource(models.pcClusters.Buildings.dataSource);
        }
        else
        {
            //display an error!
        }


    }
};


models.pcClusters.Clusters = {
    selectedBuildingId: -1,
    title: "Clusters",
    onShow: function (e) {
        var buildingId = e.view.params.buildingId;

        if (buildingId) {
            models.pcClusters.Clusters.dataSource = new kendo.data.DataSource({
                type: 'json',
                transport: {
                    read: function (options) {
                        PcClusterService.GetBuildingClusters(buildingId).then(function (clusterData) {
                            options.success(clusterData);
                        }).catch(function (pcFetchError) {
                            options.error(pcFetchError);
                        });

                    }
                }
            });

          /*  PcClusterService.GetCampus(campusId).then(function (campus) {
                $("#buildingsMainTitle").append(" <span style='font-size: smaller;'>(" + campus.MapName + ")</span>");
            }).catch(function (nameError) {
                console.log(nameError);
            });*/

            //because we need a passed in param to fetch the correct building data, we need to have the datasource definition
            //in onShow, then we manually bind the result to the correct template control
            $("#pcClusters").data("kendoMobileListView").setDataSource(models.pcClusters.Clusters.dataSource);
        }
        else {
            //display an error!
        }


    }
};


models.pcClusters.FavoriteList = {
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