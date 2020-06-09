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

        // Get user hash from local storage
        userHash = localStorage['va:userHash'];
        sessionHash = sessionStorage['va:sessionHash'];

        // if there’s no user hash id, make one and store it
        if(!userHash){
            userHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage['va:userHash'] = userHash;
            localStorage.removeItem("va:sessionCount");
        }

        // if there’s no session hash id, make one and store it
        if(!sessionHash){
            sessionHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            sessionStorage['va:sessionHash'] = sessionHash;
            sessionStorage.removeItem("va:pageviewCount");
        }

        // Get session and pageview counts
        sessionCount = localStorage['va:sessionCount'];
        pageviewCount = sessionStorage['va:pageviewCount'];

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

        // Get ref hash from URL
        refHash = window.location.hash;

        // Get property id
        var vaScript = document.getElementById('vaScript');
        var property = vaScript.getAttribute('data-property');

        // Check for bookmarked posts
        var bookmarkedPost = JSON.stringify(refHash === '#'+userHash);

        // Get page metadata
        var date = new Date();
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
            height: window.screen.height,
            width: window.screen.width,
            colorDepth: window.screen.colorDepth,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: Intl.DateTimeFormat().resolvedOptions().locale,
            timeZoneOffset: date.getTimezoneOffset(),
            protocol: window.location.protocol,
            hostname: window.location.hostname,
            port: window.location.port,
            hash: window.location.hash,
            pathname: window.location.pathname,
            search: window.location.search
        }

        // Change window location hash
        window.location.hash = userHash;

        // Set up API call
        var params={
            headers:{
                "content-type":"application/json; charset=UTF-8"
            },
            body:JSON.stringify(data),
            method:"POST"
        };
        var url="https://us-central1-genial-core-277717.cloudfunctions.net/va-post";

        // Make API call
        fetch(url, params)
        .then(function(res) {
            console.log(res.status);
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    res.send("("+viralAnalyics.toString()+")();")
};