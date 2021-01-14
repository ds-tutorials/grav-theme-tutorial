// Code to enable working with Google Analytics - mostly to allow opting out

var disableGA = 'ga-disable-' + gaProperty; // gaProperty is set by template - theme variable ga_id

if (document.cookie.indexOf(disableGA + '=true') > -1) { // if opt-out cookie exists
    window.sessionStorage.setItem("disableGA", true); // disable tracking - tracking will be disabled by a page script
}

/**
 * @desc prevents Google Analytics from tracking user and provides success message
 */
function gaOptout() {
    document.cookie = disableGA + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
    window.sessionStorage.setItem("disableGA", true);
    document.getElementById("ga-status").innerHTML = "Success. You have opted out of Google Analytics on this site."
}

/**
 * @desc alllows Google Analytics to track the user again and provides success message
 */
function gaOptin() {
    document.cookie = disableGA + '=true; expires=Thu, 31 Dec 1999 23:59:59 UTC; path=/';
    window.sessionStorage.setItem("disableGA", false);
    document.getElementById("ga-status").innerHTML = "Success. You have opted back in to Google Analytics on this site."
}