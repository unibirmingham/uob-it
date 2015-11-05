/*
    Remote Service Manager.
    Provides an interface for intergating with remote services - currently used for json services
*/

var RemoteServiceManager;

app.registerInitialise(function () {

    RemoteServiceManager = (function() {

        var forceRefreshKeys = {};

        //fetched data from a remote source
        var getDataRemote = Promise.method(function (url) {
            return new Promise(function (resolve, reject) {
                return $.getJSON(url, function (data) {
                    resolve(data);
                }).error(function (jqXhr, textStatus, errorThrown) {
                    reject({ jqXhr, textStatus, errorThrown });
                });
            });
        });

        //Checks local storage for a copy of the desired data, if it doesnt
        //exist, it'll pull it in from the passed in service url
        //and put it to local storage using the defined key
        var getDataRemoteAndCache = Promise.method(function (url, key) {

            return LocalStorageService.GetItem(key).then(function (storedData) {

                var ignoreLocal = forceRefreshKeys[key] == undefined ? false : forceRefreshKeys[key];

                if (forceRefreshKeys[key])
                    forceRefreshKeys[key] = false;



                return new Promise(function (resolve, reject) {
                    if (storedData != null && !ignoreLocal) {
                        resolve(storedData.data);
                    } else {

                        if (ignoreLocal)
                            ignoreLocal = false;

                        return RemoteServiceManager.FetchRemote(url).then(function (data) {


                            LocalStorageService.StoreOrUpdate(key, { data }).then(function (results) {
                                resolve(data);
                            }).catch(function (error) {
                                reject(error);
                            });
                        });
                    };
                });


            }).catch(function () {

                return new Promise(function (resolve, reject) {
                    return RemoteServiceManager.FetchRemote(url).then(function (data) {
                        return LocalStorageService.StoreOrUpdate(key, { data }).then(function (results) {

                            resolve(data);
                        }).catch(function (storeError) {
           
                            reject(storeError);
                        });
                    }).catch(function (fetchError) {

                        reject(fetchError);
                    });
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
            FetchRemote: getDataRemote,
            FetchRemoteCache: getDataRemoteAndCache,
            RefreshData: forceRefresh
        }

    })();
});