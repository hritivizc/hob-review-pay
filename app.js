(function () {
  "use strict";

  var STORAGE_KEY = "hob_review_opened";
  var PENDING_UPI_KEY = "hob_pending_upi";
  var PAY_PAGE = "pay.html";

  var paySection = document.getElementById("paySection");
  var reviewBtn = document.getElementById("reviewBtn");
  var unlockOnlyBtn = document.getElementById("unlockOnlyBtn");
  var copyStatus = document.getElementById("copyStatus");
  var chips = document.querySelectorAll(".review-chip");

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
    } catch (e) {}
  }

  function setPendingUpi(on) {
    try {
      if (on) sessionStorage.setItem(PENDING_UPI_KEY, "1");
      else sessionStorage.removeItem(PENDING_UPI_KEY);
    } catch (e) {}
  }

  function isPendingUpi() {
    try {
      return sessionStorage.getItem(PENDING_UPI_KEY) === "1";
    } catch (e) {
      return false;
    }
  }

  function showPaySection() {
    if (!paySection) return;
    paySection.hidden = false;
    paySection.removeAttribute("hidden");
  }

  function goToPayPage() {
    window.location.href = PAY_PAGE;
  }

  function unlock(opts) {
    opts = opts || {};
    persistUnlock();
    showPaySection();
    if (opts.pendingUpi) setPendingUpi(true);
    if (opts.goPayNow) {
      setPendingUpi(false);
      goToPayPage();
    }
  }

  function tryPayAfterReturn() {
    if (!isUnlocked() || !isPendingUpi()) return;
    if (document.visibilityState && document.visibilityState !== "visible") return;
    setPendingUpi(false);
    goToPayPage();
  }

  function showCopyStatus(msg) {
    if (!copyStatus) return;
    copyStatus.hidden = false;
    copyStatus.textContent = msg;
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(ta);
        resolve();
      } catch (e) {
        document.body.removeChild(ta);
        reject(e);
      }
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var text = chip.getAttribute("data-review") || "";
      chips.forEach(function (c) {
        c.classList.remove("is-selected");
      });
      chip.classList.add("is-selected");
      copyText(text)
        .then(function () {
          showCopyStatus("Copied! Now tap “Open Google & paste review”.");
        })
        .catch(function () {
          showCopyStatus("Couldn’t copy — long-press the text and copy.");
        });
    });
  });

  if (isUnlocked()) {
    showPaySection();
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", function () {
      unlock({ pendingUpi: true });
    });
  }

  if (unlockOnlyBtn) {
    unlockOnlyBtn.addEventListener("click", function () {
      unlock({ goPayNow: true });
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") tryPayAfterReturn();
  });
  window.addEventListener("pageshow", tryPayAfterReturn);
  window.addEventListener("focus", tryPayAfterReturn);
})();
