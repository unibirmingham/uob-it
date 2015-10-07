var UserRepository;

app.registerInitialise(function() {
    UserRepository = (function() {
        var cacheKeys = { FavoriteRooms: "%USER_REPOSITORY_FAVORITE_ROOMS" };

        var removeFavorite = function() {

        };

        var addFavorite = function() {

        };

        var getAllFavorites = Promise.method(function() {
            return LocalStorageService.GetItem(cacheKeys.FavoriteRooms).catch(function (error) {
                console.log(error);
            });
        });

        return {
            GetAllFavorites: getAllFavorites,
            AddFavorite: addFavorite,
            RemoveFavorite: removeFavorite,
            CacheKeys: cacheKeys
        }
    })();
});