// ============================================
// SITE DATA — Edit everything from admin panel
// ============================================

const SITE_DATA = {
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
      description: "Light-up marquee letters for weddings, proposals, birthdays, and corporate events. Delivery, setup, and breakdown included.",
      image: "https://static.wixstatic.com/media/3974b0_300e5c6c990e4d779f648eff2499ec39~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/IMG_1040_edited.jpg"
    },
    {
      id: "photobooth",
      title: "Photo Booth",
      icon: "◉",
      description: "Modern photo booth rentals with on-site setup and pickup. Perfect for weddings, parties, and corporate events.",
      image: "https://static.wixstatic.com/media/3974b0_cd0f17fa632440d9b56941759d917d62~mv2.jpg/v1/fill/w_292,h_300,al_c,q_80/IMG_0517_edited_edited_edited_edited_edi.jpg"
    },
    {
      id: "backdrops",
      title: "Backdrops & Flower Walls",
      icon: "❋",
      description: "Luxury floral backdrops and flower wall rentals designed for photo moments, stages, and sweetheart tables.",
      image: "https://static.wixstatic.com/media/3974b0_ab201f07a6f242809f18bc2657a9eae1~mv2.jpg/v1/fill/w_292,h_300,al_c,q_80/IMG_5322_edited_edited.jpg"
    },
    {
      id: "balloons",
      title: "Balloon Decorations",
      icon: "◎",
      description: "Custom balloon decor including arches, garlands, columns, and organic balloon installations across the DMV area.",
      image: "https://static.wixstatic.com/media/3974b0_0338f41e7e254a36840afb9d685a5d49~mv2.jpeg/v1/fill/w_292,h_300,al_c,q_80/IMG_9368_HEIC.jpeg"
    }
  ],

  individualPrices: [
    {
      id: "ip1",
      title: "3 Ft Marquee Letters",
      price: "$75",
      unit: "per letter",
      image: "https://static.wixstatic.com/media/3974b0_300e5c6c990e4d779f648eff2499ec39~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/IMG_1040_edited.jpg"
    },
    {
      id: "ip2",
      title: "4 Ft Marquee Numbers",
      price: "$100",
      unit: "per number",
      image: "https://static.wixstatic.com/media/3974b0_300e5c6c990e4d779f648eff2499ec39~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/IMG_1040_edited.jpg"
    },
    {
      id: "ip3",
      title: "Photo Booth",
      price: "$150",
      unit: "per hour",
      note: "$550 for 5 hours · Print on site: +$100/hr",
      image: "https://static.wixstatic.com/media/3974b0_cd0f17fa632440d9b56941759d917d62~mv2.jpg/v1/fill/w_292,h_300,al_c,q_80/IMG_0517_edited_edited_edited_edited_edi.jpg"
    },
    {
      id: "ip4",
      title: "Backdrop / Flower Wall",
      price: "$450",
      unit: "per event",
      image: "https://static.wixstatic.com/media/3974b0_ab201f07a6f242809f18bc2657a9eae1~mv2.jpg/v1/fill/w_292,h_300,al_c,q_80/IMG_5322_edited_edited.jpg"
    }
  ],

  packages: [
    {
      id: "pkg1",
      name: "Proposal Package",
      price: "$850",
      highlight: true,
      tag: "Most Popular",
      includes: ["Marquee Letters MARRY ME", "Balloon arrangement", "Rose petals"],
      note: "MARRY ME: $525 · LOVE: $300",
      image: "https://static.wixstatic.com/media/3974b0_dd27a05055744066b96e10e5b0d32e1c~mv2.jpg/v1/fill/w_291,h_300,al_c,q_80/B7BDF95B-DF28-4406-AADD-D91C62729F01_JPG.jpg"
    },
    {
      id: "pkg2",
      name: "Backdrop Package",
      price: "$725",
      highlight: false,
      tag: "",
      includes: ["Backdrop of your choice", "Neon sign", "Marquee letters (up to 4) or Numbers (up to 2)"],
      note: "",
      image: "https://static.wixstatic.com/media/3974b0_7ed3910748b84745bca724900a3dc689~mv2.jpg/v1/fill/w_291,h_295,al_c,q_80/IMG_8269_edited.jpg"
    },
    {
      id: "pkg3",
      name: "Party Package",
      price: "$975",
      highlight: false,
      tag: "",
      includes: ["Backdrop of your choice", "Neon sign", "Photo booth (up to 5 hours)", "Marquee letters or numbers (up to 2)"],
      note: "",
      image: "https://static.wixstatic.com/media/3974b0_9e6c604a867a43cba16a09be155a9fc5~mv2.jpg/v1/fill/w_292,h_300,al_c,q_80/Red%20Flowerwall%20Backdrop%20Party%20Decor_edited.jpg"
    },
    {
      id: "pkg4",
      name: "Package A",
      price: "$850",
      highlight: false,
      tag: "",
      includes: ["Backdrop", "Neon sign", "Photo booth (up to 8 hours)"],
      note: "",
      image: "https://static.wixstatic.com/media/3974b0_16a8513f877b462ea85f9d5e6ae76d93~mv2.jpg/v1/fill/w_292,h_300,al_c,q_80/59BD76F5-A886-42EC-A94B-848201CD7C5A_JPG.jpg"
    },
    {
      id: "pkg5",
      name: "Package B",
      price: "$850",
      highlight: false,
      tag: "",
      includes: ["Marquee letters (up to 6)", "2 Balloon columns"],
      note: "Stacking fee: $150",
      image: "https://static.wixstatic.com/media/3974b0_0338f41e7e254a36840afb9d685a5d49~mv2.jpeg/v1/fill/w_292,h_300,al_c,q_80/IMG_9368_HEIC.jpeg"
    },
    {
      id: "pkg6",
      name: "Package C — Full Event",
      price: "$2,000",
      highlight: true,
      tag: "Best Value",
      includes: ["Backdrop of choice", "Photo booth", "Neon sign", "Props", "Balloon columns (2)", "Marquee letters (up to 6)"],
      note: "Each additional letter: $75 · Stacking fee: $150",
      image: "https://static.wixstatic.com/media/3974b0_57bfff054d664e0590953c23e69ae430~mv2.jpg/v1/crop/x_104,y_241,w_1317,h_1446/fill/w_279,h_305,al_c,q_80/IMG_7675_JPG.jpg"
    }
  ],

  reviews: [
    {
      id: "r1",
      name: "G. Woodward",
      event: "Corporate Anniversary Event",
      stars: 5,
      text: "We used this company for our 10th Anniversary corporate event. The marquee lights were great quality and the perfect addition to our event aesthetic. The staff was courteous, professional, and very responsive. We would definitely use them again."
    },
    {
      id: "r2",
      name: "Christina Sin",
      event: "Event Planner — Multi-Service Rental",
      stars: 5,
      text: "A great resource when you're looking for decor at a great price. I worked with them on a photo booth, greenery wall, neon sign, marquee letters, and balloon columns. They were responsive, on time, and fantastic to work with. Their marquee letters are much brighter than others and truly lit up the night at our outdoor event. A planner's dream!"
    },
    {
      id: "r3",
      name: "Mrs. Jenkins",
      event: "Wedding Photo Booth",
      stars: 5,
      text: "I had such a wonderful experience! From start to finish, the process was smooth and stress-free. The setup was easy, the staff was professional, and the customer service was outstanding. They were able to take on my wedding with less than a month's notice, and everything turned out perfect. Our guests absolutely loved the photo booth!"
    }
  ],

  faq: [
    {
      id: "f1",
      question: "Do you include delivery, setup, and breakdown?",
      answer: "Yes. All rentals include delivery, professional setup, and post-event breakdown, so you don't have to worry about logistics."
    },
    {
      id: "f2",
      question: "What areas do you serve?",
      answer: "We serve Washington DC, Northern Virginia, Maryland, Philadelphia, and New York City. We also deliver within 100 miles of these major service areas."
    },
    {
      id: "f3",
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 1–2 weeks in advance. For weekends and peak seasons, earlier booking is strongly encouraged."
    },
    {
      id: "f4",
      question: "Are you insured for events?",
      answer: "Yes. We are fully insured for private events, weddings, and corporate events."
    },
    {
      id: "f5",
      question: "Can I customize packages or combine services?",
      answer: "Absolutely. Our packages are flexible, and you can customize or combine marquee letters, photo booths, backdrops, flower walls, and balloon décor to fit your event."
    },
    {
      id: "f6",
      question: "Do you accept last-minute bookings?",
      answer: "Yes. We may be able to accommodate last-minute orders depending on availability. Rush bookings may include an additional fee."
    }
  ]
};
