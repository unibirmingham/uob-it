'use strict';
app.registerInitialise(function () {

});

models.pocketGuide = {};

models.pocketGuide.Home = kendo.observable({
    title: "Home",
    onShow: function () {
     
        models.pocketGuide.Home.dataSource = new kendo.data.DataSource({
            type: 'json',
            transport: {
                read: function (options) {
                    
                    PocketGuideRepository.GetAllSections().then(function (sections) {

                        options.success(sections);
                    }).catch(function (guideFetchError) {

                        options.error(guideFetchError);
                    });
                }
            },
            error: function (e) {
                console.log(e);
            }
        });

        $("#pocketGuideHomeTemplate").data("kendoMobileListView").setDataSource(models.pocketGuide.Home.dataSource);
    }
});

models.pocketGuide.Pages = kendo.observable({
    title: "Page",
    onShow: function (e) {
        var contentId = e.view.params.contentId;
        
        models.pocketGuide.Pages.dataSource = new kendo.data.DataSource({
            type: 'json',
            transport: {
                read: function (options) {
                    
                    PocketGuideRepository.GetPage(contentId).then(function (page) {
                      

                        if (page && page.length > 0) {
                            $("#mainTitle").html(page[0].PageTitle);
                        }

                        options.success(page);
                    }).catch(function (pageFetchError) {
                        console.log(pageFetchError);
                        options.error(pageFetchError);
                    });
                }
            },
            error: function (e) {
                console.log(e);
            }
        });

        $("#pocketGuidePageTemplate").data("kendoMobileListView").setDataSource(models.pocketGuide.Pages.dataSource);
    }
});