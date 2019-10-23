// ==UserScript==
// @name         CopyPastor Reporter
// @version      2.3.5
// @description  Quick feedback to Guttenberg directly from CopyPastor's post page
// @author       double-beep
// @include      *://copypastor.sobotics.org/posts/*
// @exclude      *://copypastor.sobotics.org/posts/pending
// @grant        GM_xmlhttpRequest
// ==/UserScript==

// Global variables, room number, the room URL and the post id, obtained from the URL (http://copypastor.sobotics.org/posts/POSTID_WANTED)

const room = 111347;
const postId = window.location.pathname.split("/").pop();
const roomURL = 'https://chat.stackoverflow.com/rooms/' + room;

if (typeof GM !== 'object') {
    GM = {};
}

if (typeof GM_xmlhttpRequest === 'function' && !GM.xmlHttpRequest) {
    GM.xmlHttpRequest = GM_xmlhttpRequest;
}

function addFeedback(feedback_type) {

    // Find the fkey (GET request to the room and then .match it)
    GM.xmlHttpRequest({
        method: 'GET',
        url: roomURL,
        onload: function (response) {
            var fkey = response.responseText.match(/hidden" value="([\dabcdef]{32})/)[1];

            // Get the message (@Guttenberg feedback post k/f)
            const msg = "@Guttenberg feedback " + postId + ' ' + feedback_type;

            // Send the message
            GM.xmlHttpRequest({
                method: 'POST',
                url: 'https://chat.stackoverflow.com/chats/' + room + '/messages/new',
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                data: 'text=' + msg + '&fkey=' + fkey,
                onload: function (r) {
                }
            });
        },
    });
    // INFO: The message has been sent
    console.info("CopyPastor Reporter: Feedback " + feedback_type + " sent with a GET request. If you get an error, then something went wrong with it.");
}

// Show the buttons ✔️ (tp/k) and ❌ (fp/f)
$(".display-switcher").after('<p id="feedback-line"><b>Add feedback:</b><button type="button" class="fb-button" id="feedback-k" title="k - true positive">✔️</button><button type="button" class="fb-button" id="feedback-f" title="f - false positive">❌</button></p>');
// Add some top and bottom margin to fix some CSS issues, as putting the buttons after .display-switcher causes some alignment issues
$("#feedback-line").css({"margin-bottom": "-5px", "margin-top": "15px"});
// Fix the buttons
$(".fb-button").css({"background": "none", "border": "0px solid black", "cursor": "pointer"});

// When the buttons are clicked, addFeedback() should be called, when the ❌ is pressed, f must be sent as an arguement
document.getElementById("feedback-k").onclick = function() {addFeedback("k")};
document.getElementById("feedback-f").onclick = function() {addFeedback("f")};
