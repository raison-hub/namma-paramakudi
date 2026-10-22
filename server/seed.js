require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/Listing');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/namma-paramakudi';

const listings = [
  
  {
    title: 'Sri R.B. Plumber & Pipe Fitting',
    category: 'plumber',
    subCategory: 'Plumbing Repair & Pipe Fitting',
    price: 350,
    priceType: 'Starts From',
    subArea: 'Five Lamp Corner',
    phone: '9842103411',
    whatsappPhone: '9842103411',
    timings: '7:30 AM - 9:00 PM',
    extraDetails: 'Complete home PVC and CPVC pipe installation, leaky tap fittings, bathroom sanitary ware fixes, and Sintex overhead tank wash. Same-day emergency doorstep service.',
    postPin: '1234',
    lat: 9.5435,
    lng: 78.5875,
    averageRating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80', // Plumber fixing pipe under sink
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80', // Pipe wrench and tools
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80'  // Modern tap & plumbing fixture
    ]
  },
  {
    title: 'Muthu Borewell & Submersible Motors',
    category: 'plumber',
    subCategory: 'Motor & Borewell Pump Works',
    price: 450,
    priceType: 'Starts From',
    subArea: 'Railway Feeder Road',
    phone: '9786521908',
    whatsappPhone: '9786521908',
    timings: '8:00 AM - 8:30 PM',
    extraDetails: '1HP / 2HP single-phase & three-phase motor rewinding, borewell submersible pump lifting and repair, capacitor replacement, and automatic water float switch installation.',
    postPin: '1234',
    lat: 9.5490,
    lng: 78.5880,
    averageRating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80', // Industrial water pump & motor
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'  // Technician servicing motor pump
    ]
  },
  {
    title: 'Vaigai Mechanized Sump & Tank Cleaning',
    category: 'plumber',
    subCategory: 'Overhead Tank Cleaning',
    price: 600,
    priceType: 'Fixed',
    subArea: 'Gandhi Nagar',
    phone: '9443187210',
    whatsappPhone: '9443187210',
    timings: '6:30 AM - 7:00 PM',
    extraDetails: '6-stage mechanized cleaning process: sludge removal, high pressure rotary jet cleaning, vacuum cleaning, antibacterial treatment, and UV sanitization for sumps & Sintex tanks.',
    postPin: '1234',
    lat: 9.5460,
    lng: 78.5820,
    averageRating: 5.0,
    photos: [
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80', // Pressure washer cleaning water tank/tiles
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'  // Clean sparkling water bathroom system
    ]
  },

  
  {
    title: 'Sudarshan Electricals & AC Service',
    category: 'electrician',
    subCategory: 'House Wiring & Inverter Setup',
    price: 300,
    priceType: 'Starts From',
    subArea: 'New Bus Stand',
    phone: '9944180552',
    whatsappPhone: '9944180552',
    timings: '8:00 AM - 9:30 PM',
    extraDetails: 'Complete home rewiring, short-circuit troubleshooting, Luminous/Exide inverter sales & installation, split AC copper tubing leak fix, and gas refilling.',
    postPin: '1234',
    lat: 9.5445,
    lng: 78.5895,
    averageRating: 5.0,
    photos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80', // Electrician working on main electrical panel
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80', // Modern circuit wiring & switches
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=800&q=80'  // Multimeter & electrical repair tools
    ]
  },
  {
    title: 'PowerTech Security & CCTV Solutions',
    category: 'electrician',
    subCategory: 'CCTV Camera Installation',
    price: 1800,
    priceType: 'Starts From',
    subArea: 'Five Lamp Corner',
    phone: '9655423188',
    whatsappPhone: '9655423188',
    timings: '9:00 AM - 9:00 PM',
    extraDetails: 'Authorized installer of CP Plus & Hikvision color night-vision cameras. Mobile remote view setup on Android/iPhone. Shop security alarms and Wi-Fi routers.',
    postPin: '1234',
    lat: 9.5435,
    lng: 78.5875,
    averageRating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80', // Security CCTV surveillance camera
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80'  // Security monitoring screens & tech
    ]
  },
  {
    title: 'Selvam Fan & Mixie Coil Rewinding',
    category: 'electrician',
    subCategory: 'Fan / Motor Rewinding',
    price: 250,
    priceType: 'Starts From',
    subArea: 'Kattuparamakudi',
    phone: '9047218349',
    whatsappPhone: '9047218349',
    timings: '8:30 AM - 8:00 PM',
    extraDetails: 'High-speed ceiling fan bearing replacement, copper coil rewinding for table fans, exhaust fans, mixie armatures, and wet grinder motor tune-ups.',
    postPin: '1234',
    lat: 9.5520,
    lng: 78.5910,
    averageRating: 4.7,
    photos: [
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80', // Copper motor coil wiring & workshop
      'https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80'  // Motor maintenance testing
    ]
  },


  {
    title: 'Senthil Acting Driver (Madurai & Outstation)',
    category: 'driver',
    subCategory: 'Car Acting Driver (Local & Outstation)',
    price: 800,
    priceType: 'Per Day',
    subArea: 'Old Bus Stand',
    phone: '9843912044',
    whatsappPhone: '9843912044',
    timings: '24 Hours Available',
    extraDetails: '15+ years safe driving experience across Tamil Nadu. Proficient in manual and automatic cars (Innova, Swift, Ertiga, Creta). Available for Madurai airport, wedding trips, and Rameswaram visits.',
    postPin: '1234',
    lat: 9.5430,
    lng: 78.5860,
    averageRating: 5.0,
    photos: [
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80', // Professional driver holding car steering wheel
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'  // Highway road trip scenery
    ]
  },
  {
    title: 'Namma PMK Auto Stand (Bala Auto)',
    category: 'driver',
    subCategory: 'Auto Rickshaw Service',
    price: 50,
    priceType: 'Starts From',
    subArea: 'Railway Feeder Road',
    phone: '9566831092',
    whatsappPhone: '9566831092',
    timings: '5:00 AM - 11:30 PM',
    extraDetails: 'Direct auto pickup from Paramakudi Railway Station to New Bus Stand, Hospital Road, Emeneswaram, and surrounding villages. Patient assistance for elders and luggage.',
    postPin: '1234',
    lat: 9.5490,
    lng: 78.5880,
    averageRating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', // South Indian auto rickshaw on city street
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'  // Transport station pickup
    ]
  },
  {
    title: 'Kannan Tata Ace Mini Transport',
    category: 'driver',
    subCategory: 'Mini Truck / Tata Ace Transport',
    price: 600,
    priceType: 'Starts From',
    subArea: 'Gandhi Nagar',
    phone: '9787123490',
    whatsappPhone: '9787123490',
    timings: '6:00 AM - 10:00 PM',
    extraDetails: 'Tata Ace & Dost goods vehicle available for house shifting, market parcel transport, construction materials carriage, and agricultural bag loading.',
    postPin: '1234',
    lat: 9.5460,
    lng: 78.5820,
    averageRating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80', // Cargo mini delivery truck on road
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'  // Boxes & shifting parcel logistics
    ]
  },

  // ==========================================
  // 4. HOUSE RENTALS & COMMERCIAL
  // ==========================================
  {
    title: 'Independent 2 BHK Ground Floor House',
    category: 'rental',
    subCategory: '2 BHK Independent House',
    price: 7500,
    priceType: 'Per Month',
    subArea: 'Gandhi Nagar',
    phone: '9443567812',
    whatsappPhone: '9443567812',
    timings: 'Contact 9 AM - 8 PM',
    extraDetails: 'North-facing 2 BHK house in pleasant residential street. Covered car and bike parking, 24-hour Kaveri water + borewell, modular kitchen granite slab, and three-phase EB meter.',
    postPin: '1234',
    lat: 9.5460,
    lng: 78.5820,
    averageRating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80', // Beautiful independent house exterior
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', // Living room with tiled flooring
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'  // Clean modular kitchen
    ]
  },
  {
    title: 'Prime Main Road Commercial Shop Space',
    category: 'rental',
    subCategory: 'Commercial Shop / Office Space',
    price: 9000,
    priceType: 'Per Month',
    subArea: 'New Bus Stand',
    phone: '9994821567',
    whatsappPhone: '9994821567',
    timings: 'Contact 10 AM - 7 PM',
    extraDetails: '220 sq.ft ground floor commercial shutter space right opposite New Bus Stand entrance. Unmatched footfall, vitrified tiles, separate water connection, and rolling shutter with glass door.',
    postPin: '1234',
    lat: 9.5445,
    lng: 78.5895,
    averageRating: 5.0,
    photos: [
      'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80', // Commercial shop storefront with glass entrance
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'  // Modern empty retail office interior
    ]
  },
  {
    title: 'Budget 1 BHK Family Portion',
    category: 'rental',
    subCategory: '1 BHK House for Rent',
    price: 4500,
    priceType: 'Per Month',
    subArea: 'Perumal Kovil Street',
    phone: '9842517890',
    whatsappPhone: '9842517890',
    timings: 'Contact 9 AM - 6 PM',
    extraDetails: 'First floor 1 BHK in calm neighborhood close to temples and market. Tiled flooring, continuous water storage, safety grill gate, and separate EB meter. Small family preferred.',
    postPin: '1234',
    lat: 9.5410,
    lng: 78.5840,
    averageRating: 4.6,
    photos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', // Clean compact room with window light
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'  // Bedroom & balcony area
    ]
  },

 
  {
    title: 'Sri Krishna Two-Wheeler Works',
    category: 'mechanic',
    subCategory: 'Two-Wheeler / Bike Mechanic',
    price: 350,
    priceType: 'Starts From',
    subArea: 'Maninagar',
    phone: '9865123489',
    whatsappPhone: '9865123489',
    timings: '8:30 AM - 9:00 PM',
    extraDetails: 'Specialists in Royal Enfield Classic, Bullet 350, Yamaha, Honda Activa, and Hero bikes. Oil service, chain sprocket replacement, disc brake adjustment, and engine tuning.',
    postPin: '1234',
    lat: 9.5385,
    lng: 78.5820,
    averageRating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', // Royal Enfield motorcycle close-up
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=800&q=80', // Mechanic servicing motorbike in garage
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80'  // Motorcycle engine & disc brake work
    ]
  },
  {
    title: 'K.P. Four Wheeler Garage & Water Wash',
    category: 'mechanic',
    subCategory: 'Car Mechanic & Water Wash',
    price: 500,
    priceType: 'Starts From',
    subArea: 'New Bus Stand',
    phone: '9788145290',
    whatsappPhone: '9788145290',
    timings: '8:00 AM - 8:30 PM',
    extraDetails: 'Maruti Suzuki, Hyundai, and Mahindra car repairs. Suspension overhaul, clutch plate replacement, computerized scanning, and underbody high-pressure foam wash.',
    postPin: '1234',
    lat: 9.5445,
    lng: 78.5895,
    averageRating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80', // Car lifted on hydraulic ramp in workshop
      'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=800&q=80'  // Car pressure foam wash
    ]
  },
  {
    title: 'Star Tyre Works & Tubeless Puncture',
    category: 'mechanic',
    subCategory: 'Puncture & Tyre Works',
    price: 70,
    priceType: 'Starts From',
    subArea: 'Five Lamp Corner',
    phone: '9942671043',
    whatsappPhone: '9942671043',
    timings: '7:00 AM - 10:30 PM',
    extraDetails: 'Instant tubeless mushroom plug puncture repair for cars & bikes. Nitrogen tire inflation, wheel alignment assistance, and new MRF/CEAT tube replacement.',
    postPin: '1234',
    lat: 9.5435,
    lng: 78.5875,
    averageRating: 4.7,
    photos: [
      'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80', // Automobile tire stack in tire shop
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'  // Alloy wheel & tire mounting
    ]
  },

 
  {
    title: 'Anand 24x7 Medicals & Surgical',
    category: 'medical',
    subCategory: 'Pharmacy / Medical Shop (24x7)',
    price: 0,
    priceType: 'Fixed',
    subArea: 'Hospital Road',
    phone: '9443219080',
    whatsappPhone: '9443219080',
    timings: '24 Hours Open',
    extraDetails: 'Round-the-clock emergency pharmacy. All prescription medicines, pediatric syrups, surgical belts, nebulizers, insulin cool storage, and home medicine dispatch for elders.',
    postPin: '1234',
    lat: 9.5420,
    lng: 78.5905,
    averageRating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1586015555751-63c2541a789a?auto=format&fit=crop&w=800&q=80', // Pharmacy shelves stacked with medicines
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80'  // Medicine bottles & blister pills
    ]
  },
  {
    title: 'Dr. Ramesh Kumar Clinic (General Physician)',
    category: 'medical',
    subCategory: 'Clinic / General Physician',
    price: 150,
    priceType: 'Fixed',
    subArea: 'Hospital Road',
    phone: '9842881230',
    whatsappPhone: '9842881230',
    timings: '9:00 AM - 1:00 PM & 5:00 PM - 9:00 PM',
    extraDetails: 'Consultation for seasonal viral fever, hypertension, diabetes care, joint pains, and pediatric wellness. Clean consultation room and patient-friendly care.',
    postPin: '1234',
    lat: 9.5420,
    lng: 78.5905,
    averageRating: 5.0,
    photos: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80', // Doctor consulting desk with stethoscope
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'  // Professional doctor examination setup
    ]
  },
  {
    title: 'Paramakudi Diagnostic Centre & Lab',
    category: 'medical',
    subCategory: 'Diagnostic Lab & Blood Testing',
    price: 250,
    priceType: 'Starts From',
    subArea: 'Five Lamp Corner',
    phone: '9677890123',
    whatsappPhone: '9677890123',
    timings: '7:00 AM - 8:30 PM',
    extraDetails: 'Fully automated biochemistry & pathology laboratory. Complete Blood Count (CBC), lipid profile, liver function, thyroid panel, and morning home blood collection.',
    postPin: '1234',
    lat: 9.5435,
    lng: 78.5875,
    averageRating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80', // Laboratory microscope & blood test tubes
      'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80'  // Medical diagnostic lab technician equipment
    ]
  },

  
  {
    title: 'Sri Murugan Maligai Store',
    category: 'shop',
    subCategory: 'Grocery / Provision Store',
    price: 0,
    priceType: 'Fixed',
    subArea: 'Perumal Kovil Street',
    phone: '9443721950',
    whatsappPhone: '9443721950',
    timings: '7:00 AM - 9:30 PM',
    extraDetails: 'Top quality Ponni boiled rice, directly sourced country toor dhal, pure chekku sesame & groundnut oils, spices, and whole monthly grocery delivery within town.',
    postPin: '1234',
    lat: 9.5410,
    lng: 78.5840,
    averageRating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80', // Fresh grocery provision market store
      'https://images.unsplash.com/photo-1506484381205-f7945653044d?auto=format&fit=crop&w=800&q=80'  // Spices, grains and pulses display
    ]
  },
  {
    title: 'Royal Sweets & Traditional Bakery',
    category: 'shop',
    subCategory: 'Bakery & Sweets',
    price: 120,
    priceType: 'Starts From',
    subArea: 'Five Lamp Corner',
    phone: '9842145980',
    whatsappPhone: '9842145980',
    timings: '8:00 AM - 10:00 PM',
    extraDetails: 'Paramakudi special pure ghee Halwa, hot crunchy mixture, evening vegetable puffs, fresh cream birthday cakes, and freshly ground filter coffee.',
    postPin: '1234',
    lat: 9.5435,
    lng: 78.5875,
    averageRating: 5.0,
    photos: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', // Fresh bakery breads and evening baked puffs
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80', // Delicious dessert confectionery & sweets
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'  // Fresh cream birthday cake
    ]
  },
  {
    title: 'Lakshmi Silks & Handloom Sarees',
    category: 'shop',
    subCategory: 'Clothing & Textiles',
    price: 500,
    priceType: 'Starts From',
    subArea: 'New Bus Stand',
    phone: '9790123450',
    whatsappPhone: '9790123450',
    timings: '9:30 AM - 9:30 PM',
    extraDetails: 'Famous Paramakudi handloom cotton sarees, traditional wedding silk dhotis, women readymade churidars, and festive kidswear at direct weaving prices.',
    postPin: '1234',
    lat: 9.5445,
    lng: 78.5895,
    averageRating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', // Traditional South Indian handloom silk sarees
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'  // Colorful textile clothing shop fabric display
    ]
  },

  {
    title: 'Paramakudi City Auto Stand (Bala Auto)',
    category: 'auto_cab',
    subCategory: 'Auto Rickshaw Service',
    price: 40,
    priceType: 'Starts From',
    subArea: 'Railway Feeder Road',
    phone: '9566831092',
    whatsappPhone: '9566831092',
    timings: '5:00 AM - 11:30 PM',
    extraDetails: 'Immediate doorstep auto pickup across Paramakudi town. Regular drops to Railway Station, New Bus Stand, Government Hospital, and Emeneswaram. Courteous service and fair local meter rates.',
    postPin: '1234',
    lat: 9.5490,
    lng: 78.5880,
    averageRating: 4.9,
    photos: [
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ]
    
  },
  {
    title: 'Vaigai Cabs & Airport Taxi (Innova / Dzire)',
    category: 'auto_cab',
    subCategory: 'AC Cab / Outstation Taxi',
    price: 1800,
    priceType: 'Starts From',
    subArea: 'New Bus Stand',
    phone: '9843912044',
    whatsappPhone: '9843912044',
    timings: '24 Hours Open',
    extraDetails: 'Swift Dzire, Ertiga, and Innova Crysta cabs with neat AC interiors. Direct trips for Madurai Airport drops, Rameswaram temple darshan, Tiruchendur, and Chennai one-way drops.',
    postPin: '1234',
    lat: 9.5445,
    lng: 78.5895,
    averageRating: 5.0,
    photos: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    title: 'Five Lamp Share & Private Auto Service',
    category: 'auto_cab',
    subCategory: 'Local Auto Service',
    price: 30,
    priceType: 'Starts From',
    subArea: 'Five Lamp Corner',
    phone: '9787123490',
    whatsappPhone: '9787123490',
    timings: '6:00 AM - 10:00 PM',
    extraDetails: 'Stationed right at Five Lamp junction. Available for hospital emergency visits, school pickup/drop packages, market shopping trips, and Parthibanur / Bogalur rides.',
    postPin: '1234',
    lat: 9.5435,
    lng: 78.5875,
    averageRating: 4.8,
    photos: [
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connecting to MongoDB...');

    // Wipe out any older duplicate records
    const deleteResult = await Listing.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} old listings.`);

    // Map photoUrl as cover thumbnail
    const formatted = listings.map((item) => ({
      ...item,
      photoUrl: item.photos[0],
      isApproved: true
    }));

    const inserted = await Listing.insertMany(formatted);
    console.log(`Successfully seeded ${inserted.length} realistic listings across all categories!`);

    await mongoose.disconnect();
    console.log('Database disconnected. Seeding completed cleanly.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();