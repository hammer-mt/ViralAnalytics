window.addEventListener('load', function() {
    // Set hidden form field values for CRM
    var userHash = localStorage['va:userHash'];
    var sessionRefHash = sessionStorage['va:sessionRefHash']

    var userHashField = document.getElementById('VAUSERHASH');
    var refHashField = document.getElementById('VAREFHASH');

    if (userHashField && userHash) {
        userHashField.value=userHash;
    }
    if (refHashField && sessionRefHash) {
        refHashField.value=sessionRefHash;
    }
    
});
