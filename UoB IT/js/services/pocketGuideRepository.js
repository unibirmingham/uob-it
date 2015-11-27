/*
  Pocket Guide repository.
*/

var PocketGuideRepository;

app.registerInitialise(function () {

    PocketGuideRepository = (function () {

        var cacheKeys = { AllGuide: "%POCKET_GUIDE_REPOSITORY_ALL%", AllSections: "%POCKET_GUIDE_REPOSITORY_ALLSECTIONS%"};

        var pocketGuideUrl = "http://alfred.bham.ac.uk/pocket_guides/index.json";

        var getPocketGuideAll = Promise.method(function () {
        
            return new Promise(function (resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(pocketGuideUrl, cacheKeys.AllGuide).then(function (result) {

                    resolve (result);
                }).catch(function (error) {

                    reject(error);
                });
            });
        });

        var getAllSections = Promise.method(function () {
            return new Promise(function (resolve, reject) {

               // return LocalStorageService.GetItem(cacheKeys.AllSections).then(function (sections) {

                 //   resolve(sections);
               // }).catch(function (fetchSectionError) {

                    //Sections not found, lets repopulate them from the full pocket guide
                return getPocketGuideAll().then(function(fullGuide) {

                    if (fullGuide && fullGuide.data && fullGuide.data.length > 0) {

                        var fullGuideCounter = fullGuide.data.length - 1;
                        var sectionArray = [];
                        do {
                            var currentItem = fullGuide.data[fullGuideCounter];

                            if (currentItem.PageFunction == "page" && currentItem.ParentId == 22) {
                                sectionArray.push(fullGuide.data[fullGuideCounter]);
                            }

                        } while (fullGuideCounter--);


                        resolve(sectionArray);

                        /*   return LocalStorageService.StoreOrUpdate(cacheKeys.AllSections, sectionArray).then(function (storedItem) {
                                resolve(storedItem);
                            }).catch(function (sectionArrayError) {
                                reject(sectionArrayError);
                            });*/
                    }
                }).catch(function(fetchGuideError) {
                    reject(fetchGuideError);
                });
            });
            //});
        });

        //recursive search for child Ids
        var parseChildPageIds = function (fullGuide, item) {

            var fullGuideCounter = fullGuide.length - 1;

            do {
                var currentItem = fullGuide.data[fullGuideCounter];

                if (currentItem.ParentId == item.id) {
                    selectedPage.ChildPages.push(fullGuide.data[fullGuideCounter]);
                    break;
                }

            } while (fullGuideCounter--);

            return item;
        };

        var getPage = Promise.method(function (pageId) {
            return new Promise(function (resolve, reject) {
              
              //  return LocalStorageService.GetItem(cacheKeys.AllSections).then(function (sections) {

               //     resolve(sections);
              //  }).catch(function (fetchSectionError) {

                    //Sections not found, lets repopulate them from the full pocket guide
                return getPocketGuideAll().then(function(fullGuide) {

                    if (fullGuide && fullGuide.data && fullGuide.data.length > 0) {

                        var fullGuideCounter = fullGuide.data.length - 1;
                        var selectedPage;

                        do {
                            var currentItem = fullGuide.data[fullGuideCounter];

                            if (currentItem.id == pageId) {
                                selectedPage = fullGuide.data[fullGuideCounter];
                                break;
                            }

                        } while (fullGuideCounter--);

                        if (selectedPage) {

                            if (selectedPage.hasChildren) {

                                selectedPage.ChildPageIds = [];
                                selectedPage = parseChildPageIds(fullGuide.data, selectedPage);
                            }
                            console.log(selectedPage);

                            // we push the single page into a 1 element array due to the templater expecting an array.
                            // see if theres a way to bind to a single item

                            var arrayContainer = [];
                            arrayContainer.push(selectedPage);

                            resolve(arrayContainer);
                        } else {
                            reject("The selected page could not be found.");
                        }
                        /*  return LocalStorageService.StoreOrUpdate(cacheKeys.AllSections, sectionArray).then(function (storedItem) {
                                resolve(storedItem);
                            }).catch(function (sectionArrayError) {
                                reject(sectionArrayError);
                            });*/
                    }
                }).catch(function(fetchGuideError) {
                    reject(fetchGuideError);
                });
            });
           // });
        });

        return {
            GetPocketGuideFull: getPocketGuideAll,
            GetAllSections: getAllSections,
            GetPage: getPage,
            CacheKeys: cacheKeys
        }

    })();
});
