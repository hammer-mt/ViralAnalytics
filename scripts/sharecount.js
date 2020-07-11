function loadShareCountCache() {
    var shareCount = window.localStorage['va:shareCount'];
    var ref = document.getElementById('va-shareCount');
    
    if (ref && shareCount) {
        ref.innerText = shareCount;
    } else {
        ref.innerText = '0';
    }
}

loadShareCountCache();

function loadShareCountRemote() {
    var vaScript = document.getElementById('vaScript');

    var property = vaScript.getAttribute('data-property');
    var userHash = "#"+localStorage['va:userHash'];

    var data = {
        "property": property,
        "refHash": userHash
    }

    var url="https://us-central1-genial-core-277717.cloudfunctions.net/share_count";

    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
    request.send(JSON.stringify(data));

    // Log error message
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var shareCount = this.responseText;
            shareCount = parseInt(shareCount);

            if (shareCount == 100) {
                influencerStatus = "Celebrity";
            } else if (shareCount >= 50) {
                influencerStatus = "Influencer";
            } else if (shareCount >= 25) {
                influencerStatus = "Demi-Influencer";
            } else if (shareCount >= 10) {
                influencerStatus = "Micro-Influencer";
            } else if (shareCount >= 5) {
                influencerStatus = "Nano-Influencer";
            } else if (shareCount >= 1) {
                influencerStatus = "Sharer";
            } else {
                influencerStatus = "";
            }

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'va:shareCount',
                'shareCount': shareCount,
                'influencerStatus': influencerStatus
            });

            window.localStorage['va:shareCount'] = shareCount;
            window.localStorage['va:influencerStatus'] = influencerStatus;
          
            var ref = document.getElementById('va-shareCount');
            if (ref) {
                ref.innerText = shareCount;
            }

        } else if (this.readyState == 4 && this.status != 200) {
            var error = this.status + ": "+ this.responseText
            console.log(error);
        }
    }
}

window.addEventListener ? 
window.addEventListener("load",loadShareCountRemote,false) : 
window.attachEvent && window.attachEvent("onload",loadShareCountRemote);

