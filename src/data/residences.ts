export interface RoomType {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  tagline: string;
  price: number;
  bedType: string;
  features: string[];
  specs: string[];
}

export interface Residence {
  id: string;
  name: string;
  locality: string;
  headline: string;
  locationDetails: string;
  landmark: string;
  description: string;
  tag: string;
  startingPrice: number;
  deposit: string;
  images: {
    hero: string;
    room: string;
    lounge: string;
    dining: string;
  };
  galleryCount: number;
  roomTypes: RoomType[];
  menu: {
    specialDay: string;
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  amenities: {
    icon: string;
    title: string;
    description: string;
  }[];
  reviews: {
    name: string;
    role: string;
    rating: number;
    text: string;
    initials: string;
    bgColor: string;
  }[];
}

export const RESIDENCES: Record<string, Residence> = {
  "jp-nagar": {
    id: "jp-nagar",
    name: "Charla Living — JP Nagar",
    locality: "JP Nagar",
    headline: "Premium Living in the Heart of JP Nagar",
    locationDetails: "5th Phase · 6 min to JP Nagar Metro, near Central Mall",
    landmark: "Behind Vega City Mall & 15 mins to Bannerghatta Tech Corridor",
    description: "Modern, family-run residences designed for students and professionals. Move in with just one bag and enjoy a hassle-free living experience.",
    tag: "Professionals' pick",
    startingPrice: 10500,
    deposit: "1 Month",
    images: {
      hero: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80",
      room: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      lounge: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
      dining: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80"
    },
    galleryCount: 16,
    roomTypes: [
      {
        id: "single",
        name: "Private Single",
        badge: "ONLY 2 LEFT",
        badgeColor: "bg-red-50 text-red-600 border border-red-200",
        tagline: "Maximum privacy, dedicated work space and focused comfort.",
        price: 15500,
        bedType: "Queen Sized Bed",
        features: ["Attached Private Bathroom", "Dedicated Ergonomic Work Desk & Chair", "Private Balcony with Sitout", "Individual 1.5-ton AC"],
        specs: ["Private Room", "Attached Bath", "Balcony"]
      },
      {
        id: "double",
        name: "Double Sharing",
        badge: "MOST POPULAR",
        badgeColor: "bg-[#1b5299] text-white",
        tagline: "The perfect balance of social connection and personal comfort.",
        price: 10500,
        bedType: "Twin Comfort Beds",
        features: ["Spacious Dual Wardrobes with Digital Lockers", "Individual Study Desks", "Personal High-Speed Wi-Fi AP", "Attached Washroom with Geyser"],
        specs: ["2 Sharing", "Individual Desks", "Attached Bath"]
      },
      {
        id: "triple",
        name: "Triple Sharing",
        badge: "AVAILABLE",
        badgeColor: "bg-green-50 text-green-700 border border-green-200",
        tagline: "Economical boys PG living without compromising on food, Wi-Fi or space.",
        price: 8000,
        bedType: "Triple Single Beds",
        features: ["Individual Full-Height Wardrobes", "Shared Attached Washroom", "High-Speed Wi-Fi & Power Backup", "Access to Rooftop & Lounge"],
        specs: ["3 Sharing", "Storage Lockers", "Full Inclusions"]
      }
    ],
    menu: {
      specialDay: "Wednesday Special",
      breakfast: "Hot Poha with sev garnish, Fresh Banana, Filter Coffee / Masala Chai",
      lunch: "Steamed Rice, South Indian Dal Tadka, Aloo Gobhi, Curd & Papad",
      dinner: "Warm Phulka Rotis, Shahi Paneer Masala, Jeera Rice, Fresh Salad & Kheer"
    },
    amenities: [
      {
        icon: "wifi",
        title: "300 Mbps Dedicated Wi-Fi",
        description: "Dual-ISP enterprise connections with automatic failover in every room for zero-lag work & calls."
      },
      {
        icon: "sparkles",
        title: "Daily Housekeeping",
        description: "Professional cleaning of rooms, washrooms, and common corridors every single morning."
      },
      {
        icon: "shield",
        title: "Biometric & 24/7 CCTV",
        description: "Biometric fingerprint entrance, 32 CCTV cameras, and an on-site property manager 24/7."
      },
      {
        icon: "shirt",
        title: "Laundry & Ironing Area",
        description: "Fully automatic front-load washing machines with dedicated drying zones and iron boards."
      }
    ],
    reviews: [
      {
        name: "Rahul Sharma",
        role: "Software Engineer · 2 Years Resident",
        rating: 5,
        text: "I moved from Mumbai with zero knowledge of South Bangalore. Charla Living made the transition effortless. The food is authentically home-cooked, and Wi-Fi has never dropped during my work-from-home shifts.",
        initials: "RS",
        bgColor: "bg-blue-100 text-[#1b5299]"
      },
      {
        name: "Ananya Mukherjee",
        role: "Product Designer · 1 Year Resident",
        rating: 5,
        text: "The 1-month refundable deposit is such a relief compared to typical Bangalore landlords who demand 6 months. Cleanliness is immaculate every day.",
        initials: "AM",
        bgColor: "bg-orange-100 text-orange-700"
      },
      {
        name: "Karthik Venkatesh",
        role: "Data Analyst · 1.5 Years Resident",
        rating: 5,
        text: "Zero brokerage, transparent bills, and friendly family-run management. Best PG experience I've had in JP Nagar.",
        initials: "KV",
        bgColor: "bg-emerald-100 text-emerald-800"
      }
    ]
  },
  "jayanagar": {
    id: "jayanagar",
    name: "Charla Living — Jayanagar",
    locality: "Jayanagar",
    headline: "Flagship Luxury Living in 4th Block Jayanagar",
    locationDetails: "4th Block · 5 min walk to Jayanagar Metro & Shopping Complex",
    landmark: "Opposite Madhavan Park, near cool cafes & metro green line",
    description: "Our flagship property in Bengaluru's greenest, most connected heritage neighborhood. Quiet tree-lined avenue with hotel-grade comfort.",
    tag: "Flagship",
    startingPrice: 11000,
    deposit: "1 Month",
    images: {
      hero: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      room: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80",
      lounge: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=80",
      dining: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80"
    },
    galleryCount: 20,
    roomTypes: [
      {
        id: "single",
        name: "Private Single Suite",
        badge: "ONLY 1 LEFT",
        badgeColor: "bg-red-50 text-red-600 border border-red-200",
        tagline: "Large sunny single suite with balcony overlooking Madhavan park.",
        price: 16500,
        bedType: "King Single Bed",
        features: ["Attached Luxury Washroom", "Hardwood Work Station", "Private Balcony with Garden View", "Dedicated AC & Inverter"],
        specs: ["Single Occupancy", "Attached Bath", "Park View"]
      },
      {
        id: "double",
        name: "Premium Double Sharing",
        badge: "MOST POPULAR",
        badgeColor: "bg-[#1b5299] text-white",
        tagline: "Spacious twin suite with generous storage and natural lighting.",
        price: 11000,
        bedType: "Twin Ortho Beds",
        features: ["Spacious Teak Finish Closets", "Two Ergonomic Workdesks", "300 Mbps Wi-Fi AP in-room", "Attached Modern Washroom"],
        specs: ["2 Sharing", "Work Desks", "Spacious"]
      }
    ],
    menu: {
      specialDay: "Thursday Feast",
      breakfast: "Steaming Idli, Vada, Coconut Chutney & Sambar, Fresh Filter Coffee",
      lunch: "Ghee Sona Masoori Rice, Rasam, Palak Dal, Beans Poriyal, Curd",
      dinner: "Butter Naan, Kadai Paneer, Veg Pulao, Gulab Jamun"
    },
    amenities: [
      {
        icon: "wifi",
        title: "High-Speed Fiber (300 Mbps)",
        description: "Zero latency connection suitable for heavy remote engineering and meetings."
      },
      {
        icon: "sparkles",
        title: "Hotel-Grade Daily Cleaning",
        description: "Spotless daily sanitation of room floors, washroom fixtures, and linen wash."
      },
      {
        icon: "shield",
        title: "Touchless Biometric Entry",
        description: "Keyless access control with CCTV surveillance and security staff."
      },
      {
        icon: "shirt",
        title: "In-House Laundry & Steam",
        description: "Washing and drying facilities handled cleanly by our housekeeping team."
      }
    ],
    reviews: [
      {
        name: "Pooja Hegde",
        role: "Management Consultant · 1.5 Years Resident",
        rating: 5,
        text: "The best place to stay in Jayanagar. Walking distance to the metro, serene leafy neighborhood, and the food tastes just like home.",
        initials: "PH",
        bgColor: "bg-purple-100 text-purple-800"
      },
      {
        name: "Siddharth Rao",
        role: "Architect · 2 Years Resident",
        rating: 5,
        text: "Rooms are huge and well-ventilated. The terrace is great for working in the evenings.",
        initials: "SR",
        bgColor: "bg-blue-100 text-[#1b5299]"
      }
    ]
  },
  "banashankari": {
    id: "banashankari",
    name: "Charla Living — Banashankari",
    locality: "Banashankari",
    headline: "Modern Connected PG 3 Min from Banashankari Metro",
    locationDetails: "2nd Stage · 3 min walk to Banashankari Metro Station & BDA Complex",
    landmark: "Direct commute to Majestic, Jayanagar, and Outer Ring Road",
    description: "Superbly connected residence for professionals commuting via Green Line Metro or students attending nearby South Bengaluru institutions.",
    tag: "3 min to Metro",
    startingPrice: 9000,
    deposit: "1 Month",
    images: {
      hero: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      room: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      lounge: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
      dining: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80"
    },
    galleryCount: 14,
    roomTypes: [
      {
        id: "single",
        name: "Private Single AC",
        badge: "AVAILABLE",
        badgeColor: "bg-green-50 text-green-700 border border-green-200",
        tagline: "Private air-conditioned sanctuary right near the metro.",
        price: 14000,
        bedType: "Single Comfort Bed",
        features: ["Dedicated Split AC", "Study Desk with Lamp", "Attached Modern Washroom", "Balcony Access"],
        specs: ["AC Single", "Attached Bath", "Near Metro"]
      },
      {
        id: "double",
        name: "Double Sharing AC",
        badge: "MOST POPULAR",
        badgeColor: "bg-[#1b5299] text-white",
        tagline: "Air-conditioned double sharing with separate study tables.",
        price: 9500,
        bedType: "Twin Beds",
        features: ["AC in Room", "Dual Wardrobes", "High-Speed Wi-Fi", "Attached Washroom"],
        specs: ["2 Sharing", "AC Included", "Study Desk"]
      },
      {
        id: "triple",
        name: "Triple Sharing Non-AC",
        badge: "VALUE PICK",
        badgeColor: "bg-blue-50 text-[#1b5299] border border-blue-200",
        tagline: "Budget-friendly option with full meal plan and Wi-Fi.",
        price: 7500,
        bedType: "Triple Single Beds",
        features: ["Individual Lockers", "Daily Housekeeping", "3 Meals Daily", "RO Drinking Water"],
        specs: ["3 Sharing", "Economical", "All Included"]
      }
    ],
    menu: {
      specialDay: "Friday Special",
      breakfast: "Crispy Masala Dosa, Chutney, Sambar & Tea",
      lunch: "Bisibelebath with Boondi, Curd Rice & Pickles",
      dinner: "Chapati, Veg Korma, Steamed Rice, Tomato Dal & Sweet"
    },
    amenities: [
      {
        icon: "train",
        title: "3 Min to Metro",
        description: "Skip traffic and hop directly onto Namma Metro Green Line."
      },
      {
        icon: "wifi",
        title: "200 Mbps Wi-Fi",
        description: "Reliable internet throughout all rooms and lounge spaces."
      },
      {
        icon: "sparkles",
        title: "Daily Housekeeping",
        description: "Daily room and bathroom cleaning."
      },
      {
        icon: "shield",
        title: "Secure Access",
        description: "Biometric and CCTV monitored."
      }
    ],
    reviews: [
      {
        name: "Gaurav Nair",
        role: "UX Researcher · 1 Year Resident",
        rating: 5,
        text: "Being 3 minutes from the metro cuts my commute time in half. Great food, great crowd.",
        initials: "GN",
        bgColor: "bg-indigo-100 text-indigo-800"
      }
    ]
  },
  "kumaraswamy-layout": {
    id: "kumaraswamy-layout",
    name: "Charla Living — Kumaraswamy Layout",
    locality: "Kumaraswamy Layout",
    headline: "Top Choice for Dayananda Sagar Students & Techies",
    locationDetails: "Off Kanakapura Rd · 10 min to Dayananda Sagar College (DSCE / DSI)",
    landmark: "Near Dayananda Sagar Main Gate & Kanakapura Metro",
    description: "Our most popular residence for Dayananda Sagar students and young engineers. High-energy, studious environment with zero chore overhead.",
    tag: "Bestseller",
    startingPrice: 8500,
    deposit: "1 Month",
    images: {
      hero: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      room: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      lounge: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
      dining: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80"
    },
    galleryCount: 15,
    roomTypes: [
      {
        id: "single",
        name: "Private Single Room",
        badge: "FEW LEFT",
        badgeColor: "bg-red-50 text-red-600 border border-red-200",
        tagline: "Dedicated study room with quiet ambience.",
        price: 13500,
        bedType: "Single Bed",
        features: ["Workdesk & Bookshelf", "Attached Washroom", "High-Speed Wi-Fi", "Balcony"],
        specs: ["Single", "Attached Bath", "Near College"]
      },
      {
        id: "double",
        name: "Double Sharing Room",
        badge: "BESTSELLER",
        badgeColor: "bg-[#1b5299] text-white",
        tagline: "Favorite choice for college mates and coworkers.",
        price: 8500,
        bedType: "Twin Beds",
        features: ["Separate Study Tables", "Dual Wardrobes", "4 Meals / Day", "Housekeeping"],
        specs: ["2 Sharing", "Study Desks", "4 Meals"]
      },
      {
        id: "triple",
        name: "Triple Sharing Room",
        badge: "BUDGET FRIENDLY",
        badgeColor: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        tagline: "Affordable and social with complete meal plans.",
        price: 7000,
        bedType: "Triple Beds",
        features: ["Individual Lockers", "Attached Bath", "All Meals", "Wi-Fi"],
        specs: ["3 Sharing", "Budget", "Attached Bath"]
      }
    ],
    menu: {
      specialDay: "Sunday Special",
      breakfast: "Poori Sagu with Halwa, Fresh Tea / Coffee",
      lunch: "Veg/Egg Biryani, Raita, Dal, Paneer Gravy",
      dinner: "Soft Rotis, Dal Makhani, Jeera Rice, Ice Cream"
    },
    amenities: [
      {
        icon: "utensils",
        title: "4 Meals / Day",
        description: "Breakfast, Lunch, Evening Snacks & Dinner included."
      },
      {
        icon: "wifi",
        title: "100 Mbps Fast Wi-Fi",
        description: "Designed for online classes, submissions, and gaming."
      },
      {
        icon: "book",
        title: "Dedicated Study Room",
        description: "Quiet group study room with whiteboards."
      },
      {
        icon: "shield",
        title: "Biometric Gates",
        description: "Safe environment with student-friendly curfew policies."
      }
    ],
    reviews: [
      {
        name: "Abhishek Kulkarni",
        role: "DSCE Student · 3 Years Resident",
        rating: 5,
        text: "Lived here through my 2nd, 3rd, and 4th year of engineering. The food is way better than college mess, and having no chores saved my grades.",
        initials: "AK",
        bgColor: "bg-orange-100 text-orange-800"
      }
    ]
  },
  "padmanabhanagar": {
    id: "padmanabhanagar",
    name: "Charla Living — Padmanabhanagar",
    locality: "Padmanabhanagar",
    headline: "Newly Renovated Peaceful Residence with Rooftop Terrace",
    locationDetails: "Near Brigade Millennium · 12 min to JP Nagar 6th Phase",
    landmark: "Quiet residential layout close to greenery and supermarkets",
    description: "Spacious, newly upgraded residence for boys and men featuring a serene rooftop terrace, high natural light, and quiet work spaces.",
    tag: "Newly renovated",
    startingPrice: 8000,
    deposit: "1 Month",
    images: {
      hero: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      room: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
      lounge: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
      dining: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80"
    },
    galleryCount: 12,
    roomTypes: [
      {
        id: "single",
        name: "Private Deluxe Room",
        badge: "RENOVATED",
        badgeColor: "bg-blue-50 text-[#1b5299] border border-blue-200",
        tagline: "Brand new interiors with premium teak furniture.",
        price: 13000,
        bedType: "Queen Single",
        features: ["Brand New Fixtures", "Work Table", "Attached Bath", "Balcony"],
        specs: ["Single", "Brand New", "Balcony"]
      },
      {
        id: "double",
        name: "Double Sharing Deluxe",
        badge: "POPULAR",
        badgeColor: "bg-[#1b5299] text-white",
        tagline: "Large airy double room with high ceilings.",
        price: 8500,
        bedType: "Twin Beds",
        features: ["Dual Closets", "Two Desks", "Attached Washroom", "High-Speed Wi-Fi"],
        specs: ["2 Sharing", "High Ceiling", "Terrace Access"]
      },
      {
        id: "triple",
        name: "Triple Sharing Room",
        badge: "AVAILABLE",
        badgeColor: "bg-green-50 text-green-700 border border-green-200",
        tagline: "Cost-effective living in a peaceful neighborhood.",
        price: 6800,
        bedType: "Triple Single Beds",
        features: ["Individual Lockers", "Attached Bath", "3 Meals Daily", "Wi-Fi"],
        specs: ["3 Sharing", "Budget", "Attached Bath"]
      }
    ],
    menu: {
      specialDay: "Saturday Special",
      breakfast: "Upma with Chutney, Sheera, Coffee / Tea",
      lunch: "Lemon Rice, Sambar Rice, Potato Fry, Curd",
      dinner: "Roti, Mix Veg Curry, Jeera Rice, Fruit Custard"
    },
    amenities: [
      {
        icon: "sun",
        title: "Rooftop Terrace Garden",
        description: "Open-air rooftop for morning yoga, sunset tea, and weekend chats."
      },
      {
        icon: "wifi",
        title: "200 Mbps Fiber",
        description: "Dedicated mesh Wi-Fi routers across all floors."
      },
      {
        icon: "sparkles",
        title: "Daily Housekeeping",
        description: "Clean rooms and spotlessly sanitized washrooms."
      },
      {
        icon: "shield",
        title: "Biometric & Security",
        description: "Complete CCTV and fingerprint access."
      }
    ],
    reviews: [
      {
        name: "Deepak S.",
        role: "Financial Analyst · 1 Year Resident",
        rating: 5,
        text: "The rooftop here is awesome after a long day at the office. Super peaceful neighborhood with everything nearby.",
        initials: "DS",
        bgColor: "bg-teal-100 text-teal-800"
      }
    ]
  },
  "uttarahalli": {
    id: "uttarahalli",
    name: "Charla Living — Uttarahalli",
    locality: "Uttarahalli",
    headline: "Spacious & Budget-Friendly Living on Uttarahalli Main Rd",
    locationDetails: "Uttarahalli Main Rd · 8 min to Kumaran's School bus stop",
    landmark: "Near Uttarahalli Lake, easy connectivity to Kanakapura & Mysore Rd",
    description: "Great value living with spacious layouts, dedicated parking, and both vegetarian and non-vegetarian food plan options.",
    tag: "Great Value",
    startingPrice: 7500,
    deposit: "1 Month",
    images: {
      hero: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      room: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
      lounge: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
      dining: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80"
    },
    galleryCount: 10,
    roomTypes: [
      {
        id: "single",
        name: "Private Single Room",
        badge: "AVAILABLE",
        badgeColor: "bg-green-50 text-green-700 border border-green-200",
        tagline: "Comfortable single room at the best price point in South BLR.",
        price: 12000,
        bedType: "Single Bed",
        features: ["Workdesk", "Attached Bathroom", "Wi-Fi", "Parking Slot"],
        specs: ["Single", "Attached Bath", "Parking"]
      },
      {
        id: "double",
        name: "Double Sharing Room",
        badge: "POPULAR",
        badgeColor: "bg-[#1b5299] text-white",
        tagline: "Spacious double sharing with large windows.",
        price: 7500,
        bedType: "Twin Beds",
        features: ["Two Wardrobes", "Study Tables", "Attached Washroom", "Daily Meals"],
        specs: ["2 Sharing", "Large Room", "Food Included"]
      },
      {
        id: "triple",
        name: "Triple Sharing Room",
        badge: "BEST BUDGET",
        badgeColor: "bg-emerald-50 text-emerald-800 border border-emerald-200",
        tagline: "Most affordable room with hot meals and cleaning included.",
        price: 6000,
        bedType: "Triple Single Beds",
        features: ["Individual Storage", "Attached Bath", "3 Meals Daily", "Wi-Fi"],
        specs: ["3 Sharing", "Most Affordable", "All Inclusions"]
      }
    ],
    menu: {
      specialDay: "Tuesday Special",
      breakfast: "Aloo Paratha with Curd & Pickle, Tea / Coffee",
      lunch: "Steamed Rice, Dal Fry, Bhindi Masala, Rasam & Curd",
      dinner: "Phulka Roti, Chana Masala, Veg Pulao, Gulab Jamun"
    },
    amenities: [
      {
        icon: "car",
        title: "Two-Wheeler & Car Parking",
        description: "Covered, gated parking on site for your bike or scooter."
      },
      {
        icon: "wifi",
        title: "150 Mbps Wi-Fi",
        description: "Seamless internet access across all rooms."
      },
      {
        icon: "sparkles",
        title: "Daily Housekeeping",
        description: "Daily room cleaning and waste disposal."
      },
      {
        icon: "shield",
        title: "Biometric & CCTV",
        description: "Secure, gated building with CCTV monitoring."
      }
    ],
    reviews: [
      {
        name: "Manoj Kumar",
        role: "Accountant · 1 Year Resident",
        rating: 5,
        text: "Unbeatable price for the quality of food and cleanliness provided. The management is very responsive.",
        initials: "MK",
        bgColor: "bg-amber-100 text-amber-800"
      }
    ]
  }
};
