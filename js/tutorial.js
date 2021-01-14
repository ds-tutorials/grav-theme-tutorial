jQuery(document).ready(function() {
    setHeadingIds();
    scrollFunction();
    // expand sidenav dropdowns as needed
    expandSidenavMenus()
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
    updateCopyToClipboard()
    
    /* replace footer text if opted out of Google Analytics. */
    if (window.sessionStorage.getItem("disableGA") === "true") {
        document.getElementById("ga-opted-out").innerHTML = "You are opted out of Google Analytics on this site."
        document.getElementById("ga-btn-out").classList.toggle("hide");
        document.getElementById("ga-btn-in").classList.toggle("hide");
    }
});

// Removes "start" class that prevented transition to/from sidenav + partial content vs. full-width content
setTimeout(() => {  document.getElementById("body-0").classList.remove("start"); }, 500);

window.onscroll = function() { scrollFunction() };

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
 * @desc Expand/contract sidenav submenu
 * @param {string} id - the id attribute of the button calling the function
 */
function submenuToggle(id) {
    let button = document.getElementById(id);
    let expanded = id.concat("_expanded");
    // change button info
    if (button.getAttribute("aria-expanded") === "true") { // list is collapsed
        button.setAttribute("aria-expanded", "false");
        window.sessionStorage.setItem(expanded, "false"); // store setting
    } else { // list is expanded
        button.setAttribute("aria-expanded", "true");
        window.sessionStorage.setItem(expanded, "true"); // store setting
    }
    // toggle hide/show class
    button.parentNode.classList.toggle("show");
}

/**
 * @desc Show/hide sidenav
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
 * @desc Toggle back to top button and determine width of content based on scroll position
 */
function scrollFunction() {
    // toggle back to top button
    button = document.getElementById("back-to-top");
    if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) {
        button.classList.add("active");
    } else {
        button.classList.remove("active");
    }
    // determine if content should be full-width (sidenav must be far enough out of sight)
    content = document.getElementById("body-0");
    height = document.getElementById("sidenav").getBoundingClientRect().bottom;
    if (height <= -200) {
        content.classList.add("full");
    } else {
        content.classList.remove("full");
    }
}

/**
 * @desc Startup function: Expand sidenav menus as needed
 * Allows users to expand or hide menus on one page and have their changes follows as they refresh or move to other pages
 */
function expandSidenavMenus() {
    let buttons = document.getElementsByClassName("toggle-btn");
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];
        let expanded = window.sessionStorage.getItem(button.getAttribute("id").concat("_expanded"));
        let isParent = button.parentNode.classList.contains("parent");
        if ((expanded === "true") || isParent) { // button was expanded or is parent of current page and should be expanded
            button.setAttribute("aria-expanded", "true");
            button.parentNode.classList.toggle("show");
        }
        if (isParent) { // button is parent of current page and should be disabled
            button.setAttribute("disabled", "true");
            button.setAttribute("aria-disabled", "true");
        }
    }
}

/**
 * @desc Startup function: Adds id to each heading without one based on heading text
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
    headings.forEach(function(heading) {
        if (heading.id) { // heading already has an id
            return;
        }
        let id = heading.innerText;
        if (id.length > 30) { // text is too long
            id = id.substr(0, 30);
            let lastSpace = id.lastIndexOf(" ");
            if (lastSpace > 10) { // id has multiple words, removing the last partial word will not shorten the id more to fewer than 10 characters
                id = id.substr(0, lastSpace); // remove last partial word
            }
        }
        // format - all lower case, spaces replaced with hyphens
        id = id.toLowerCase().replace(/ /g, "-");
        let originalID = id; // save the original id
        idCount = 0;
        while (document.getElementById(id)) { // id already exists
            idCount++;
            // add count to the ID (use originalID to prevent heading-text-1-2-3...)
            id = originalID.concat("-", idCount);
        }
        heading.id = id;
    });
}

/**
 * @desc Startup function: Updates copy to clipboard button added by learn2 for additional customization and accessibility
 * Code block: Button will be added by default unless the first line of code reads "noclip" (not case sensitive)
 * Inline code: Button will not be added unless the code section begins with "noclip" (not case sensitive)
 * Screen reader accessibility has been added.
 */
function updateCopyToClipboard() {
    // remove clipboards for clean slate
    let clipboards = document.getElementsByClassName("copy-to-clipboard");
    while (clipboards.length !== 0) {
        clipboards[0].parentNode.removeChild(clipboards[0]);
    }
    // The following code comes from the Learn2 theme version 1.8.0 - learn2/js/learn.js, lines 172-??? and has been modified as noted
    var clipInit = false;
    $('code').each(function() {
        var code = $(this),
            text = code.text();
        
        // added code - for code block, add clipboard unless NOCLIP tag
        if (code[0].parentNode.nodeName == "PRE" && text.toLowerCase().startsWith("noclip:")) {
            $(this).text(text.substring(8));
            return;
        }
        // added code - for inline code, only add clipboard if there is CLIP tag
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

            // modified code - added span with class "sr-only" and text Copy to clipboard
            code.after('<button class="copy-to-clipboard" title="Copy to clipboard"><span class="sr-only">Copy to clipboard</span></button>');
            code.next('.copy-to-clipboard').on('mouseleave', function() {
                $(this).attr('aria-label', null).removeClass('tooltipped tooltipped-s tooltipped-w');
            });
        }
    });
}