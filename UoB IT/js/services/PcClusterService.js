/*
 PC Cluster Service.
 */

var PcClusterService;

app.registerInitialise(function () {

    PcClusterService = (function () {

        var forceRefreshKeys = {};

        var cacheKeys = {
            AllPCs: "%PC_CLUSTER_SERVICE_GET_ALL_PCS%",
            Campus: "%PC_CLUSTER_SERVICE_CAMPUS%",
            CampusBuildings: "%PC_CLUSTER_SERVICE_BUILDINGS_{MAPID}%",
            BuildingClusters: "%PC_CLUSTER_SERVICE_CLUSTERS_{BUILDINGID}%"
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
                    resolve(result);
                }).catch(function (error) {

                    reject(error);
                });

            });

        });

        //returns all iniversity defined campuses
        var getCampuses = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(urls.Campus, cacheKeys.Campus).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

        //returns buildings for specified campus (id)
        var getCampusBuildings = Promise.method(function (campusId) {
            return new Promise(function (resolve, reject) {

                if (campusId == null) {
                    reject("No campus id passed into getCampusBuilding function");
                }
                else {

                    return RemoteServiceManager.FetchRemoteCache(urls.Buildings.replace("{MAPID}", campusId), cacheKeys.CampusBuildings.replace("{MAPID}", campusId)).then(function (result) {
                        resolve(result);
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
                    return RemoteServiceManager.FetchRemoteCache(urls.Clusters.replace("{BUILDINGID}", buildingId), cacheKeys.BuildingClusters.replace("{BUILDINGID}", buildingId)).then(function (result) {
                        resolve(result);
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            });
        });


        var fetchAllCampusContent = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                //clear all pcCluster items from local storage except for 'near me' items
                localStorage.removeItem(cacheKeys.Campus);

                var sKey;

                var localStorageCounter = localStorage.length - 1;

                do {
                    sKey = localStorage.key(localStorageCounter);

                    if (sKey.indexOf("%PC_CLUSTER_SERVICE_BUILDINGS_") > -1 || sKey.indexOf("%PC_CLUSTER_SERVICE_CLUSTERS_") > -1) {
                        localStorage.removeItem(localStorage.getItem(sKey));
                        console.log("removed " + sKey);
                    }

                } while (localStorageCounter--)

                return getCampuses().then(function (campuses) {

                    if (campuses == null || !campuses.length > 0) {
                        reject("CampusContent could not be populated. An attempt to fetch campuses returned null.")
                    }
                    else {
                        var items = {};
                        var campusCounter = campuses.length - 1;

                        do {
                            console.log(campuses[campusCounter].ContentId);
                            getCampusBuildings(campuses[campusCounter].ContentId).then(function (buildings) {

                                if (buildings != null && buildings.length > 0) {
                                    var buildingCounter = buildings.length - 1;

                                    do {
                                        getBuildingClusters(buildings[buildingCounter].ContentId).then(function (clusters) {
                                            console.log(clusters);
                                        }).catch(function (clusterFetchError) {
                                            console.log(clusterFetchError);
                                        });
                                    } while (buildingCounter--);

                                }


                            }).catch(function (buildingFetchError) {
                                //how to do multipel rejects - would this cause an issue?? perhaps just append them to a string obj then 
                            });

                        } while (campusCounter--)


                    }
                }).catch(function (campusFetchError) {
                    reject(campusFetchError);
                });

            });
        });

        //fetch campus name using campus id
        var getCampus = Promise.method(function (campusId) {
            return new Promise(function (resolve, reject) {
                return getCampuses().then(function (result) {

                    if (result.length > 0) {
                        var counter = result.length - 1;

                        do {
                            if (campusId == result[counter].ContentId) {
                                resolve(result[counter]);
                                break;
                            }
                        } while (counter--)
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
                /*var i = 0, items = {}, sKey;
                for (; sKey = window.localStorage.key(i) ; i++) {
                    if (sKey.indexOf("%PC_CLUSTER_SERVICE_BUILDINGS_") > -1) {
                        items[sKey] = window.localStorage.getItem(sKey);
                    }
                }

                if(items == null || !items.length > 0)
                {
                    reject("The requested building could not be found.")
                }
                else
                {
                    var counter = items.length - 1;

                    var items = {};
                    do{
                        
                    }while(counter--)
                }*/

            });
        });

        var calculateCampusPCAvailability = Promise.method(function (campuses) {
            return new Promise(function (resolve, reject) {

                if (campuses == null || !campuses.length > 0) {
                    reject("No campuses were passed into the calculateCampusPCAvailability function");
                }
                else {


                    var counter = campuses.length - 1;
                    //    getNearestPcsToMe
                    do {
                        getCampusBuildings(campuses.ContentId)
                    } while (counter--);

                    // var i = 0, items = {}, sKey;
                    /*for (; sKey = window.localStorage.key(i) ; i++) {
                        if (sKey.indexOf("%PC_CLUSTER_SERVICE_BUILDINGS_") > -1) {
                            items[sKey] = window.localStorage.getItem(sKey);
                        }
                    }*/
                }
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
            FetchAllCampusContent: fetchAllCampusContent,
            GetBuilding: getBuilding,
            RefreshData: forceRefresh,
            CacheKeys: cacheKeys
        }

    })();
});