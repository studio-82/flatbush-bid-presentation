/* ============================================================
   Slide content model — Flatbush Junction BID working session.
   Copy is faithful to the report "Information as Infrastructure";
   live-site observations and figures are sourced (see `source`
   objects) so every data point is traceable per the brief.
   Verified figures are tagged; the BID's own uncited claims are
   shown as estimates — itself an example of the thesis.

   Structure — four parts plus bookends:
     0 Opening          (cover, agenda)
     1 The Argument     (01 · thesis, frame, assets)
     2 What We Saw &     (02 · diagnosis + the five costs)
       Cost
     3 What To Build     (03 · what good looks like, then the build)
     4 Next Steps        (04 · roadmap + the ask)
     5 Appendix          (tool exploration)
   ============================================================ */

/* Sections drive the progress rail + section color arc:
   neutral opening/argument -> coral (the problem) -> teal (the fix) */
window.SECTIONS = [
  { key: "open", label: "Opening", accent: "ink" },
  { key: "argument", label: "The Argument", accent: "ink" },
  { key: "saw", label: "What We Saw & Cost", accent: "coral" },
  { key: "build", label: "What To Build", accent: "sea" },
  { key: "next", label: "Next Steps", accent: "sea" },
  { key: "appendix", label: "Appendix", accent: "sea" },
];

/* Reusable source links (only URLs the research actually reached) */
var SRC = {
  directory: { label: "exploreflatbush.com/business-directory", url: "https://www.exploreflatbush.com/business-directory/" },
  map: { label: "exploreflatbush.com/business-map", url: "https://www.exploreflatbush.com/business-map/" },
  data404: { label: "exploreflatbush.com/bid-data-economic-studies (404)", url: "https://www.exploreflatbush.com/bid-data-economic-studies/" },
  realestate: { label: "exploreflatbush.com/real-estate", url: "https://www.exploreflatbush.com/real-estate/" },
  contact: { label: "exploreflatbush.com/contact-us", url: "https://www.exploreflatbush.com/contact-us/" },
  news: { label: "exploreflatbush.com/news", url: "https://www.exploreflatbush.com/news/" },
  resources: { label: "exploreflatbush.com/business-resources", url: "https://www.exploreflatbush.com/business-resources/" },
  guide: { label: "exploreflatbush.com/business-resource-guide", url: "https://www.exploreflatbush.com/business-resource-guide/" },
  aboutBid: { label: "exploreflatbush.com/about-the-bid", url: "https://www.exploreflatbush.com/about-the-bid/" },
  aboutFlatbush: { label: "exploreflatbush.com/about-flatbush", url: "https://www.exploreflatbush.com/about-flatbush/" },
  bc: { label: "brooklyn.edu/about/fast-facts", url: "https://www.brooklyn.edu/about/fast-facts/" },
  census: { label: "censusreporter.org — Brooklyn CD14 (2024 ACS)", url: "http://censusreporter.org/profiles/79500US3604314-nyc-brooklyn-community-district-14-flatbush-midwood-puma-ny/" },
  olData: { label: "onelouisville.org/data-statistics", url: "https://onelouisville.org/data-statistics/" },
  olProperty: { label: "onelouisville.org/property-locator", url: "https://onelouisville.org/property-locator/" },
  olTalent: { label: "onelouisville.org/talent-workforce", url: "https://onelouisville.org/talent-workforce/" },
  olBiz: { label: "onelouisville.org/small-business-resources", url: "https://onelouisville.org/small-business-resources/" },
  dbp: { label: "downtownbrooklyn.com — Development Dashboard", url: "https://www.downtownbrooklyn.com/downtown-brooklyn-development-dashboard/" },
  chamber: { label: "brooklynchamber.com — Business Directory", url: "https://www.brooklynchamber.com/membership/directory/" },
  /* Public data feeds for an exploration of a Junction-scale tool (verified live) */
  nycOpenData: { label: "opendata.cityofnewyork.us", url: "https://opendata.cityofnewyork.us/" },
  storefrontReg: { label: "NYC Open Data — Storefronts Reported Vacant or Not (LL157)", url: "https://data.cityofnewyork.us/City-Government/Storefronts-Reported-Vacant-or-Not/92iy-9c3n" },
  censusData: { label: "data.census.gov — American Community Survey", url: "https://data.census.gov/" },
  nypd: { label: "nyc.gov — NYPD crime statistics", url: "https://www.nyc.gov/site/nypd/stats/crime-statistics/crime-statistics-landing.page" },
  nyc311: { label: "portal.311.nyc.gov", url: "https://portal.311.nyc.gov/" },
};

window.SLIDES = [
  /* ---------------- OPENING ---------------- */
  {
    section: 0,
    accent: "ink",
    type: "cover",
    kickerOverride: "Flatbush Junction BID · Working Session",
    title: "Information as Infrastructure",
    subtitle:
      "The district's digital information system — and what it would take to make it carry real economic-development weight.",
    meta: [
      { k: "Prepared for", v: "Flatbush Nostrand Junction BID" },
      { k: "Companion to", v: "the report of the same name" },
      { k: "Format", v: "Working session — walk-through & decisions" },
    ],
    cue: "Use ← → or click. Press O for the slide map.",
  },
  {
    section: 0,
    accent: "ink",
    type: "agenda",
    title: "What this session covers",
    intro:
      "Four parts. We look at the live site together, agree on what's broken and what it's costing, and leave with a first phase the BID can own.",
    items: [
      { n: "01", label: "The argument", desc: "One claim — and why information is infrastructure for the BID's core job." },
      { n: "02", label: "What we saw, and what it costs", desc: "A guided walk through exploreflatbush.com, and the five costs of leaving it as-is." },
      { n: "03", label: "What good looks like, and what to build", desc: "A four-layer system for the Junction — then what each looks like running live." },
      { n: "04", label: "Next steps", desc: "A phased rollout, and what it would take to start." },
    ],
  },

  /* ---------------- 01 · THE ARGUMENT ---------------- */
  {
    section: 1,
    accent: "ink",
    type: "divider",
    num: "01",
    overline: "Executive Summary",
    line:
      "The BID's digital information system isn't yet built for the economic-development job it's meant to do.",
    body:
      "The digital layer already holds useful signals — it just doesn't yet organize them into a strong district system. The good news: the problem is organization, not a shortage of assets.",
  },
  {
    section: 1,
    accent: "ink",
    type: "frame",
    title: "Why robust information infrastructure is key to economic development",
    body:
      "One of a BID's core responsibilities is business retention and expansion (BR&E) — keeping the businesses you already have and helping them grow. And all of that work runs on information.",
    body2:
      "In practice, BR&E means systematically knowing your businesses, hearing their problems early, and routing them to help before they fail or leave. It depends on a current business inventory, a live vacancy picture, a real feedback channel, and shared data.",
    through:
      "Every one of those inputs is a piece of information infrastructure. When the information layer is thin, BR&E weakens quietly — and because nothing breaks loudly, it's hard to tell until a business has already left or an opportunity has passed.",
  },
  {
    section: 1,
    accent: "ink",
    type: "assets",
    title: "Start from strength: the district already holds real assets",
    intro:
      "This is not a turnaround story. The Junction has anchors, a market, and capital most districts would envy. The issue is that none of it is yet organized into a system that can signal opportunity or be trusted by a partner.",
    stats: [
      { value: "14,469", unit: "students", label: "Brooklyn College enrollment, plus 427 full-time faculty (Fall 2025)", status: "verified", source: SRC.bc },
      { value: "≈148k", unit: "residents", label: "Core district population — Flatbush–Midwood (Brooklyn CD14, 2024 ACS)", status: "verified", source: SRC.census },
      { value: "350k", unit: "within 1.5 mi", label: "Wider market the BID claims around the Junction — its own estimate, uncited on the site", status: "estimate", source: SRC.aboutFlatbush },
      { value: "200+", unit: "businesses", label: "Businesses the BID represents along Flatbush & Nostrand", status: "estimate", source: SRC.map },
      { value: "$3B", unit: "/ year", label: "Consumer spending the BID cites within the radius — uncited on the site", status: "estimate", source: SRC.aboutFlatbush },
      { value: "≈6%", unit: "vacancy", label: "Commercial vacancy rate the BID reports — uncited on the site", status: "estimate", source: SRC.aboutFlatbush },
    ],
    note:
      "Notice the split: the assets are real, but most of your own headline numbers are estimates with no citation on your site. The strongest case you can make is currently not backed by data a partner could check — which is exactly the problem we are here to fix.",
  },

  /* ---------------- 02 · WHAT WE SAW & COST ---------------- */
  {
    section: 2,
    accent: "coral",
    type: "divider",
    num: "02",
    overline: "Diagnosis & Cost",
    line: "What we saw on the site — and what each gap costs the BID",
    body:
      "The digital layer already holds useful signals; it just doesn't organize them into a strong district system. We walked the site feature by feature — and for every gap, named what it's already costing: in attraction, talent, retention, and credibility.",
  },
  {
    section: 2,
    accent: "coral",
    type: "walkthrough",
    n: "Finding 1",
    theme: "Brooklyn College and local talent are visible, but not operationalized.",
    today: {
      points: [
        "The BID points to Brooklyn College and a large local population as a talent advantage.",
        "But on the site, workforce is a single “NY Workforce1 Centers” link.",
        "The one Brooklyn College small-business link points to a Facebook page, not an institutional resource.",
      ],
      evidence: { render: "chip", value: "1 workforce link · BC → Facebook", caption: "Live business-resources page" },
      source: SRC.resources,
    },
    cost: {
      label: "Brooklyn College & workforce",
      text:
        "≈14,500 students, 427 faculty, and a deep resident labor pool sit right at the Junction — but with no talent layer, the BID can't turn them into a visible labor advantage for local employers.",
    },
  },
  {
    section: 2,
    accent: "coral",
    type: "walkthrough",
    n: "Finding 2",
    theme: "Local finance and support are present, but not organized as a business advantage.",
    today: {
      points: [
        "Capital links exist — Pursuit, Accion, Kiva, Women's Venture Fund, BOC.",
        "But the featured resources are COVID-era: “PPP Loan Forgiveness,” “EIDL,” “Bring Back Brooklyn Fund.”",
        "And despite billing itself a “one-stop business development office,” the page lists no direct phone or email for help.",
      ],
      evidence: { render: "chip", value: "Capital buried · resources frozen ~2021 · no contact", caption: "Live business-resources page" },
      source: SRC.resources,
    },
    cost: {
      label: "Finance & support visibility",
      text:
        "When a merchant needs working capital or short-term relief, they can't see how much local help is actually available — so capital and support that already exist go unused.",
    },
  },
  {
    section: 2,
    accent: "coral",
    type: "walkthrough",
    n: "Finding 3",
    theme: "Commercial opportunity is visible, but not site-selection-ready.",
    today: {
      points: [
        "The real-estate page lists four properties — photo and address only.",
        "No square footage, no rent, no lease terms, no broker contact, no availability date.",
        "The map that should anchor this — “0 of 0 outlets” — loads nothing.",
      ],
      evidence: { render: "chip", value: "4 listings · photo + address only · no specs", caption: "Live real-estate page" },
      source: SRC.realestate,
    },
    cost: {
      label: "Business attraction",
      text:
        "A serious operator or broker gets a photo gallery, not a site-selection case — so prospective businesses never get a strong enough reason to choose the Junction.",
    },
  },
  {
    section: 2,
    accent: "coral",
    type: "walkthrough",
    n: "Finding 4",
    theme: "Support and reporting are too generic.",
    today: {
      points: [
        "Contact is one generic form — name, email, subject, message.",
        "No phone, no email, no address; no categorized, 311-style issue reporting.",
        "The newsroom's most recent post is dated September 27, 2018.",
      ],
      evidence: { render: "chip", value: "Generic form · no 311 path · news frozen 2018", caption: "Live contact & news pages" },
      source: SRC.contact,
    },
    cost: {
      label: "BR&E & merchant intelligence",
      text:
        "Problems are never captured, so service activity never becomes corridor intelligence — and the small businesses that together carry real local jobs stay invisible to the BID.",
    },
  },
  {
    section: 2,
    accent: "coral",
    type: "walkthrough",
    n: "Finding 5",
    theme: "The load-bearing features — directory, map, and data — aren't loading.",
    today: {
      points: [
        "The business directory outputs a raw WordPress shortcode, [businessdirectory], with zero listings.",
        "The business map claims “200+ businesses” but renders “0 of 0 outlets.”",
        "The “BID Data & Economic Studies” page returns a 404 — there is no working data section.",
      ],
      evidence: { render: "chip", value: "[businessdirectory] · 0 of 0 · 404", caption: "Live directory, map & data pages" },
      sources: [SRC.directory, SRC.map, SRC.data404],
    },
    cost: {
      label: "Funders & strategic partners",
      text:
        "These are the exact capabilities BR&E depends on, and an operator or funder hits them first. With no working data or reporting, the BID's case to funders, partners, and institutional allies is weaker the moment they look.",
    },
  },
  {
    section: 2,
    accent: "coral",
    type: "synthesis",
    eyebrow: "Step back · one root cause",
    lead: "Five findings. One root cause.",
    body:
      "“Explore Flatbush” is trying to be two products at once — a neighborhood guide for residents and shoppers, and the BID's economic-development workbench for merchants, operators, brokers, and funders.",
    body2:
      "The two want very different things, so one undifferentiated site clutters the guide and buries the workbench. Every finding you just saw is a symptom of that — and the build starts by separating them.",
  },
  /* ---------------- 03 · WHAT GOOD LOOKS LIKE & WHAT TO BUILD ---------------- */
  {
    section: 3,
    accent: "sea",
    type: "divider",
    num: "03",
    overline: "What To Build",
    line: "What we'd build for the Junction — and what good looks like",
    body:
      "Separate the two jobs the site conflates: a clear public guide and a real economic-development engine. A four-part system, each layer closing a finding you just saw — then a look at the same tools running live elsewhere.",
  },
  {
    section: 3,
    accent: "sea",
    type: "buildlayer",
    n: "Layer A",
    title: "District information layer",
    build: [
      "Get the directory and map actually working — a live, searchable business inventory.",
      "Tighten the district narrative around assets, opportunity, and support.",
      "Turn capital and support into a current, usable directory with a real point of contact.",
    ],
    closes: [
      { f: "Finding 5", t: "directory, map & data that load" },
      { f: "Finding 2", t: "capital & support, surfaced and routable" },
    ],
    note: "The foundation. Everything else sits on a directory, map, and facts people can trust.",
  },
  {
    section: 3,
    accent: "sea",
    type: "buildlayer",
    n: "Layer B",
    title: "Opportunity & site-selection layer",
    build: [
      "Turn property listings into a structured vacancy layer — sq ft, rent, terms, broker.",
      "Connect vacancies to district facts, foot traffic, and anchor institutions.",
      "Publish short opportunity briefs for likely business categories.",
    ],
    closes: [{ f: "Finding 3", t: "vacancies become a real site-selection case" }],
    note: "Turns a four-photo real-estate page into something an operator or broker can act on.",
  },
  {
    section: 3,
    accent: "sea",
    type: "buildlayer",
    n: "Layer C",
    title: "Jobs & talent layer",
    build: [
      "Show residents nearby jobs, internships, and pathways.",
      "Show employers the talent pool around the district and Brooklyn College.",
      "Use periodic employer nudges to keep the resource active and visible.",
    ],
    closes: [{ f: "Finding 1", t: "Brooklyn College & local talent, operationalized" }],
    note: "≈14,500 students and a deep labor pool become a visible advantage for local employers.",
  },
  {
    section: 3,
    accent: "sea",
    type: "buildlayer",
    n: "Layer D",
    title: "Intake & intelligence layer",
    build: [
      "Make issue reporting and feedback prominent — for residents, tenants, and owners.",
      "Use structured intake for cleaning, graffiti, merchant support, and corridor problems, with visible status.",
      "Track what was raised, fixed, and unresolved so it becomes a source of BR&E intelligence.",
    ],
    closes: [{ f: "Finding 4", t: "service activity becomes corridor intelligence" }],
    note: "Replaces a generic contact form with a system that learns from the corridor.",
  },
  {
    section: 3,
    accent: "sea",
    type: "screens",
    title: "What good looks like — running today",
    intro:
      "One Louisville turns the same jobs into working tools. Its Property Locator is what a real site-selection layer looks like — an interactive map of every available space, with the data an operator actually needs.",
    cards: [
      { img: "assets/benchmarks/ol-property.jpg", url: "https://onelouisville.org/property-locator/", name: "One Louisville — Property Locator", contrast: "vs. our 4 photos", wide: true },
    ],
    captured: "Captured June 2026 · click to open the live tool.",
  },
  {
    section: 3,
    accent: "sea",
    type: "screens",
    title: "An interactive data dashboard — already live in Brooklyn",
    cards: [
      { img: "assets/benchmarks/dbp-dashboard.jpg", url: "https://www.downtownbrooklyn.com/downtown-brooklyn-development-dashboard/", name: "Downtown Brooklyn — Development Dashboard", contrast: "205 projects · live data · CSV", wide: true },
    ],
    foot: "Filter every project by status, drill into the numbers, and download the dataset — all on a single Brooklyn BID's budget. Proof a tool like this is well within reach.",
    captured: "Captured June 2026 · click to open the live tool.",
  },

  /* ---------------- 04 · NEXT STEPS & THE ASK ---------------- */
  {
    section: 4,
    accent: "sea",
    type: "divider",
    num: "04",
    overline: "Next Steps",
    line: "A sensible first phase is straightforward.",
    body:
      "We don't build all four layers at once. We sequence them so the BID starts building a shared factual base partners can trust — and starts learning from what it captures.",
  },
  {
    section: 4,
    accent: "sea",
    type: "roadmap",
    title: "Three phases, in order",
    intro: "Each phase ships something usable and sets up the next.",
    phases: [
      {
        label: "First phase",
        focus: "Decide & repair the foundation",
        items: [
          "Working sessions on the district story, the key facts, the weak directory/map, and the issue-reporting path.",
          "Decide what must be public, what must be structured, and what needs an owner.",
          "Fix the broken directory and map so the basics actually work.",
        ],
      },
      {
        label: "Second phase",
        focus: "Publish a trustworthy base",
        items: [
          "Ship a simple, recurring “State of the Junction” dashboard.",
          "Improve the vacancy and opportunity layer with real specs.",
          "Start building a shared factual base partners and funders can trust.",
        ],
      },
      {
        label: "Third phase",
        focus: "Start learning from the corridor",
        items: [
          "Add the jobs and talent system.",
          "Add structured intake and intelligence.",
          "Begin learning from what you capture — especially small firms and recurring corridor issues.",
        ],
      },
    ],
  },
  {
    section: 4,
    accent: "sea",
    type: "closing",
    title: "What we'd like from this session",
    asks: [
      { k: "Agree the diagnosis", v: "That the information layer — not effort or assets — is the binding constraint." },
      { k: "Pick the first target", v: "Greenlight Phase 1: repair the directory and map, and design the issue-reporting path." },
      { k: "Name owners", v: "Decide who owns the district story, the data, and the intake going forward." },
    ],
    signoff:
      "The Junction has the assets. This is about making the information match them — so the BID can attract, retain, and prove its work.",
    wordmark: "Information as Infrastructure",
  },

  /* ---------------- APPENDIX · TOOL EXPLORATION ---------------- */
  {
    section: 5,
    accent: "sea",
    type: "divider",
    num: "A",
    overline: "Appendix · Exploration",
    line: "What could be brought into the tool",
    body:
      "Beyond the four-layer concept: a closer look at the specific components — and the mostly-free public data feeds — that could populate a Junction-scale tool. This section is exploratory. Treat it as the menu, not the commitment.",
  },
  {
    section: 5,
    accent: "sea",
    type: "toolkit",
    kickerOverride: "Exploration · What goes in the tool",
    title: "The components, mapped to the four layers",
    intro:
      "Each chip is a concrete, buildable part. The tag on the right names the live-site gap that layer closes.",
    layers: [
      {
        n: "A",
        title: "District information",
        chips: ["Live business directory", "Interactive map", "Hours · photos · contact", "Events & news feed", "Anchors & wayfinding"],
        fix: "Replaces the empty directory & dead map",
      },
      {
        n: "B",
        title: "Opportunity & site-selection",
        chips: ["Vacancy listings — sq ft · rent · broker", "Vacancy map pins", "Opportunity briefs by category", "Openings & closings tracker"],
        fix: "Replaces the 4-photo real-estate page",
      },
      {
        n: "C",
        title: "Jobs & talent",
        chips: ["Local job board", "Brooklyn College pipeline", "Employer talent snapshot", "Training & Workforce1 links"],
        fix: "Operationalizes the college",
      },
      {
        n: "D",
        title: "Intake & intelligence",
        chips: ["311-style categorized reporting", "Status tracking", "Merchant support intake", "Capital-fit assistant (WhatsApp bot)", "BR&E pattern reporting"],
        fix: "Replaces the generic contact form",
      },
    ],
    crossLabel: "Cross-cutting — shared across every layer",
    cross: ["One shared map", "Search & filters", "CSV / data export", "Mobile-first", "Public + BID-admin views", "Meet merchants on WhatsApp / SMS"],
  },
  {
    section: 5,
    accent: "sea",
    type: "datasources",
    kickerOverride: "Exploration · Where the data comes from",
    title: "Where the data comes from — free vs paid",
    intro:
      "Most of a credible “State of the Junction” dashboard runs on free public data. Budget concentrates in just two places.",
    free: [
      { name: "NYC Open Data", powers: "Business licenses, sanitation & more → directory + dashboard", source: SRC.nycOpenData },
      { name: "Storefront Registry — Local Law 157", powers: "Registered ground-floor vacancies → vacancy layer", source: SRC.storefrontReg },
      { name: "U.S. Census / ACS", powers: "Population, income, age, education → market view", source: SRC.censusData },
      { name: "NYPD crime statistics", powers: "70th Precinct safety trend → safety metric", source: SRC.nypd },
      { name: "NYC 311", powers: "Relay reports so issues actually get actioned → intake", source: SRC.nyc311 },
      { name: "MTA Open Data", powers: "Flatbush Av–Brooklyn College ridership → footfall proxy", source: null },
    ],
    paid: [
      { name: "Foot-traffic analytics", powers: "True pedestrian counts (Placer.ai-class)", tag: "Recurring" },
      { name: "Front-end & map build", powers: "The tool itself — one-time development", tag: "One-time" },
      { name: "Hosting & upkeep", powers: "Keeping it live and current", tag: "Minor recurring" },
    ],
    takeaway:
      "Roughly four-fifths of the dashboard is public data you can wire up in Phase 1–2 at near-zero data cost. The only real budget items are foot-traffic counts and the build itself.",
  },

  /* ---------------- CREDIT ---------------- */
  {
    section: 5,
    accent: "sea",
    type: "credit",
    kickerOverride: "Thank you",
    mark: "¶",
    byline: "A presentation by",
    studio: "Studio 82",
    project:
      "Information as Infrastructure — prepared for the Flatbush Nostrand Junction BID.",
  },
];
