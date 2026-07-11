const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'glowup2024';

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MySQL connection
let db;
async function connectDB() {
  try {
    db = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: process.env.MYSQLPORT || 3306
    });
    console.log('MySQL connected!');

    // Create tables
    await db.execute(`
      CREATE TABLE IF NOT EXISTS site_data (
        id INT PRIMARY KEY DEFAULT 1,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(50) PRIMARY KEY,
        data LONGTEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default site data if empty
    const [rows] = await db.execute('SELECT id FROM site_data WHERE id = 1');
    if(rows.length === 0) {
      await db.execute('INSERT INTO site_data (id, data) VALUES (1, ?)', [JSON.stringify(DEFAULT_DATA)]);
      console.log('Default data inserted');
    }

    console.log('Tables ready!');
  } catch(e) {
    console.error('DB Error:', e.message);
  }
}

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
      description: "Light-up marquee letters for weddings, proposals, birthdays, and corporate events.",
      image: "https://static.wixstatic.com/media/3974b0_300e5c6c990e4d779f648eff2499ec39~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/IMG_1040_edited.jpg",
      gallery: [
        "https://static.wixstatic.com/media/3974b0_dd27a05055744066b96e10e5b0d32e1c~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/B7BDF95B-DF28-4406-AADD-D91C62729F01_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_aff6fe501cfe4ca1a5552ca2e347c26c~mv2.jpg/v1/fill/w_600,h_730,al_c,q_80/IMG_7675_edited.jpg",
        "https://static.wixstatic.com/media/3974b0_57bfff054d664e0590953c23e69ae430~mv2.jpg/v1/fill/w_600,h_660,al_c,q_80/IMG_7675_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_e6e6433d6de94a45af45c71395900c33~mv2.jpg/v1/fill/w_600,h_450,al_c,q_80/0EB1DE65-95EA-490E-9995-F6AF483F0C52_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_16a8513f877b462ea85f9d5e6ae76d93~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/59BD76F5-A886-42EC-A94B-848201CD7C5A_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_7ed3910748b84745bca724900a3dc689~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80/IMG_8269_edited.jpg"
      ]
    },
    {
      id: "photobooth", title: "Photo Booth", icon: "◉",
      price: "$150/hr", priceDetail: "$550 for 5 Hours · Print on site: +$100/hr",
      link: "pages/photo-booth.html",
      description: "Modern photo booth rentals with on-site setup and pickup.",
      image: "https://static.wixstatic.com/media/3974b0_16a8513f877b462ea85f9d5e6ae76d93~mv2.jpg/v1/fill/w_410,h_410,al_c,q_80/59BD76F5-A886-42EC-A94B-848201CD7C5A_JPG.jpg",
      gallery: [
        "https://static.wixstatic.com/media/3974b0_346bf7b9ac5d49ccb65ebfa5ddd446d9~mv2.jpg/v1/fill/w_600,h_520,al_c,q_80/59BD76F5-A886-42EC-A94B-848201CD7C5A_edited.jpg",
        "https://static.wixstatic.com/media/3974b0_bab8b9b67e5348eb80aa5dc3b462bdd8~mv2.png/v1/fit/w_600,h_780,q_90/3974b0_bab8b9b67e5348eb80aa5dc3b462bdd8~mv2.png",
        "https://static.wixstatic.com/media/3974b0_ed5f6d4716b0497c93b2dab72c07ae9a~mv2.jpg/v1/fit/w_600,h_900,q_90/3974b0_ed5f6d4716b0497c93b2dab72c07ae9a~mv2.jpg"
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
        "https://static.wixstatic.com/media/3974b0_b9b37c08eb4a4d7aa1dda2955126c8eb~mv2.jpg/v1/fill/w_600,h_620,al_c,q_80/Greenery%20Backdrop_JPG.jpg",
        "https://static.wixstatic.com/media/3974b0_8636f33e097e4017af2a3866992d3fca~mv2.jpg/v1/fill/w_600,h_410,al_c,q_80/IMG-2314.jpg"
      ]
    },
    {
      id: "balloons", title: "Balloon Decorations", icon: "◎",
      price: "$200", priceDetail: "Per balloon column",
      link: "pages/inquiry.html",
      description: "Custom balloon arches, garlands, columns, and organic installations.",
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
      includes: ["Backdrop of your choice", "Neon sign", "Marquee letters (up to 4)"],
      note: "",
      image: "https://static.wixstatic.com/media/3974b0_7ed3910748b84745bca724900a3dc689~mv2.jpg/v1/fill/w_291,h_295,al_c,q_80/IMG_8269_edited.jpg",
      gallery: []
    },
    {
      id: "pkg3", name: "Party Package", price: "$975",
      highlight: false, tag: "",
      includes: ["Backdrop of your choice", "Neon sign", "Photo booth (up to 5 hours)", "Marquee letters (up to 2)"],
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
    { id: "r1", name: "G. Woodward", event: "Corporate Anniversary Event", stars: 5, text: "We used this company for our 10th Anniversary corporate event. The marquee lights were great quality. The staff was courteous, professional, and very responsive." },
    { id: "r2", name: "Christina Sin", event: "Event Planner", stars: 5, text: "A great resource when you're looking for decor at a great price. They were responsive, on time, and fantastic to work with." },
    { id: "r3", name: "Mrs. Jenkins", event: "Wedding Photo Booth", stars: 5, text: "I had such a wonderful experience! From start to finish, the process was smooth and stress-free. The customer service was outstanding." }
  ],
  faq: [
    { id: "f1", question: "Do you include delivery, setup, and breakdown?", answer: "Yes. All rentals include delivery, professional setup, and post-event breakdown." },
    { id: "f2", question: "What areas do you serve?", answer: "We serve Washington DC, Northern Virginia, Maryland, Philadelphia, and New York City." },
    { id: "f3", question: "How far in advance should I book?", answer: "We recommend booking at least 1–2 weeks in advance." },
    { id: "f4", question: "Are you insured for events?", answer: "Yes. We are fully insured for private events, weddings, and corporate events." },
    { id: "f5", question: "Can I customize packages?", answer: "Absolutely. Our packages are flexible and you can combine services to fit your event." },
    { id: "f6", question: "Do you accept last-minute bookings?", answer: "Yes, depending on availability. Rush bookings may include an additional fee." }
  ]
};

// ===== ROUTES =====

// GET site data
app.get('/api/data', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT data FROM site_data WHERE id = 1');
    if(rows.length) res.json(JSON.parse(rows[0].data));
    else res.json(DEFAULT_DATA);
  } catch(e) {
    res.json(DEFAULT_DATA);
  }
});

// POST update site data
app.post('/api/data', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await db.execute('INSERT INTO site_data (id, data) VALUES (1, ?) ON DUPLICATE KEY UPDATE data = ?, updated_at = NOW()',
      [JSON.stringify(req.body), JSON.stringify(req.body)]);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// POST new inquiry
app.post('/api/inquiry', async (req, res) => {
  try {
    const id = 'inq_' + Date.now();
    const data = { ...req.body, createdAt: new Date().toISOString() };
    await db.execute('INSERT INTO inquiries (id, data, status, comment) VALUES (?, ?, ?, ?)',
      [id, JSON.stringify(data), 'new', '']);
    res.json({ success: true, id });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// GET all inquiries
app.get('/api/inquiries', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [rows] = await db.execute('SELECT * FROM inquiries ORDER BY created_at DESC');
    const inquiries = rows.map(r => ({
      ...JSON.parse(r.data),
      id: r.id,
      status: r.status,
      comment: r.comment,
      createdAt: r.created_at
    }));
    res.json(inquiries);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH update inquiry
app.patch('/api/inquiry/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    if(req.body.status) await db.execute('UPDATE inquiries SET status = ? WHERE id = ?', [req.body.status, req.params.id]);
    if(req.body.comment !== undefined) await db.execute('UPDATE inquiries SET comment = ? WHERE id = ?', [req.body.comment, req.params.id]);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'GlowUp API running ✓' });
});

// Start
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
});
