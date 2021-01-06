jQuery(document).ready(function() {
    setHeadingIds();
    scrollFunction();
    // expand sidenav dropdowns as needed
    let dropdowns = document.getElementsByClassName("toggle-btn");
    for (let i = 0; i < dropdowns.length; i++) {
        let button = dropdowns[i];
        let expanded = window.sessionStorage.getItem(button.getAttribute("id").concat("_expanded"));
        let isParent = button.parentNode.classList.contains("parent");
        if ((expanded === "true") || isParent) {
            button.setAttribute("aria-expanded", "true");
            button.parentNode.classList.toggle("show");
        }
        // disable button if parent
        if (isParent) {
            button.setAttribute("disabled", "true");
            button.setAttribute("aria-disabled", "true");
        }
    }
    // hide sidebar as needed
    if (window.sessionStorage.getItem("sidebar-hidden") === "true") {
        document.getElementById("body-0").classList.toggle("sidebar-hidden");
        document.getElementById("sidenav").setAttribute("aria-hidden", "true");
    }
    // set role for all markdown notices
    let notices = document.getElementsByClassName("notices");
    for (let i = 0; i < notices.length; i++) {
        notices[i].setAttribute("role", "note");
    }
    
    // deal with copy-to-clipboard
    let clipboards = document.getElementsByClassName("copy-to-clipboard");
    while (clipboards.length !== 0) {
        clipboards[0].parentNode.removeChild(clipboards[0]);
    }
    // taking this straight from learn.js and modifying slightly
        var clipInit = false;
    $('code').each(function() {
        var code = $(this),
            text = code.text();
        
        // for code block, add clipboard unless NOCLIP tag
        if (code[0].parentNode.nodeName == "PRE" && text.toLowerCase().startsWith("noclip:")) {
            $(this).text(text.substring(8));
            return;
        }
        // for inline code, only add clipboard if there is CLIP tag
        else if (code[0].parentNode.nodeName != "PRE") {
            if (!text.toLowerCase().startsWith("clip: ")) return;
            else $(this).text(text.substring(6));
        }

         
        if (text.length > 5) {
            if (!clipInit) {
                var text, clip = new Clipboard('.copy-to-clipboard', {
                    text: function(trigger) {
                        text = $(trigger).prev('code').text();
                        return text.replace(/^\$\s/gm, '');
                    }
                });

                var inPre;
                clip.on('success', function(e) {
                    e.clearSelection();
                    inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
                    $(e.trigger).attr('aria-label', 'Copied to clipboard!').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
                });

                clip.on('error', function(e) {
                    inPre = $(e.trigger).parent().prop('tagName') == 'PRE';
                    $(e.trigger).attr('aria-label', fallbackMessage(e.action)).addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
                    $(document).one('copy', function(){
                        $(e.trigger).attr('aria-label', 'Copied to clipboard!').addClass('tooltipped tooltipped-' + (inPre ? 'w' : 's'));
                    });
                });

                clipInit = true;
            }

            code.after('<button class="copy-to-clipboard" title="Copy to clipboard"><span class="sr-only">Copy to clipboard</span></button>');
            code.next('.copy-to-clipboard').on('mouseleave', function() {
                $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
            });
        }
    });

    /* replace footer text if opted out. */
    if (window.sessionStorage.getItem("disableGA") === "true") {
        document.getElementById("ga-opted-out").innerHTML = "You are opted out of Google Analytics on this site."
        document.getElementById("ga-btn-out").classList.toggle("hide");
        document.getElementById("ga-btn-in").classList.toggle("hide");
    }
});

setTimeout(() => {  document.getElementById("body-0").classList.remove("start"); }, 500);

function addClipboard(element) {
    newElement = document.createElement("button");
}

/**
 * Toggle sidenav menus
 * 
 * @param {string} id - the id attribute of the button calling the function
 */
function submenuToggle(id) {
    let button = document.getElementById(id);
    let expanded = id.concat("_expanded");
    // change button info
    if (button.getAttribute("aria-expanded") === "true") { // list is collapsed
        button.setAttribute("aria-expanded", "false");
        window.sessionStorage.setItem(expanded, "false");
    } else { // list is expanded
        button.setAttribute("aria-expanded", "true");
        window.sessionStorage.setItem(expanded, "true");
    }
    // toggle hide/show class
    button.parentNode.classList.toggle("show");
}

/**
 * Function to toggle sidenav
 */
function toggleMenu() {
    document.getElementById("body-0").classList.toggle("sidebar-hidden");
    let nav = document.getElementById("sidenav");
    if (nav.getAttribute("aria-hidden") === "true") {
        nav.setAttribute("aria-hidden", "false");
        window.sessionStorage.setItem("sidebar-hidden", "false");
    }
    else {
        nav.setAttribute("aria-hidden", "true");
        window.sessionStorage.setItem("sidebar-hidden", "true");
    }
}

/**
 * Back to top button
 */
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
    button = document.getElementById("back-to-top");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }
    content = document.getElementById("body-0");
    height = document.getElementById("sidenav").getBoundingClientRect().bottom;
    if (height <= -100) {
        content.classList.add("full");
    } else {
        content.classList.remove("full");
    }
}

// Enable smoother transition to links within a page
jQuery(window).on('hashchange', function(){
    document.getElementById("body-0").classList.add("start");
    id = location.hash.replace("#", "");
    console.log(id);
    setTimeout(() => {  document.getElementById(id).scrollIntoView(); }, 10);
    document.getElementById(id).scrollIntoView(true);
    setTimeout(() => {  document.getElementById("body-0").classList.remove("start"); }, 100);
});

/**
 * Give headings ids
 */
function setHeadingIds() {
    // get all headings
    let headingLabels = ["h1", "h2", "h3", "h4", "h5", "h6"];
    let headings = [];
    headingLabels.forEach(function(label) {
        let items = document.getElementsByTagName(label);
        for (let i = 0; i < items.length; i++) {
            headings.push(items[i]);
        }
    });
    // set ids for all headings
    headings.forEach(setHeadingId);
}

function setHeadingId(heading) {
    // if heading already has an id, ignore
    if (heading.id) {
        return;
    }
    // form id from heading text
    let id = heading.innerText;
    // if text is too long, truncate it
    if (id.length > 30) {
        id = id.substr(0, 30);
        // if possible, don't cut up any words
        let lastSpace = id.lastIndexOf(" ");
        if (lastSpace > 10) {
            id = id.substr(0, lastSpace);
        }
    }
    // format
    id = id.toLowerCase();
    id = id.replace(/ /g, "-");
    // if the id is already in use on the page, modify it
    idCount = 0;
    while (document.getElementById(id)) {
        idCount++;
        id = id.concat("-", idCount);
    }
    heading.id = id;
}