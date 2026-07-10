const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'glowup2024';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ===== DEFAULT DATA =====
const DEFAULT_DATA = {
  name: "GlowUp Rentals",
  tagline: "Marquee Letters, Photo Booths & Flower Walls",
  phone: "571-786-1516",
  email: "info@glowuprentals.com",
  address: "Alexandria, VA",
  areas: "Washington DC · Maryland · Virginia · Philadelphia · New York City",
  instagram: "https://www.instagram.com/dmv_flowerwalls/",
  services: [
    {
      id: "marquee", title: "Marquee Letters & Numbers", icon: "✦",
      price: "From $75", priceDetail: "3ft Letters $75 · 4ft Numbers $100",
      link: "pages/marquee.html",
      description: "Light-up marquee letters for weddings, proposals, birthdays, and corporate events. Delivery, setup, and breakdown included.",
      image: "https://static.wixstatic.com/media/3974b0_300e5c6c990e4d779f648eff2499ec39~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/IMG_1040_edited.jpg",
      gallery: [
        "https://static.wixstatic.com/media/3974b0_dd27a05055744066b96e10e5b0d32e1c~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/B7BDF95B-DF28-4406-AADD-D91C62729F01_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_aff6fe501cfe4ca1a5552ca2e347c26c~mv2.jpg/v1/fill/w_600,h_730,al_c,q_80/IMG_7675_edited.jpg",
        "https://static.wixstatic.com/media/3974b0_57bfff054d664e0590953c23e69ae430~mv2.jpg/v1/fill/w_600,h_660,al_c,q_80/IMG_7675_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_e6e6433d6de94a45af45c71395900c33~mv2.jpg/v1/fill/w_600,h_450,al_c,q_80/0EB1DE65-95EA-490E-9995-F6AF483F0C52_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_16a8513f877b462ea85f9d5e6ae76d93~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/59BD76F5-A886-42EC-A94B-848201CD7C5A_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_7ed3910748b84745bca724900a3dc689~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/IMG_8269_edited.jpg",
        "https://static.wixstatic.com/media/3974b0_0338f41e7e254a36840afb9d685a5d49~mv2.jpeg/v1/fill/w_600,h_600,al_c,q_80/IMG_9368_HEIC.jpeg",
        "https://static.wixstatic.com/media/3974b0_9e6c604a867a43cba16a09be155a9fc5~mv2.jpg/v1/fill/w_600,h_620,al_c,q_80/Red%20Flowerwall%20Backdrop%20Party%20Decor_edited.jpg"
      ]
    },
    {
      id: "photobooth", title: "Photo Booth", icon: "◉",
      price: "$150/hr", priceDetail: "$550 for 5 Hours · Print on site: +$100/hr",
      link: "pages/photo-booth.html",
      description: "Modern photo booth rentals with on-site setup and pickup. Perfect for weddings, parties, and corporate events.",
      image: "https://static.wixstatic.com/media/3974b0_16a8513f877b462ea85f9d5e6ae76d93~mv2.jpg/v1/fill/w_410,h_410,al_c,q_80/59BD76F5-A886-42EC-A94B-848201CD7C5A_JPG.jpg",
      gallery: [
        "https://static.wixstatic.com/media/3974b0_346bf7b9ac5d49ccb65ebfa5ddd446d9~mv2.jpg/v1/fill/w_600,h_520,al_c,q_80/59BD76F5-A886-42EC-A94B-848201CD7C5A_edited.jpg",
        "https://static.wixstatic.com/media/3974b0_bab8b9b67e5348eb80aa5dc3b462bdd8~mv2.png/v1/fit/w_600,h_780,q_90/3974b0_bab8b9b67e5348eb80aa5dc3b462bdd8~mv2.png",
        "https://static.wixstatic.com/media/3974b0_7708a74b74ee443c822174ed485b0610~mv2.png/v1/fit/w_600,h_780,q_90/3974b0_7708a74b74ee443c822174ed485b0610~mv2.png",
        "https://static.wixstatic.com/media/3974b0_ed5f6d4716b0497c93b2dab72c07ae9a~mv2.jpg/v1/fit/w_600,h_900,q_90/3974b0_ed5f6d4716b0497c93b2dab72c07ae9a~mv2.jpg",
        "https://static.wixstatic.com/media/3974b0_bbf1dd819b6948bebed9e86faae5dfce~mv2.jpg/v1/fit/w_600,h_900,q_90/3974b0_bbf1dd819b6948bebed9e86faae5dfce~mv2.jpg",
        "https://static.wixstatic.com/media/3974b0_543fff37e75644d5ac2ff30b2e1a567b~mv2.jpg/v1/fit/w_600,h_450,q_90/3974b0_543fff37e75644d5ac2ff30b2e1a567b~mv2.jpg"
      ]
    },
    {
      id: "backdrops", title: "Backdrops & Flower Walls", icon: "❋",
      price: "$450", priceDetail: "8×8 ft · All colors available",
      link: "pages/flower-walls.html",
      description: "Luxury floral backdrops and flower wall rentals for all events.",
      image: "https://static.wixstatic.com/media/3974b0_04b0fef52a614d1b909cf6c836c1ead2~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/White%20Flowerwall%20Backdrop%20Wedding%20Decor_.jpg",
      gallery: [
        "https://static.wixstatic.com/media/3974b0_bd579cf63c62416e9379dd32610cd395~mv2.jpg/v1/fill/w_600,h_620,al_c,q_80/IMG_9242_edited.jpg",
        "https://static.wixstatic.com/media/3974b0_a85d358c67b34c6091a5f86ca6791f83~mv2.png/v1/fill/w_600,h_620,al_c,q_85/Pink%20Birthday%20Sweet%2016%20Backdrop%20Baby%20Shower%20Girl_edited.png",
        "https://static.wixstatic.com/media/3974b0_c2ea6d95545040428f9ee557df090a98~mv2.jpg/v1/fill/w_600,h_620,al_c,q_80/Red%20Flowerwall%20Holiday%20Valentines%20Day%20Backdrop_%20JPG_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_b9b37c08eb4a4d7aa1dda2955126c8eb~mv2.jpg/v1/fill/w_600,h_620,al_c,q_80/Greenery%20Backdrop_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_8636f33e097e4017af2a3866992d3fca~mv2.jpg/v1/fill/w_600,h_410,al_c,q_80/IMG-2314.jpg",
        "https://static.wixstatic.com/media/3974b0_9e6c604a867a43cba16a09be155a9fc5~mv2.jpg/v1/fill/w_600,h_620,al_c,q_80/Red%20Flowerwall%20Backdrop%20Party%20Decor_edited.jpg",
        "https://static.wixstatic.com/media/3974b0_7ed3910748b84745bca724900a3dc689~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/IMG_8269_edited.jpg",
        "https://static.wixstatic.com/media/3974b0_60e954afe3cc4480baca2e218602b61a~mv2.jpg/v1/fill/w_600,h_620,al_c,q_80/IMG_5322_edited.jpg"
      ]
    },
    {
      id: "balloons", title: "Balloon Decorations", icon: "◎",
      price: "$200", priceDetail: "Per balloon column",
      link: "pages/inquiry.html",
      description: "Custom balloon arches, garlands, columns, and organic balloon installations across the DMV area.",
      image: "https://static.wixstatic.com/media/3974b0_0338f41e7e254a36840afb9d685a5d49~mv2.jpeg/v1/fill/w_292,h_300,al_c,q_80/IMG_9368_HEIC.jpeg",
      gallery: []
    }
  ],
  packages: [
    {
      id: "pkg1", name: "Proposal Package", price: "$850",
      highlight: true, tag: "Most Popular",
      includes: ["Marquee Letters MARRY ME", "Balloon arrangement", "Rose petals"],
      note: "MARRY ME: $525 · LOVE: $300",
      image: "https://static.wixstatic.com/media/3974b0_dd27a05055744066b96e10e5b0d32e1c~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/B7BDF95B-DF28-4406-AADD-D91C62729F01_JPG.jpg",
      gallery: []
    },
    {
      id: "pkg2", name: "Backdrop Package", price: "$725",
      highlight: false, tag: "",
      includes: ["Backdrop of your choice", "Neon sign", "Marquee letters (up to 4) or Numbers (up to 2)"],
      note: "",
      image: "https://static.wixstatic.com/media/3974b0_7ed3910748b84745bca724900a3dc689~mv2.jpg/v1/fill/w_291,h_295,al_c,q_80/IMG_8269_edited.jpg",
      gallery: []
    },
    {
      id: "pkg3", name: "Party Package", price: "$975",
      highlight: false, tag: "",
      includes: ["Backdrop of your choice", "Neon sign", "Photo booth (up to 5 hours)", "Marquee letters or numbers (up to 2)"],
      note: "",
      image: "https://static.wixstatic.com/media/3974b0_9e6c604a867a43cba16a09be155a9fc5~mv2.jpg/v1/fill/w_292,h_300,al_c,q_80/Red%20Flowerwall%20Backdrop%20Party%20Decor_edited.jpg",
      gallery: []
    },
    {
      id: "pkg4", name: "Package C — Full Event", price: "$2,000",
      highlight: true, tag: "Best Value",
      includes: ["Backdrop of choice", "Photo booth", "Neon sign", "Props", "Balloon columns (2)", "Marquee letters (up to 6)"],
      note: "Each additional letter: $75 · Stacking fee: $150",
      image: "https://static.wixstatic.com/media/3974b0_57bfff054d664e0590953c23e69ae430~mv2.jpg/v1/fill/w_279,h_305,al_c,q_80/IMG_7675_JPG.jpg",
      gallery: []
    }
  ],
  reviews: [
    { id: "r1", name: "G. Woodward", event: "Corporate Anniversary Event", stars: 5, text: "We used this company for our 10th Anniversary corporate event. The marquee lights were great quality and the perfect addition to our event aesthetic. The staff was courteous, professional, and very responsive." },
    { id: "r2", name: "Christina Sin", event: "Event Planner — Multi-Service Rental", stars: 5, text: "A great resource when you're looking for decor at a great price. I worked with them on a photo booth, greenery wall, neon sign, marquee letters, and balloon columns. They were responsive, on time, and fantastic to work with." },
    { id: "r3", name: "Mrs. Jenkins", event: "Wedding Photo Booth", stars: 5, text: "I had such a wonderful experience! From start to finish, the process was smooth and stress-free. The setup was easy, the staff was professional, and the customer service was outstanding." }
  ],
  faq: [
    { id: "f1", question: "Do you include delivery, setup, and breakdown?", answer: "Yes. All rentals include delivery, professional setup, and post-event breakdown." },
    { id: "f2", question: "What areas do you serve?", answer: "We serve Washington DC, Northern Virginia, Maryland, Philadelphia, and New York City. We also deliver within 100 miles." },
    { id: "f3", question: "How far in advance should I book?", answer: "We recommend booking at least 1–2 weeks in advance. For weekends, earlier is better." },
    { id: "f4", question: "Are you insured for events?", answer: "Yes. We are fully insured for private events, weddings, and corporate events." },
    { id: "f5", question: "Can I customize packages?", answer: "Absolutely. Our packages are flexible and you can combine services to fit your event." },
    { id: "f6", question: "Do you accept last-minute bookings?", answer: "Yes, depending on availability. Rush bookings may include an additional fee." }
  ]
};

// In-memory storage (persists while Railway is running)
let siteData = JSON.parse(JSON.stringify(DEFAULT_DATA));

// GET all data
app.get('/api/data', (req, res) => {
  res.json(siteData);
});

// POST update all data
app.post('/api/data', (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if(secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  siteData = req.body;
  res.json({ success: true });
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'GlowUp API running ✓', services: siteData.services.length });
});

// ===== INQUIRIES =====
let inquiries = [];

// POST new inquiry from website form
app.post('/api/inquiry', (req, res) => {
  const inquiry = {
    id: 'inq_' + Date.now(),
    ...req.body,
    status: 'new',
    comment: '',
    createdAt: new Date().toISOString()
  };
  inquiries.unshift(inquiry); // newest first
  res.json({ success: true, id: inquiry.id });
});

// GET all inquiries (admin only)
app.get('/api/inquiries', (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if(secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  res.json(inquiries);
});

// PATCH update inquiry status/comment
app.patch('/api/inquiry/:id', (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if(secret !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  const inq = inquiries.find(i => i.id === req.params.id);
  if(!inq) return res.status(404).json({ error: 'Not found' });
  if(req.body.status) inq.status = req.body.status;
  if(req.body.comment !== undefined) inq.comment = req.body.comment;
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`GlowUp API on port ${PORT}`));
