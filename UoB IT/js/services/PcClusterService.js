/*
 PC Cluster Service.
 */

var PcClusterService;

app.registerInitialise(function () {

    PcClusterService = (function () {

        var forceRefreshKeys = {};

        var cacheKeys = {
            AllPCs: "%PC_CLUSTER_SERVICE_GET_ALL_PCS",
            Campus: "%PC_CLUSTER_SERVICE_CAMPUS%"
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

        var getCampuses = Promise.method(function() {
            return new Promise(function(resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(urls.Campus, cacheKeys.Campus).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
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
            GetNearestPCs: getNearestPcsToMe,
            RefreshData: forceRefresh,
            CacheKeys: cacheKeys
        }

    })();
});