var LocalStorageService;

//todo: look into fallback to localstorage, see here: http://pouchdb.com/adapters.html

app.registerInitialise(function () {
    console.log("in localStorageService registerInitialise");
    LocalStorageService = (function () {

         var db = new PouchDB('UoBITApp', { adapter: 'websql' });

         if (!db.adapter) { // websql not supported by this browser
             db = new PouchDB('UoBITApp');
             console.log("websql not supported");
         } else {
             console.log("websql supported");
         }

         var getItem = Promise.method(function (cacheName) {
             // console.log("in getItem: " + cacheName);
             return new Promise(function(resolve, reject) {
                 db.get(cacheName).then(function(returnedItem) {

                     resolve(returnedItem);
                 }).catch(function(error) {
                     reject(error);
                 });
             });

         });

         var storeOrUpdate = Promise.method(function (cacheName, item) {

            if (item._id == undefined)
                item._id = cacheName;

           //  console.log(item);

             return new Promise(function(resolve, reject) {
                 db.put(item).catch(function(error) {
                     
                     if (error.status == 409) {
                         db.get(item._id).then(function (doc) {
                             doc.data = item.data;
                             return db.put(doc);
                         }).then(function() {
                             resolve(db.get(item._id));
                         }).catch(function(error) {
                             reject(error);
                         });
                     } else {
                         reject(error);
                     }
                 });
             });
         });

         var setItem = function (cacheName, item) {

             if (item._id == undefined)
                 item._id = cacheName;

             db.put(item).catch(function(error) {
                 console.log(error);
             });

         };

         var updateItem = function(item) {

             db.get(item._id).then(function (doc) {
                 return db.put(doc);
             }).then(function () {
                 return db.get(item._id);
             }).catch(function (error) {
                 console.log("setItem error: " + error);
             });
         }

         return {
             GetItem: getItem,
             StoreItem: setItem,
             UpdateItem: updateItem,
             StoreOrUpdate: storeOrUpdate
         }

     })();
});



