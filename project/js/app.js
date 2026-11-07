"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  UI.setActiveNavigation(page);

  if (page === "landing") {
    UI.initLanding();
  } else if (page === "assistant") {
    UI.initAssistant();
  } else if (page === "about") {
    UI.initAbout();
  }
});
