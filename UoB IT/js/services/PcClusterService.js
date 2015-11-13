/*
 PC Cluster Service.
 */

var PcClusterService;

app.registerInitialise(function () {

    PcClusterService = (function () {

        var forceRefreshKeys = {};

        var cacheKeys = {
            AllPCs: "%PC_CLUSTER_SERVICE_GET_ALL_PCS%",
            Campuses: "%PC_CLUSTER_SERVICE_CAMPUS%",
            Campus: "%PC_CLUSTER_SERVICE_CAMPUS_{CAMPUSID}%",
            CampusBuildings: "%PC_CLUSTER_SERVICE_BUILDINGS_{MAPID}%",
            CampusBuildingsWildCard: "%PC_CLUSTER_SERVICE_BUILDINGS_",
            BuildingClusters: "%PC_CLUSTER_SERVICE_CLUSTERS_{BUILDINGID}%",
            PcCounts: "%PC_CLUSTER_SERVICE_PC_COUNTS%"
        };

        // List of Service endpoints for Pc Cluster functions
        // Some service requests require specific data such as buildingId or MapId
        var urls = {
            NearestPCs: "http://www.birmingham.ac.uk/web_services/Clusters.svc/nearestpc",
            Campus: "http://www.birmingham.ac.uk/web_services/Clusters.svc/maps",
            Buildings: "http://www.birmingham.ac.uk/web_services/Clusters.svc/maps/{MAPID}/buildings",
            Clusters: "http://www.birmingham.ac.uk/web_services/Clusters.svc/buildings/{BUILDINGID}/clusters"

        };

        //generates the service url for PC location based upon current or a default location
        var pcUrlCreator = function (coords) {
            if (coords == null || coords.length != 1) {
                console.log("invalid coords array passed into pcUrlCreator: " + coords);
                coords = [52.45049111433046, -1.9307774305343628];
            }

            return urls.NearestPCs + "?lat=" + coords[0] + "&long=" + coords[1];
        }


        //returns all PCs using the phones location to populate distance
        var getNearestPcsToMe = Promise.method(function (location) {

            return new Promise(function (resolve, reject) {
                // resolve(data)
                return RemoteServiceManager.FetchRemoteCache(pcUrlCreator(location), cacheKeys.AllPCs).then(function (result) {
                    resolve(result.data);
                }).catch(function (error) {

                    reject(error);
                });

            });

        });

        //returns all iniversity defined campuses
        var getCampuses = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(urls.Campus, cacheKeys.Campuses).then(function (result) {

                   // console.log(result);
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

        //returns buildings for specified campus (id)
        var getCampusBuildings = Promise.method(function (campusId) {
            //console.log(campusId);
            return new Promise(function (resolve, reject) {

                if (campusId == null) {
                    reject("No campus id passed into getCampusBuilding function");
                }
                else {
                  //  console.log(campusId);
                    return RemoteServiceManager.FetchRemoteCache(urls.Buildings.replace("{MAPID}", campusId), cacheKeys.CampusBuildings.replace("{MAPID}", campusId), campusId).then(function (result) {
                        resolve(result);
                      //  console.log(result)
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            });
        });

        //returns clusters for specified building (id)
        var getBuildingClusters = Promise.method(function (buildingId) {
            return new Promise(function (resolve, reject) {

                if (buildingId == null) {
                    reject("No building id passed into getBuildingClusters function");
                }
                else {
                    return RemoteServiceManager.FetchRemoteCache(urls.Clusters.replace("{BUILDINGID}", buildingId), cacheKeys.BuildingClusters.replace("{BUILDINGID}", buildingId), buildingId).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            });
        });

        var parseClusterCounts = Promise.method(function (pcCounts) {
            return new Promise(function(resolve, reject) {
                // return { blah: 2 };
                console.log(pcCounts);
                if (pcCounts && pcCounts.Campuses && pcCounts.Campuses) {
                    for (var key in pcCounts.Campuses) {
                        console.log(pcCounts.Campuses);
                    }
                }
            });

        });

        // This is a bit of a heavy function. It parses the entire cluster service tree, calling every
        // building and cluster service. This is currently the only way to create available PC totals
        // at both the cluster and building level. To force a refresh of all cluster data, we remove
        // all cache items pertaining to clusters
        var generatePcCounts = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                //clear all pcCluster items from local storage except for 'near me' items
                LocalStorageService.RemoveItemsByKey(cacheKeys.Campus);
                LocalStorageService.RemoveItemsByKey("%PC_CLUSTER_SERVICE_BUILDINGS_");
                LocalStorageService.RemoveItemsByKey("%PC_CLUSTER_SERVICE_CLUSTERS_");

                var pcCounts = {};

                return getCampuses().then(function (campuses) {

                    if (campuses == null || campuses.data == null || !campuses.data.length > 0) {
                        reject("CampusContent could not be populated. An attempt to fetch campuses returned null.")
                    }
                    else {
                     //   var items = {};

                        var campusCounter = campuses.data.length - 1;
                        pcCounts.Campuses = {};
                        do {


                            var campus = campuses.data[campusCounter];
                            pcCounts.Campuses[campus.ContentId] = { PcCount: 0, Buildings: {} };

                            getCampusBuildings(campus.ContentId).then(function (buildings) {

                                if (buildings != null && buildings.data != null && buildings.data.length > 0) {
                                    var buildingCounter = buildings.data.length - 1;

                                    do {
                                        var building = buildings.data[buildingCounter];
                                      
                                        pcCounts.Campuses[buildings.addition].Buildings[building.ContentId] = { PcCount: 0, Clusters: {} };
                                      
                                        getBuildingClusters(building.ContentId).then(function (clusters) {
                                            if (clusters != null && clusters.data != null && clusters.data.length > 0) {
                                                var clusterCounter = clusters.data.length - 1;

                                                var freePcsCount = 0;

                                                do {
                                                    var cluster = clusters.data[clusterCounter];
                                                    pcCounts.Campuses[buildings.addition].Buildings[clusters.addition].Clusters[cluster.ContentId] = { PcCount: cluster.NoOfPcsFree };

                                                    freePcsCount += cluster.NoOfPcsFree;

                                                } while (clusterCounter--)
                                                pcCounts.Campuses[buildings.addition].PcCount += freePcsCount;
                                                pcCounts.Campuses[buildings.addition].Buildings[clusters.addition].PcCount += freePcsCount;

                                            }
                                            else {
                                                reject("Cluster data could not be populated for all clusters.");
                                            }

                                        }).catch(function (clusterFetchError) {
                                            reject(clusterFetchError);
                                        });
                                    } while (buildingCounter--);

                                }
                            }).catch(function (buildingFetchError) {
                                //how to do multiple rejects - would this cause an issue?? perhaps just append them to a string obj then 
                                reject(buildingFetchError);
                            });

                        } while (campusCounter--)
                    }
                }).then(function () {
                    resolve(pcCounts);
                }).catch(function (campusFetchError) {
                    reject(campusFetchError);
                });

            });
        });


        var getCampusPcCounts = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return LocalStorageService.GetItem(cacheKeys.PcCounts).then(function (result) {

                    parseClusterCounts(result).then(function(clusterCounts) {
                        console.log(clusterCounts);
                    });
                }).catch(function (fetchError) {
                    //lets repopulate the cache item
                 
                    return generatePcCounts().then(function (pcCounts) {
                        LocalStorageService.StoreOrUpdate(cacheKeys.PcCounts, pcCounts).then(function (storeResult) {
                            parseClusterCounts(storeResult).then(function (clusterCounts) {
                                console.log(clusterCounts);
                            });
                        }).catch(function(storeError) {
                            reject(storeError);
                        });
                    }).catch(function (pcCountGenerationError) {
                        reject(pcCountGenerationError);
                    });
                });
            });
        });


        //fetch campus name using campus id
        var getCampus = Promise.method(function (campusId) {
            return new Promise(function (resolve, reject) {
                return getCampuses().then(function (result) {
                   
                    if (result.data.length > 0) {
                        var counter = result.data.length - 1;
                        var selectedCampus;
                        do {
                          
                            if (campusId == result.data[counter].ContentId) {
                                
                                selectedCampus = result.data[counter];
                                break;
                            }
                        } while (counter--)

                        

                        if (selectedCampus)
                            resolve(selectedCampus);
                        else
                            reject("The requested campus could not be found.");
                    }
                    else {
                        reject("Could not find campus name id: " + campusId);
                    }


                }).catch(function (getCampusError) {

                    reject(getCampusError);
                });
            });
        });

        //todo: finish this!
        var getBuilding = Promise.method(function (buildingId) {
            return new Promise(function (resolve, reject) {

                return LocalStorageService.GetItems(cacheKeys.CampusBuildingsWildCard).then(function(buildings) {

                    //getItems returns an object array
                    if (Object.keys(buildings).length > 0) {

                        var selectedBuilding;

                        outerDo:
                            for (var key in buildings) {
                                if (buildings.hasOwnProperty(key)) {
                                    var buildingList = JSON.parse(buildings[key]);

                                    if (buildingList && buildingList.data.length > 0) {

                                        var listCounter = buildingList.data.length - 1;
                                        
                                        do {
                                            var listBuilding = buildingList.data[listCounter];

                                             if (listBuilding.ContentId == buildingId) {
                                                 selectedBuilding = listBuilding;
                                                 break outerDo;
                                             }

                                        } while (listCounter--);
                                    }
                                }
                            }


                        if (selectedBuilding)
                            resolve(selectedBuilding);
                        else
                            reject("The requested building could not be found");


                    } else {
                        reject("The requested building could not be found");
                    }

                }).catch(function(fetchBuildingsError) {
                    reject(fetchBuildingsError);
                });
            });
        });

        //adds a key to the refresh array. On the next local storage request
        //for the specified key, a remote fetch will occur, the results
        //being pushed back to local storage
        var forceRefresh = function (key) {

            forceRefreshKeys[key] = true;
        };


        return {
            GetCampuses: getCampuses,
            GetCampusBuildings: getCampusBuildings,
            GetBuildingClusters: getBuildingClusters,
            GetNearestPCs: getNearestPcsToMe,
            GetCampus: getCampus,
            GetCampusPcCounts: getCampusPcCounts,
            GeneratePcCounts: generatePcCounts,
            GetBuilding: getBuilding,
            RefreshData: forceRefresh,
            CacheKeys: cacheKeys
        }

    })();
});