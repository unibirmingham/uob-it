/*
    Local storage sevice.
    All db/local storage operations should use this facade.

   ### currently using pouch db ###
   All items inserted into PouchDB *must* have a unique '_id' field. 
   I'm currently using cache keys for this purpose.
*/

var LocalStorageService;

//todo: look into fallback to localstorage, see here: http://pouchdb.com/adapters.html

app.registerInitialise(function () {

    LocalStorageService = (function () {

        //PouchDB('UoBITApp').destroy();

        //set up PouchDB with the websql adapter. We provide a fall back if the phone
        //doesn't support websql
        var db = new PouchDB('UoBITApp', { adapter: 'websql' });

        if (!db.adapter) {
            // websql not supported by this browser, so fall back
             db = new PouchDB('UoBITApp');
             console.log("websql not supported");
         }

        //comment this out in production.
    //     PouchDB.debug.enable('*');

        //fetches item from the local DB
         var getItem = Promise.method(function (cacheName) {

             return new Promise(function(resolve, reject) {
                 db.get(cacheName).then(function(returnedItem) {

                     resolve(returnedItem);
                 }).catch(function(error) {
                     reject(error);
                 });
             });

         });

        //fetches all items with the unique identifier. We use
        // \uffff to fetch all wildcards matching the first part of the identifier.
        var getItems = Promise.method(function (identifier) {

            return new Promise(function (resolve, reject) {
                return db.allDocs({
                    include_docs: true,
                    startkey: identifier,
                    endkey: identifier + "\uffff"
                }).then(function(result) {
                    resolve(result);
                }).catch(function(error) {
                    reject(error);
                });
            });

        });

        //pouch db can either store or update, not overwrite. This function
        //takes an item and firsts checks to see if we can place it in 
        //local db. If not, and the returned failure is 409 (item exists),
        //we do an update on the item instead.
         var storeOrUpdate = Promise.method(function (cacheName, item) {

            if (item._id == undefined)
                item._id = cacheName;

            return new Promise(function (resolve, reject) {
                return db.put(item).then(function(result) {
                 
                }).catch(function (error) {
                
                    if (error.status == 409) {
                        db.get(item._id).then(function (doc) {
                            doc.data = item.data;
                            return db.put(doc);
                        }).then(function (tsttt) {
                          
                            resolve(db.get(item._id));
                        }).catch(function (subError) {
                            reject(subError);
                        });
                    } 
                    else
                    {
                        reject(error);
                    }
                });
            });
         });



        /*else if (error.status == 404) {//} && reason == "deleted") {
                            //recover item and reinsert
                            return LocalStorageService.RecoverItem(item._id).then(function (recoverResult) {
                                resolve(recoverResult);
                            }).catch(function (subError) {
                                reject(subError);
                            });
                    }*/

        //Not using yet
        //Allows individual collection items to be passed in 
        //in bulk. More efficient than put.
        var setBulk = Promise.method(function(items) {
            return new Promise(function(resolve, reject) {
                return db.bulkDocs(items).then(function (result) {
                    resolve(result);
                }).catch(function(error) {
                    reject(error);
                });
            });
        });

        //Places an item into local db, generating an _id if
        //the item doesnt have a unique identifier.
        var setItem = Promise.method(function (cacheName, item) {

             if (item._id == undefined)
                 item._id = cacheName;

            return new Promise(function(resolve, reject) {
                return db.put(item).then(function (result) {
                    resolve(result);
                }).catch(function(error) {
                    reject(error);
                });
            });

        });

        //Updates the specified item in the local db
        var updateItem = Promise.method(function(item) {
            return new Promise(function (resolve, reject) {

                db.get(item._id).then(function(doc) {
                    return db.put(doc);
                }).then(function() {
                    return db.get(item._id).then(function(result) {
                        resolve(result);
                    }).catch(function (error) {

                        if (error.status == 404) {//} && reason == "deleted") {
                            //recover item and reinsert
                            return LocalStorageService.RecoverItem(item._id).then(function(recoverResult) {
                                resolve(recoverResult);
                            }).catch(function(subError) {
                                reject(subError);
                            });
                        } else {
                            reject(error);
                        }
                        
                    });
                }).catch(function(error) {
                    reject(error);
                });
            });
        });


        /*                    if (error.status == "404" && reason == "deleted") {
                        //recover item and reinsert
                        return LocalStorageService.RecoverItem(cacheKeys.FavoriteRooms + "_" + item.BuildingId + "_" + item.RoomId, item).then(function(recoverResult) {
                            resolve(recoverResult);
                        }).catch(function(subError) {
                            reject(subError);
                        });
                    }*/

        var removeItem = Promise.method(function(item) {
            return new Promise(function(resolve, reject) {
                db.get(item).then(function(document) {
                    resolve(db.remove(document));
                }).catch(function(error) {
                    reject(error);
                });
            });
        });

        var recoverItem = Promise.method(function (item) {
            //TODO: needs work. Need to get revs, then reinsert last rev?
       //     console.log("recoverItem func");
            return new Promise(function (resolve, reject) {
                db.get(item/*, { revs: true, open_revs: 'all' }*/).then(function (document) {
                    // document._deleted = false;
                    console.log(document);
                    resolve(db.put(document));
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

        //accessors
         return {
             GetItem: getItem,
             GetItems: getItems,
             StoreItem: setItem,
             StoreItems: setBulk,
             UpdateItem: updateItem,
             StoreOrUpdate: storeOrUpdate,
             RemoveItem: removeItem,
             RecoverItem: recoverItem
         }

     })();
});



