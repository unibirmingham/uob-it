/*
    Local file manager service
    Handles access to local files such as offline .json files etc
*/

var LocalFileManager;

app.registerInitialise(function () {

    LocalFileManager = (function () {

        var keys = { PcClusters: "/data/PcClusters.json", Settings: "/data/Settings.json", PocketGuide: "/data/PocketGuide.json" };

        var getFile = Promise.method(function(file) {
            return new Promise(function (resolve, reject) {
                //todo: perhaps reject on invalid key + see if theres a way to detect missing requested file in the /data/ dir ?
                resolve(keys[file]);
            });
        });

        return {
            Keys: keys,
            GetFile: getFile
        }

    })();
});