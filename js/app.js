/* ============================================================
   Bootstrap — restore position, then start the deck.
   ============================================================ */
(function () {
  "use strict";

  function start() {
    var total = window.SLIDES ? window.SLIDES.length : 0;
    window.DeckState.load().then(function (st) {
      var startIndex = 0;
      if (st && typeof st.index === "number") {
        // guard against an out-of-range index if the deck changed
        startIndex = Math.max(0, Math.min(total - 1, st.index));
      }
      window.Deck.init({
        start: startIndex,
        onChange: function (i) {
          window.DeckState.save(i, total);
        },
      });
    });

    // Also persist on unload as a belt-and-braces safeguard.
    window.addEventListener("beforeunload", function () {
      if (window.Deck) window.DeckState.save(window.Deck.index, total);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
