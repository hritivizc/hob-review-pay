(function () {
  "use strict";

  var STORAGE_KEY = "hob_review_opened";
  var paySection = document.getElementById("paySection");
  var reviewBtn = document.getElementById("reviewBtn");
  var unlockOnlyBtn = document.getElementById("unlockOnlyBtn");

  function isUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function persistUnlock() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch (e) {
      /* private mode / blocked — still unlock in-session via DOM */
    }
  }

  function showPaySection() {
    if (!paySection) return;
    paySection.hidden = false;
    paySection.removeAttribute("hidden");
  }

  function unlock() {
    persistUnlock();
    showPaySection();
  }

  if (isUnlocked()) {
    showPaySection();
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", function () {
      /* Link already opens in new tab via target=_blank; unlock on this tab */
      unlock();
    });
  }

  if (unlockOnlyBtn) {
    unlockOnlyBtn.addEventListener("click", function () {
      unlock();
    });
  }
})();
