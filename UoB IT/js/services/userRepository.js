/*
    User repository.
    All user based operationsoperations should go here e.g. favprites, settings etc
 */

var UserRepository;

app.registerInitialise(function () {
    UserRepository = (function () {
        var cacheKeys = {
            FavoriteRooms: "%USER_REPOSITORY_FAVORITE_ROOMS%",
            Settings: "%USER_REPOSITORY_APP_SETTINGS%"
        };

        var favorites = {}

        //internal func
        var saveFavorites = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return LocalStorageService.StoreOrUpdate(cacheKeys.FavoriteRooms, favorites).then(function (result) {
                    favorites = result;
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });


        var removeFavorite = Promise.method(function (item) {

            var key = item.BuildingId + "_" + item.RoomId;
            return new Promise(function (resolve, reject) {
                if (delete favorites[key]) {
                    resolve(saveFavorites());
                } else {
                    reject("could not delete item '" + key + "' from favorites.");
                }
            });
        });

        var addFavorite = Promise.method(function (item) {
            var key = item.BuildingId + "_" + item.RoomId;

            favorites[key] = item;

            return new Promise(function (resolve) {
                resolve(saveFavorites());
            });

        });

        var getAllFavorites = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return LocalStorageService.GetItem(cacheKeys.FavoriteRooms).then(function (items) {
                    favorites = items;
                    resolve(items);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

        // fetching a local file using .getJson might not work in all browsers due to security
        // if it fails on any mobile, use http://requirejs.org/ to pull the file in, see here:
        // http://stackoverflow.com/questions/7346563/loading-local-json-file
        var getSettings = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(LocalFileManager.Files.Settings, cacheKeys.Settings).then(function (result) {
                    resolve(result);
                 //   console.log(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

        var saveSettings = Promise.method(function (settings) {
            return new Promise(function (resolve, reject) {
                return LocalStorageService.StoreOrUpdate(cacheKeys.Settings, settings).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });

        });

        return {
            GetAllFavorites: getAllFavorites,
            AddFavorite: addFavorite,
            RemoveFavorite: removeFavorite,
            CacheKeys: cacheKeys,
            GetSettings: getSettings,
            SaveSettings: saveSettings
        }
    })();
});