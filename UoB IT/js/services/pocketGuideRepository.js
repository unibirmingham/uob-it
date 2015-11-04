/*
  Pocket Guide repository.
*/

var PocketGuideRepository;

app.registerInitialise(function() {

    PocketGuideRepository = (function() {

        var cacheKeys = { AllGuide: "%POCKET_GUIDE_REPOSITORY_ALL" };

        var pocketGuideUrl = "http://alfred.bham.ac.uk/pocket_guides/index.json";

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

        var getPocketGuideAll = function() {
            
        }


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
