(function () {
  "use strict";

  var STORAGE_KEY = "hob_review_opened";
  var PENDING_UPI_KEY = "hob_pending_upi";
  var UPI_URI =
    "upi://pay?pa=7073123656-6@ibl&pn=Ritik%20Sharma&mc=0000&mode=02&purpose=00";

  var paySection = document.getElementById("paySection");
  var reviewBtn = document.getElementById("reviewBtn");
  var unlockOnlyBtn = document.getElementById("unlockOnlyBtn");
  var payUpiBtn = document.getElementById("payUpiBtn");
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

  function openUpiPayment() {
    window.location.href = UPI_URI;
  }

  function unlock(opts) {
    opts = opts || {};
    persistUnlock();
    showPaySection();
    if (opts.pendingUpi) setPendingUpi(true);
    if (opts.openUpiNow) {
      setPendingUpi(false);
      openUpiPayment();
    }
  }

  function tryOpenUpiAfterReturn() {
    if (!isUnlocked() || !isPendingUpi()) return;
    if (document.visibilityState && document.visibilityState !== "visible") return;
    setPendingUpi(false);
    openUpiPayment();
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
          showCopyStatus("Couldn’t copy automatically — long-press the text and copy.");
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
      unlock({ openUpiNow: true });
    });
  }

  if (payUpiBtn) {
    payUpiBtn.addEventListener("click", function () {
      setPendingUpi(false);
      openUpiPayment();
    });
  }

  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") tryOpenUpiAfterReturn();
  });
  window.addEventListener("pageshow", tryOpenUpiAfterReturn);
  window.addEventListener("focus", tryOpenUpiAfterReturn);
})();
