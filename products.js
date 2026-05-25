/* =============================================
   A-WAG — Product Catalog
   products.js — shared by index.html + product.html
   ============================================= */

const AWAG_PRODUCTS = [

  // ── AKSHAR ∴ ─────────────────────────────────
  {
    id:         'akshar-arent-we-all',
    name:       "AREN'T WE ALL?",
    collection: 'Akshar',
    symbol:     '∴',
    signal:     'Signal 001',
    colorway:   'Washed Void Black · Bone White Ink',
    img:        'Collections/Akshar/Arent%20we%20all.jpg',
    price:      2499,
    philosophy: "The question isn't rhetorical. Every tradition that went deep enough arrived here — Vedanta, Zen, Sufism, the particle physicist at 3am. The question is the answer, wearing a question mark.",
  },
  {
    id:         'akshar-gods-doubt',
    name:       'EVEN GODS DOUBT',
    collection: 'Akshar',
    symbol:     '∴',
    signal:     'Signal 001',
    colorway:   'Deep Burgundy · Bone White Ink',
    img:        'Collections/Akshar/Gods%20Doubt.jpg',
    price:      2499,
    philosophy: "Certainty is the smallest room. The gods worth following are the ones who kept asking. This garment is for the ones who haven't stopped.",
  },
  {
    id:         'akshar-never-born',
    name:       'YOU WERE NEVER BORN',
    collection: 'Akshar',
    symbol:     '∴',
    signal:     'Signal 001',
    colorway:   'Raw Linen · Deep Black Ink',
    img:        'Collections/Akshar/Never%20Born.jpg',
    price:      2499,
    philosophy: "नैनं छिन्दन्ति शस्त्राणि — the blade cannot cut it. Whatever you actually are was not made when you were born and will not end when you stop breathing.",
  },
  {
    id:         'akshar-on-loan',
    name:       'YOUR BODY IS ON LOAN',
    collection: 'Akshar',
    symbol:     '∴',
    signal:     'Signal 001',
    colorway:   'Army Khaki · Bone White Ink',
    img:        'Collections/Akshar/On%20Loan.jpg',
    price:      2499,
    philosophy: "You did not make this body. You did not ask for it. You will not keep it. Wear it as though it belongs to something larger — because it does.",
  },

  // ── BLOOM ⊕ ──────────────────────────────────
  {
    id:         'bloom-nada',
    name:       'NADA',
    collection: 'Bloom',
    symbol:     '⊕',
    signal:     'Signal 002',
    colorway:   'Sacred Geometry · Sound Form',
    img:        'Collections/Bloom/Nada.jpg',
    price:      2499,
    philosophy: "Nada Brahma. The universe is sound. Before light, before matter, before you — there was vibration. The graphic on this garment is what that vibration looks like when plotted against itself.",
  },
  {
    id:         'bloom-panchakshara',
    name:       'PANCHAKSHARA',
    collection: 'Bloom',
    symbol:     '⊕',
    signal:     'Signal 002',
    colorway:   'Five Syllables · Five Elements',
    img:        'Collections/Bloom/Panchakshara.jpg',
    price:      2499,
    philosophy: "Na-Ma-Śi-Vā-Ya. Five syllables. Five elements. The Shiva Purana says this mantra contains the entirety of creation in compressed form. The mandala on this garment is that compression, made visible.",
  },
  {
    id:         'bloom-spanda',
    name:       'SPANDA',
    collection: 'Bloom',
    symbol:     '⊕',
    signal:     'Signal 002',
    colorway:   'The Divine Pulse · Primordial Vibration',
    img:        'Collections/Bloom/Spanda.jpg',
    price:      2499,
    philosophy: "Spanda is the Kashmir Shaivite term for the sacred trembling at the root of everything — before form, before thought. The pulse the universe uses to recognise itself.",
  },
  {
    id:         'bloom-vaayu-1',
    name:       'VAAYU PUTRA I',
    collection: 'Bloom',
    symbol:     '⊕',
    signal:     'Signal 002',
    colorway:   'Son of Wind · Form I',
    img:        'Collections/Bloom/Vaayu%20Putra%201.jpg',
    price:      2499,
    philosophy: "Vaayu — the wind — is the life force made kinetic. Vayu Putra: born of that force. Two forms of the same movement. This is the first.",
  },
  {
    id:         'bloom-vaayu-2',
    name:       'VAAYU PUTRA II',
    collection: 'Bloom',
    symbol:     '⊕',
    signal:     'Signal 002',
    colorway:   'Son of Wind · Form II',
    img:        'Collections/Bloom/Vaayu%20Putra%202.jpg',
    price:      2499,
    philosophy: "Vaayu — the wind — is the life force made kinetic. Vayu Putra: born of that force. Two forms of the same movement. This is the second.",
  },

  // ── VOID ○ ────────────────────────────────────
  {
    id:         'void-before-name',
    name:       'BEFORE NAME',
    collection: 'Void',
    symbol:     '○',
    signal:     'Signal 003',
    colorway:   'The Ground Before Form',
    img:        'Collections/Void/Before%20Name.jpg',
    price:      2499,
    philosophy: "Before you were named, you existed. Before the name settled in and became the container everything else went into. The design shows the moment before the wave function collapses into a person.",
  },
  {
    id:         'void-static-field',
    name:       'STATIC FIELD',
    collection: 'Void',
    symbol:     '○',
    signal:     'Signal 003',
    colorway:   'Quantum Ground State',
    img:        'Collections/Void/Static%20Field.jpg',
    price:      2499,
    philosophy: "The quantum vacuum is not empty. It is the ground state — the condition from which all particles emerge and into which they return. The static is not noise. It is the field before it decides what to be.",
  },
  {
    id:         'void-the-vessel',
    name:       'THE VESSEL',
    collection: 'Void',
    symbol:     '○',
    signal:     'Signal 003',
    colorway:   'Form Holding Emptiness',
    img:        'Collections/Void/The%20Vessel.jpg',
    price:      2499,
    philosophy: "The Upanishads say the body is not the container of energy. The body IS the energy, temporarily localised. The graphic is spanda — the sacred trembling — radiating from a human centre.",
  },

  // ── WITNESS ◉ ─────────────────────────────────
  {
    id:         'witness-enso',
    name:       'ENSO',
    collection: 'Witness',
    symbol:     '◉',
    signal:     'Signal 004',
    colorway:   'The Zen Circle · Completion',
    img:        'Collections/Witness/Enso.jpg',
    price:      2499,
    philosophy: "The ensō is brushed in one stroke without correction. It is complete because the person who brushed it was, at that moment, complete. Not a symbol of perfection — documentation of presence.",
  },
  {
    id:         'witness-indras-center',
    name:       "INDRA'S CENTER",
    collection: 'Witness',
    symbol:     '◉',
    signal:     'Signal 004',
    colorway:   "The Net of Indra · Infinite Reflection",
    img:        "Collections/Witness/Indra%27s%20Center.jpg",
    price:      2499,
    philosophy: "Indra's Net: a net of infinite jewels, each reflecting all others. Every point is a centre. There is no outside. The person wearing this garment is one of the jewels. So is the person looking at it.",
  },
  {
    id:         'witness-kalachakra',
    name:       'KALACHAKRA',
    collection: 'Witness',
    symbol:     '◉',
    signal:     'Signal 004',
    colorway:   'Wheel of Time · The Observer',
    img:        'Collections/Witness/Kalachakra.jpg',
    price:      2499,
    philosophy: "The wheel does not turn — the observer turns. What you call time is the shape your attention makes moving through what has always been.",
  },

  // ── YAATRA ◎ ──────────────────────────────────
  {
    id:         'yaatra-jyotirlinga',
    name:       'JYOTIRLINGA',
    collection: 'Yaatra',
    symbol:     '◎',
    signal:     'Signal 004',
    colorway:   'Kedarnath · Light Form of Shiva',
    img:        'Collections/Yaatra/Jyotirlinga.jpg',
    price:      2499,
    philosophy: "Jyotirlinga means pillar of light. Shiva does not appear as a statue at Kedarnath — he appears as light itself. The geometry on this garment is the temple's sacred architecture, mapped topologically.",
  },
  {
    id:         'yaatra-kaal',
    name:       'KAAL',
    collection: 'Yaatra',
    symbol:     '◎',
    signal:     'Signal 004',
    colorway:   'Ujjain · The Mahakaleshwar',
    img:        'Collections/Yaatra/Kaal.jpg',
    price:      2499,
    philosophy: "Mahakaleshwar — the great lord of time. Ujjain sits on the Tropic of Cancer, where the shadow disappears at noon on the solstice. This is the garment of the place where time folds.",
  },
  {
    id:         'yaatra-mahasmashana',
    name:       'MAHASMASHANA',
    collection: 'Yaatra',
    symbol:     '◎',
    signal:     'Signal 004',
    colorway:   'Kashi · The Great Cremation Ground',
    img:        'Collections/Yaatra/Mahasmashana.jpg',
    price:      2499,
    philosophy: "Varanasi is where bodies burn continuously, where death is not hidden, where the line between the living and the dissolving is a ghat step wide. To go there correctly is to understand what the body is.",
  },
  {
    id:         'yaatra-triveni',
    name:       'TRIVENI',
    collection: 'Yaatra',
    symbol:     '◎',
    signal:     'Signal 004',
    colorway:   'Prayagraj · Three Rivers, One Truth',
    img:        'Collections/Yaatra/Triveni.jpg',
    price:      2499,
    philosophy: "Triveni Sangam: where the Ganga, Yamuna, and the invisible Saraswati meet. The third river cannot be seen — it flows beneath the surface. The confluence is a diagram of consciousness.",
  },

];

/* ── Helpers ───────────────────────────────────── */
function getProduct(id) {
  return AWAG_PRODUCTS.find(function(p) { return p.id === id; }) || null;
}

// Same collection, different product
function getRelated(id, max) {
  max = max || 3;
  var product = getProduct(id);
  if (!product) return [];
  return AWAG_PRODUCTS
    .filter(function(p) { return p.collection === product.collection && p.id !== id; })
    .slice(0, max);
}

// One representative product from each OTHER collection
function getOtherCollections(id, max) {
  max = max || 4;
  var product = getProduct(id);
  if (!product) return [];
  var seenCollections = {};
  var results = [];
  AWAG_PRODUCTS.forEach(function(p) {
    if (
      p.collection !== product.collection &&
      !seenCollections[p.collection] &&
      results.length < max
    ) {
      seenCollections[p.collection] = true;
      results.push(p);
    }
  });
  return results;
}
