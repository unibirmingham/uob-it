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
                        //http://cordova.apache.org/docs/en/2.5.0/cordova/inappbrowser/inappbrowser.html#InAppBrowser
                        var regex1 = /href="(.*?)"/g;
                       // var tst = page[0].PageContent.replace(regex1, "fffff");
                       // page.PageContent = 
                       // console.log(tst);
                        var match = regex1.exec(page[0].PageContent);
                        //need to loop this because might be multiple links
                        if (match) {//window.open('http://apache.org', '_blank', 'location=yes');
                            var tst = page[0].PageContent.replace(regex1, " href='#' onclick='javascript:window.open(\"" + match[1] + "\", \"_blank\", \"location=yes\");' ");

                            page[0].PageContent = tst;
                            console.log(match[0]);
                        }

                        console.log(match);
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



    },
    afterShow: function(e) {
        $(function () {
            /*   var links = document.links; // or document.getElementsByTagName("a");
               for (var i = 0, n = links.length; i < n; i++) {
                  // if (links[i].className === "sys_16") {
                    //   links[i].href = "someotherurl.html";
                       console.log(links[i]);
                       //  break; // remove this line if there are more than one checkout link
                  // }
   
               }*/

            $("a[href]")
   .each(function () {
       //  this.href = this.href.replace(/^http:\/\/beta\.stackoverflow\.com/,
       //  "http://stackoverflow.com");
       console.log(this);
   });
        });
    }
});
