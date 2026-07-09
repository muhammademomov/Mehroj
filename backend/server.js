const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Load default data
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
      id: "marquee",
      title: "Marquee Letters & Numbers",
      icon: "✦",
      price: "From $75",
      priceDetail: "3ft Letters $75 · 4ft Numbers $100",
      link: "pages/marquee.html",
      description: "Light-up marquee letters for weddings, proposals, birthdays, and corporate events.",
      image: "https://static.wixstatic.com/media/3974b0_300e5c6c990e4d779f648eff2499ec39~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/IMG_1040_edited.jpg"
    },
    {
      id: "photobooth",
      title: "Photo Booth",
      icon: "◉",
      price: "$150/hr",
      priceDetail: "$550 for 5 Hours · Print on site: +$100/hr",
      link: "pages/photo-booth.html",
      description: "Modern photo booth rentals with on-site setup and pickup.",
      image: "https://static.wixstatic.com/media/3974b0_16a8513f877b462ea85f9d5e6ae76d93~mv2.jpg/v1/fill/w_410,h_410,al_c,q_80/59BD76F5-A886-42EC-A94B-848201CD7C5A_JPG.jpg"
    },
    {
      id: "backdrops",
      title: "Backdrops & Flower Walls",
      icon: "❋",
      price: "$450",
      priceDetail: "8×8 ft · All colors available",
      link: "pages/flower-walls.html",
      description: "Luxury floral backdrops and flower wall rentals for all events.",
      image: "https://static.wixstatic.com/media/3974b0_04b0fef52a614d1b909cf6c836c1ead2~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/White%20Flowerwall%20Backdrop%20Wedding%20Decor_.jpg"
    },
    {
      id: "balloons",
      title: "Balloon Decorations",
      icon: "◎",
      price: "$200",
      priceDetail: "Per balloon column",
      link: "pages/inquiry.html",
      description: "Custom balloon arches, garlands, columns, and organic installations.",
      image: "https://static.wixstatic.com/media/3974b0_0338f41e7e254a36840afb9d685a5d49~mv2.jpeg/v1/fill/w_292,h_300,al_c,q_80/IMG_9368_HEIC.jpeg"
    }
  ],
  packages: [
    {
      id: "pkg1", name: "Proposal Package", price: "$850",
      highlight: true, tag: "Most Popular",
      includes: ["Marquee Letters MARRY ME", "Balloon arrangement", "Rose petals"],
      note: "MARRY ME: $525 · LOVE: $300",
      image: "https://static.wixstatic.com/media/3974b0_dd27a05055744066b96e10e5b0d32e1c~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/B7BDF95B-DF28-4406-AADD-D91C62729F01_JPG.jpg"
    },
    {
      id: "pkg2", name: "Backdrop Package", price: "$725",
      highlight: false, tag: "",
      includes: ["Backdrop of your choice", "Neon sign", "Marquee letters (up to 4) or Numbers (up to 2)"],
      note: "",
      image: "https://static.wixstatic.com/media/3974b0_7ed3910748b84745bca724900a3dc689~mv2.jpg/v1/fill/w_291,h_295,al_c,q_80/IMG_8269_edited.jpg"
    },
    {
      id: "pkg3", name: "Party Package", price: "$975",
      highlight: false, tag: "",
      includes: ["Backdrop of your choice", "Neon sign", "Photo booth (up to 5 hours)", "Marquee letters or numbers (up to 2)"],
      note: "",
      image: "https://static.wixstatic.com/media/3974b0_9e6c604a867a43cba16a09be155a9fc5~mv2.jpg/v1/fill/w_292,h_300,al_c,q_80/Red%20Flowerwall%20Backdrop%20Party%20Decor_edited.jpg"
    },
    {
      id: "pkg4", name: "Package C — Full Event", price: "$2,000",
      highlight: true, tag: "Best Value",
      includes: ["Backdrop of choice", "Photo booth", "Neon sign", "Props", "Balloon columns (2)", "Marquee letters (up to 6)"],
      note: "Each additional letter: $75 · Stacking fee: $150",
      image: "https://static.wixstatic.com/media/3974b0_57bfff054d664e0590953c23e69ae430~mv2.jpg/v1/crop/x_104,y_241,w_1317,h_1446/fill/w_279,h_305,al_c,q_80/IMG_7675_JPG.jpg"
    }
  ],
  reviews: [
    {
      id: "r1", name: "G. Woodward", event: "Corporate Anniversary Event", stars: 5,
      text: "We used this company for our 10th Anniversary corporate event. The marquee lights were great quality and the perfect addition to our event aesthetic. The staff was courteous, professional, and very responsive."
    },
    {
      id: "r2", name: "Christina Sin", event: "Event Planner — Multi-Service Rental", stars: 5,
      text: "A great resource when you're looking for decor at a great price. I worked with them on a photo booth, greenery wall, neon sign, marquee letters, and balloon columns. They were responsive, on time, and fantastic to work with."
    },
    {
      id: "r3", name: "Mrs. Jenkins", event: "Wedding Photo Booth", stars: 5,
      text: "I had such a wonderful experience! From start to finish, the process was smooth and stress-free. The setup was easy, the staff was professional, and the customer service was outstanding."
    }
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

// Read data from file or use default
function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch(e) {}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

// Save data to file
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// ===== ROUTES =====

// GET all data
app.get('/api/data', (req, res) => {
  res.json(readData());
});

// POST update all data (from admin)
app.post('/api/data', (req, res) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== (process.env.ADMIN_SECRET || 'glowup2024')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  writeData(req.body);
  res.json({ success: true });
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'GlowUp API running', version: '1.0' });
});

app.listen(PORT, () => {
  console.log(`GlowUp API running on port ${PORT}`);
});
