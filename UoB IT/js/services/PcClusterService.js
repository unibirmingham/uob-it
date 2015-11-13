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

        var parseCampusCounts = Promise.method(function (pcCounts) {
            return new Promise(function (resolve, reject) {
                console.log(pcCounts);
                var clusterCounts = {};
                clusterCounts.lastUpdated = pcCounts.lastUpdated;
                clusterCounts.Clusters = {};

                if (pcCounts && pcCounts.Campuses && pcCounts.Campuses) {
                    for (var key in pcCounts.Campuses) {
                        if (pcCounts.Campuses.hasOwnProperty(key)) {

                            clusterCounts.Clusters[key] = { AvailablePCs: 0, NumberOfBuildings: 0 };
                            clusterCounts.Clusters[key].AvailablePCs = pcCounts.Campuses[key].PcCount;
                            clusterCounts.Clusters[key].NumberOfBuildings = pcCounts.Campuses[key].BuildingCount;
                        }
                    }

                    resolve(clusterCounts);
                }
                else
                {
                    reject("Cluster count data could not be parsed");
                }
            });

        });

        // This is a bit of a heavy function. It parses the entire cluster service tree, calling every
        // building and cluster service. This is currently the only way to create available PC totals
        // at both the cluster and building level. To force a refresh of all cluster data, we remove
        // all cache items pertaining to clusters.
        // We have to use Promise.each to force all promises to be resolved before resolving pcCount object, if we
        // don't do this, the pcCount object gets Json.stringified to localStorage before it has fully resolved,
        // consequently storing a broken empty object
        var generatePcCounts = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                //todo: do we need to clear out campus and building data? This is very unlikely to change frequently
                LocalStorageService.RemoveItemsByKey(cacheKeys.Campus);
                LocalStorageService.RemoveItemsByKey("%PC_CLUSTER_SERVICE_BUILDINGS_");
                LocalStorageService.RemoveItemsByKey("%PC_CLUSTER_SERVICE_CLUSTERS_");

                var pcCounts = {};

                return getCampuses().then(function (campuses) {

                    if (campuses == null || campuses.data == null || !campuses.data.length > 0) {
                        reject("CampusContent could not be populated. An attempt to fetch campuses returned null.")
                    }
                    else {
      
                        pcCounts.Campuses = {};
                        return Promise.each(campuses.data, function (campus) {

                            pcCounts.Campuses[campus.ContentId] = { PcCount: 0, BuildingCount: 0, Buildings: {} };

                            return getCampusBuildings(campus.ContentId).then(function (building) {
                                return Promise.each(building.data, function (building) {

                                    pcCounts.Campuses[campus.ContentId].BuildingCount++;
                                    pcCounts.Campuses[campus.ContentId].Buildings[building.ContentId] = { PcCount: 0, ClusterCount: 0, Clusters: {} };

                                    return getBuildingClusters(building.ContentId).then(function (cluster) {

                                        return Promise.each(cluster.data, function (cluster) {

                                            pcCounts.Campuses[campus.ContentId].Buildings[building.ContentId].Clusters[cluster.ContentId] = { PcCount: cluster.NoOfPcsFree };
                                            pcCounts.Campuses[campus.ContentId].Buildings[building.ContentId].ClusterCount++;

                                            pcCounts.Campuses[campus.ContentId].PcCount += cluster.NoOfPcsFree;
                                            pcCounts.Campuses[campus.ContentId].Buildings[building.ContentId].PcCount += cluster.NoOfPcsFree;
                                        });

                                    });
                                });
                            });

                        }).then(function () {
                            resolve(pcCounts);
                        });
                    }
                }).then(function () {

                   
                }).catch(function (campusFetchError) {
                    reject(campusFetchError);
                });



            });
        });

        var getCampusPcCounts = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return LocalStorageService.GetItem(cacheKeys.PcCounts).then(function (result) {

                    return parseCampusCounts(result).then(function (clusterCounts) {
                        resolve(clusterCounts);
                    });
                }).catch(function (fetchError) {
                    //lets repopulate the cache item
                 
                    return generatePcCounts().then(function (pcCounts) {
                        
                        return LocalStorageService.StoreOrUpdate(cacheKeys.PcCounts, pcCounts).then(function (storeResult) {
                            return parseCampusCounts(storeResult).then(function (clusterCounts) {
                                resolve(clusterCounts);
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