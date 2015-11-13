'use strict';

var fullPcList;
var location;

models.pcClusters = kendo.observable({
    onInit: function () {

    },
    onShow: function () {

    }
});

models.pcClusters.displayLastUpdated = function (lastUpdated) {
    $("#lastUpdated").html("last updated " + moment.duration(moment(lastUpdated).diff(moment())).humanize() + " ago");
};

models.pcClusters.Campuses = {
    title: "Campuses",
    onShow: function () {

        models.pcClusters.Campuses.dataSource = new kendo.data.DataSource({
            type: 'json',
            transport: {
                read: function (options) {

                    PcClusterService.GetCampuses().then(function (campuses) {

                        if (campuses && campuses.data.length > 0) {
                            PcClusterService.GetCampusPcCounts().then(function (counts) {

                                // If GetCampusPcCounts returns a valid object, lets
                                // merge it with the existing campuses objects, so we
                                // can use the kendo template to bind the extra data

                                if (counts && Object.keys(counts.Clusters).length > 0)
                                {
                                    models.pcClusters.displayLastUpdated(counts.lastUpdated);
                                    var campusCount = campuses.data.length - 1;

                                    do {

                                        campuses.data[campusCount].AvailablePCs = 0;
                                        campuses.data[campusCount].NumberOfBuildings = 0;
                                        var currentCount = counts.Clusters[campuses.data[campusCount].ContentId];

                                        if (currentCount) {
                                            campuses.data[campusCount].AvailablePCs = currentCount.AvailablePCs;
                                            campuses.data[campusCount].NumberOfBuildings = currentCount.NumberOfBuildings;
                                         
                                        }
                                    } while (campusCount--);


                                    options.success(campuses.data);
                                }
                                else {
                                    options.success(campuses.data);
                                }


                            }).catch(function (error) {
                                console.log(error);
                            });
                        }

                    
                    }).catch(function (pcFetchError) {
                        options.error(pcFetchError);
                    });
                }
            },
            error: function (e) {
                console.log(e);
            }
        });

        $("#pcCampuses").data("kendoMobileListView").setDataSource(models.pcClusters.Campuses.dataSource);
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


                            PcClusterService.GetBuildingPcCounts(campusId);

                            models.pcClusters.displayLastUpdated(buildingData.lastUpdated);
                            console.log(buildingData.lastUpdated);

                            options.success(buildingData.data);


                        }).catch(function (pcFetchError) {
                            options.error(pcFetchError);
                        });

                    }
                }
            });



            PcClusterService.GetCampus(campusId).then(function (campus) {
                $("#buildingsMainTitle").html("Buildings <span style='font-size: small;'>(" + campus.MapName + ")</span>");
            }).catch(function (nameError) {
                $("#buildingsMainTitle").html("Buildings");
            });

            //because we need a passed in param to fetch the correct building data, we need to have the datasource definition
            //in onShow, then we manually bind the result to the correct template control
            $("#pcBuildings").data("kendoMobileListView").setDataSource(models.pcClusters.Buildings.dataSource);
        }
        else {
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

            PcClusterService.GetBuilding(buildingId).then(function (building) {
                $("#clustersMainTitle").html("Clusters <span style='font-size: small;'>(" + building.BuildingName + ")</span>");
            }).catch(function (error) {

                $("#clustersMainTitle").html("Buildings");
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