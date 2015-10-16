/*
    User repository.
    All user based operationsoperations should go here e.g. favprites, settings etc
 */

var UserRepository;

app.registerInitialise(function() {
    UserRepository = (function() {
        var cacheKeys = { FavoriteRooms: "%USER_REPOSITORY_FAVORITE_ROOMS", Settings: "%USER_REPOSITORY_APP_SETTINGS" };

        var removeFavorite = function(item) {
            return new Promise(function (resolve, reject) {
                return LocalStorageService.RemoveItem(cacheKeys.FavoriteRooms + "_" + item.BuildingId + "_" + item.RoomId, item).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        };

        var addFavorite = Promise.method(function (item) {
            return new Promise(function(resolve, reject) {
                return LocalStorageService.StoreOrUpdate(cacheKeys.FavoriteRooms + "_" + item.BuildingId + "_" + item.RoomId, item).then(function (result) {
                    resolve(result);
                }).catch(function (error) {


                    reject(error);
                });
            });
        });

        var getAllFavorites = Promise.method(function () {
            return new Promise(function(resolve, reject) {
                return LocalStorageService.GetItems(cacheKeys.FavoriteRooms).then(function (items) {
                    resolve(items);
                }).catch(function(error) {

                    reject(error);
                });
            });
        });

        var getSettings = Promise.method(function () {
            return new Promise(function(resolve, reject) {
                return LocalStorageService.GetItem(cacheKeys.Settings).then(function(item) {
                    resolve(item);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

        var saveSettings = Promise.method(function(settings) {
            return LocalStorageService.StoreOrUpdate(cacheKeys.Settings, settings).then(function (result) {
                resolve(result);
            }).catch(function (error) {
                reject(error);
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