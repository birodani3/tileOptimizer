var APP = APP || {};

APP.notification = (function() {

    var duration = 3000;

    return {
        error: error,
        message: message
    };

    function error(msg) {
        var toastElem = $("<div id='toast'</div>");
        toastElem.text(msg);
        toastElem.addClass("show error");

        $(".content").append(toastElem);

        setTimeout(function() {
            toastElem.remove();
        }, duration);
    }

    function message(msg) {
        var toastElem = $("<div id='toast'</div>");
        toastElem.text(msg);
        toastElem.addClass("show");

        $(".content").append(toastElem);

        setTimeout(function() {
            toastElem.remove();
        }, duration);
    }

})();