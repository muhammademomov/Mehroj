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

    await db.execute(`
      CREATE TABLE IF NOT EXISTS inventory (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(100),
        total_qty INT DEFAULT 1,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        inquiry_id VARCHAR(50),
        item_id VARCHAR(50),
        item_name VARCHAR(200),
        qty_needed INT DEFAULT 1,
        event_date DATE,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default site data if empty
    const [rows] = await db.execute('SELECT id FROM site_data WHERE id = 1');
    if(rows.length === 0) {
      await db.execute('INSERT INTO site_data (id, data) VALUES (1, ?)', [JSON.stringify(DEFAULT_DATA)]);
      console.log('Default data inserted');
    }

    await db.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(50) PRIMARY KEY,
        inquiry_id VARCHAR(50),
        client_name VARCHAR(200),
        client_email VARCHAR(200),
        client_phone VARCHAR(50),
        event_type VARCHAR(100),
        event_date DATE,
        event_address VARCHAR(300),
        event_time VARCHAR(200),
        location_type VARCHAR(50),
        status VARCHAR(50) DEFAULT 'new',
        notes TEXT,
        source VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    // Add inquiry_id column if not exists (for existing tables)
    try { await db.execute('ALTER TABLE projects ADD COLUMN inquiry_id VARCHAR(50)'); } catch(e) {}
    // Add project_id column to bookings if not exists (for existing tables)
    try { await db.execute('ALTER TABLE bookings ADD COLUMN project_id VARCHAR(50)'); } catch(e) {}
    // Staff member assigned to carry out the project
    try { await db.execute('ALTER TABLE projects ADD COLUMN assigned_staff_id VARCHAR(50)'); } catch(e) {}

    await db.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        phone VARCHAR(50),
        login VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(200) NOT NULL,
        token VARCHAR(100),
        active TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS staff_responses (
        id VARCHAR(50) PRIMARY KEY,
        project_id VARCHAR(50) NOT NULL,
        staff_id VARCHAR(50) NOT NULL,
        response VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_resp (project_id, staff_id)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS quotes (
        id VARCHAR(50) PRIMARY KEY,
        project_id VARCHAR(50) NOT NULL,
        title VARCHAR(200),
        status VARCHAR(50) DEFAULT 'draft',
        subtotal DECIMAL(10,2) DEFAULT 0,
        discount DECIMAL(10,2) DEFAULT 0,
        tax DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) DEFAULT 0,
        deposit DECIMAL(10,2) DEFAULT 0,
        notes TEXT,
        terms TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS quote_items (
        id VARCHAR(50) PRIMARY KEY,
        quote_id VARCHAR(50) NOT NULL,
        inventory_id VARCHAR(50),
        name VARCHAR(200) NOT NULL,
        description TEXT,
        qty INT DEFAULT 1,
        price DECIMAL(10,2) DEFAULT 0,
        total DECIMAL(10,2) DEFAULT 0
      )
    `);

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

// ===== INVENTORY =====

// GET all inventory items
app.get('/api/inventory', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [items] = await db.execute('SELECT * FROM inventory ORDER BY category, name');
    // For each item get current bookings
    const result = [];
    for(const item of items) {
      const [bookings] = await db.execute(
        "SELECT SUM(qty_needed) as used FROM bookings WHERE item_id = ? AND status != 'cancelled' AND event_date >= CURDATE()",
        [item.id]
      );
      item.in_use = parseInt(bookings[0].used) || 0;
      item.available = item.total_qty - item.in_use;
      result.push(item);
    }
    res.json(result);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST add inventory item
app.post('/api/inventory', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const id = 'inv_' + Date.now();
    const { name, category, total_qty, notes } = req.body;
    await db.execute(
      'INSERT INTO inventory (id, name, category, total_qty, notes) VALUES (?, ?, ?, ?, ?)',
      [id, name, category || '', total_qty || 1, notes || '']
    );
    res.json({ success: true, id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PATCH update inventory item
app.patch('/api/inventory/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { name, category, total_qty, notes } = req.body;
    await db.execute(
      'UPDATE inventory SET name=?, category=?, total_qty=?, notes=? WHERE id=?',
      [name, category, total_qty, notes, req.params.id]
    );
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE inventory item
app.delete('/api/inventory/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await db.execute('DELETE FROM inventory WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== BOOKINGS =====

// GET bookings for a date (check availability)
app.get('/api/availability', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { date } = req.query;
    const [bookings] = await db.execute(
      "SELECT b.*, i.name, i.total_qty FROM bookings b JOIN inventory i ON b.item_id = i.id WHERE b.event_date = ? AND b.status != 'cancelled'",
      [date]
    );
    res.json(bookings);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// POST add booking items to inquiry
app.post('/api/booking', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { inquiry_id, project_id, items, event_date } = req.body;
    // items = [{item_id, item_name, qty_needed}]
    const warnings = [];
    for(const item of items) {
      // Check availability
      const [inv] = await db.execute('SELECT total_qty FROM inventory WHERE id=?', [item.item_id]);
      const [used] = await db.execute(
        "SELECT SUM(qty_needed) as used FROM bookings WHERE item_id=? AND event_date=? AND status!='cancelled'",
        [item.item_id, event_date]
      );
      const total = inv[0]?.total_qty || 0;
      const inUse = parseInt(used[0]?.used) || 0;
      const available = total - inUse;
      if(item.qty_needed > available) {
        warnings.push({
          item: item.item_name,
          needed: item.qty_needed,
          available,
          in_use: inUse,
          total
        });
      }
      // Add booking regardless (admin can handle)
      const id = 'bk_' + Date.now() + '_' + Math.random().toString(36).substr(2,5);
      await db.execute(
        'INSERT INTO bookings (id, inquiry_id, project_id, item_id, item_name, qty_needed, event_date) VALUES (?,?,?,?,?,?,?)',
        [id, inquiry_id||null, project_id||null, item.item_id, item.item_name, item.qty_needed, event_date]
      );
    }
    res.json({ success: true, warnings });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET all bookings
app.get('/api/bookings', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [bookings] = await db.execute(
      'SELECT * FROM bookings ORDER BY event_date DESC'
    );
    res.json(bookings);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PATCH update booking status
app.patch('/api/booking/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await db.execute('UPDATE bookings SET status=? WHERE id=?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET bookings by inquiry_id
app.get('/api/bookings/inquiry/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [rows] = await db.execute(
      'SELECT b.*, i.total_qty, i.name as inv_name FROM bookings b LEFT JOIN inventory i ON b.item_id = i.id WHERE b.inquiry_id = ? ORDER BY b.created_at',
      [req.params.id]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// GET bookings by project_id (also picks up items still tagged with the project's original inquiry_id,
// so projects created before the project_id column existed show their items too)
app.get('/api/bookings/project/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [rows] = await db.execute(
      `SELECT b.*, i.total_qty, i.name as inv_name FROM bookings b
       LEFT JOIN inventory i ON b.item_id = i.id
       WHERE b.project_id = ?
          OR b.inquiry_id = (SELECT inquiry_id FROM projects WHERE id = ?)
       ORDER BY b.created_at`,
      [req.params.id, req.params.id]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// PATCH booking status
app.patch('/api/booking/:id/status', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await db.execute('UPDATE bookings SET status=? WHERE id=?', [req.body.status, req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// DELETE booking
app.delete('/api/booking/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await db.execute('DELETE FROM bookings WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== PROJECTS =====

app.get('/api/projects', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [rows] = await db.execute('SELECT p.*, s.name as assigned_staff_name FROM projects p LEFT JOIN staff s ON p.assigned_staff_id = s.id ORDER BY p.created_at DESC');
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/projects/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [rows] = await db.execute('SELECT * FROM projects WHERE id=?', [req.params.id]);
    if(!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/projects', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const id = 'prj_' + Date.now();
    const { client_name, client_email, client_phone, event_type, event_date, event_address, event_time, location_type, notes, source, inquiry_id } = req.body;
    await db.execute(
      'INSERT INTO projects (id,inquiry_id,client_name,client_email,client_phone,event_type,event_date,event_address,event_time,location_type,notes,source) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [id, inquiry_id||null, client_name||'', client_email||'', client_phone||'', event_type||'', event_date||null, event_address||'', event_time||'', location_type||'', notes||'', source||'']
    );
    // Carry over any rented items already added while this was still an inquiry
    if(inquiry_id){
      await db.execute('UPDATE bookings SET project_id=? WHERE inquiry_id=? AND project_id IS NULL', [id, inquiry_id]);
    }
    res.json({ success: true, id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== STAFF (admin CRUD) =====
const crypto = require('crypto');

app.get('/api/staff', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [rows] = await db.execute('SELECT id, name, phone, login, active, created_at FROM staff ORDER BY name');
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/staff', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { name, phone, login, password } = req.body;
    if(!name || !login || !password) return res.status(400).json({ error: 'name, login and password are required' });
    const id = 'st_' + Date.now();
    await db.execute('INSERT INTO staff (id, name, phone, login, password) VALUES (?,?,?,?,?)',
      [id, name, phone||'', login, password]);
    res.json({ success: true, id });
  } catch(e) {
    if(e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'This login is already taken' });
    res.status(500).json({ error: e.message });
  }
});

app.patch('/api/staff/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const fields = ['name','phone','login','password','active'];
    const updates = fields.filter(f => req.body[f] !== undefined);
    if(!updates.length) return res.json({ success: true });
    const sql = 'UPDATE staff SET ' + updates.map(f => f+'=?').join(',') + ' WHERE id=?';
    await db.execute(sql, [...updates.map(f => req.body[f]), req.params.id]);
    res.json({ success: true });
  } catch(e) {
    if(e.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'This login is already taken' });
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await db.execute('DELETE FROM staff WHERE id=?', [req.params.id]);
    await db.execute('UPDATE projects SET assigned_staff_id=NULL WHERE assigned_staff_id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Responses of all staff for one project (admin view)
app.get('/api/projects/:id/responses', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [rows] = await db.execute(
      `SELECT r.*, s.name as staff_name, s.phone as staff_phone
       FROM staff_responses r JOIN staff s ON r.staff_id = s.id
       WHERE r.project_id = ? ORDER BY r.created_at`,
      [req.params.id]
    );
    res.json(rows);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== STAFF PORTAL (staff auth via token) =====
async function staffFromToken(req){
  const token = req.headers['x-staff-token'];
  if(!token) return null;
  const [rows] = await db.execute('SELECT id, name, phone, login, active FROM staff WHERE token=? AND active=1', [token]);
  return rows[0] || null;
}

app.post('/api/staff/login', async (req, res) => {
  try {
    const { login, password } = req.body;
    const [rows] = await db.execute('SELECT * FROM staff WHERE login=? AND password=? AND active=1', [login||'', password||'']);
    if(!rows.length) return res.status(401).json({ error: 'Wrong login or password' });
    const token = crypto.randomBytes(24).toString('hex');
    await db.execute('UPDATE staff SET token=? WHERE id=?', [token, rows[0].id]);
    res.json({ success: true, token, staff: { id: rows[0].id, name: rows[0].name } });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Orders visible to staff: deposit-paid upcoming events, with my response and assignment info
app.get('/api/staff/orders', async (req, res) => {
  try {
    const me = await staffFromToken(req);
    if(!me) return res.status(401).json({ error: 'Unauthorized' });
    const [rows] = await db.execute(
      `SELECT p.id, p.client_name, p.event_type, p.event_date, p.event_time, p.event_address, p.location_type, p.notes,
              p.assigned_staff_id, s.name as assigned_staff_name,
              (SELECT response FROM staff_responses WHERE project_id=p.id AND staff_id=?) as my_response
       FROM projects p
       LEFT JOIN staff s ON p.assigned_staff_id = s.id
       WHERE p.status = 'deposit_paid' AND (p.event_date IS NULL OR p.event_date >= CURDATE() - INTERVAL 1 DAY)
       ORDER BY p.event_date ASC`,
      [me.id]
    );
    res.json({ staff: me, orders: rows });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Staff responds to an order: accept | decline | busy
app.post('/api/staff/orders/:id/respond', async (req, res) => {
  try {
    const me = await staffFromToken(req);
    if(!me) return res.status(401).json({ error: 'Unauthorized' });
    const { response } = req.body;
    if(!['accept','decline','busy'].includes(response)) return res.status(400).json({ error: 'Invalid response' });
    const rid = 'sr_' + Date.now() + '_' + Math.random().toString(36).substr(2,4);
    await db.execute(
      `INSERT INTO staff_responses (id, project_id, staff_id, response) VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE response=VALUES(response), created_at=CURRENT_TIMESTAMP`,
      [rid, req.params.id, me.id, response]
    );
    let assigned = false;
    if(response === 'accept'){
      // First to accept gets the job — only if nobody is assigned yet
      const [result] = await db.execute(
        'UPDATE projects SET assigned_staff_id=? WHERE id=? AND assigned_staff_id IS NULL',
        [me.id, req.params.id]
      );
      assigned = result.affectedRows > 0;
    } else {
      // If I previously held this job and now can't do it, free it up
      await db.execute('UPDATE projects SET assigned_staff_id=NULL WHERE id=? AND assigned_staff_id=?', [req.params.id, me.id]);
    }
    res.json({ success: true, assigned });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/projects/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const fields = ['client_name','client_email','client_phone','event_type','event_date','event_address','event_time','location_type','status','notes','source','assigned_staff_id'];
    const updates = fields.filter(f => req.body[f] !== undefined);
    if(!updates.length) return res.json({ success: true });
    const sql = 'UPDATE projects SET ' + updates.map(f => f+'=?').join(',') + ' WHERE id=?';
    await db.execute(sql, [...updates.map(f => req.body[f] || null), req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/projects/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await db.execute('DELETE FROM quote_items WHERE quote_id IN (SELECT id FROM quotes WHERE project_id=?)', [req.params.id]);
    await db.execute('DELETE FROM quotes WHERE project_id=?', [req.params.id]);
    await db.execute('DELETE FROM projects WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ===== QUOTES =====

app.get('/api/quotes/project/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const [quotes] = await db.execute('SELECT * FROM quotes WHERE project_id=? ORDER BY created_at DESC', [req.params.id]);
    for(const q of quotes){
      const [items] = await db.execute('SELECT * FROM quote_items WHERE quote_id=?', [q.id]);
      q.items = items;
    }
    res.json(quotes);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Public quote view (no auth needed)
app.get('/api/quote/:id/public', async (req, res) => {
  try {
    const [quotes] = await db.execute('SELECT * FROM quotes WHERE id=?', [req.params.id]);
    if(!quotes.length) return res.status(404).json({ error: 'Not found' });
    const q = quotes[0];
    const [items] = await db.execute('SELECT * FROM quote_items WHERE quote_id=?', [q.id]);
    q.items = items;
    const [projects] = await db.execute('SELECT client_name, event_type, event_date, event_address FROM projects WHERE id=?', [q.project_id]);
    q.project = projects[0] || {};
    res.json(q);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/quotes', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const id = 'qte_' + Date.now();
    const { project_id, title, items, discount, tax, deposit, notes, terms } = req.body;
    // Calculate totals
    const subtotal = (items||[]).reduce((sum, i) => sum + (parseFloat(i.price)*parseInt(i.qty)), 0);
    const discountAmt = parseFloat(discount)||0;
    const taxAmt = parseFloat(tax)||0;
    const total = subtotal - discountAmt + taxAmt;
    await db.execute(
      'INSERT INTO quotes (id,project_id,title,subtotal,discount,tax,total,deposit,notes,terms) VALUES (?,?,?,?,?,?,?,?,?,?)',
      [id, project_id, title||'Quote', subtotal, discountAmt, taxAmt, total, parseFloat(deposit)||0, notes||'', terms||'']
    );
    // Add items
    for(const item of (items||[])){
      const iid = 'qi_' + Date.now() + '_' + Math.random().toString(36).substr(2,4);
      const itotal = parseFloat(item.price) * parseInt(item.qty);
      await db.execute(
        'INSERT INTO quote_items (id,quote_id,inventory_id,name,description,qty,price,total) VALUES (?,?,?,?,?,?,?,?)',
        [iid, id, item.inventory_id||null, item.name, item.description||'', parseInt(item.qty)||1, parseFloat(item.price)||0, itotal]
      );
    }
    res.json({ success: true, id });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch('/api/quotes/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { status, items, discount, tax, deposit, notes, terms, title } = req.body;
    if(items !== undefined){
      await db.execute('DELETE FROM quote_items WHERE quote_id=?', [req.params.id]);
      const subtotal = items.reduce((sum, i) => sum + (parseFloat(i.price)*parseInt(i.qty)), 0);
      const discountAmt = parseFloat(discount)||0;
      const taxAmt = parseFloat(tax)||0;
      const total = subtotal - discountAmt + taxAmt;
      await db.execute('UPDATE quotes SET subtotal=?,discount=?,tax=?,total=?,deposit=?,notes=?,terms=?,title=? WHERE id=?',
        [subtotal, discountAmt, taxAmt, total, parseFloat(deposit)||0, notes||'', terms||'', title||'Quote', req.params.id]);
      for(const item of items){
        const iid = 'qi_' + Date.now() + '_' + Math.random().toString(36).substr(2,4);
        const itotal = parseFloat(item.price) * parseInt(item.qty);
        await db.execute('INSERT INTO quote_items (id,quote_id,inventory_id,name,description,qty,price,total) VALUES (?,?,?,?,?,?,?,?)',
          [iid, req.params.id, item.inventory_id||null, item.name, item.description||'', parseInt(item.qty)||1, parseFloat(item.price)||0, itotal]);
      }
    }
    if(status) await db.execute('UPDATE quotes SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/quotes/:id', async (req, res) => {
  if(req.headers['x-admin-secret'] !== ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await db.execute('DELETE FROM quote_items WHERE quote_id=?', [req.params.id]);
    await db.execute('DELETE FROM quotes WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'GlowUp API running ✓' });
});

// Start
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server on port ${PORT}`));
});
