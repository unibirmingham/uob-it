/*
    Local storage sevice.
    All db/local storage operations should use this facade.
*/

//Add setObject / getObject to localStorage so we don't have to keep parsing and stringifying data for our json objects
Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}


var LocalStorageService;

app.registerInitialise(function () {
    //only for dev! 
    //localStorage.clear();
    LocalStorageService = (function () {

        var getItem = Promise.method(function (cacheName) {

            return new Promise(function (resolve, reject) {
                if (typeof (Storage) !== "undefined") {
                    var item = localStorage.getObject(cacheName);

                    if (item) {
                        resolve(item);
                    } else {
                        reject("The requested item could not be found");
                    }
                } else {
                    reject("No localStorage support!");
                }
            });
        });

        //fetches all items with the unique identifier.
        var getItems = Promise.method(function (cacheName) {

            return new Promise(function (resolve, reject) {
                if (typeof (Storage) !== "undefined") {
                    var item = localStorage.getObject(cacheName);

                    if (item) {
                        resolve(item);
                    } else {
                        reject("The requested items could not be found");
                    }
                } else {
                    reject("No localStorage support!");
                }
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
                if (typeof (Storage) !== "undefined") {

                    if (item == null) {
                        reject("The item is null");
                    }
                    else {

                        item.lastUpdated = moment();
                  
                        localStorage.setObject(cacheName, item);
                        console.log(item);
                        if (localStorage.getObject(cacheName))
                            resolve(item);
                        else
                            reject("The item could not be saved");
                    }
                } else {
                    reject("No localStorage support!");
                }
            });
        });

        //Not using yet
        //Allows individual collection items to be passed in 
        //in bulk. More efficient than put.
        var setBulk = Promise.method(function (items) {
            return new Promise(function (resolve, reject) {
                reject("Not implemented for localStorage provider!");
            });
        });

        //Places an item into local db, generating an _id if
        //the item doesnt have a unique identifier.
        var setItem = Promise.method(function (cacheName, item) {

            if (item._id == undefined)
                item._id = cacheName;

            return new Promise(function (resolve, reject) {
                if (typeof (Storage) !== "undefined") {


                    localStorage.setObject(cacheName, item);

                    if (localStorage.getObject(cacheName))
                        resolve(item);
                    else
                        reject("The item could not be saved");
                } else {
                    reject("No localStorage support!");
                }
            });
        });

        //Updates the specified item in the local db
        var updateItem = Promise.method(function (item) {

            return new Promise(function (resolve, reject) {
                if (!item._id) {
                    reject("Item contains no _id, use StoreItem instead.");
                } else {
                    if (typeof (Storage) !== "undefined") {

                        localStorage.setObject(item._id, item);

                        if (localStorage.getObject(item._id))
                            resolve(item);
                        else
                            reject("The item could not be saved");
                    } else {
                        reject("No localStorage support!");
                    }
                }
            });
        });


        var removeItem = Promise.method(function (item) {
            return new Promise(function (resolve, reject) {
                if (!item._id) {
                    reject("Item contains no _id.");
                } else {
                    if (typeof (Storage) !== "undefined") {

                        localStorage.removeItem(item._id);

                        if (localStorage.getObject(item._id))
                            resolve("Item was successfully removed from Cache.");
                        else
                            reject("An error occurred. The item was not removed from cache.");
                    } else {
                        reject("No localStorage support!");
                    }
                }
            });
        });

        var recoverItem = Promise.method(function (item) {
            //TODO: needs work. Need to get revs, then reinsert last rev?
            //     console.log("recoverItem func");
            return new Promise(function (resolve, reject) {
                reject("Not implemented for localStorage provider!");
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



