'use strict';
app.registerInitialise(function () {

});
models.settings = kendo.observable({
    onShow: function () {
        UserRepository.GetSettings().then(function (settings) {
            console.log(settings);
        }).catch(function (fetchSettingsError) {
            console.log(fetchSettingsError);
        });
       
        // setResidence(app.data.residence);

        // $("#home-logo").one("load", function() {
        // After the logo has loaded, we'll have the height of the top div, so we can add a height to the lower div and use percentage heights on the icons
        // 	$('#icons-container').height($('#home-container').outerHeight(true) - $('#logo-container').outerHeight(true));
        //  }).each(function() {
        // 	if(this.complete) $(this).load();
        // 
    //    var item = LocalStorageService.GetItem("dfsfddddsdfs");

      //  var pcs = LocationService.GetAllPCs();
       // console.log(pcs);
    },
    title: "asdsad"
});