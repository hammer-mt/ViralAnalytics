exports.vaLoad = (req, res) => {
    res.type('.js');
    var viralAnalyics = function(){        
        /**
        * Copyright (c) 2020-present, Saxifrage, LLC. All rights reserved.
        *
        * You are hereby granted a non-exclusive, worldwide, royalty-free license to use,
        * copy, modify, and distribute this software in source code or binary form for use
        * in connection with the web services and APIs provided by Saxifrage.
        *
        * As with any software that integrates with Saxifrage technology, your use of
        * this software is subject to the Saxifrage Technology Policy
        * [http://developers.saxifrage.xyz/policy/]. This copyright notice shall be
        * included in all copies or substantial portions of the software.
        *
        * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
        * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
        * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
        * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
        * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
        */

        // Log an event
        window.vaEventLog = function(event="pageview", meta="") {

            // Get property id
            var vaScript = document.getElementById('vaScript');
            var property = vaScript.getAttribute('data-property');

            // Try for local and session storage
            function storageAvailable(type) {
                var storage;
                try {
                    storage = window[type];
                    var x = '__storage_test__';
                    storage.setItem(x, x);
                    storage.removeItem(x);
                    return true;
                }
                catch(e) {
                    return e instanceof DOMException && (
                        // everything except Firefox
                        e.code === 22 ||
                        // Firefox
                        e.code === 1014 ||
                        // test name field too, because code might not be present
                        // everything except Firefox
                        e.name === 'QuotaExceededError' ||
                        // Firefox
                        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                        // acknowledge QuotaExceededError only if there's something already stored
                        (storage && storage.length !== 0);
                }
            }

            // Check local and session storage is accessible
            var localStorageCheck = storageAvailable('localStorage');
            var sessionStorageCheck = storageAvailable('sessionStorage');

            // Get user hash from local storage
            var userHash = localStorage['va:userHash'];
            var sessionHash = sessionStorage['va:sessionHash'];

            // Try catch for unsupported APIs
            try {
                var height = window.screen.height;
                var width = window.screen.width;
                var colorDepth = window.screen.colorDepth;
            } catch (error) {
                var height = "";
                var width = "";
                var colorDepth = "";
            }
            try {
                var timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                var locale = Intl.DateTimeFormat().resolvedOptions().locale; 
            } catch (error) {
                var timeZone = "";
                var locale = ""; 
            }
            // Set a date for timestamp
            var date = new Date();
            var timestamp = JSON.stringify(date);

            // Get page meta data
            var referrer = document.referrer;
            var search = window.location.search;
            var href = window.location.href;
            var title = document.title;
            var userAgent = navigator.userAgent;
            var doNotTrack = navigator.doNotTrack;
            var cookieEnabled = navigator.cookieEnabled;
            var timeZoneOffset = date.getTimezoneOffset();
            var protocol = window.location.protocol;
            var hostname = window.location.hostname;
            var port = window.location.port;
            var hash = window.location.hash;
            var pathname = window.location.pathname;

            // Check for expiry and refresh or remove
            var expire = sessionStorage['va:sessionExpire'];
            var expiryDate = Date.parse(expire);

            // If the session exists but has timed out
            if (expire && date > expiryDate) {
                sessionStorage.removeItem("va:sessionExpire");
                sessionStorage.removeItem("va:pageviewCount");
                sessionStorage.removeItem("va:sessionHash");
            }

            // Get valid ref hash
            if (hash.search(/\w{18}/i) >= 0) {
                var refHash = hash;
            } else {
                var refHash = "";
            }

            // if there’s no user hash id, make one and store it
            if(!userHash){
                var userHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                localStorage['va:userHash'] = userHash;
                localStorage['va:userReferrer'] = referrer;
                localStorage['va:userParams'] = search;
                localStorage['va:userRefHash'] = refHash;
                localStorage['va:sessionCount'] = "0";
            }

            // if there’s no session hash id, make one and store it
            if(!sessionHash){
                sessionHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                sessionStorage['va:sessionHash'] = sessionHash;
                if (refHash != "#"+userHash) {
                    sessionStorage['va:sessionRefHash'] = refHash;
                }
                sessionStorage['va:sessionReferrer'] = referrer;
                sessionStorage['va:sessionParams'] = search;

                var sessionExpire = new Date(date.getTime() + 30*60000);
                sessionStorage['va:sessionExpire'] = JSON.stringify(sessionExpire);

                var oldSessionCount = JSON.parse(localStorage['va:sessionCount']) || 0;
                newSessionCount = JSON.stringify(oldSessionCount + 1);
                localStorage['va:sessionCount'] = newSessionCount;
            }

            // Get session and pageview count
            var sessionCount = localStorage['va:sessionCount'];
            var pageviewCount = sessionStorage['va:pageviewCount'];

            // Get session marketing sources
            var sessionReferrer = sessionStorage['va:sessionReferrer'];
            var sessionParams = sessionStorage['va:sessionParams'];
            var sessionRefHash = sessionStorage['va:sessionRefHash'];

            // Get user marketing sources
            var userReferrer = localStorage['va:userReferrer'];
            var userParams = localStorage['va:userParams'];
            var userRefHash = localStorage['va:userRefHash'];

            // Initialize bookmarked post variable
            var bookmarkedPost = JSON.stringify(false);

            // Initialize event and event meta
            var eventName = "pageview";
            var eventMeta = "";

            // Check if event is pageview
            if (event=='pageview') {

                // Check pageview count not null and set if so
                if(!pageviewCount){
                    pageviewCount = "0";
                    sessionStorage['va:pageviewCount'] = pageviewCount;
                } else {
                    pageviewCount = JSON.parse(pageviewCount);
                    pageviewCount = JSON.stringify(pageviewCount + 1);
                    sessionStorage['va:pageviewCount'] = pageviewCount;
                }

                // Check for bookmarked posts
                if (pageviewCount == "0" && refHash == '#'+userHash) {
                    bookmarkedPost = JSON.stringify(true);
                }

                
            // Event is custom, not a pageview
            } else {
                // Log event metadata
                eventName = event;
                eventMeta = meta;
            }
           
            // Get page metadata
            var data={
                property: property,
                userHash: userHash,
                sessionHash: sessionHash,
                refHash: refHash,
                sessionCount: sessionCount,
                pageviewCount: pageviewCount,
                href: href,
                referrer: referrer,
                title: title,
                userAgent: userAgent,
                doNotTrack: doNotTrack,
                cookieEnabled: cookieEnabled,
                height: height,
                width: width,
                colorDepth: colorDepth,
                timeZone: timeZone,
                locale: locale,
                timeZoneOffset: timeZoneOffset,
                protocol: protocol,
                hostname: hostname,
                port: port,
                hash: hash,
                pathname: pathname,
                search: search,
                bookmarked: bookmarkedPost,
                sessionReferrer: sessionReferrer,
                sessionParams: sessionParams,
                sessionRefHash: sessionRefHash,
                userReferrer: userReferrer,
                userParams: userParams,
                userRefHash: userRefHash,
                localStorageCheck: localStorageCheck,
                sessionStorageCheck: sessionStorageCheck,
                eventName: eventName,
                eventMeta: eventMeta,
                timestamp: timestamp
            }

            // Set up API call
            var url="https://us-central1-genial-core-277717.cloudfunctions.net/va-post";

            var request = new XMLHttpRequest();
            request.open("POST", url, true);
            request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            request.send(JSON.stringify(data));

            // Log error message
            request.onreadystatechange = function() {
                if (this.readyState == 4 && this.status != 200) {
                    var error = this.status + ": "+ this.responseText
                    console.log(error);

                    // Send error to logging function
                    var url="https://us-central1-genial-core-277717.cloudfunctions.net/errorlogger";
                    var payload={
                        message: error
                    }
                    var request = new XMLHttpRequest();
                    request.open("POST", url, true);
                    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
                    request.send(JSON.stringify(payload));
                }
            }

            // Change window location hash
            window.location.hash = userHash;
        }

        // Fire pageview
        try {
            vaEventLog();
        } catch(err) {
            console.log(err);
        }
        

        // Set up event queue
        window.vaEventsQ = [];

        // Set up event processing function
        function processEvent(arguments) {
            // this will be called on each .push
            try {
                var eventObj = arguments[0];
                var eventName = eventObj['event'];
                var eventMeta = JSON.parse(JSON.stringify(eventObj)); // clones
                delete eventMeta['event'];
                eventMeta = JSON.stringify(eventMeta);
                vaEventLog(event=eventName, meta=eventMeta);
            } catch(err) {
                console.log(err);
            }
        }

        // Overwrite push for the eventsQ
        window.vaEventsQ.push = function() { Array.prototype.push.apply(this, arguments);  processEvent(arguments);};

        // // Code for pushing custom events
        // vaEventsQ.push({
        //     'color': 'red',
        //     'conversionValue': 50,
        //     'event': 'customizeCar'
        // });  
    }
    res.send("("+viralAnalyics.toString()+")();")
};