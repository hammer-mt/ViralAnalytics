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
userHash = localStorage.userHash;

// if there’s no hash id, make one and store it
if(!userHash){
    userHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.userHash = userHash;
}

// Get ref hash from URL
refHash = window.location.hash;

// Change window location hash
window.location.hash = userHash;

// Set property id
property = "abc-123456789-001";

// Get page metadata
var date = new Date();
const Data={
    property: property,
    userHash: userHash,
    refHash: refHash,
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
    timeZoneOffset: date.getTimezoneOffset()
}

// Set up API call
const params={
    headers:{
        "content-type":"application/json; charset=UTF-8"
    },
    body:Data,
    method:"POST"
};
const Url="https://us-central1-genial-core-277717.cloudfunctions.net/logdata";

// Make API call
fetch(Url, params)
.then(function(res) {
    console.log(res.status);
})
.catch(function(error) {
    console.log(error);
});