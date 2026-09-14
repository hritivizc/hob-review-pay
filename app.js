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
      /* private mode — DOM unlock still works */
    }
  }

  function setPendingUpi(on) {
    try {
      if (on) sessionStorage.setItem(PENDING_UPI_KEY, "1");
      else sessionStorage.removeItem(PENDING_UPI_KEY);
    } catch (e) {
      /* ignore */
    }
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
    /* Navigate to UPI intent so PhonePe / GPay / Paytm can open */
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

  if (isUnlocked()) {
    showPaySection();
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", function () {
      /* Google opens via target=_blank; mark pending UPI for when they return */
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

  window.addEventListener("pageshow", function () {
    tryOpenUpiAfterReturn();
  });

  window.addEventListener("focus", function () {
    tryOpenUpiAfterReturn();
  });
})();
