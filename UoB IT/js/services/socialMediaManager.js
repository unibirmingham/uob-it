/*
    Social media managery.
    All social media based operations should go here.
 */

var SocialMediaManager;

app.registerInitialise(function () {
    SocialMediaManager = (function () {

        var cacheKeys = {
            TwitterFeed: "%SOCIAL_MEDIA_MANAGER_TWITTERFEED%",
            FacebookFeed: "%SOCIAL_MEDIA_MANAGER_FACEBOOKFEED%",
            NewsFeed: "%SOCIAL_MEDIA_MANAGER_NEWSFEED%"
        };

        var urls = {
            TwitterFeed: "http://www.alfred.bham.ac.uk/twitter-api/index.php?screenname=uobservicedesk",
            FacebookFeed: "http://www.friendface.butler.bham.ac.uk/feed.json?fb_user=uobservicedesk",
            NewsFeed: "http://www.birmingham.ac.uk/webteam/pcavailability/news/index.aspx?Listing_SyndicationType=1"
        };

        var getTwitterFeed = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(urls.TwitterFeed, cacheKeys.TwitterFeed).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

        var getFacebookFeed = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(urls.FacebookFeed, cacheKeys.FacebookFeed).then(function (result) {
                    console.log(result);
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

        var getNewsFeed = Promise.method(function () {
            return new Promise(function (resolve, reject) {
                return RemoteServiceManager.FetchRemoteCache(urls.NewsFeed, cacheKeys.NewsFeed).then(function (result) {
                    resolve(result);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });


        return {
            GetTwitterFeed: getTwitterFeed,
            GetFacebookFeed: getFacebookFeed,
            GetNewsFeed: getNewsFeed,
            CacheKeys: cacheKeys
        }
    })();
});