'use strict';

app.registerInitialise(function() {

});

models.home = kendo.observable({
    onShow: function () {
        
        // setResidence(app.data.residence);

        // $("#home-logo").one("load", function() {
        // After the logo has loaded, we'll have the height of the top div, so we can add a height to the lower div and use percentage heights on the icons
        // 	$('#icons-container').height($('#home-container').outerHeight(true) - $('#logo-container').outerHeight(true));
        //  }).each(function() {
        // 	if(this.complete) $(this).load();
        // });
        var obj = { stuff: "dfsfdsdfsdfsdsf" }
        LocalStorageService.StoreOrUpdate("dfsfddddsdfs", obj);
    },
    title: "gggg"
});