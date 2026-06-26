/* ============================================================
   State persistence — reload policy.
   The deck writes the live navigation position (and timestamp)
   to appData/presentationState.json via AgentBrowserStorage on
   every change, and restores from it on load so a page reload
   never loses the presenter's place.
   ============================================================ */
window.DeckState = {
  FILE: "presentationState.json",
  data: { index: 0, updated: null, total: null },

  load: function () {
    var self = this;
    return new Promise(function (resolve) {
      if (!window.AgentBrowserStorage) {
        resolve(self.data);
        return;
      }
      AgentBrowserStorage.read(self.FILE)
        .then(function (d) {
          if (d && typeof d.index === "number") self.data = d;
          resolve(self.data);
        })
        .catch(function () {
          resolve(self.data);
        });
    });
  },

  save: function (index, total) {
    this.data.index = index;
    if (total != null) this.data.total = total;
    try {
      this.data.updated = new Date().toISOString();
    } catch (e) {
      this.data.updated = null;
    }
    if (window.AgentBrowserStorage) {
      // fire-and-forget; never block navigation on a write
      try {
        AgentBrowserStorage.write(this.FILE, this.data);
      } catch (e) {}
    }
  },
};
