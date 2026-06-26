/* ============================================================
   Deck engine — renders the slide model, drives navigation,
   the progress rail, the overview grid, and staged reveals.
   One index = one slide (robust for reload-state restore).
   ============================================================ */
(function () {
  "use strict";

  var SLIDES = window.SLIDES;
  var SECTIONS = window.SECTIONS;

  /* ---------- tiny helpers ---------- */
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function srcLink(source) {
    if (!source) return "";
    return (
      '<a class="src reveal" href="' +
      source.url +
      '" target="_blank" rel="noopener"><span class="src__tag">Source</span>' +
      esc(source.label) +
      ' <span class="src__arr">↗</span></a>'
    );
  }
  function statusTag(status) {
    if (status === "verified")
      return '<span class="tag tag--ok">✓ Verified</span>';
    return '<span class="tag tag--est">BID estimate · uncited</span>';
  }
  function list(points, cls) {
    return (
      '<ul class="' +
      (cls || "plist") +
      '">' +
      points
        .map(function (p) {
          return '<li class="reveal">' + esc(p) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  /* ---------- per-type renderers (return inner HTML for .slide__body) ---------- */
  var R = {};

  R.cover = function (s) {
    var meta = s.meta
      .map(function (m) {
        return (
          '<div class="cover__metarow reveal"><span class="k">' +
          esc(m.k) +
          '</span><span class="v">' +
          esc(m.v) +
          "</span></div>"
        );
      })
      .join("");
    return (
      '<div class="cover">' +
      '<p class="cover__mark reveal" aria-hidden="true">¶</p>' +
      '<h1 class="cover__title headline reveal">' +
      esc(s.title) +
      "</h1>" +
      '<p class="cover__sub deck-text reveal">' +
      esc(s.subtitle) +
      "</p>" +
      '<div class="cover__meta">' +
      meta +
      "</div>" +
      '<p class="cover__cue reveal">' +
      esc(s.cue) +
      "</p>" +
      "</div>"
    );
  };

  R.agenda = function (s) {
    var items = s.items
      .map(function (it) {
        return (
          '<div class="agenda__item reveal"><span class="agenda__n">' +
          esc(it.n) +
          '</span><div><h3 class="agenda__label">' +
          esc(it.label) +
          '</h3><p class="agenda__desc">' +
          esc(it.desc) +
          "</p></div></div>"
        );
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="agenda__grid">' +
      items +
      "</div>"
    );
  };

  R.statement = function (s) {
    var pull = s.pull
      ? '<aside class="pull reveal"><span class="pull__label">' +
        esc(s.pull.label) +
        '</span><p>' +
        esc(s.pull.text) +
        "</p></aside>"
      : "";
    return (
      '<div class="statement">' +
      '<p class="statement__lead headline reveal">' +
      esc(s.lead) +
      "</p>" +
      '<p class="statement__body deck-text reveal">' +
      esc(s.body) +
      "</p>" +
      pull +
      "</div>"
    );
  };

  R.frame = function (s) {
    return (
      '<div class="frame">' +
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.body) +
      "</p>" +
      (s.body2 ? '<p class="lede reveal">' + esc(s.body2) + "</p>" : "") +
      '<p class="lede reveal">' +
      esc(s.through) +
      "</p>" +
      "</div>"
    );
  };

  R.assets = function (s) {
    var stats = s.stats
      .map(function (st) {
        return (
          '<div class="stat reveal' +
          (st.status === "verified" ? " stat--ok" : " stat--est") +
          '">' +
          '<div class="stat__fig"><span class="stat__val">' +
          esc(st.value) +
          '</span><span class="stat__unit">' +
          esc(st.unit) +
          "</span></div>" +
          '<p class="stat__label">' +
          esc(st.label) +
          "</p>" +
          '<div class="stat__foot">' +
          statusTag(st.status) +
          srcLink(st.source) +
          "</div>" +
          "</div>"
        );
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="stat__grid">' +
      stats +
      "</div>" +
      '<p class="thesis-note reveal">' +
      esc(s.note) +
      "</p>"
    );
  };

  R.divider = function (s) {
    return (
      '<div class="divider">' +
      '<span class="divider__num reveal" aria-hidden="true">' +
      esc(s.num) +
      "</span>" +
      '<div class="divider__body">' +
      '<span class="divider__over eyebrow reveal">' +
      esc(s.overline) +
      "</span>" +
      '<h2 class="divider__line headline reveal">' +
      esc(s.line) +
      "</h2>" +
      '<p class="divider__text deck-text reveal">' +
      esc(s.body) +
      "</p>" +
      "</div>" +
      "</div>"
    );
  };

  R.exhibit = function (s) {
    var cards = s.exhibits
      .map(function (e) {
        var artifact;
        if (e.render === "code") {
          artifact =
            '<div class="ex__artifact ex__artifact--code"><span class="ex__win"><i></i><i></i><i></i></span><code>' +
            esc(e.value) +
            "</code></div>";
        } else if (e.render === "count") {
          artifact =
            '<div class="ex__artifact ex__artifact--num"><span class="ex__big">' +
            esc(e.value) +
            '</span><span class="ex__sub">' +
            esc(e.unit) +
            "</span></div>";
        } else {
          artifact =
            '<div class="ex__artifact ex__artifact--err"><span class="ex__big">' +
            esc(e.value) +
            '</span><span class="ex__sub">' +
            esc(e.unit) +
            "</span></div>";
        }
        return (
          '<div class="ex reveal"><span class="ex__label">' +
          esc(e.label) +
          "</span>" +
          artifact +
          '<p class="ex__cap">' +
          esc(e.caption) +
          "</p>" +
          srcLink(e.source) +
          "</div>"
        );
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="ex__grid">' +
      cards +
      "</div>" +
      '<p class="thesis-note reveal">' +
      esc(s.note) +
      "</p>"
    );
  };

  R.walkthrough = function (s) {
    var ev = s.today.evidence;
    return (
      '<div class="wt">' +
      '<div class="wt__head reveal"><span class="wt__n">' +
      esc(s.n) +
      '</span><h2 class="wt__theme headline">' +
      esc(s.theme) +
      "</h2></div>" +
      '<div class="wt__cols wt__cols--cost">' +
      /* TODAY — what we saw */
      '<div class="wt__col wt__col--today reveal">' +
      '<span class="wt__col-label">On the live site today</span>' +
      list(s.today.points, "wt__points") +
      '<div class="chip reveal"><span class="chip__dot"></span><span class="chip__val">' +
      esc(ev.value) +
      '</span><span class="chip__cap">' +
      esc(ev.caption) +
      "</span></div>" +
      (s.today.sources
        ? '<div class="wt__sources">' +
          s.today.sources
            .map(function (src) {
              return srcLink(src);
            })
            .join("") +
          "</div>"
        : srcLink(s.today.source)) +
      "</div>" +
      /* COST — what it costs */
      '<div class="wt__col wt__col--cost reveal">' +
      '<span class="wt__col-label wt__col-label--cost">What it costs</span>' +
      '<h3 class="wt__cost-cat">' +
      esc(s.cost.label) +
      "</h3>" +
      '<p class="wt__cost-text">' +
      esc(s.cost.text) +
      "</p>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  };

  R.costs = function (s) {
    var rows = s.items
      .map(function (it, i) {
        return (
          '<div class="cost reveal"><span class="cost__n">' +
          ("0" + (i + 1)).slice(-2) +
          '</span><div class="cost__body"><h3 class="cost__title">' +
          esc(it.title) +
          '</h3><p class="cost__text">' +
          esc(it.text) +
          "</p></div></div>"
        );
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="cost__stack">' +
      rows +
      "</div>"
    );
  };

  R.system = function (s) {
    var cards = s.layers
      .map(function (l) {
        return (
          '<div class="layer reveal"><span class="layer__n">' +
          esc(l.n) +
          '</span><h3 class="layer__title">' +
          esc(l.title) +
          '</h3><p class="layer__text">' +
          esc(l.text) +
          '</p><span class="layer__fix">' +
          esc(l.fixes) +
          "</span></div>"
        );
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="layer__grid">' +
      cards +
      "</div>" +
      '<p class="thesis-note reveal">' +
      esc(s.note) +
      "</p>"
    );
  };

  R.benchmark = function (s) {
    var rows = s.rows
      .map(function (r) {
        return (
          '<div class="bm__row reveal">' +
          '<span class="bm__tool">' +
          esc(r.tool) +
          "</span>" +
          '<p class="bm__what">' +
          esc(r.what) +
          "</p>" +
          '<span class="bm__contrast">' +
          esc(r.contrast) +
          "</span>" +
          srcLink(r.source) +
          "</div>"
        );
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="bm__head reveal"><span>Tool</span><span>What it does</span><span>Today</span><span></span></div>' +
      '<div class="bm__rows">' +
      rows +
      "</div>" +
      '<div class="proof reveal"><span class="proof__label">' +
      esc(s.proof.label) +
      "</span><p>" +
      esc(s.proof.text) +
      "</p>" +
      srcLink(s.proof.source) +
      "</div>"
    );
  };

  R.roadmap = function (s) {
    var phases = s.phases
      .map(function (p, i) {
        return (
          '<div class="phase reveal"><span class="phase__n">' +
          (i + 1) +
          '</span><span class="phase__label">' +
          esc(p.label) +
          '</span><h3 class="phase__focus">' +
          esc(p.focus) +
          "</h3>" +
          list(p.items, "phase__items") +
          "</div>"
        );
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="phase__row">' +
      phases +
      "</div>"
    );
  };

  R.closing = function (s) {
    var asks = s.asks
      .map(function (a, i) {
        return (
          '<div class="ask reveal"><span class="ask__n">' +
          (i + 1) +
          '</span><div><h3 class="ask__k">' +
          esc(a.k) +
          '</h3><p class="ask__v">' +
          esc(a.v) +
          "</p></div></div>"
        );
      })
      .join("");
    return (
      '<div class="closing">' +
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<div class="ask__stack">' +
      asks +
      "</div>" +
      '<p class="closing__sign reveal">' +
      esc(s.signoff) +
      "</p>" +
      '<p class="closing__mark reveal">' +
      esc(s.wordmark) +
      "</p>" +
      "</div>"
    );
  };

  R.buildlayer = function (s) {
    var build = s.build
      .map(function (p) {
        return '<li class="reveal">' + esc(p) + "</li>";
      })
      .join("");
    var closes = s.closes
      .map(function (c) {
        return (
          '<div class="bl__close reveal"><span class="bl__close-f">' +
          esc(c.f) +
          '</span><span class="bl__close-t">' +
          esc(c.t) +
          "</span></div>"
        );
      })
      .join("");
    return (
      '<div class="bl">' +
      '<div class="bl__head reveal"><span class="bl__n">' +
      esc(s.n) +
      '</span><h2 class="bl__title headline">' +
      esc(s.title) +
      "</h2></div>" +
      '<div class="bl__cols">' +
      '<div class="bl__col bl__col--build reveal">' +
      '<span class="bl__col-label">What we’d build</span>' +
      '<ul class="bl__points">' +
      build +
      "</ul></div>" +
      '<div class="bl__col bl__col--closes reveal">' +
      '<span class="bl__col-label bl__col-label--closes">What it closes</span>' +
      '<div class="bl__closes">' +
      closes +
      "</div>" +
      (s.note ? '<p class="bl__note">' + esc(s.note) + "</p>" : "") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  };

  R.benchshots = function (s) {
    var shots = s.shots
      .map(function (sh) {
        return (
          '<a class="bshot reveal" href="' +
          sh.source.url +
          '" target="_blank" rel="noopener">' +
          '<span class="bshot__frame"><img src="' +
          sh.img +
          '" alt="' +
          esc(sh.label) +
          ' — One Louisville" loading="lazy"></span>' +
          '<span class="bshot__label">' +
          esc(sh.label) +
          "</span>" +
          '<span class="bshot__contrast">' +
          esc(sh.contrast) +
          "</span>" +
          '<span class="bshot__src">View live ↗</span>' +
          "</a>"
        );
      })
      .join("");
    var p = s.proof;
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="bshot__grid">' +
      shots +
      "</div>" +
      '<a class="proofshot reveal" href="' +
      p.source.url +
      '" target="_blank" rel="noopener">' +
      '<span class="bshot__frame proofshot__frame"><img src="' +
      p.img +
      '" alt="' +
      esc(p.label) +
      '" loading="lazy"></span>' +
      '<span class="proofshot__body"><span class="bshot__label">' +
      esc(p.label) +
      "</span><p>" +
      esc(p.text) +
      '</p><span class="bshot__src">View live ↗</span></span>' +
      "</a>" +
      '<p class="bshot__captured reveal">' +
      esc(s.captured) +
      "</p>"
    );
  };

  R.credit = function (s) {
    return (
      '<div class="credit">' +
      '<p class="credit__mark reveal" aria-hidden="true">' +
      esc(s.mark) +
      "</p>" +
      '<p class="credit__by reveal">' +
      esc(s.byline) +
      "</p>" +
      '<h1 class="credit__studio headline reveal">' +
      esc(s.studio) +
      "</h1>" +
      '<p class="credit__project reveal">' +
      esc(s.project) +
      "</p>" +
      (s.url
        ? '<a class="credit__url reveal" href="' +
          s.url +
          '" target="_blank" rel="noopener">' +
          esc(s.urlLabel) +
          " ↗</a>"
        : "") +
      "</div>"
    );
  };

  R.synthesis = function (s) {
    return (
      '<div class="syn">' +
      '<span class="eyebrow eyebrow--coral reveal">' +
      esc(s.eyebrow) +
      "</span>" +
      '<h2 class="syn__lead headline reveal">' +
      esc(s.lead) +
      "</h2>" +
      '<p class="syn__body reveal">' +
      esc(s.body) +
      "</p>" +
      (s.body2 ? '<p class="syn__body reveal">' + esc(s.body2) + "</p>" : "") +
      "</div>"
    );
  };

  R.screens = function (s) {
    var cards = s.cards
      .map(function (c) {
        var host = c.url
          .replace(/^https?:\/\//, "")
          .replace(/^www\./, "")
          .replace(/\/$/, "");
        return (
          '<a class="scard reveal' +
          (c.wide ? " scard--wide" : "") +
          '" href="' +
          c.url +
          '" target="_blank" rel="noopener">' +
          '<span class="scard__win">' +
          '<span class="scard__bar"><span class="scard__dots"><i></i><i></i><i></i></span>' +
          '<span class="scard__url">' +
          esc(host) +
          '</span><span class="scard__live">Live ↗</span></span>' +
          '<img class="scard__shot" src="' +
          c.img +
          '" alt="' +
          esc(c.name) +
          '" loading="lazy"></span>' +
          '<span class="scard__cap"><span class="scard__name">' +
          esc(c.name) +
          '</span><span class="scard__contrast">' +
          esc(c.contrast) +
          "</span></span>" +
          "</a>"
        );
      })
      .join("");
    return (
      (s.eyebrow
        ? '<span class="eyebrow eyebrow--sea reveal">' + esc(s.eyebrow) + "</span>"
        : "") +
      (s.title ? '<h2 class="headline slide-h reveal">' + esc(s.title) + "</h2>" : "") +
      (s.intro ? '<p class="lede reveal">' + esc(s.intro) + "</p>" : "") +
      '<div class="scards' +
      (s.cards.length === 1 ? " scards--one" : "") +
      '">' +
      cards +
      "</div>" +
      (s.foot
        ? '<p class="thesis-note thesis-note--sea reveal">' + esc(s.foot) + "</p>"
        : "") +
      (s.captured
        ? '<p class="bshot__captured reveal">' + esc(s.captured) + "</p>"
        : "")
    );
  };

  R.toolkit = function (s) {
    var rows = s.layers
      .map(function (l) {
        var chips = l.chips
          .map(function (c) {
            return '<span class="tk-chip">' + esc(c) + "</span>";
          })
          .join("");
        return (
          '<div class="tk-row reveal">' +
          '<div class="tk-row__head"><span class="tk-row__mark">' +
          esc(l.n) +
          '</span><span class="tk-row__name">' +
          esc(l.title) +
          "</span></div>" +
          '<div class="tk-row__chips">' +
          chips +
          "</div>" +
          '<span class="tk-row__fix">' +
          esc(l.fix) +
          "</span>" +
          "</div>"
        );
      })
      .join("");
    var cross = s.cross
      .map(function (c) {
        return '<span class="tk-chip tk-chip--x">' + esc(c) + "</span>";
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="tk">' +
      rows +
      "</div>" +
      '<div class="tk-cross reveal"><span class="tk-cross__label">' +
      esc(s.crossLabel) +
      '</span><div class="tk-cross__chips">' +
      cross +
      "</div></div>"
    );
  };

  R.datasources = function (s) {
    var freeItems = s.free
      .map(function (d) {
        return (
          '<div class="ds-item reveal"><div class="ds-item__top"><span class="ds-item__name">' +
          esc(d.name) +
          "</span>" +
          (d.source
            ? srcLink(d.source)
            : '<span class="ds-item__named">Public · MTA Open Data</span>') +
          '</div><p class="ds-item__powers">' +
          esc(d.powers) +
          "</p></div>"
        );
      })
      .join("");
    var paidItems = s.paid
      .map(function (d) {
        return (
          '<div class="ds-item ds-item--paid reveal"><div class="ds-item__top"><span class="ds-item__name">' +
          esc(d.name) +
          '</span><span class="ds-tag ds-tag--paid">' +
          esc(d.tag) +
          "</span></div><p class=\"ds-item__powers\">" +
          esc(d.powers) +
          "</p></div>"
        );
      })
      .join("");
    return (
      '<h2 class="headline slide-h reveal">' +
      esc(s.title) +
      "</h2>" +
      '<p class="lede reveal">' +
      esc(s.intro) +
      "</p>" +
      '<div class="ds-cols">' +
      '<div class="ds-group reveal"><span class="ds-group__h ds-group__h--free">Free · public data</span>' +
      freeItems +
      "</div>" +
      '<div class="ds-group reveal"><span class="ds-group__h ds-group__h--paid">Paid · budget</span>' +
      paidItems +
      "</div>" +
      "</div>" +
      '<p class="thesis-note thesis-note--sea reveal">' +
      esc(s.takeaway) +
      "</p>"
    );
  };

  /* ---------- short title for overview / rail ---------- */
  function slideTitle(s) {
    switch (s.type) {
      case "cover":
        return s.title;
      case "statement":
        return s.lead;
      case "divider":
        return s.line;
      case "walkthrough":
        return s.n + " — " + s.theme;
      case "buildlayer":
        return s.n + " — " + s.title;
      case "screens":
        return s.title || (s.eyebrow ? s.eyebrow : "What good looks like");
      case "synthesis":
        return s.lead;
      case "credit":
        return s.studio;
      default:
        return s.title || s.line || "";
    }
  }

  /* ============================================================
     Deck controller
     ============================================================ */
  var Deck = {
    index: 0,
    slides: [],
    onChange: null,

    init: function (opts) {
      opts = opts || {};
      this.onChange = opts.onChange || null;
      this.deckEl = document.getElementById("deck");
      this.chromeEl = document.getElementById("chrome");
      this.overviewEl = document.getElementById("overview");
      this._buildSlides();
      this._buildChrome();
      this._buildOverview();
      this._bind();
      this.go(opts.start || 0, true);
      return this;
    },

    _buildSlides: function () {
      var self = this;
      var frag = document.createDocumentFragment();
      SLIDES.forEach(function (s, i) {
        var sec = SECTIONS[s.section];
        var sect = document.createElement("section");
        sect.className = "slide";
        sect.setAttribute("data-type", s.type);
        sect.setAttribute("data-accent", s.accent);
        sect.setAttribute("aria-hidden", "true");
        var kicker = s.kickerOverride || sec.label;
        sect.innerHTML =
          '<div class="slide__top">' +
          '<span class="slide__kicker"><span class="dot"></span>' +
          esc(kicker) +
          "</span>" +
          '<span class="slide__index"><b>' +
          ("0" + (i + 1)).slice(-2) +
          "</b> / " +
          ("0" + SLIDES.length).slice(-2) +
          "</span>" +
          "</div>" +
          '<div class="slide__body"><div class="slide__inner">' +
          (R[s.type] ? R[s.type](s) : "") +
          "</div></div>" +
          '<div class="slide__foot"><span>Flatbush Junction BID</span><span>Information as Infrastructure</span></div>';
        self.slides.push(sect);
        frag.appendChild(sect);
      });
      this.deckEl.appendChild(frag);
    },

    _buildChrome: function () {
      var segs = SECTIONS.map(function (sec, i) {
        return (
          '<button class="rail__seg" data-section="' +
          i +
          '" data-accent="' +
          sec.accent +
          '"><span class="bar"></span><span class="lbl">' +
          esc(sec.label) +
          "</span></button>"
        );
      }).join("");

      this.chromeEl.innerHTML =
        '<div class="navzone navzone--prev" data-nav="prev" aria-label="Previous"></div>' +
        '<div class="navzone navzone--next" data-nav="next" aria-label="Next"></div>' +
        '<div class="rail">' +
        '<div class="rail__sections">' +
        segs +
        "</div>" +
        '<div class="rail__meta">' +
        '<div class="rail__hint"><span><kbd>←</kbd> <kbd>→</kbd> Navigate</span><span><kbd>O</kbd> Map</span></div>' +
        '<div class="rail__controls">' +
        '<span class="rail__count" id="railCount"></span>' +
        '<button class="rail__btn" data-nav="prev" aria-label="Previous slide"><svg viewBox="0 0 24 24"><polyline points="15 5 8 12 15 19"/></svg></button>' +
        '<button class="rail__btn" data-nav="overview" aria-label="Slide map"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></svg></button>' +
        '<button class="rail__btn" data-nav="next" aria-label="Next slide"><svg viewBox="0 0 24 24"><polyline points="9 5 16 12 9 19"/></svg></button>' +
        "</div>" +
        "</div>" +
        "</div>";
    },

    _buildOverview: function () {
      var cards = SLIDES.map(function (s, i) {
        var sec = SECTIONS[s.section];
        return (
          '<button class="ovcard" data-goto="' +
          i +
          '" data-accent="' +
          s.accent +
          '">' +
          '<span class="ovcard__n">' +
          ("0" + (i + 1)).slice(-2) +
          "</span>" +
          '<span class="ovcard__sec">' +
          esc(sec.label) +
          "</span>" +
          '<span class="ovcard__t">' +
          esc(slideTitle(s)) +
          "</span>" +
          "</button>"
        );
      }).join("");
      this.overviewEl.innerHTML =
        '<div class="overview__head"><span class="overview__title">Slide map · ' +
        SLIDES.length +
        ' slides</span><button class="overview__close" data-nav="overview-close">Close ×</button></div>' +
        '<div class="overview__grid">' +
        cards +
        "</div>";
    },

    _bind: function () {
      var self = this;
      document.addEventListener("click", function (e) {
        var nav = e.target.closest("[data-nav]");
        if (nav) {
          var a = nav.getAttribute("data-nav");
          if (a === "next") self.next();
          else if (a === "prev") self.prev();
          else if (a === "overview") self.toggleOverview();
          else if (a === "overview-close") self.toggleOverview(false);
          return;
        }
        var seg = e.target.closest("[data-section]");
        if (seg) {
          self.gotoSection(+seg.getAttribute("data-section"));
          return;
        }
        var goto = e.target.closest("[data-goto]");
        if (goto) {
          self.go(+goto.getAttribute("data-goto"));
          self.toggleOverview(false);
          return;
        }
      });

      document.addEventListener("keydown", function (e) {
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        var k = e.key;
        if (k === "ArrowRight" || k === "PageDown" || k === " ") {
          e.preventDefault();
          self.next();
        } else if (k === "ArrowLeft" || k === "PageUp") {
          e.preventDefault();
          self.prev();
        } else if (k === "ArrowDown") {
          e.preventDefault();
          self.next();
        } else if (k === "ArrowUp") {
          e.preventDefault();
          self.prev();
        } else if (k === "Home") {
          e.preventDefault();
          self.go(0);
        } else if (k === "End") {
          e.preventDefault();
          self.go(SLIDES.length - 1);
        } else if (k === "o" || k === "O") {
          self.toggleOverview();
        } else if (k === "Escape") {
          self.toggleOverview(false);
        }
      });
    },

    next: function () {
      if (this.index < SLIDES.length - 1) this.go(this.index + 1);
    },
    prev: function () {
      if (this.index > 0) this.go(this.index - 1);
    },
    gotoSection: function (secIdx) {
      for (var i = 0; i < SLIDES.length; i++) {
        if (SLIDES[i].section === secIdx) {
          this.go(i);
          return;
        }
      }
    },

    go: function (i, immediate) {
      i = Math.max(0, Math.min(SLIDES.length - 1, i));
      var prev = this.index;
      this.index = i;
      for (var n = 0; n < this.slides.length; n++) {
        var el = this.slides[n];
        el.classList.remove("is-active", "is-past");
        el.setAttribute("aria-hidden", "true");
        if (n < i) el.classList.add("is-past");
        // reset reveals so re-entry re-animates
        var rev = el.querySelectorAll(".reveal");
        for (var r = 0; r < rev.length; r++) rev[r].classList.remove("is-shown");
      }
      var active = this.slides[i];
      active.classList.add("is-active");
      active.setAttribute("aria-hidden", "false");
      this._cascade(active, immediate);
      this._updateChrome();
      if (this.onChange) this.onChange(i, prev);
    },

    _cascade: function (slideEl, immediate) {
      var rev = slideEl.querySelectorAll(".reveal");
      var apply = function () {
        for (var r = 0; r < rev.length; r++) {
          rev[r].classList.add("cascade", "is-shown");
          rev[r].style.setProperty("--i", immediate ? 0 : r);
        }
      };
      if (immediate) {
        apply();
      } else {
        // next frame so the transition fires
        requestAnimationFrame(function () {
          requestAnimationFrame(apply);
        });
      }
    },

    _updateChrome: function () {
      var curSec = SLIDES[this.index].section;
      // section spans
      var bounds = {};
      SLIDES.forEach(function (s, i) {
        if (bounds[s.section] === undefined) bounds[s.section] = { start: i, end: i };
        else bounds[s.section].end = i;
      });
      var segs = this.chromeEl.querySelectorAll(".rail__seg");
      for (var i = 0; i < segs.length; i++) {
        var b = bounds[i];
        var fill = 0;
        if (b) {
          if (this.index > b.end) fill = 100;
          else if (this.index < b.start) fill = 0;
          else {
            var span = b.end - b.start;
            fill = span === 0 ? 100 : ((this.index - b.start) / span) * 100;
          }
        }
        segs[i].style.setProperty("--fill", fill + "%");
        segs[i].classList.toggle("is-current", i === curSec);
      }
      var count = document.getElementById("railCount");
      if (count)
        count.textContent =
          ("0" + (this.index + 1)).slice(-2) + " / " + ("0" + SLIDES.length).slice(-2);
      // overview current
      var ov = this.overviewEl.querySelectorAll(".ovcard");
      for (var o = 0; o < ov.length; o++)
        ov[o].classList.toggle("is-current", o === this.index);
    },

    toggleOverview: function (force) {
      var show = force === undefined ? this.overviewEl.hasAttribute("hidden") : force;
      if (show) this.overviewEl.removeAttribute("hidden");
      else this.overviewEl.setAttribute("hidden", "");
    },
  };

  window.Deck = Deck;
})();
