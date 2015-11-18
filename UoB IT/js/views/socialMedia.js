'use strict';

models.socialMedia = {};

models.socialMedia.Twitter = {
    title: "Recent Tweets",
    onShow: function () {

    },
    dataSource: new kendo.data.DataSource({
        type: 'json',
        transport: {
            read: function (options) {
                SocialMediaManager.GetTwitterFeed().then(function (feed) {
                    options.success(feed.data);
                }).catch(function (getFeedError) {
                    options.error(getFeedError);
                });
            }
        },
        error: function (e) {
            console.log(e);
        }
    })
};

models.socialMedia.Facebook = {
    title: "Recent Posts",
    onShow: function () {

    },
    dataSource: new kendo.data.DataSource({
        type: 'json',
        transport: {
            read: function (options) {
                SocialMediaManager.GetFacebookFeed().then(function (feed) {
                    options.success(feed.data);
                }).catch(function (getFeedError) {
                    options.error(getFeedError);
                });
            }
        },
        error: function (e) {
            console.log(e);
        }
    })
};

models.socialMedia.News = {
    title: "Recent Items",
    onShow: function () {

    },
    dataSource: new kendo.data.DataSource({
        type: 'json',
        transport: {
            read: function (options) {
                SocialMediaManager.GetNewsFeed().then(function (feed) {
                    options.success(feed.data);
                }).catch(function (getFeedError) {
                    options.error(getFeedError);
                });
            }
        },
        error: function (e) {
            console.log(e);
        }
    })
};