/*
    Local file manager service
    Handles access to local files such as offline .json files etc
*/

var LocalFileManager;

app.registerInitialise(function () {

    LocalFileManager = (function () {

        var keys = { PcClusters: "/data/PcClusters.json", Settings: "/data/Settings.json", PocketGuide: "/data/PocketGuide.json" };


        return {
            Keys: keys
        }

    })();
});