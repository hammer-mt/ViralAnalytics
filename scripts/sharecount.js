window.addEventListener('load', function() {
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
            var share_count = this.responseText;
            console.log(share_count);
        } else if (this.readyState == 4 && this.status != 200) {
            var error = this.status + ": "+ this.responseText
            console.log(error);
        }
    }
});
