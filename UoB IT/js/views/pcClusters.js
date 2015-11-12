'use strict';

var fullPcList;
var location;

models.pcClusters = kendo.observable({
    onInit: function () {

    },
    onShow: function () {

    }
});

models.pcClusters.displayLastUpdated = function(lastUpdated) {
    $("#lastUpdated").html("last updated " + moment.duration(moment(lastUpdated).diff(moment())).humanize() + " ago");
};

models.pcClusters.Campuses = {
    title: "Campuses",
    onShow: function () {

        models.pcClusters.Campuses.dataSource = new kendo.data.DataSource({
            type: 'json',
            transport: {
                read: function(options) {

                    PcClusterService.GetCampuses().then(function (campuses) {
                        //alert(campuses);
                        models.pcClusters.displayLastUpdated(campuses.lastUpdated);

                        options.success(campuses.data);
                        
                    }).catch(function (pcFetchError) {
                       // alert(pcFetchError);
                        options.error(pcFetchError);
                    });
                }
            },
            error: function (e) {
                console.log(e);
            }
        });
    
        $("#pcCampuses").data("kendoMobileListView").setDataSource(models.pcClusters.Campuses.dataSource);
       

        PcClusterService.GeneratePcCounts().then(function (campuses) {  //GetCampusPcCounts()
            console.log(campuses);
        }).catch(function (error) {
            console.log(error);
        });
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

                            models.pcClusters.displayLastUpdated(buildingData.lastUpdated);
                            console.log(buildingData.lastUpdated);

                            options.success(buildingData.data);


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

                            models.pcClusters.displayLastUpdated(clusterData.lastUpdated);
                          
                            options.success(clusterData.data);
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