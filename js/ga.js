// Disable tracking if the opt-out cookie exists.
var disableGA = 'ga-disable-' + gaProperty;
if (document.cookie.indexOf(disableGA + '=true') > -1) {
    window[disableGA] = true;
}
// Opt-out function
function gaOptout() {
    document.cookie = disableGA + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
    window[disableGA] = true;
    document.getElementById("ga-status").innerHTML = "Success. You have opted out of Google Analytics on this site."
}
// Opt back in function
function gaOptin() {
    document.cookie = disableGA + '=true; expires=Thu, 31 Dec 1999 23:59:59 UTC; path=/';
    window[disableGA] = false;
    document.getElementById("ga-status").innerHTML = "Success. You have opted back in to Google Analytics on this site."
}