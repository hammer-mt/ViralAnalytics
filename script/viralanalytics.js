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

        // Set a date for timestamp
        var date = new Date();

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

        var localStorageCheck = storageAvailable('localStorage');
        var sessionStorageCheck = storageAvailable('sessionStorage');

        // Check for expiry and remove if so
        var expire = sessionStorage['va:sessionExpire'];
        var expiryDate = Date.parse(expire);
        if (expire && date > expiryDate) {
            sessionStorage.removeItem("va:sessionExpire");
            sessionStorage.removeItem("va:pageviewCount");
            sessionStorage.removeItem("va:sessionHash");
        }

        // Get user hash from local storage
        var userHash = localStorage['va:userHash'];
        var sessionHash = sessionStorage['va:sessionHash'];

        // Get ref hash from URL
        var refHash = window.location.hash;

        // if there’s no user hash id, make one and store it
        if(!userHash){
            var userHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage['va:userHash'] = userHash;
        }

        // if there’s no session hash id, make one and store it
        if(!sessionHash){
            sessionHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            sessionStorage['va:sessionHash'] = sessionHash;
            if (refHash != "#"+userHash) {
                sessionStorage['va:sessionRefHash'] = refHash;
            }
            var sessionExpire = new Date(date.getTime() + 30*60000);
            sessionStorage['va:sessionExpire'] = JSON.stringify(sessionExpire);
        }

        // Get session and pageview counts
        var sessionCount = localStorage['va:sessionCount'];
        var pageviewCount = sessionStorage['va:pageviewCount'];

        // Check session count not null and set if so
        if(!sessionCount){
            sessionCount = "0";
            localStorage['va:sessionCount'] = sessionCount;
        } else {
            sessionCount = JSON.parse(sessionCount);
            sessionCount = JSON.stringify(sessionCount + 1);
            localStorage['va:sessionCount'] = sessionCount;
        }

        // Check pageview count not null and set if so
        if(!pageviewCount){
            pageviewCount = "0";
            sessionStorage['va:pageviewCount'] = pageviewCount;
        } else {
            pageviewCount = JSON.parse(pageviewCount);
            pageviewCount = JSON.stringify(pageviewCount + 1);
            sessionStorage['va:pageviewCount'] = pageviewCount;
        }

        // Get property id
        var vaScript = document.getElementById('vaScript');
        var property = vaScript.getAttribute('data-property');

        // Check for bookmarked posts
        if (pageviewCount == 0 && refHash == '#'+userHash) {
            var bookmarkedPost = JSON.stringify(true);
        } else {
            var bookmarkedPost = JSON.stringify(false);
        }

        // Set the session ref and params
        if (pageviewCount == 0) {
            sessionStorage['va:sessionReferrer'] = document.referrer;
            sessionStorage['va:sessionParams'] = window.location.search;
        }
        var sessionReferrer = sessionStorage['va:sessionReferrer'];
        var sessionParams = sessionStorage['va:sessionParams'];

        // Set sessionRefHash
        var sessionRefHash = sessionStorage['va:sessionRefHash'];

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
        
        // Get page metadata
        var data={
            property: property,
            userHash: userHash,
            sessionHash: sessionHash,
            refHash: refHash,
            sessionCount: sessionCount,
            pageviewCount: pageviewCount,
            href: window.location.href,
            referrer: document.referrer,
            title: document.title,
            userAgent: navigator.userAgent,
            doNotTrack: navigator.doNotTrack,
            cookieEnabled: navigator.cookieEnabled,
            height: height,
            width: width,
            colorDepth: colorDepth,
            timeZone: timeZone,
            locale: locale,
            timeZoneOffset: date.getTimezoneOffset(),
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            port: window.location.port,
            hash: window.location.hash,
            pathname: window.location.pathname,
            search: window.location.search,
            bookmarked: bookmarkedPost,
            sessionReferrer: sessionReferrer,
            sessionParams: sessionParams,
            sessionRefHash: sessionRefHash,
            localStorageCheck: localStorageCheck,
            sessionStorageCheck: sessionStorageCheck
        }

        // Change window location hash
        window.location.hash = userHash;

        // Change social sharing buttons hash
        var socialSharing = document.getElementById('va-social-sharing');
        if (socialSharing) {
            links = socialSharing.getElementsByTagName('a');
            for (var i=0, item; item = links[i]; i++) {
                item.href = item.href + "%23" + userHash;
            }
    
            var copyLink = document.getElementById("va-link");
            copyLink.value = copyLink.value + "#" + userHash;
        }

        // Set hidden form field values for CRM
        var userHashField = document.getElementById('VAUSERHASH');
        var refHashField = document.getElementById('VAREFHASH');

        if (userHashField && userHash) {
            userHashField.value=userHash;
        }
        if (refHashField && sessionRefHash) {
            refHashField.value=sessionRefHash;
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
    }
    res.send("("+viralAnalyics.toString()+")();")
};