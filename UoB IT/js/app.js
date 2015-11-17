/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var models = {};

if (!Object.keys) {
    Object.keys = function (obj) {
        var arr = [],
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(key);
            }
        }
        return arr;
    };
}



var app = {
    back: function () {
        app.mobile.navigate('#:back');
    },
    isOnline: function() {
        if (app.hasConnection)
            return app.hasConnection;
        else
            return false;
    },
    // Application Constructor
    initialize: function () {
        

        if (app.registerPreInitialiseCB) {
            app.receivedEvent('registerPreInitialise');
            var length = app.registerPreInitialiseCB.length - 1;
     
            do {
                app.registerPreInitialiseCB[length]();
            } while (length--);
        }

        this.bindEvents();
        app.hasConnection = true;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        app.receivedEvent('bindEvents');
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onDeviceOffline, false);
        document.addEventListener('online', this.onDeviceOnline, false);
    },
    registerPush: function () {
        app.receivedEvent('registeredPush');
    },
    registerPreInitialise: function (callback)
    {
        if (!app.registerPreInitialiseCB)
            app.registerPreInitialiseCB = [];

        app.registerPreInitialiseCB.push(callback);
    },
    registerInitialise: function (callback) {
        if (!app.registerInitialiseCB)
            app.registerInitialiseCB = [];

        app.registerInitialiseCB.push(callback);
    },
    registerPostInitialise: function (callback) {
        if (!app.registerPostInitialiseCB)
            app.registerPostInitialiseCB = [];

        app.registerPostInitialiseCB.push(callback);
    },
    registerTimedWatcher: function (item) {
        //format of item: {every: <value in minutes>, then: function () {//a callback function; } }
        if (!app.registeredTimedObjects)
            app.registeredTimedObjects = [];

        item.updateWhen = moment().add(item.every, 'minutes').format("hh:mm:ss");

        app.registeredTimedObjects.push(item);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');

        var initialView = 'views/home.html';

        app.hasConnection = true;

        app.mobile = new kendo.mobile.Application(document.body, {
            skin: 'flat',
            // the application needs to know which view to load first
            initial: initialView,
            statusBarStyle: "black"
        });

        navigator.splashscreen.hide();

        if (app.registerInitialiseCB) {
            app.receivedEvent('registerInitialise');
            var length = app.registerInitialiseCB.length - 1;

            do {
                app.registerInitialiseCB[length]();
            } while (length--);
        }

        if (app.registerPostInitialiseCB) {
            app.receivedEvent('registerPostInitialise');
            var length = app.registerPostInitialiseCB.length - 1;

            do {
                app.registerPostInitialiseCB[length]();
            } while (length--);
        }
    },
    onViewChange: function(e) {
        app.receivedEvent('onViewChange');

        if (app.registeredTimedObjects) {
            var currentTime = moment().format("hh:mm:ss");

            var counter = app.registeredTimedObjects.length - 1;

            do {
                var item = app.registeredTimedObjects[counter];

                if (currentTime >= item.updateWhen) {
                    item.then();

                    item.updateWhen = moment().add(item.every, 'minutes').format("hh:mm:ss");

                    app.registeredTimedObjects[counter] = item;
                }
            } while (counter--);

        };
    },
    onDeviceOffline: function () {
        app.receivedEvent('onDeviceOffline');
        app.hasConnection = false;
    },
    onDeviceOnline: function () {
        app.receivedEvent('onDeviceOnline');
        //  console.log("online!!");
        app.hasConnection = true;
    },
    /* pushReceivedEvent: function(item) {
         app.receivedEvent('pushEventReceived');
     },*/
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        console.log('Received Event: ' + id);
    }




};