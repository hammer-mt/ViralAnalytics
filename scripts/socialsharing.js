function loadUserHashCache() {
    var userHash = window.localStorage['va:userHash'];
    var socialSharing = document.getElementById('va-social-sharing');
    if (socialSharing && userHash) {
        links = socialSharing.getElementsByTagName('a');
        for (var i=0, item; item = links[i]; i++) {
            var link = item.href;
            if (link.search(/\w{18}/i) < 0) {
                item.href = link + "%23" + userHash;
            }
        }

        var copyLink = document.getElementById("va-link");
        var link = copyLink.value;
        if (link.search(/\w{18}/i) < 0) {
            copyLink.value = link + "#" + userHash;
        }  
    }
}

loadUserHashCache();

window.addEventListener ? 
window.addEventListener("load",loadUserHashCache,false) : 
window.attachEvent && window.attachEvent("onload",loadUserHashCache);