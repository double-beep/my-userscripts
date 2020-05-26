// ==UserScript==
// @name         Toggle the right sidebar
// @version      0.2
// @author       double-beep
// @include      /^https://(?:[^/]+\.)?(?:(?:stackoverflow|serverfault|superuser|stackexchange|askubuntu|stackapps)\.com|mathoverflow\.net)/questions/\d+/
// @updateURL    https://github.com/double-beep/my-userscripts/raw/master/toggleSidebar.user.js
// @grant        none
// ==/UserScript==

(function($) {
  const sidebar = $('#sidebar'), mainbar = $('#mainbar');
  $('.-secondary').append('<li class="-item"><a class="-link" id="hide-sidebar" title="Toggle visibility of right sidebar">&#10095;</a></li>');
  $('#hide-sidebar').click(function() {
    if (sidebar.is(':visible')) {
      sidebar.hide(200);
      mainbar.animate({'width': '100%'}, 200);
      $(this).html('&#10094;');
    } else {
      sidebar.show(200);
      mainbar.css('width', 'calc(-324px + 100%)');
      $(this).html('&#10095;');
    }
  });
})(jQuery);
