// ==UserScript==
// @name         CopyPastor Reporter
// @version      2.5
// @description  Quick feedback to Guttenberg directly from CopyPastor's post page
// @author       double-beep
// @include      *://copypastor.sobotics.org/posts/*
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

(function($) {
  if (window.location.pathname.match(/\d+/)) {
    const room = 111347;
    const postId = window.location.pathname.split("/").pop();

    if (typeof GM !== 'object') GM = {};
    if (typeof GM_xmlhttpRequest === 'function' && !GM.xmlHttpRequest) GM.xmlHttpRequest = GM_xmlhttpRequest;

    function addFeedback(feedback_type) {

      // Find the fkey (GET request to the room and then .match it)
      GM.xmlHttpRequest({
        method: 'GET',
        url: `https://chat.stackoverflow.com/rooms/${room}`,
        onload: function (response) {
          var fkey = response.responseText.match(/hidden" value="([\dabcdef]{32})/)[1];

          const message = `@Guttenberg feedback ${postId} ${feedback_type}`;

          // Send the message
          GM.xmlHttpRequest({
            method: 'POST',
            url: `https://chat.stackoverflow.com/chats/${room}/messages/new`,
            headers: { "content-type": "application/x-www-form-urlencoded" },
            data: `text=${message}&fkey=${fkey}`,
          });
        },
      });
      // INFO: The message has been sent
      console.info("CopyPastor Reporter: Feedback " + feedback_type + " sent with a GET request. If you get an error, then something went wrong with it.");
    }

    $(".display-switcher").after('<p id="feedback-line"><b>Add feedback:</b><button type="button" class="fb-button" id="feedback-k" title="k - true positive">✔️</button><button type="button" class="fb-button" id="feedback-f" title="f - false positive">❌</button></p>');
    $("#feedback-line").css({"margin-bottom": "-5px", "margin-top": "15px"});
    $(".fb-button").css({"background": "none", "border": "0px solid black", "cursor": "pointer"});

    document.getElementById("feedback-k").onclick = function() {addFeedback("k")};
    document.getElementById("feedback-f").onclick = function() {addFeedback("f")};
  } else {
    const ids = $('pre').html().match(/\d+/g);
    for (let i = 0; i < ids.length; i++) {
      $("body").append(`<a href="https://copypastor.sobotics.org/posts/${ids[i]}">https://copypastor.sobotics.org/posts/${ids[i]}</a><br>`)
    }
  }
})(jQuery)
