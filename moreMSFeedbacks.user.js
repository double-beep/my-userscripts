// ==UserScript==
// @name         More MetaSmoke Feedbacks
// @version      7.0
// @description  Send tpu-, fpu-, tp-, naa-, fp- and ignore- can be sent through MetaSmoke
// @author       double-beep
// @include      *://metasmoke.erwaysoftware.com/post/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

const key = "55c3b1f85a2db5922700c36b49583ce1a047aabc4cf5f06ba5ba5eff217faca6"; // FIRE's MS API key

if (!GM_getValue('token')) {
  window.open(`/oauth/request?key=${key}`, "_blank");
  GM_setValue('code', prompt("Token not found. Please copy the string you will obtain from the URL opened here (allow opening new tabs)"));
  $.get(`/oauth/token?key=${key}&code=${GM_getValue("code")}`, data => {
    GM_setValue('token', data.token);
  });
}
const token = GM_getValue("token");

function sendFeedback(verdict) {
  $.ajax({
    type: "POST",
    url: `/api/w/post/${window.location.pathname.split("/")[2]}/feedback`,
    data: { type: verdict, key: key, token }
  });
}

var naa;
$(".feedback-button").length == 3 ? naa =`<strong> | </strong><a class="feedback-button on-post text-warning" id="naa-">💩</a>` : naa = '';
$(".feedback-button").remove();

$('p:contains("Add feedback")').append(`<a class="feedback-button on-post text-success" id="tpu-">✓😮</a>`)
                               .append(`<strong> | </strong><a class="feedback-button on-post text-success" id="tp-">✓</a>`)
                               .append(`<strong> | </strong><a class="feedback-button on-post text-danger" id="fp-">✗</a>`)
                               .append(`<strong> | </strong><a class="feedback-button on-post text-danger" id="fpu-">✗😮</a>`)
                               .append(naa)
                               .append(`<strong> | </strong><a class="feedback-button on-post" id="ignore-">🚫</a>`);
$(".feedback-button").css("cursor", "pointer")
$(".feedback-button").click(function() {
  sendFeedback($(this).attr("id"));
});

$(".small").after(' - <a class="small" style="cursor: pointer" id="ms-feedbacks-remove-token">delete MS write token</a>');
$("#ms-feedbacks-remove-token").click(function() {
  if (confirm("Remove your MS write token? You can generate a new one any time you want.")) {
    GM_deleteValue("token");
    GM_deleteValue("code");
  }
})
