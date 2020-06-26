window.addEventListener('load', function() {
    // Change social sharing buttons hash
    var userHash = localStorage['va:userHash'];
    var socialSharing = document.getElementById('va-social-sharing');
    if (socialSharing && userHash) {
        links = socialSharing.getElementsByTagName('a');
        for (var i=0, item; item = links[i]; i++) {
            item.href = item.href + "%23" + userHash;
        }

        var copyLink = document.getElementById("va-link");
        copyLink.value = copyLink.value + "#" + userHash;
    }
});