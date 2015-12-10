/*
    Local file manager service
    Handles access to local files such as offline .json files etc
*/

var LocalFileManager;

app.registerInitialise(function () {

    LocalFileManager = (function () {

        var keys = { PcClusters: "/data/PcClusters.json", Settings: "/data/Settings.json", PocketGuide: "/data/PocketGuide.json" };

        var getFile = Promise.method(function(file) {
            return new Promise(function (resolve, reject) {
                //todo: perhaps reject on invalid key + see if theres a way to detect missing requested file in the /data/ dir ?
               
                //var file = keys[key];

                if (file) {

                    require(["json!" + file], function (data) {

                        resolve(data);

                    });
                }
                else
                {
                    reject("The requested file could not be found.");
                }

            });
        });

        var getFileCache = Promise.method(function (file, key) {
            return new Promise(function (resolve, reject) {
                //todo: perhaps reject on invalid key + see if theres a way to detect missing requested file in the /data/ dir ?
              
              //  console.log(file);
                return LocalStorageService.GetItem(key).then(function (storedData) {
                 
              
                        if (storedData != null) {

                            resolve(storedData);
                        } else {


                            return getFile(file).then(function (data) {
                             
                                return LocalStorageService.StoreOrUpdate(key, { data }).then(function (results) {
                                    resolve(results);
                                }).catch(function (error) {
                                    reject(error);
                                });
                            });
                        };
                  


                }).catch(function (error) {
                    
             
                        return getFile(file).then(function (data) {

                            if (data != null) {
                                return LocalStorageService.StoreOrUpdate(key, { data }).then(function (results) {
                        
                                    resolve(results);
                                }).catch(function (storeError) {
                                    
                                    reject(storeError);
                                });
                            }
                            else
                            {
                                reject("an error occurred, the requested file could not be found.");
                            }
                        }).catch(function (fetchError) {

                            reject(fetchError);
                        });
                   
                });
            });
        });

        return {
            Files: keys,
            GetFile: getFile,
            GetFileCache: getFileCache
        }

    })();
});