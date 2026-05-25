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
    img2:       'Collections/Akshar/Arent%20we%20all-1.jpg',
    price:      2499,
    philosophy: "The question isn't rhetorical. Every tradition that went deep enough arrived here — Vedanta, Zen, Sufism, the particle physicist at 3am. The question is the answer, wearing a question mark.",
    artist: {
      name:     'Kavya Rao',
      initials: 'KR',
      role:     'Sanskrit Calligrapher · Vedanta Practitioner',
      location: 'Mysore',
      quote:    'I sat with this question every morning for three years before I let it become a garment. The Vedantic answer is obvious — but only after you have stopped being afraid of what it means for the self you have been carrying.',
    },
  },
  {
    id:         'akshar-gods-doubt',
    name:       'EVEN GODS DOUBT',
    collection: 'Akshar',
    symbol:     '∴',
    signal:     'Signal 001',
    colorway:   'Deep Burgundy · Bone White Ink',
    img:        'Collections/Akshar/Gods%20Doubt.jpg',
    img2:       'Collections/Akshar/Gods%20Doubt-1.jpg',
    price:      2499,
    philosophy: "Certainty is the smallest room. The gods worth following are the ones who kept asking. This garment is for the ones who haven't stopped.",
    artist: {
      name:     'Kavya Rao',
      initials: 'KR',
      role:     'Sanskrit Calligrapher · Vedanta Practitioner',
      location: 'Mysore',
      quote:    'My teacher at Sringeri said once: the student who stops doubting has stopped learning. I made this for everyone still inside the question — which is everyone who is honest.',
    },
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
    artist: {
      name:     'Kavya Rao',
      initials: 'KR',
      role:     'Sanskrit Calligrapher · Vedanta Practitioner',
      location: 'Mysore',
      quote:    'This is the first Sanskrit verse I memorised. I was eight. I repeated it without understanding for twenty years. I made this garment the afternoon I finally did.',
    },
  },
  {
    id:         'akshar-on-loan',
    name:       'YOUR BODY IS ON LOAN',
    collection: 'Akshar',
    symbol:     '∴',
    signal:     'Signal 001',
    colorway:   'Army Khaki · Bone White Ink',
    img:        'Collections/Akshar/On%20Loan.jpg',
    img2:       'Collections/Akshar/On%20Loan-1.jpg',
    price:      2499,
    philosophy: "You did not make this body. You did not ask for it. You will not keep it. Wear it as though it belongs to something larger — because it does.",
    artist: {
      name:     'Kavya Rao',
      initials: 'KR',
      role:     'Sanskrit Calligrapher · Vedanta Practitioner',
      location: 'Mysore',
      quote:    'A swami at Sringeri Mutt pointed to my hand and said simply: borrowed. I laughed. Then I sat with it for four years. This garment came out the other side.',
    },
  },
  {
    id:         'akshar-god-mirror',
    name:       'GOD MIRROR',
    collection: 'Akshar',
    symbol:     '∴',
    signal:     'Signal 001',
    colorway:   'Washed Void Black · Bone White Ink',
    img:        'Collections/Akshar/God%20Mirror.jpg',
    img2:       'Collections/Akshar/God%20Mirror-1.jpg',
    price:      2499,
    philosophy: "Every mirror shows you a reversed self. The God mirror shows you the unreversed one — the version that was never only what it appeared to be. This garment is that reflection.",
    artist: {
      name:     'Kavya Rao',
      initials: 'KR',
      role:     'Sanskrit Calligrapher · Vedanta Practitioner',
      location: 'Mysore',
      quote:    'The Upanishads say tat tvam asi — thou art that. Not a metaphor. A mirror facing a mirror. I spent one year trying to draw what happens at the point of infinite reflection. This is the moment before it becomes everything.',
    },
  },
  {
    id:         'akshar-confusion-conclusion',
    name:       'CONFUSION / CONCLUSION',
    collection: 'Akshar',
    symbol:     '∴',
    signal:     'Signal 001',
    colorway:   'Smoke White · Deep Black Ink',
    img:        'Collections/Akshar/Confusion%20Conclusion.jpg',
    img2:       'Collections/Akshar/Confusion%20Conclusion-1.jpg',
    price:      2499,
    philosophy: "Confusion is not a failure of understanding — it is the exact shape of the boundary where understanding expands. Every realisation was first a confusion that refused to resolve cheaply.",
    artist: {
      name:     'Kavya Rao',
      initials: 'KR',
      role:     'Sanskrit Calligrapher · Vedanta Practitioner',
      location: 'Mysore',
      quote:    'My teacher would say: if you are not confused, you have settled for a smaller question. This garment is for everyone who chose the bigger confusion — because on the other side of it is the only conclusion that doesn\'t collapse.',
    },
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
    img2:       'Collections/Bloom/Nada-1.jpg',
    price:      2499,
    philosophy: "Nada Brahma. The universe is sound. Before light, before matter, before you — there was vibration. The graphic on this garment is what that vibration looks like when plotted against itself.",
    artist: {
      name:     'Aryan Mehta',
      initials: 'AM',
      role:     'Cymatic Artist · Sound Healer',
      location: 'Varanasi',
      quote:    'I had studied Nada Brahma for seven years before I set up the Chladni plate. The first time I played the correct frequency and watched the sand arrange itself — I understood. The universe had been waiting to show me this since before I was born.',
    },
  },
  {
    id:         'bloom-panchakshara',
    name:       'PANCHAKSHARA',
    collection: 'Bloom',
    symbol:     '⊕',
    signal:     'Signal 002',
    colorway:   'Five Syllables · Five Elements',
    img:        'Collections/Bloom/Panchakshara.jpg',
    img2:       'Collections/Bloom/Panchakshara-1.jpg',
    price:      2499,
    philosophy: "Na-Ma-Śi-Vā-Ya. Five syllables. Five elements. The Shiva Purana says this mantra contains the entirety of creation in compressed form. The mandala on this garment is that compression, made visible.",
    artist: {
      name:     'Aryan Mehta',
      initials: 'AM',
      role:     'Cymatic Artist · Sound Healer',
      location: 'Varanasi',
      quote:    'I spent six months mapping the resonant frequency of each syllable separately. Individually, they make simple forms. Together — Na-Ma-Śi-Vā-Ya — they become this mandala. That is what a mantra does. Five separate things become one totality.',
    },
  },
  {
    id:         'bloom-spanda',
    name:       'SPANDA',
    collection: 'Bloom',
    symbol:     '⊕',
    signal:     'Signal 002',
    colorway:   'The Divine Pulse · Primordial Vibration',
    img:        'Collections/Bloom/Spanda.jpg',
    img2:       'Collections/Bloom/Spanda-1.jpg',
    price:      2499,
    philosophy: "Spanda is the Kashmir Shaivite term for the sacred trembling at the root of everything — before form, before thought. The pulse the universe uses to recognise itself.",
    artist: {
      name:     'Aryan Mehta',
      initials: 'AM',
      role:     'Cymatic Artist · Sound Healer',
      location: 'Varanasi',
      quote:    'I sat by the Ganga for three days trying to draw what trembling looks like before it becomes a wave. This came on the fourth morning, before I was awake enough to interfere with it.',
    },
  },
  {
    id:         'bloom-vaayu-2',
    name:       'VAAYU PUTRA II',
    collection: 'Bloom',
    symbol:     '⊕',
    signal:     'Signal 002',
    colorway:   'Son of Wind · Form II',
    img:        'Collections/Bloom/Vaayu%20Putra%202.jpg',
    img2:       'Collections/Bloom/Vaayu%20Putra%202-1.jpg',
    price:      2499,
    philosophy: "Vaayu — the wind — is the life force made kinetic. Vayu Putra: born of that force. Two forms of the same movement. This is the second.",
    artist: {
      name:     'Aryan Mehta',
      initials: 'AM',
      role:     'Cymatic Artist · Sound Healer',
      location: 'Varanasi',
      quote:    'This is the same wind — after it decides. The difference between Form I and Form II is the same as between breath held and breath released. One is everything that could be. One is what is.',
    },
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
    img2:       'Collections/Void/Before%20Name-1.jpg',
    price:      2499,
    philosophy: "Before you were named, you existed. Before the name settled in and became the container everything else went into. The design shows the moment before the wave function collapses into a person.",
    artist: {
      name:     'Riya Sen',
      initials: 'RS',
      role:     'Zen Artist · Quantum Physicist',
      location: 'Kolkata',
      quote:    'In quantum mechanics, a particle exists in superposition — all states simultaneously — until observation collapses it into one. This design is that superposition. Before language collapsed you into a particular self.',
    },
  },
  {
    id:         'void-static-field',
    name:       'STATIC FIELD',
    collection: 'Void',
    symbol:     '○',
    signal:     'Signal 003',
    colorway:   'Quantum Ground State',
    img:        'Collections/Void/Static%20Field.jpg',
    img2:       'Collections/Void/Static%20Field-1.jpg',
    price:      2499,
    philosophy: "The quantum vacuum is not empty. It is the ground state — the condition from which all particles emerge and into which they return. The static is not noise. It is the field before it decides what to be.",
    artist: {
      name:     'Riya Sen',
      initials: 'RS',
      role:     'Zen Artist · Quantum Physicist',
      location: 'Kolkata',
      quote:    'Physicists call it the zero-point field — the lowest possible energy state, which is still not zero. The vacuum hums. This garment is that hum. The field before it decides to become a particle.',
    },
  },
  {
    id:         'void-the-vessel',
    name:       'THE VESSEL',
    collection: 'Void',
    symbol:     '○',
    signal:     'Signal 003',
    colorway:   'Form Holding Emptiness',
    img:        'Collections/Void/The%20Vessel.jpg',
    img2:       'Collections/Void/The%20Vessel-1.jpg',
    price:      2499,
    philosophy: "The Upanishads say the body is not the container of energy. The body IS the energy, temporarily localised. The graphic is spanda — the sacred trembling — radiating from a human centre.",
    artist: {
      name:     'Riya Sen',
      initials: 'RS',
      role:     'Zen Artist · Quantum Physicist',
      location: 'Kolkata',
      quote:    'My Zen teacher asked: what is the shape of your mind before you start thinking? I could not answer for two years. One morning I picked up a brush without intention and this came out. That is the only way it could have.',
    },
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
    img2:       'Collections/Witness/Enso-1.jpg',
    price:      2499,
    philosophy: "The ensō is brushed in one stroke without correction. It is complete because the person who brushed it was, at that moment, complete. Not a symbol of perfection — documentation of presence.",
    artist: {
      name:     'Devraj Nair',
      initials: 'DN',
      role:     'Mandala Painter · Vipassana Teacher',
      location: 'Kerala',
      quote:    'I have brushed the ensō ten thousand times in eighteen years of practice. Each one in a single stroke, one breath, no correction. Each one different. Each one complete. This is the one that finally surprised me — my hand made the choice before I did.',
    },
  },
  {
    id:         'witness-indras-center',
    name:       "INDRA'S CENTER",
    collection: 'Witness',
    symbol:     '◉',
    signal:     'Signal 004',
    colorway:   "The Net of Indra · Infinite Reflection",
    img:        "Collections/Witness/Indra%27s%20Center.jpg",
    img2:       "Collections/Witness/Indra%27s%20Center-1.jpg",
    price:      2499,
    philosophy: "Indra's Net: a net of infinite jewels, each reflecting all others. Every point is a centre. There is no outside. The person wearing this garment is one of the jewels. So is the person looking at it.",
    artist: {
      name:     'Devraj Nair',
      initials: 'DN',
      role:     'Mandala Painter · Vipassana Teacher',
      location: 'Kerala',
      quote:    'I spent three years with the Avatamsaka Sutra before I attempted this. Every jewel reflects all others. There is no centre — or every point is the centre. I tried to draw the moment you realise you are simultaneously one of the jewels, the net, and the light between them.',
    },
  },
  {
    id:         'witness-kalachakra',
    name:       'KALACHAKRA',
    collection: 'Witness',
    symbol:     '◉',
    signal:     'Signal 004',
    colorway:   'Wheel of Time · The Observer',
    img:        'Collections/Witness/Kalachakra.jpg',
    img2:       'Collections/Witness/Kalachakra-1.jpg',
    price:      2499,
    philosophy: "The wheel does not turn — the observer turns. What you call time is the shape your attention makes moving through what has always been.",
    artist: {
      name:     'Devraj Nair',
      initials: 'DN',
      role:     'Mandala Painter · Vipassana Teacher',
      location: 'Kerala',
      quote:    'A traditional Kalachakra mandala takes nine months to complete. I have made eleven. This design is not the mandala itself — it is the mathematical structure underneath it. The geometry the universe uses to organise time.',
    },
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
    img2:       'Collections/Yaatra/Jyotirlinga-1.jpg',
    price:      2499,
    philosophy: "Jyotirlinga means pillar of light. Shiva does not appear as a statue at Kedarnath — he appears as light itself. The geometry on this garment is the temple's sacred architecture, mapped topologically.",
    artist: {
      name:     'Meera Krishnamurthy',
      initials: 'MK',
      role:     'Sacred Geography Artist · Shaivite',
      location: 'Tamil Nadu',
      quote:    'I arrived at Kedarnath in November, before the season closed. The temple was half-buried in snow. The priest opened the doors at 4am. Inside there was no murti — only a rock, and light coming from somewhere I could not locate. I spent three months trying to draw where that light was coming from.',
    },
  },
  {
    id:         'yaatra-kaal',
    name:       'KAAL',
    collection: 'Yaatra',
    symbol:     '◎',
    signal:     'Signal 004',
    colorway:   'Ujjain · The Mahakaleshwar',
    img:        'Collections/Yaatra/Kaal.jpg',
    img2:       'Collections/Yaatra/Kaal-1.jpg',
    price:      2499,
    philosophy: "Mahakaleshwar — the great lord of time. Ujjain sits on the Tropic of Cancer, where the shadow disappears at noon on the solstice. This is the garment of the place where time folds.",
    artist: {
      name:     'Meera Krishnamurthy',
      initials: 'MK',
      role:     'Sacred Geography Artist · Shaivite',
      location: 'Tamil Nadu',
      quote:    'Ujjain is the only city where Shiva appears as time itself. I arrived at midnight and stood in the Mahakaleshwar sanctum until the 4am aarti. When I walked out I had stopped knowing what time it was. That disappearance — that is what this garment documents.',
    },
  },
  {
    id:         'yaatra-mahasmashana',
    name:       'MAHASMASHANA',
    collection: 'Yaatra',
    symbol:     '◎',
    signal:     'Signal 004',
    colorway:   'Kashi · The Great Cremation Ground',
    img:        'Collections/Yaatra/Mahasmashana.jpg',
    img2:       'Collections/Yaatra/Mahasmashana-1.jpg',
    price:      2499,
    philosophy: "Varanasi is where bodies burn continuously, where death is not hidden, where the line between the living and the dissolving is a ghat step wide. To go there correctly is to understand what the body is.",
    artist: {
      name:     'Meera Krishnamurthy',
      initials: 'MK',
      role:     'Sacred Geography Artist · Shaivite',
      location: 'Tamil Nadu',
      quote:    'I sat at Manikarnika Ghat for three consecutive nights. By the third I understood what was burning. It was not people. It was the part of them that believed it was something other than fire.',
    },
  },
  {
    id:         'yaatra-triveni',
    name:       'TRIVENI',
    collection: 'Yaatra',
    symbol:     '◎',
    signal:     'Signal 004',
    colorway:   'Prayagraj · Three Rivers, One Truth',
    img:        'Collections/Yaatra/Triveni.jpg',
    img2:       'Collections/Yaatra/Triveni-1.jpg',
    price:      2499,
    philosophy: "Triveni Sangam: where the Ganga, Yamuna, and the invisible Saraswati meet. The third river cannot be seen — it flows beneath the surface. The confluence is a diagram of consciousness.",
    artist: {
      name:     'Meera Krishnamurthy',
      initials: 'MK',
      role:     'Sacred Geography Artist · Shaivite',
      location: 'Tamil Nadu',
      quote:    'At Sangam, three rivers meet — but the Saraswati is invisible. The confluence is real, felt by everyone who enters that water. But one of its three currents cannot be seen. I have been thinking about invisible truth for twenty years. This is its diagram.',
    },
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
