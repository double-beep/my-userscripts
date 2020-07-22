// ==UserScript==
// @name         Retrieve close, reopen and delete votes
// @version      0.5
// @description  Show how many delete, reopen and close votes a question has regardless of rep
// @author       double-beep
// @include      /^https://(?:[^/]+\.)?(?:(?:stackoverflow|serverfault|superuser|stackexchange|askubuntu|stackapps)\.com|mathoverflow\.net)/questions/\d+/
// @updateURL    https://github.com/double-beep/my-userscripts/raw/master/retrieveDVCV.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==
/* globals StackExchange */

(async function() {
  const canSeeDVs = StackExchange.options.user.canSeeDeletedPosts;
  const canSeeCVs = !!document.getElementsByClassName('close-question-link').length;
  const canSeeTimelineVotes = StackExchange.options.user.rep >= 1000;
  if (canSeeDVs && canSeeCVs) return;

  // API params
  const apiUrl = `https://api.stackexchange.com/2.2/questions/`;
  const questionId = window.location.pathname.split('/')[2];
  const questionFilter = '!YOLQXf.68O4I3*ost.Je3i7xLj';
  const site = window.location.hostname;
  const key = '7sZdxePhKAwk2Av4iS9P6w((';

  function generateAppendElementInQuestion(type, count) {
    if (document.getElementById('qinfo')) { // compatibility with Stack Sidebar Question Stats
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><p class="label-key">${type}</p></td>
                      <td style="padding-left: 10px"><p class="label-key"><b><span>${count}</span></b></p></td>`;
      document.querySelector('#qinfo tbody').appendChild(tr);
    } else {
      const div = document.createElement('div');
      div.className = 'grid--cell ws-nowrap mb8 mr16';
      div.innerHTML = `<span class="fc-light mr2">${type}</span>   ${count}`;
      document.querySelector('.grid.fw-wrap').appendChild(div);
    }
  }

  function appendDeleteVotesInAnswer(answerId, deleteVoteCount) {
    const appendAfterElement = document.querySelector(`#answer-${answerId} .post-menu .flag-post-link`).nextElementSibling; // append after .lsep, which is after flag link
    const html = `<a href="#">delete (${deleteVoteCount})</a>`;
    appendAfterElement.insertAdjacentHTML('afterend', html);
  }

  async function findDeleteVoteCountFromAnswerTimeline(postId) {
    const resp = await fetch(`/posts/${postId}/timeline?filter=WithVoteSummaries`), text = await resp.text();
    const parsedHTML = new DOMParser().parseFromString(text, 'text/html');
    var deleteVoteCount = 0;
    parsedHTML.querySelectorAll('.summary-entry').forEach(function(el) {
      const text = el.innerHTML;
      if (text.match(/Delete:\s\d+/)) deleteVoteCount += parseInt(text.match(/(\d+)/)[0]);
    });
    return deleteVoteCount;
  }

  const response = await fetch(`${apiUrl}${questionId}?filter=${questionFilter}&site=${site}&key=${key}`);
  const results = await response.json(), items = results.items[0];
  if (!canSeeCVs && items.close_vote_count) generateAppendElementInQuestion('Close', items.close_vote_count);
  if (!canSeeCVs && items.reopen_vote_count) generateAppendElementInQuestion('Reopen', items.reopen_vote_count);
  if (!canSeeDVs && items.delete_vote_count) generateAppendElementInQuestion('Delete', items.delete_vote_count);

  if (!canSeeTimelineVotes) return; // under 1k rep; can't see the vote summaries in timeline
  document.querySelectorAll('.answer').forEach(async el => {
    const answerId = el.getAttribute('data-answerid');
    const delVotes = await findDeleteVoteCountFromAnswerTimeline(answerId);
    if (!delVotes) return; // 0 delete votes, don't add the count
  });
})();
