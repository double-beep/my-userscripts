// ==UserScript==
// @name         More MetaSmoke Feedbacks
// @version      5.0
// @description  Send tpu-, fpu-, tp-, naa-, fp- and ignore- can be sent through MetaSmoke
// @author       double-beep
// @include      *://metasmoke.erwaysoftware.com/post/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

// const token_obtained = "9438a0b6";
const key = "55c3b1f85a2db5922700c36b49583ce1a047aabc4cf5f06ba5ba5eff217faca6"; // FIRE's MS API key
if (!GM_getValue('token')) {
  window.open(`https://metasmoke.erwaysoftware.com/oauth/request?key=${key}`, '_blank');
  GM_setValue('code', prompt("Token not found. Please copy the string you will obtain from the URL opened here (allow opening new tabs)"));
  $.get(
    "https://metasmoke.erwaysoftware.com/oauth/token?key=" + key + "&code=" + GM_getValue('code'),
    function(data) {
      GM_setValue('token', data.token)
    }
  )
}

const urlV1 = "https://metasmoke.erwaysoftware.com/api/";
const token = GM_getValue('token');
const post_id = window.location.pathname.split("/")[2];
const classes = ["success","danger","warning"];
const descriptions = ["tp-: Single case of undisclosed affiliation or vandalism", "fp-: false positive", "naa-: Not an answer or very low quality (answers only)"];

function sendFeedback(verdict) {

    $.ajax({
        type: 'POST',
        url: `${urlV1}w/post/${post_id}/feedback`, // V2.0 appears broken at this time. Using V1.
        data: {type: verdict, key: key, token}
    });
}

for (var i = 0; i < 3; i++) {
    var el = document.getElementsByClassName("feedback-button on-post text-" + classes[i]);
    $(el).removeAttr("href data-method data-remote data-post-id");
    $(el).attr("title", descriptions[i]);

    if (i == 0) {
        $(el).after("<strong><span> | </span></strong>")
        $(el).click( function () { sendFeedback("tp-"); } );
        $(el).before('<a id="tpu" title="tpu-: true positive and blacklist user" class="feedback-button on-post text-success">✓😮</a> <strong><span>| </span></strong>');
        $("#tpu").click( function () { sendFeedback("tpu-") } );
    } else if (i == 1) {
        $(el).click( function () { sendFeedback("fp-"); } );
        $(el).after('<strong><span> |</span></strong> <a id="fpu" title="fpu-: false positive and whitelist user" class="feedback-button on-post text-danger">✗😮</a>');
        $("#fpu").click( function () { sendFeedback("fpu-") } );
        $('#fpu').after('<strong><span> | </span></strong><span title="ignore-: ignore this reported post" id="ignore" class="feedback-button">🚫</span>');
        $("#ignore").click( function () { sendFeedback("ignore-") } );
    } else if (i == 2) {
        $(el).before('<strong><span> | </span></strong>');
        $(el).click( function () { sendFeedback("naa-"); } );
    }
}

// Add "cursor: pointer" to all feedback buttons
$(".feedback-button").css("cursor", "pointer");
$(".add-comment").after('<button class="ms-feedbacks-remove-token" style="cursor: pointer">Delete MS write token</button>')
$(".ms-feedbacks-remove-token").click(function() {
  if (confirm("Are you sure you want to remove your MS write token? A new one will be generated if you reload the page and follow the instructions.")) {
    GM_deleteValue('token');
    GM_deleteValue('code');
  }
})
