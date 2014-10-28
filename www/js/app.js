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
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        ons.setDefaultDeviceBackButtonListener(function() {
            if (navigator.notification.confirm("Are you sure to close the app?", 
                function(index) {
                    if (index == 1) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                }
            ));
        });
        
        // Open any external link with InAppBrowser Plugin
        $(document).on('click', 'a[href^=http], a[href^=https]', function(e){

            e.preventDefault();
            var $this = $(this); 
            var target = $this.data('inAppBrowser') || '_blank';

            window.open($this.attr('href'), target);

        });
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
    
};

(function() {
    var app = angular.module('sensationApp', ['onsen.directives', 'ngTouch', 'ngSanitize', 'angular-carousel', 'google-maps', 'appLocalStorage', 'LocalStorageModule', 'ui.map', 'ui.event', 'nvd3']);
    
    document.addEventListener('deviceready', function() {
        angular.bootstrap(document, ['sensationApp']);       
    }, false);
    
    // Home Controller
    app.controller('HomeController', function($scope, Data) {
        
        $scope.items = Data.items;

        $scope.showDetail = function(index){
            var selectedItem = $scope.items[index];
            Data.selectedItem = selectedItem;
            $scope.ons.navigator.pushPage(selectedItem.page, {title: selectedItem.title, animation: 'slide'});
        }
        
    });
    
    // Menu Controller
    app.controller('MenuController', function($scope, MenuData) {
        
        $scope.items = MenuData.items;

        $scope.showDetail = function(index){
            var selectedItem = $scope.items[index];
            MenuData.selectedItem = selectedItem;

            $scope.ons.navigator.pushPage(selectedItem.page, {animation: 'none'});
            
        }
        
    });
    
    // Plugins Controller
    app.controller('PluginsController', function($scope, PluginsData) {
        $scope.items = PluginsData.items;
            
        $scope.showDetail = function(index){
            var selectedItem = $scope.items[index];
            PluginsData.selectedItem = selectedItem;
            $scope.ons.navigator.pushPage('plugins/' + selectedItem.page, {title: selectedItem.title, animation: 'slide'});

        }
        
    });
    
    // Parameters Controller
    app.controller('ParametersController', function($scope) {
        var page = $scope.ons.navigator.getCurrentPage();
        $scope.param1 = page.options.param1;
    });
    
    // Map Controller
    app.controller('MapController', function($scope, MapData) {
        
        $scope.map = MapData.map;
        
    });
    
    // Contact Controller
    app.controller('ContactController', function($scope) {

        $scope.submitForm = function() {
            
            window.plugin.email.open({
                to:      ['username@company.com'],
                cc:      ['username1@company.com'],
                bcc:     ['username2@company.com'],
                subject: $scope.subject,
                body:    $scope.message
            });

        };

    });
    
    // News Controller
    app.controller('NewsController', function($scope, $http, NewsData) {
        
        $scope.news = [];
        
        $http({method: 'GET', url: NewsData.url}).
        success(function(data, status, headers, config) {
            $scope.news = data.result;
            $scope.letterLimit = NewsData.letterLimit;
        }).
        error(function(data, status, headers, config) {

        });
        
        $scope.showDetail = function(index) {
        var selectedItem = $scope.news[index];
        NewsData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('new.html', selectedItem);
        }
        
        // getNews() function()
        $scope.getNews = function() {
            // Filter News by $scope.search
            return $scope.news.filter(function(item) {
                
                // Filter News by Title
                var itemDoesMatch = !$scope.search ||
                item.title.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;
                
                // Filter News by Title or Body
                //var itemDoesMatch = !$scope.search ||
                //item.title.toLowerCase().indexOf($scope.search.toLowerCase()) > -1 || 
                //item.body.toLowerCase().indexOf($scope.search.toLowerCase()) > -1;
                
                return itemDoesMatch;
            });
        };

        // Search Detail function()
        $scope.showSearchDetail = function(index) {
        var items = $scope.getNews();
        var selectedItem = items[index];
        NewsData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('new.html', selectedItem);
        }
        
    });
    
    // New Controller
    app.controller('NewController', function($scope, NewsData) {
        $scope.item = NewsData.selectedItem;
     });
    
    // Products Controller
    app.controller('ProductsController', function($scope, $http, ProductsData) {
        
        $http({method: 'GET', url: ProductsData.url}).
        success(function(data, status, headers, config) {
            $scope.products = data.result;
            $scope.letterLimit = ProductsData.letterLimit;
        }).
        error(function(data, status, headers, config) {

        });
        
        $scope.showDetail = function(index) {
        var selectedItem = $scope.products[index];
        ProductsData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('product.html', selectedItem);
        }
        
    });

    // Product Controller
    app.controller('ProductController', function($scope, ProductsData) {
        $scope.item = ProductsData.selectedItem;
     });
    
    // Posts Controller
    app.controller('PostsController', function($scope, $http, PostsData) {
        
        $scope.msg = "Loading...";
        
        $http({method: 'GET', url: PostsData.url}).
        success(function(data, status, headers, config) {
            $scope.posts = data.posts;
            
            if ($scope.posts.length < 1)
            {
                $scope.msg = "Nothing found.";
            }else{
                $scope.msg = undefined;
            }

            var page = 1;
            // Define the number of the posts in the page
            var pageSize = 3;

            $scope.paginationLimit = function(data) {
            return pageSize * page;
            };

            $scope.hasMoreItems = function() {
            return page < ($scope.posts.length / pageSize);
            };

            $scope.showMoreItems = function() {
            page = page + 1;       
            }; 
            
        }).
        error(function(data, status, headers, config) {
        $scope.msg = 'An error occured:' + status;
        });
        
        $scope.showDetail = function(index) {
        var selectedItem = $scope.posts[index];
        PostsData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('post.html', selectedItem);
        }
        
    });
    
    // Post Controller
    app.controller('PostController', function($scope, PostsData) {
        $scope.item = PostsData.selectedItem;

        $scope.loadURL = function (url) {
            //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
            //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
            //_blank: Opens in the InAppBrowser.
            //_system: Opens in the system's web browser.
            window.open(url,'_blank');
        }
        
        $scope.sharePost = function () {
            
            var subject = $scope.item.title;
            var message = $scope.item.content;
            message = message.replace(/(<([^>]+)>)/ig,"");

            var link = $scope.item.url;

            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }

     });
    
    // Server Posts Controller (Server side pagination with AngularJS)
    app.controller('ServerPostsController', function($scope, $http, $filter, ServerPostsData) {
        
        $scope.loadData = function () {
            
            $http({method: 'GET', url: ServerPostsData.url + 'page=' + $scope.page}).
            success(function(data, status, headers, config) {
                
                $scope.msg = "";
                $scope.more = data.pages !== $scope.page;
                $scope.posts = $scope.posts.concat(data.posts);
                $scope.status_bar = "Showing " + ($scope.posts.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.posts.length) + " of " + $filter('number')(data.count_total) + " entries";

            }).
            error(function(data, status, headers, config) {
            $scope.msg = 'An error occured:' + status;
            });
            
        }

        $scope.showMoreItems = function () {
            $scope.page += 1;
            $scope.msg = "Loading...";
            $scope.loadData();
        }

        $scope.hasMoreItems = function () {
            return $scope.more;
        }

        $scope.page = 1;
        $scope.posts = [];
        $scope.more = true;
        $scope.status_bar = "";
        $scope.loadData();
        
        
        $scope.showDetail = function(index) {
        var selectedItem = $scope.posts[index];
        ServerPostsData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('serverpost.html', selectedItem);
        }
        
    });
    
    // Server Post Controller
    app.controller('ServerPostController', function($scope, ServerPostsData) {
        $scope.item = ServerPostsData.selectedItem;
        
        $scope.loadURL = function (url) {
            //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
            //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
            //_blank: Opens in the InAppBrowser.
            //_system: Opens in the system's web browser.
            window.open(url,'_blank');
        }
        
        $scope.sharePost = function () {
            
            var subject = $scope.item.title;
            var message = $scope.item.content;
            message = message.replace(/(<([^>]+)>)/ig,"");

            var link = $scope.item.url;
            
            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        
    });
    
    // Categories Controller
    app.controller('CategoriesController', function($scope, $http, CategoriesData) {
        
        $scope.msg = "Loading...";
        
        $http({method: 'GET', url: CategoriesData.url}).
        success(function(data, status, headers, config) {
            $scope.categories = data.categories;
            
            if ($scope.categories.length < 1)
            {
                $scope.msg = "Nothing found.";
            }else{
                $scope.msg = undefined;
            }

            var page = 1;
            // Define the initial number of the categories in the page
            var pageSize = 10;

            $scope.paginationLimit = function(data) {
            return pageSize * page;
            };

            $scope.hasMoreItems = function() {
            return page < ($scope.categories.length / pageSize);
            };

            $scope.showMoreItems = function() {
            page = page + 1;       
            }; 
            
        }).
        error(function(data, status, headers, config) {
        $scope.msg = 'An error occured:' + status;
        });
        
        $scope.showDetail = function(index) {
        var selectedItem = $scope.categories[index];
        CategoriesData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('category-posts.html', selectedItem);
        }
        
    });
    
    // Category Posts Controller
    app.controller('CategoryPostsController', function($scope, $http, $filter, CategoriesData) {
        
        $scope.msg = "Loading...";
        
        $scope.loadData = function () {

            $http({method: 'GET', url: CategoriesData.category_url + 'id=' + CategoriesData.selectedItem.id + '&page=' + $scope.page}).
            success(function(data, status, headers, config) {
                
                $scope.msg = "";
                $scope.title = CategoriesData.selectedItem.title;
                $scope.more = data.pages !== $scope.page;
                $scope.posts = $scope.posts.concat(data.posts);
                $scope.status_bar = "Showing " + ($scope.posts.length === 0 ? "0" : "1") + " to " + $filter('number')($scope.posts.length);

            }).
            error(function(data, status, headers, config) {
            $scope.msg = 'An error occured:' + status;
            });
            
        }

        $scope.showMoreItems = function () {
            $scope.page += 1;
            $scope.msg = "Loading...";
            $scope.loadData();
        }

        $scope.hasMoreItems = function () {
            return $scope.more;
        }

        $scope.page = 1;
        $scope.posts = [];
        $scope.title="";
        $scope.more = true;
        $scope.status_bar = "";
        $scope.loadData();
        
        
        $scope.showDetail = function(index) {
        var lastSelectedItem = $scope.posts[index];
        CategoriesData.lastSelectedItem = lastSelectedItem;
        $scope.ons.navigator.pushPage('category-post.html', lastSelectedItem);
        }
        
    });
    
    // Category Post Controller
    app.controller('CategoryPostController', function($scope, CategoriesData) {
        $scope.item = CategoriesData.lastSelectedItem;
        
        $scope.loadURL = function (url) {
            //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
            //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
            //_blank: Opens in the InAppBrowser.
            //_system: Opens in the system's web browser.
            window.open(url,'_blank');
        }
        
        $scope.sharePost = function () {
            
            var subject = $scope.item.title;
            var message = $scope.item.content;
            message = message.replace(/(<([^>]+)>)/ig,"");

            var link = $scope.item.url;
            
            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        
     });
    
   // RSS: Feeds Controller
    app.controller('FeedsController', function($scope, $http, FeedData, FeedStorage) {
        
        $scope.msg = "Loading...";
        $scope.feeds = "";

        $http({method: 'JSONP', url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(FeedData.url)}).
        success(function(data, status, headers, config) {
            
            if (!data.responseData) {
                $scope.data = FeedStorage.get();
                $scope.msg = "Offline Mode - The device is unable to get the data.";

                $scope.title = $scope.data.feed.title;
                $scope.description = $scope.data.feed.description;
                $scope.link = $scope.data.feed.link;
                $scope.feeds = $scope.data.feed.entries;
            } else {
                $scope.title = data.responseData.feed.title;
                $scope.description = data.responseData.feed.description;
                $scope.link = data.responseData.feed.link;
                $scope.feeds = data.responseData.feed.entries;
                
                // Save feeds to the local storage
                FeedStorage.save(data.responseData);
                
                $scope.msg = "";
            }

        }).
        error(function(data, status, headers, config) {
        
        $scope.data = FeedStorage.get();
        $scope.msg = 'Offline Mode - An error occured:' + status;
            
        $scope.title = $scope.data.feed.title;
        $scope.description = $scope.data.feed.description;
        $scope.link = $scope.data.feed.link;
        $scope.feeds = $scope.data.feed.entries;  
            
        });

        var page = 1;
        // Define the number of the feed results in the page
        var pageSize = 5;

        $scope.paginationLimit = function(data) {
        return pageSize * page;
        };
        
        $scope.hasMoreItems = function() {
        return page < ($scope.feeds.length / pageSize);
        };

        $scope.showMoreItems = function() {
        page = page + 1;       
        }; 
        
        $scope.showDetail = function(index) {
        var selectedItem = $scope.feeds[index];
        FeedData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('feed.html', selectedItem);
        }
        
    });
    
    // RSS: Feed Controller
    app.controller('FeedController', function($scope, FeedData) {
        $scope.item = FeedData.selectedItem;
        
        $scope.loadURL = function (url) {
            //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
            //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
            //_blank: Opens in the InAppBrowser.
            //_system: Opens in the system's web browser.
            window.open(url,'_blank');
        }
        
        $scope.sharePost = function () {
            
            var subject = $scope.item.title;
            var message = $scope.item.content;
            message = message.replace(/(<([^>]+)>)/ig,"");

            var link = $scope.item.link;
            
            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        
     });
    
    // About: About Controller
    app.controller('AboutController', function($scope, $http, AboutData) {
        
        $http({method: 'GET', url: AboutData.url}).
        success(function(data, status, headers, config) {
            $scope.about = data.result;
        }).
        error(function(data, status, headers, config) {

        });
        
        $scope.showDetail = function(index) {
        var selectedItem = $scope.about[index];
        AboutData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('member.html', selectedItem);
        }
        
    });
    
    // About: Member Controller
    app.controller('MemberController', function($scope, AboutData) {
        $scope.item = AboutData.selectedItem;
     });
    
    // Gallery Controller
    app.controller('GalleryController', function($scope, GalleryData) {

        var items = GalleryData.items;

        function addSlides(target) {
            angular.forEach(items,function(item,index){
                target.push({
                    label: item.label,
                    picture: item.src,
                    location: item.location,
                    item: (index + 1)
                });
            });
         };

        $scope.slides = [];
        addSlides($scope.slides);

    });

    // Settings Controller
    app.controller('SettingsController', function($scope, SettingsData, localStorageService, FeedStorage) {
        $scope.settings = SettingsData.items;

        if (localStorageService.get('settings')) {
            $scope.settings = localStorageService.get('settings');
        }
        
        $scope.saveSettings = function() {
            localStorageService.clearAll();
            localStorageService.add('settings',$scope.settings);
        };
        
        $scope.clearLocalStorage = function() {
        FeedStorage.clear();
        }
        
    });
    
    // Modal View: Modal Controller
    app.controller('ModalController', function($scope) {
        
        $scope.show = function () {
            modal.show();
        }
        
        $scope.hide = function () {
            modal.hide();
        }
        
     });
    
    // Feed Plugin: Categories Controller
    app.controller('FeedPluginCategoriesController', function($scope, $http, FeedPluginData) {

        $http({method: 'GET', url: FeedPluginData.url}).
        success(function(data, status, headers, config) {
            $scope.categories = data.categories; 
        }).
        error(function(data, status, headers, config) {

        });

        $scope.showDetail = function(index) {
        var selectedItem = $scope.categories[index];
        FeedPluginData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('feed-category.html', {title : selectedItem.title});
        }

    });
    
    // Feed Plugin: Category Controller
    app.controller('FeedPluginCategoryController', function($scope, FeedPluginData) {

        $scope.title = FeedPluginData.selectedItem.title;
        $scope.items = FeedPluginData.selectedItem.items;

        $scope.showDetail = function(index) {
        var selectedItem = $scope.items[index];
        FeedPluginData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('feed-master.html', {title : selectedItem.title});
        }

    });
    
    // Feed Plugin: Master Controller
    app.controller('FeedPluginMasterController', function($scope, $http, FeedPluginData) {
        
        $scope.msg = "Loading...";
        $scope.feeds = "";

        $http({method: 'JSONP', url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=' + encodeURIComponent(FeedPluginData.selectedItem.url)}).
        success(function(data, status, headers, config) {
            
            if (!data.responseData) {
                $scope.msg = "The device is unable to get the data.";
            } else {
                $scope.title = data.responseData.feed.title;
                $scope.description = data.responseData.feed.description;
                $scope.link = data.responseData.feed.link;
                $scope.feeds = data.responseData.feed.entries;
                
                $scope.msg = "";
            }

        }).
        error(function(data, status, headers, config) {
        $scope.msg = 'An error occured:' + status; 
        });

        var page = 1;
        // Define the number of the feed results in the page
        var pageSize = 4;

        $scope.paginationLimit = function(data) {
        return pageSize * page;
        };
        
        $scope.hasMoreItems = function() {
        return page < ($scope.feeds.length / pageSize);
        };

        $scope.showMoreItems = function() {
        page = page + 1;       
        }; 
        
        $scope.showDetail = function(index) {
        var selectedItem = $scope.feeds[index];
        FeedPluginData.selectedItem = selectedItem;
        $scope.ons.navigator.pushPage('feed-detail.html', selectedItem);
        }
        
		$scope.mediaObject = function(item) {
			return (item && item.mediaGroups) ? item.mediaGroups[0].contents[0] : {url:''};
		}

		$scope.hasVideo = function(item) {
			var media = $scope.mediaObject(item);
            
            //JAVASCRIPT: condition ? val1 : val2
            //return media.type ? (media.type == "video/mp4") : (media.url ? (media.url.indexOf(".mp4") != -1) : false);
			return media.type ? (media.type == "video/mp4") : false;
		}
        
		$scope.hasAudio = function(item) {
			var media = $scope.mediaObject(item);
            
            //JAVASCRIPT: condition ? val1 : val2
			return media.type ? (media.type == "audio/mp3") : false;
		}
        
        
        
    });

    // Feed Plugin: Detail Controller
    app.controller('FeedPluginDetailController', function($scope, $sce, FeedPluginData) {
        $scope.item = FeedPluginData.selectedItem;
        
		$scope.mediaObject = function(item) {
			return (item && item.mediaGroups) ? item.mediaGroups[0].contents[0] : {url:''};
		}

		$scope.hasVideo = function(item) {
			var media = $scope.mediaObject(item);
            
            //JAVASCRIPT: condition ? val1 : val2
            //return media.type ? (media.type == "video/mp4") : (media.url ? (media.url.indexOf(".mp4") != -1) : false);
			return media.type ? (media.type == "video/mp4") : false;
		}
        
		$scope.hasAudio = function(item) {
			var media = $scope.mediaObject(item);
            
            //JAVASCRIPT: condition ? val1 : val2
			return media.type ? (media.type == "audio/mp3") : false;
		}
        
        $scope.getTrustedResourceUrl = function(src) {
            return $sce.trustAsResourceUrl(src);
        }
        
        $scope.loadURL = function () {
            //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
            //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
            //_blank: Opens in the InAppBrowser.
            //_system: Opens in the system's web browser.
            window.open($scope.item.link,'_blank');
        }
        
        $scope.shareFeed = function () {
            
            var subject = $scope.item.title;
            var message = $scope.item.content;
            message = message.replace(/(<([^>]+)>)/ig,"");

            var link = $scope.item.link;
            
            //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
            //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
            window.plugins.socialsharing.share(message, subject, null, link);
        }
        
     });
    
    // NVD3 View: NVD3 Controller
    app.controller('NVD3Controller', function($scope, NVD3Data) {
        
        var data = NVD3Data;
        
        /* Chart options */
        $scope.options = data.options;

        /* Chart data */
        $scope.data = data.data;
        
     });
    
    // PLUGINS: Device Controller
    app.controller('DeviceController', function($scope) {
        
        $scope.device = device;
        
    });
    
    // PLUGINS: Geolocation Controller
    app.controller('GeolocationController', function($scope) {

        $scope.latitude = '0';
        $scope.longitude = '0';
        $scope.accuracy = '0';
        $scope.altitude = '0';
        $scope.altitudeAccuracy = '0';
        $scope.heading = '0';
        $scope.speed = '0';
        $scope.timestamp = '0';
        $scope.error = '';
        $scope.model = { map: undefined };
        $scope.markers = [];
 
        $scope.showResult = function () {
            return $scope.error == '';
        }
 
        $scope.mapOptions = {
            center: new google.maps.LatLng($scope.latitude, $scope.longitude),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
 
        $scope.showPosition = function (position) {
            $scope.latitude = position.coords.latitude;
            $scope.longitude = position.coords.longitude;
            $scope.accuracy = position.coords.accuracy;
            $scope.altitude = position.coords.altitude;
            $scope.altitudeAccuracy = position.coords.altitudeAccuracy;
            $scope.heading = position.coords.heading;
            $scope.speed = position.coords.speed;
            $scope.timestamp = position.timestamp;
            $scope.$apply();
 
            var latlng = new google.maps.LatLng($scope.latitude, $scope.longitude);
            $scope.model.map.setCenter(latlng);
            $scope.markers.push(new google.maps.Marker({ map: $scope.model.map, position: latlng }));
        }
 
        $scope.showError = function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    $scope.error = "User does not allow the app to retrieve position information."
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.error = "The device is unable to retrieve a position. In general, this means the device is not connected to a network or can't get a satellite fix."
                    break;
                case error.TIMEOUT:
                    $scope.error = "The request to get user location timed out."
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.error = "An unknown error occurred."
                    break;
            }
            $scope.$apply();
        }
 
        $scope.getLocation = function () {
            if (navigator.geolocation) {
                var options = { enableHighAccuracy: true };
                navigator.geolocation.getCurrentPosition($scope.showPosition, $scope.showError, options);
            }
            else {
                $scope.error = "Geolocation is not supported by this browser.";
            }
        }
 
        $scope.getLocation();

    });
    
    // PLUGINS: Notifications Controller
    app.controller('NotificationsController', function($scope) {
        
        $scope.alertNotify = function() {
        navigator.notification.alert("Sample Alert",function() {console.log("Alert success")},"My Alert","Close");
        };

        $scope.beepNotify = function() {
        navigator.notification.beep(1);
        };

        $scope.vibrateNotify = function() {
        navigator.notification.vibrate(3000);
        };

        $scope.confirmNotify = function() {
        navigator.notification.confirm("My Confirmation",function(){console.log("Confirm Success")},"Are you sure?",["Ok","Cancel"]);
        };
        
    });
    
    // Barcodescanner Controller
    app.controller('BarcodescannerController', function($scope) {
        
        $scope.scan = function() {
            cordova.plugins.barcodeScanner.scan(function(result) {
                $scope.result = result;
                $scope.$apply();
            }, function(error) {
                $scope.error = error;
                $scope.$apply();
            });
        }
        
    });
    
    // Filter
    app.filter('partition', function($cacheFactory) {
          var arrayCache = $cacheFactory('partition');
          var filter = function(arr, size) {
            if (!arr) { return; }
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));        
            }
            var cachedParts;
            var arrString = JSON.stringify(arr);
            cachedParts = arrayCache.get(arrString+size); 
            if (JSON.stringify(cachedParts) === JSON.stringify(newArr)) {
              return cachedParts;
            }
            arrayCache.put(arrString+size, newArr);
            return newArr;
          };
          return filter;
        });


})();