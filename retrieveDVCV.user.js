// ==UserScript==
// @name         Retrieve close, reopen and delete votes
// @version      0.3
// @description  Show how many delete, reopen and close votes a question has regardless of rep
// @author       double-beep
// @include      /^https://(?:[^/]+\.)?(?:(?:stackoverflow|serverfault|superuser|stackexchange|askubuntu|stackapps)\.com|mathoverflow\.net)/questions/\d+/
// @updateURL    https://github.com/double-beep/my-userscripts/raw/master/retrieveDVCV.user.js
// @grant        none
// ==/UserScript==

(async () => {
  const canSeeDVs = StackExchange.options.user.canSeeDeletedPosts;
  const canSeeCVs = !!document.getElementsByClassName('close-question-link').length;
  if (canSeeDVs && canSeeCVs) return;

  // API params
  const apiUrl = `https://api.stackexchange.com/2.2/questions/`;
  const questionId = StackExchange.question.getQuestionId();
  const questionFilter = '!YOLQXf.68O4I3*ost.Je3i7xLj';
  const site = window.location.hostname;
  const key = '7sZdxePhKAwk2Av4iS9P6w((';

  function generateAppendElement(desc, count) {
    if (document.getElementById('qinfo')) { // compatibility with Stack Sidebar Question Stats
      const tr = document.createElement('tr');
      tr.innerHTML = `<td><p class="label-key">${desc}</p></td>
                      <td style="padding-left: 10px"><p class="label-key"><b><span>${count}</span></b></p></td>`;
      document.querySelector('#qinfo tbody').appendChild(tr);
    } else {
      const div = document.createElement('div');
      div.className = 'grid--cell ws-nowrap mb8 mr16';
      div.innerHTML = `<span class="fc-light mr2">${desc}</span>   ${count}`;
      document.querySelector('.grid.fw-wrap').appendChild(div);
    }
  }

  const response = await fetch(`${apiUrl}${questionId}?filter=${questionFilter}&site=${site}&key=${key}`);
  const results = await response.json(), items = results.items[0];
  if (!canSeeCVs && items.close_vote_count) generateAppendElement('Close', items.close_vote_count);
  if (!canSeeCVs && items.reopen_vote_count) generateAppendElement('Reopen', items.reopen_vote_count);
  if (!canSeeDVs && items.delete_vote_count) generateAppendElement('Delete', items.delete_vote_count);
})();
