/*
  Pocket Guide repository.
*/

var PocketGuideRepository;

app.registerInitialise(function () {

    PocketGuideRepository = (function () {

        var cacheKeys = { AllGuide: "%POCKET_GUIDE_REPOSITORY_ALL" };

        var pocketGuideUrl = "http://alfred.bham.ac.uk/pocket_guides/index.json";

        var forceRefreshKeys = {};

        var getPocketGuideAll = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(pocketGuideUrl, cacheKeys.AllGuide).then(function (result) {
                    return (result);
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
            CacheKeys: cacheKeys,
            GetPocketGuideFull: getPocketGuideAll,
            RefreshData: forceRefresh
        }

    })();
});
