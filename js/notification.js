var APP = APP || {};

APP.notification = (function() {

    var duration = 3000;

    return {
        error: error,
        message: message
    };

    function error(msg) {
        var toastElem = $("#toast");
        toastElem.text(msg);
        toastElem.addClass("show error");

        setTimeout(function() {
            toastElem.removeClass("show error");
        }, duration);
    }

    function message(msg) {
        var toastElem = $("#toast");
        toastElem.text(msg);
        toastElem.addClass("show");

        setTimeout(function() {
            toastElem.removeClass("show");
        }, duration);
    }

})();