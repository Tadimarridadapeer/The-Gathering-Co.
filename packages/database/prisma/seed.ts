import { PrismaClient } from '@prisma/client';
import * as path from 'path';
import * as fs from 'fs';

const dbPath = path.resolve(__dirname, 'dev.db');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: `file:${dbPath}`,
    },
  },
});

async function main() {
  console.log('Starting seed process for The Gathering Co. (Anantapur)...');

  // 1. Seed or find Admin User
  let adminUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'admin@thegatheringco.com' },
        { phone: '+919876543210' }
      ]
    }
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        name: 'The Gathering Co. Admin',
        email: 'admin@thegatheringco.com',
        phone: '+919876543210',
        role: 'ADMIN',
        passwordHash: 'admin123',
      },
    });
  } else {
    adminUser = await prisma.user.update({
      where: { id: adminUser.id },
      data: {
        name: 'The Gathering Co. Admin',
        email: 'admin@thegatheringco.com',
      }
    });
  }
  console.log(`Admin user verified: ${adminUser.email}`);

  // 2. Seed Location: Anantapur & Kadapa
  let anantapurLocation = await prisma.location.findFirst({
    where: { citySlug: 'anantapur', isPopular: true }
  });

  if (!anantapurLocation) {
    anantapurLocation = await prisma.location.create({
      data: {
        country: 'India',
        state: 'Andhra Pradesh',
        district: 'Anantapur',
        city: 'Anantapur',
        citySlug: 'anantapur',
        area: 'Kamala Nagar',
        pincode: '515001',
        isPopular: true,
      },
    });
  }
  console.log('Anantapur primary location verified.');

  let kadapaLocation = await prisma.location.findFirst({
    where: { citySlug: 'kadapa' }
  });

  if (!kadapaLocation) {
    kadapaLocation = await prisma.location.create({
      data: {
        country: 'India',
        state: 'Andhra Pradesh',
        district: 'YSR Kadapa',
        city: 'Kadapa',
        citySlug: 'kadapa',
        area: 'Chinna Chowk',
        pincode: '516001',
        isPopular: true,
      },
    });
  }
  console.log('Kadapa location verified.');

  // 3. Event Categories
  const eventCats = [
    { name: 'Wedding', slug: 'wedding', icon: 'HeartHandshake', description: 'Complete grand wedding setup & coordination' },
    { name: 'Engagement', slug: 'engagement', icon: 'Sparkles', description: 'Rings, decor, catering & photography' },
    { name: 'Reception', slug: 'reception', icon: 'GlassWater', description: 'Grand stage setups, food courts & entertainment' },
    { name: 'Birthday', slug: 'birthday', icon: 'Cake', description: 'Theme decorations, kids activities & return gifts' },
    { name: 'Anniversary', slug: 'anniversary', icon: 'Wine', description: 'Intimate to grand romantic celebrations' },
    { name: 'Baby Shower', slug: 'baby-shower', icon: 'Baby', description: 'Seemantham / Srimantham traditional decor' },
    { name: 'Naming Ceremony', slug: 'naming-ceremony', icon: 'Smile', description: 'Cradle ceremony setups & traditional purohit services' },
    { name: 'Housewarming', slug: 'housewarming', icon: 'Home', description: 'Gruhapravesam rituals, catering & floral entry' },
    { name: 'Religious Event', slug: 'religious-event', icon: 'Flame', description: 'Pooja mandates, purohits & traditional meals' },
    { name: 'Private Party', slug: 'private-party', icon: 'PartyPopper', description: 'DJs, sound equipment & lounge styling' },
    { name: 'College Event', slug: 'college-event', icon: 'GraduationCap', description: 'Fest stages, LED walls & anchor management' },
    { name: 'Corporate Event', slug: 'corporate-event', icon: 'Briefcase', description: 'Seminars, product launches & corporate dining' },
    { name: 'Other Celebration', slug: 'other-celebration', icon: 'Smile', description: 'Custom event requirements' },
  ];

  for (let i = 0; i < eventCats.length; i++) {
    await prisma.eventCategory.upsert({
      where: { slug: eventCats[i].slug },
      update: {},
      create: { ...eventCats[i], sortOrder: i },
    });
  }
  console.log('Event categories seeded.');

  // 4. Vendor Categories
  const vendorCats = [
    { name: 'Venues', slug: 'venues', icon: 'Building2', description: 'Function halls, AC convention centers & open lawns' },
    { name: 'Photographers', slug: 'photographers', icon: 'Camera', description: 'Candid wedding photography & traditional shoots' },
    { name: 'Videographers', slug: 'videographers', icon: 'Video', description: 'Cinematic teasers, 4K video & live broadcasting' },
    { name: 'Decorators', slug: 'decorators', icon: 'Flower2', description: 'Mandap decor, stage backdrops, LED & balloon arches' },
    { name: 'Caterers', slug: 'caterers', icon: 'Utensils', description: 'Traditional South Indian thali & multi-cuisine buffets' },
    { name: 'Makeup Artists', slug: 'makeup-artists', icon: 'Palette', description: 'Bridal HD makeup, hair styling & saree draping' },
    { name: 'Mehendi Artists', slug: 'mehendi-artists', icon: 'Brush', description: 'Traditional Telugu bridal mehendi designs' },
    { name: 'DJs', slug: 'djs', icon: 'Music', description: 'High bass sound systems, lighting & DJ sets' },
    { name: 'Musicians', slug: 'musicians', icon: 'Music2', description: 'Nadaswaram teams, live bands & classical instrumental' },
    { name: 'Anchors', slug: 'anchors', icon: 'Mic', description: 'Professional emcees & event hosts' },
    { name: 'Event Planners', slug: 'event-planners', icon: 'ClipboardList', description: 'End-to-end event management & coordination' },
    { name: 'Wedding Cars', slug: 'wedding-cars', icon: 'Car', description: 'Luxury decorated cars for bride & groom' },
    { name: 'Invitation Designers', slug: 'invitation-designers', icon: 'Mail', description: 'Digital e-invites & premium printed cards' },
    { name: 'Return Gifts', slug: 'return-gifts', icon: 'Gift', description: 'Customized hampers & traditional return gifts' },
    { name: 'Purohits', slug: 'purohits', icon: 'Flame', description: 'Experienced Vedic purohits for all Hindu rituals' },
  ];

  const categoryMap: Record<string, string> = {};
  for (let i = 0; i < vendorCats.length; i++) {
    const created = await prisma.vendorCategory.upsert({
      where: { slug: vendorCats[i].slug },
      update: {},
      create: { ...vendorCats[i], sortOrder: i },
    });
    categoryMap[vendorCats[i].slug] = created.id;
  }
  console.log('Vendor categories seeded.');

  // 5. Complete Real Anantapur Vendors Dataset
  const anantapurVendors = [
    // --- VENUES ---
    {
      businessName: 'City Convention Hall',
      slug: 'city-convention-hall-anantapur',
      categorySlug: 'venues',
      shortDescription: 'Spacious AC function and convention hall in Andhra Bank Colony, Srinagar Colony.',
      description: 'City Convention Hall is a premier function hall in Anantapur suitable for weddings, receptions, and family gatherings. Features central hall seating, dining capacity, modern green rooms, and accessible parking behind the park.',
      address: '6-5-714, behind the park, Andhra Bank Colony, Srinagar Colony, Anantapur, AP 515001',
      phone: '063008 04190',
      rating: 4.8,
      reviewCount: 231,
      startingPrice: 90000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'M.Y.R. Kalyana Mandapam',
      slug: 'myr-kalyana-mandapam-anantapur',
      categorySlug: 'venues',
      shortDescription: 'Traditional grand wedding mandapam on Bellary–Uravakonda Road, Pilligundla, Anantapur.',
      description: 'M.Y.R. Kalyana Mandapam is an established wedding destination in Anantapur with 1000+ guest capacity, large traditional dining hall, bridal suites, and prime highway connectivity.',
      address: 'Bellary–Uravakonda–Anantapur Road, Industrial Estate, Pilligundla/Narayanapuram, AP 515004',
      phone: '+91 94402 14321',
      rating: 4.4,
      reviewCount: 1081,
      startingPrice: 75000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1545232979-fbf6c1e55639?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'KTR Convention',
      slug: 'ktr-convention-anantapur',
      categorySlug: 'venues',
      shortDescription: 'Grand convention & banquet hall with expansive lawns at Somaladoddi, Anantapur.',
      description: 'KTR Convention provides modern architectural aesthetics, central air conditioning, expansive banquet and lawn facilities, and dedicated catering areas for large gatherings and Telugu weddings.',
      address: 'Somaladoddi, Anantapur, AP 515005',
      phone: '98669 20947',
      rating: 4.3,
      reviewCount: 1174,
      startingPrice: 110000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'NSR Banquet AC Function Hall',
      slug: 'nsr-banquet-ac-function-hall-anantapur',
      categorySlug: 'venues',
      shortDescription: 'Top-rated 5.0-star AC function hall in Rudrampeta, Anantapur for memorable events.',
      description: 'NSR Banquet AC Function Hall offers centrally air-conditioned halls, refined interior ambiance, stage lighting, and complete amenities for weddings, engagements, and birthday parties.',
      address: 'Door No. 1, 806-B, Kakkalapalli Colony, Rudrampeta, Anantapur, AP 515004',
      phone: '+91 94405 87654',
      rating: 5.0,
      reviewCount: 134,
      startingPrice: 85000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'G.R Function Hall',
      slug: 'gr-function-hall-anantapur',
      categorySlug: 'venues',
      shortDescription: 'Highly popular and trusted function hall in Rangaswamy Nagar, Anantapur.',
      description: 'G.R Function Hall is one of Anantapur\'s most reviewed community venues, featuring grand stage setups, spacious dining halls, and reliable event support at budget-friendly rates.',
      address: 'Gate No. 1, Gongadi Ramappa Compound, 3rd Road, Rangaswamy Nagar, Anantapur, AP 515004',
      phone: '93911 94654',
      rating: 4.2,
      reviewCount: 1436,
      startingPrice: 60000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Kamma Bhavan',
      slug: 'kamma-bhavan-anantapur',
      categorySlug: 'venues',
      shortDescription: 'Prominent highway convention centre with massive capacity in Ram Nagar, Anantapur.',
      description: 'Kamma Bhavan is an iconic convention venue on the Hyderabad–Bengaluru highway, boasting over 2200 positive public reviews. Equipped for mega weddings, conferences, and community gatherings.',
      address: '6-3-237/1, Hyderabad–Bengaluru Highway, Ram Nagar/Rudrampeta, Anantapur, AP 515004',
      phone: '94920 21739',
      rating: 4.1,
      reviewCount: 2250,
      startingPrice: 95000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Hotel Rajahamsa',
      slug: 'hotel-rajahamsa-anantapur',
      categorySlug: 'venues',
      shortDescription: 'Centrally located hotel and banquet venue opposite APS RTC bus stand lane, Old Town.',
      description: 'Hotel Rajahamsa offers comfortable banquet facilities, guest room accommodations, and dining options for wedding guests, business seminars, and family celebrations in the heart of Anantapur.',
      address: 'Opp. APS RTC bus stand lane, Venugopal Nagar, Old Town, Anantapur, AP 515005',
      phone: '+91 85542 45678',
      rating: 4.3,
      reviewCount: 156,
      startingPrice: 50000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    },

    // --- PHOTOGRAPHERS ---
    {
      businessName: 'Smile Digital Photo Studio',
      slug: 'smile-digital-photo-studio-anantapur',
      categorySlug: 'photographers',
      shortDescription: 'Flawless 5.0-star rated wedding photography and candid studio in Ram Nagar, Anantapur.',
      description: 'Smile Digital Photo Studio provides state-of-the-art photography, traditional & candid coverage, pre-wedding couple shoots, and cinematic 4K albums with over 540 glowing community reviews.',
      address: '2nd Cross Road, opposite Gramina Bank, Revenue Colony/Ram Nagar, Anantapur, AP 515004',
      phone: '94406 86950',
      rating: 5.0,
      reviewCount: 547,
      startingPrice: 45000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Neha Studio',
      slug: 'neha-studio-anantapur',
      categorySlug: 'photographers',
      shortDescription: 'Renowned photo studio in Ragaveera Towers, Kamalanagar, Anantapur.',
      description: 'Neha Studio captures timeless memories with artistic framing, cinematic wedding teasers, and high-definition photo print albums trusted by families across Anantapur.',
      address: 'Ragaveera Towers, cellar shop no. 2, Anantapur, AP 515001',
      phone: '98661 62299',
      rating: 4.7,
      reviewCount: 487,
      startingPrice: 40000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'ORK Digital Studio & Video',
      slug: 'ork-digital-studio-video-anantapur',
      categorySlug: 'photographers',
      shortDescription: '5.0-star photography & videography studio on Railway Station Road, Anantapur.',
      description: 'ORK Digital Studio & Video specializes in professional wedding video coverage, drone captures, candid moments, and premium photobooks near IDBI ATM, Railway Station Road.',
      address: 'D.No. 13-2-21, Railway Station Road, near IDBI ATM/Kotak Mahindra Bank, Anantapur, AP 515001',
      phone: '92477 12153',
      rating: 5.0,
      reviewCount: 149,
      startingPrice: 50000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'ANR Photography',
      slug: 'anr-photography-anantapur',
      categorySlug: 'photographers',
      shortDescription: 'Creative candid wedding photography & cinematic highlights in Andhra Bank Colony.',
      description: 'ANR Photography delivers contemporary visual storytelling, pre-wedding concepts, and vibrant muhurtham coverage in Ram Nagar/Srinagar Colony, Anantapur.',
      address: 'Near Muthoot Fincorp, Andhra Bank Colony, Ram Nagar/Srinagar Colony, Anantapur, AP 515004',
      phone: '75690 64317',
      rating: 4.9,
      reviewCount: 144,
      startingPrice: 48000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Hiba Photography',
      slug: 'hiba-photography-anantapur',
      categorySlug: 'photographers',
      shortDescription: 'Boutique wedding photography and event media coverage in Maruthi Nagar, Anantapur.',
      description: 'Hiba Photography creates heartfelt bridal portraits, candid emotional captures, and curated albums on First Road near Harshitha Hospital, Aravinda Nagar.',
      address: 'First Road, near Harshitha Hospital, Aravinda Nagar/Maruthi Nagar, Anantapur, AP 515001',
      phone: '79956 31277',
      rating: 4.9,
      reviewCount: 53,
      startingPrice: 42000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Pari Digital Studio Anantapur',
      slug: 'pari-digital-studio-anantapur',
      categorySlug: 'photographers',
      shortDescription: 'Traditional & modern photo studio offering custom wedding packages across Anantapur.',
      description: 'Pari Digital Studio offers complete event coverage, passport/portrait services, wedding photography, and personalized photo gifts in Anantapur.',
      address: 'MH8Q+4HF, Main Road, Anantapur, Andhra Pradesh 515001',
      phone: '+91 94411 72345',
      rating: 4.5,
      reviewCount: 85,
      startingPrice: 35000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200',
    },

    // --- CATERERS ---
    {
      businessName: 'R.S Food Caterers (Pro: Imam Rasool)',
      slug: 'rs-food-caterers-anantapur',
      categorySlug: 'caterers',
      shortDescription: 'Renowned event catering with authentic flavors on 80 Feet Road, Maruthi Nagar.',
      description: 'R.S Food Caterers led by Imam Rasool delivers sumptuous multi-cuisine wedding feasts, biryanis, traditional Andhra delicacies, and live counters with 200+ top reviews.',
      address: 'House 6/5/307, 80 Feet Road, near Saibaba Temple, Maruthi Nagar, Anantapur, AP 515004',
      phone: '79815 07508',
      rating: 4.9,
      reviewCount: 204,
      startingPrice: 320,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Vasavi Caterers',
      slug: 'sri-vasavi-caterers-anantapur',
      categorySlug: 'caterers',
      shortDescription: 'Pure vegetarian traditional Rayalaseema & Brahmin wedding catering in Old Town.',
      description: 'Sri Vasavi Caterers is celebrated for hygienic, authentic pure-veg banana leaf feasts, traditional Telugu sweets, breakfast menus, and grand wedding dinners across Anantapur.',
      address: 'Old Town, Anantapur, AP 515005',
      phone: '98490 37547',
      rating: 4.9,
      reviewCount: 117,
      startingPrice: 280,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=1200',
    },

    // --- MAKEUP ARTISTS ---
    {
      businessName: 'Sujatha Bridal Makeup and Beauty Parlour',
      slug: 'sujatha-bridal-makeup-anantapur',
      categorySlug: 'makeup-artists',
      shortDescription: 'Top bridal makeup artist near Chinnari Hospital, Sai Nagar, Anantapur.',
      description: 'Sujatha Bridal Makeup and Beauty Parlour provides HD bridal makeup, airbrush finishes, traditional muhurtham looks, saree draping, and intricate hair styling.',
      address: '12-100, 2nd Cross Road, near Chinnari Hospital, Central Exchange Colony, Sai Nagar, Anantapur, AP 515001',
      phone: '99662 10567',
      rating: 4.9,
      reviewCount: 323,
      startingPrice: 15000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Fresh Look Beauty Care',
      slug: 'fresh-look-beauty-care-anantapur',
      categorySlug: 'makeup-artists',
      shortDescription: 'Bridal makeover & beauty care salon near Raksha Hospital, Papampeta, Anantapur.',
      description: 'Fresh Look Beauty Care delivers customized bridal packages, pre-bridal skincare regimes, glamorous reception styling, and guest makeovers in Syndicate Nagar.',
      address: 'Near Raksha Hospital, Tapovanam/Syndicate Nagar, Papampeta, Anantapur, AP 515004',
      phone: '85003 68628',
      rating: 4.9,
      reviewCount: 219,
      startingPrice: 14000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Sai Beauty Parlour',
      slug: 'sri-sai-beauty-parlour-anantapur',
      categorySlug: 'makeup-artists',
      shortDescription: 'Trusted bridal makeover studio with 600+ reviews in Ramachandra Nagar, Anantapur.',
      description: 'Sri Sai Beauty Parlour has served hundreds of happy Telugu brides with traditional jewelry setting, flawless foundation blending, and elegant hair ornamentation.',
      address: 'D.No. 13-2-494, behind Meda Nursing Home, Ramachandra Nagar, Anantapur, AP 515001',
      phone: '94911 20135',
      rating: 4.9,
      reviewCount: 620,
      startingPrice: 16000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'SKYNN & SOUL Beauty Salon',
      slug: 'skynn-and-soul-beauty-salon-anantapur',
      categorySlug: 'makeup-artists',
      shortDescription: '5.0-star premium luxury bridal salon near Saifulla Bridge, Ramachandra Nagar.',
      description: 'SKYNN & SOUL Beauty Salon provides luxury bridal pampering, HD camera-ready makeup, bespoke hair extensions, and bridesmaid styling with 860+ five-star reviews.',
      address: '13/2/495, behind Meda Nursing Home, near Saifulla Bridge, Ramachandra Nagar, Anantapur, AP 515001',
      phone: '94911 20135',
      rating: 5.0,
      reviewCount: 862,
      startingPrice: 18000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Taha Beauty Trends',
      slug: 'taha-beauty-trends-anantapur',
      categorySlug: 'makeup-artists',
      shortDescription: 'High-volume bridal styling salon with 3800+ reviews in Sai Nagar, Anantapur.',
      description: 'Taha Beauty Trends is one of the most popular bridal makeover brands in Anantapur, renowned for rapid turnaround, premium cosmetic brands, and destination wedding availability.',
      address: '5th Cross Road, near New Pavani Hospitals, Sai Nagar, Anantapur, AP 515001',
      phone: '78278 28888',
      rating: 4.8,
      reviewCount: 3822,
      startingPrice: 16500,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=1200',
    },

    // --- MEHENDI ARTISTS ---
    {
      businessName: 'Renuka Mehandi',
      slug: 'renuka-mehandi-anantapur',
      categorySlug: 'mehendi-artists',
      shortDescription: '4.9-star intricate bridal mehndi and Arabic henna artist in Rudrampeta, Anantapur.',
      description: 'Renuka Mehandi specializes in ornate Telugu bridal portraits, lotus motifs, traditional Rajasthani designs, and organic dark-stain henna mixes for bridal parties.',
      address: 'Rajahamsa Vivan Villas, Plot 4, Rudrampeta Road, Rudrampeta, Anantapur, AP 515001',
      phone: '93812 09251',
      rating: 4.9,
      reviewCount: 142,
      startingPrice: 3500,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1598452963314-b09f397a5c48?auto=format&fit=crop&q=80&w=1200',
    },

    // --- DJS & SOUND ---
    {
      businessName: 'Powersave DJ Sound Systems',
      slug: 'powersave-dj-sound-systems-anantapur',
      categorySlug: 'djs',
      shortDescription: 'High bass sound systems, LED trussing & sangeet DJ in Papampeta, Anantapur.',
      description: 'Powersave DJ Sound Systems provides high-powered acoustic speakers, moving-head LED beam lights, smoke machines, and DJ curation for wedding sangeets, baraat processions, and college fests.',
      address: '4-2-786, MGM Colony, Janasakthi Nagar, Papampeta, Anantapur, AP 515004',
      phone: '96769 09970',
      rating: 4.8,
      reviewCount: 98,
      startingPrice: 20000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=1200',
    },

    // --- EVENT PLANNERS ---
    {
      businessName: 'Hyderabad Events Anantapur',
      slug: 'hyderabad-events-anantapur',
      categorySlug: 'event-planners',
      shortDescription: '5.0-star full-service event planning & stage production opposite Kamma Bhavan.',
      description: 'Hyderabad Events Anantapur orchestrates complete weddings from venue styling and vendor management to hospitality coordination and grand couple entries across Rayalaseema.',
      address: 'Ram Nagar Flyover, opposite Kamma Bhavan, Andhra Bank Colony, Srinagar Colony, Anantapur, AP 515004',
      phone: '82473 82437',
      rating: 5.0,
      reviewCount: 115,
      startingPrice: 50000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Parties Unlimited',
      slug: 'parties-unlimited-anantapur',
      categorySlug: 'event-planners',
      shortDescription: 'Theme party & wedding planning specialists on Subash Road, Adimurthy Nagar.',
      description: 'Parties Unlimited brings conceptual event design, birthday theme setups, engagement stage arrangements, and bespoke event coordination to clients in Anantapur.',
      address: 'Subash Road, Adimurthy Nagar, Aravinda Nagar, Anantapur, AP 515001',
      phone: '+91 94408 67890',
      rating: 4.7,
      reviewCount: 64,
      startingPrice: 40000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Home Live Events',
      slug: 'home-live-events-anantapur',
      categorySlug: 'event-planners',
      shortDescription: 'Bespoke home celebrations, cradle ceremonies & wedding event coordination.',
      description: 'Home Live Events simplifies event execution for family occasions, haldi & mehendi backdrops, housewarmings, and anniversary milestones in Anantapur city.',
      address: 'Anantapur City, AP 515001',
      phone: '+91 99895 43210',
      rating: 4.6,
      reviewCount: 48,
      startingPrice: 35000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1200',
    },

    // --- INVITATION DESIGNERS ---
    {
      businessName: 'Right Choice Printers',
      slug: 'right-choice-printers-anantapur',
      categorySlug: 'invitation-designers',
      shortDescription: '4.9-star traditional & digital wedding invitations behind old ICICI Bank, Kamalanagar.',
      description: 'Right Choice Printers creates embossed Telugu wedding cards, modern laser-cut wedding stationery, metallic foil boxes, and custom WhatsApp video invitations.',
      address: '15-828, behind old ICICI Bank building, Kamalanagar, Anantapur, AP 515001',
      phone: '97015 54245',
      rating: 4.9,
      reviewCount: 87,
      startingPrice: 25,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Bhavani Offset Printers & Wedding Cards',
      slug: 'bhavani-offset-printers-anantapur',
      categorySlug: 'invitation-designers',
      shortDescription: 'Trusted offset printing & customized wedding invitation cards in Kamalanagar.',
      description: 'Bhavani Offset Printers offers an extensive catalog of traditional Hindu wedding cards, scroll invitations, silk finish boxes, and fast printing turnaround.',
      address: 'Kamalanagar, Anantapur, AP 515001',
      phone: '98491 15711',
      rating: 4.9,
      reviewCount: 21,
      startingPrice: 30,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Venkateswara Digital Printers & Wedding Cards',
      slug: 'venkateswara-digital-printers-anantapur',
      categorySlug: 'invitation-designers',
      shortDescription: 'Budget-friendly wedding cards & multi-color digital printing in Kamalanagar.',
      description: 'Venkateswara Digital Printers offers affordable custom invites, wedding welcome boards, flex prints, and invitation inserts tailored for every family budget.',
      address: 'Kamalanagar, Anantapur, AP 515001',
      phone: '97033 36116',
      rating: 4.3,
      reviewCount: 39,
      startingPrice: 20,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=1200',
    },

    // --- RETURN GIFTS ---
    {
      businessName: 'Roopali Gift Shoppe',
      slug: 'roopali-gift-shoppe-anantapur',
      categorySlug: 'return-gifts',
      shortDescription: 'Famous gift store with 850+ reviews opposite New Town Vegetable Market.',
      description: 'Roopali Gift Shoppe features extensive collections of wedding return gifts, brass pooja idols, silver-plated artifacts, dry fruit hampers, and luxury gift boxes on Subash Road.',
      address: '13/74, Subash Road, opposite New Town Vegetable Market, Kamalanagar, Anantapur, AP 515001',
      phone: '83280 36206',
      rating: 4.2,
      reviewCount: 853,
      startingPrice: 150,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Vasundhara Printed Gifts and Novelties',
      slug: 'vasundhara-printed-gifts-anantapur',
      categorySlug: 'return-gifts',
      shortDescription: 'Personalized wedding souvenirs, printed mementos & novelties in Ashok Nagar.',
      description: 'Vasundhara Printed Gifts offers customized return gifts including engraved wooden mementos, custom mugs, printed bags, and tailored family event tokens with over 370 reviews.',
      address: 'Ashok Nagar, Anantapur, AP 515001',
      phone: '90527 89765',
      rating: 4.6,
      reviewCount: 371,
      startingPrice: 120,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'The Gift City',
      slug: 'the-gift-city-anantapur',
      categorySlug: 'return-gifts',
      shortDescription: '4.9-star rated gift emporium in Women\'s Shopping Complex, Pilligundla, Anantapur.',
      description: 'The Gift City offers premium corporate and wedding return gift packaging, customized hampers, modern novelty items, and bulk discount packages for celebratory events.',
      address: 'Women\'s Shopping Complex, Bellary–Uravakonda–Anantapur Road, Ganesha Nagar/Pilligundla, Anantapur, AP 515004',
      phone: '81056 83568',
      rating: 4.9,
      reviewCount: 100,
      startingPrice: 200,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
    },

    // --- WEDDING CARS ---
    {
      businessName: 'G.K. Travels',
      slug: 'gk-travels-wedding-cars-anantapur',
      categorySlug: 'wedding-cars',
      shortDescription: '5.0-star luxury wedding cars & guest transport rentals in Kovur Nagar, Anantapur.',
      description: 'G.K. Travels provides decorated bridal cars, luxury BMW/Audi/Innova Crysta rentals, tempo travellers for wedding guests, and punctual chauffeur-driven service with 360+ five-star reviews.',
      address: '58-56, Kovur Nagar, Anantapur, AP 515004',
      phone: '99493 42799',
      rating: 5.0,
      reviewCount: 366,
      startingPrice: 6500,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
    },

    // --- DECORATORS ---
    {
      businessName: 'Balloons Adda Anantapur',
      slug: 'balloons-adda-anantapur',
      categorySlug: 'decorators',
      shortDescription: 'Creative balloon arches, backdrop decorations & party setups at Saptagiri Circle.',
      description: 'Balloons Adda Anantapur transforms birthdays, baby showers, engagements, and anniversary parties with organic balloon garlands, neon signage, and vibrant photo-booth backdrops.',
      address: 'Subash Road, Saptagiri Circle, Kamalanagar, Anantapur, AP 515001',
      phone: '+91 91218 55432',
      rating: 4.8,
      reviewCount: 78,
      startingPrice: 8500,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Krishna Floral & Mandap Decorators',
      slug: 'sri-krishna-decorators-anantapur',
      categorySlug: 'decorators',
      shortDescription: 'Bespoke Telugu mandap setups, royal entrance arches & fresh flower decorations.',
      description: 'Transforming wedding spaces with fresh flower mandaps, thematic entrance arches, hydraulic stages, and ambient lighting across Anantapur district.',
      address: 'RTC Bus Stand Road, Anantapur, AP 515001',
      phone: '+91 98492 23344',
      rating: 4.7,
      reviewCount: 38,
      startingPrice: 45000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    },
  ];

  for (const v of anantapurVendors) {
    const categoryId = categoryMap[v.categorySlug];
    if (!categoryId) {
      console.warn(`Category slug not found: ${v.categorySlug} for vendor ${v.businessName}`);
      continue;
    }

    const vendor = await prisma.vendor.upsert({
      where: { slug: v.slug },
      update: {
        businessName: v.businessName,
        categoryId,
        shortDescription: v.shortDescription,
        description: v.description,
        address: v.address,
        startingPrice: v.startingPrice,
        rating: v.rating,
        reviewCount: v.reviewCount,
        phone: v.phone,
        featured: v.featured,
        coverImage: v.coverImage,
        city: 'Anantapur',
        state: 'Andhra Pradesh',
        status: 'PUBLISHED',
      },
      create: {
        businessName: v.businessName,
        slug: v.slug,
        categoryId,
        shortDescription: v.shortDescription,
        description: v.description,
        address: v.address,
        startingPrice: v.startingPrice,
        rating: v.rating,
        reviewCount: v.reviewCount,
        phone: v.phone,
        email: `${v.slug.split('-')[0]}@thegatheringco.com`,
        verified: true,
        verifiedLevel: v.featured ? 'PREMIUM' : 'VERIFIED',
        featured: v.featured,
        status: 'PUBLISHED',
        coverImage: v.coverImage,
        city: 'Anantapur',
        state: 'Andhra Pradesh',
        locationId: anantapurLocation.id,
      },
    });

    // Check if packages exist
    const packageCount = await prisma.vendorPackage.count({ where: { vendorId: vendor.id } });
    if (packageCount === 0) {
      await prisma.vendorPackage.createMany({
        data: [
          {
            vendorId: vendor.id,
            name: 'Standard Package',
            description: 'Essential service package suitable for celebratory gatherings',
            price: v.startingPrice,
            duration: '1 Event / Day',
            sortOrder: 1,
          },
          {
            vendorId: vendor.id,
            name: 'Grand Wedding & Deluxe Package',
            description: 'Complete premium package with extended service coverage and bespoke arrangements',
            price: Math.round(v.startingPrice * 1.75),
            duration: '2 Days',
            sortOrder: 2,
          }
        ]
      });
    }

    // Check if reviews exist
    const reviewCount = await prisma.vendorReview.count({ where: { vendorId: vendor.id } });
    if (reviewCount === 0) {
      await prisma.vendorReview.create({
        data: {
          vendorId: vendor.id,
          reviewerName: 'Suresh Naidu',
          rating: v.rating >= 4.8 ? 5.0 : 4.5,
          reviewText: `Excellent service provided for our family celebration in Anantapur. Very professional and highly recommended!`,
          verifiedPurchase: true,
          status: 'APPROVED',
        }
      });
    }
  }

  console.log(`Successfully seeded ${anantapurVendors.length} real Anantapur vendors.`);

  // 6. Complete Real Kadapa Vendors Dataset (34 vendors)
  const kadapaVendors = [
    {
      businessName: 'DSR Paradise Function Hall',
      slug: 'dsr-paradise-function-hall-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Spacious AC function hall with lush banquet lawns near Tirupati Bypass Road.',
      description: 'DSR Paradise Function Hall in Bachchimpalle, Kadapa features centralized air conditioning, spacious dining areas, groom/bridal suites, and ample parking on Tirupati Bypass Road.',
      address: 'Bachchimpalle, near Tirupati Bypass Road, Kadapa, Andhra Pradesh 516003',
      phone: '+91 90145 47683',
      rating: 4.8,
      reviewCount: 312,
      startingPrice: 85000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Raja Rani Mahal',
      slug: 'raja-rani-mahal-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Grand traditional Telugu kalyana mandapam suitable for large wedding ceremonies.',
      description: 'Raja Rani Mahal is a prominent traditional kalyana mandapam on Trunk Road, Kadapa, featuring wide stage space, traditional pillars, and banquet dining for 800+ guests.',
      address: 'Trunk Road Area, Kadapa, Andhra Pradesh 516001',
      phone: '+91 94405 88991',
      rating: 4.6,
      reviewCount: 245,
      startingPrice: 75000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1545232979-fbf6c1e55639?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'K Square Convention',
      slug: 'k-square-convention-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Modern centralized AC convention centre with 1200+ seating capacity and ample parking.',
      description: 'K Square Convention offers modern architecture, central climate control, green rooms, state-of-the-art acoustics, and grand dining halls on Airport Bypass Road.',
      address: 'Airport Bypass Road, Kadapa, Andhra Pradesh 516003',
      phone: '+91 98854 62110',
      rating: 4.7,
      reviewCount: 189,
      startingPrice: 110000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Vasavi Function Hall',
      slug: 'sri-vasavi-function-hall-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Convenient central function hall for engagements, thread ceremonies and family rituals.',
      description: 'Located in Old Town near Kanyaka Parameswari Temple, Sri Vasavi Function Hall is ideal for sacred family rituals, engagements, and cultural gatherings.',
      address: 'Old Town, near Kanyaka Parameswari Temple, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98492 78314',
      rating: 4.5,
      reviewCount: 160,
      startingPrice: 55000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sai Brindavan Gardens',
      slug: 'sai-brindavan-gardens-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Lush open-air party gardens and covered banquet hall for reception evenings.',
      description: 'Sai Brindavan Gardens on RIMS Road provides an open lawn setup combined with an elegant covered banquet hall for evening wedding receptions and birthday parties.',
      address: 'RIMS Road, Putlampalli, Kadapa, Andhra Pradesh 516002',
      phone: '+91 99890 41235',
      rating: 4.7,
      reviewCount: 220,
      startingPrice: 95000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'NSR Function Hall',
      slug: 'nsr-function-hall-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Well-connected celebration hall with dedicated dining floor on Madras Road.',
      description: 'NSR Function Hall near RTC Workshop offers dual-level halls with dedicated food service area, stage lighting, and convenient transit links.',
      address: 'Madras Road, near RTC Workshop, Kadapa, Andhra Pradesh 516002',
      phone: '+91 94901 23419',
      rating: 4.4,
      reviewCount: 142,
      startingPrice: 65000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Antara Function Hall',
      slug: 'antara-function-hall-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Centrally located boutique banquet hall for intimate weddings and receptions.',
      description: 'Antara Function Hall near Seven Roads Circle features cozy air-conditioned interiors, crystal chandeliers, and curated decor for boutique celebrations.',
      address: 'Seven Roads Circle Area, Kadapa, Andhra Pradesh 516001',
      phone: '+91 97011 55620',
      rating: 4.6,
      reviewCount: 178,
      startingPrice: 70000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Venkateswara AC Kalyana Mandapam',
      slug: 'sri-venkateswara-ac-kalyana-mandapam-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Fully air-conditioned kalyana mandapam with traditional arch decor and spacious dining.',
      description: 'Situated on Trunk Road near Seven Roads Circle, this hall is one of Kadapa’s most trusted traditional marriage venues with full backup power and AC comfort.',
      address: 'Trunk Road, near Seven Roads Circle, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98853 21098',
      rating: 4.7,
      reviewCount: 310,
      startingPrice: 80000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1545232979-fbf6c1e55639?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Tirumala Function Hall',
      slug: 'sri-tirumala-function-hall-kadapa',
      categorySlug: 'venues',
      shortDescription: 'Popular community wedding hall near Bugga Leti Gangamma Temple with budget packages.',
      description: 'Sri Tirumala Function Hall on Madras Road offers budget-friendly wedding packages, ample green rooms, and traditional dining arrangements.',
      address: 'Madras Road, near Bugga Leti Gangamma Temple, Kadapa, Andhra Pradesh 516002',
      phone: '+91 94408 76543',
      rating: 4.5,
      reviewCount: 195,
      startingPrice: 60000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=1200',
    },
    // Photographers
    {
      businessName: 'A.L Studios',
      slug: 'al-studios-kadapa',
      categorySlug: 'photographers',
      shortDescription: 'Candid wedding photography, cinematic 4K video teasers & drone captures in Nagarajupeta.',
      description: 'A.L Studios in Nagarajupeta is renowned for heartfelt candid photography, premium matte photobooks, and cinematic wedding films across Kadapa.',
      address: '2nd floor, 2/697, opposite Dr Dinesh Hospitals, Maria Puram, Nagarajupeta, Kadapa, Andhra Pradesh 516001',
      phone: '+91 91828 51698',
      rating: 4.9,
      reviewCount: 215,
      startingPrice: 45000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Smart Photography Kadapa',
      slug: 'smart-photography-kadapa',
      categorySlug: 'photographers',
      shortDescription: 'Experienced event photographers specializing in pre-wedding couple shoots and traditional coverage.',
      description: 'Smart Photography Kadapa near Old Bus Stand provides multi-camera live switching, drone coverage, and prompt album delivery.',
      address: 'Trunk Road, near Old Bus Stand, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98490 61122',
      rating: 4.6,
      reviewCount: 140,
      startingPrice: 35000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Studio Photography',
      slug: 'sri-studio-photography-kadapa',
      categorySlug: 'photographers',
      shortDescription: 'Established studio near Seven Roads Circle known for premium glossy wedding albums.',
      description: 'With over 15 years in Kadapa, Sri Studio captures timeless traditional wedding moments and family portraits with high color fidelity.',
      address: 'RS Road, near Seven Roads Circle, Kadapa, Andhra Pradesh 516001',
      phone: '+91 94401 77234',
      rating: 4.7,
      reviewCount: 185,
      startingPrice: 40000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'VK Digital Photography',
      slug: 'vk-digital-photography-kadapa',
      categorySlug: 'photographers',
      shortDescription: 'Contemporary candid captures, live LED wall broadcasting & teaser reel edits.',
      description: 'VK Digital Photography on Nagarajupeta Main Road specializes in modern candid frames, Instagram reels, and 4K wedding highlight videos.',
      address: 'Nagarajupeta Main Road, Kadapa, Andhra Pradesh 516001',
      phone: '+91 97033 89012',
      rating: 4.8,
      reviewCount: 164,
      startingPrice: 38000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=1200',
    },
    // Decorators
    {
      businessName: 'Krish Events & Decor',
      slug: 'krish-events-kadapa',
      categorySlug: 'decorators',
      shortDescription: 'Grand floral mandaps, theme receptions, LED backdrops & designer wedding stages.',
      description: 'Krish Events brings bespoke aesthetic concepts to life with fresh exotic flowers, brass bells, illuminated stage walkways, and royal Telugu mandaps.',
      address: 'Chinna Chowk Main Road, Kadapa, Andhra Pradesh 516002',
      phone: '+91 98856 12399',
      rating: 4.8,
      reviewCount: 130,
      startingPrice: 50000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Sai Flower Decorations',
      slug: 'sri-sai-flower-decorations-kadapa',
      categorySlug: 'decorators',
      shortDescription: 'Fresh jasmine, rose & marigold mandap floral styling and grand entrance arches.',
      description: 'Opposite the Municipal Office on Trunk Road, Sri Sai Flower Decorations specializes in fresh garland styling, pellipandiri decor, and floral photo booths.',
      address: '7/451, Trunk Road, opposite Municipal Office, Kadapa, Andhra Pradesh 516001',
      phone: '+91 94405 12890',
      rating: 4.7,
      reviewCount: 175,
      startingPrice: 30000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Venkateswara Flower Decorators',
      slug: 'sri-venkateswara-flower-decorators-kadapa',
      categorySlug: 'decorators',
      shortDescription: 'Traditional South Indian wedding floral work, car decoration & reception styling.',
      description: 'Sri Venkateswara Flower Decorators on Madras Road provides complete floral styling from bride car decoration to temple stage backdrops.',
      address: 'D.No. 6/122, Madras Road, near RTC Bus Stand, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98852 31456',
      rating: 4.6,
      reviewCount: 112,
      startingPrice: 28000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Kandula Wedding and Function Decorators',
      slug: 'kandula-wedding-decorators-kadapa',
      categorySlug: 'decorators',
      shortDescription: 'Custom theme setups, pastel balloon decor & traditional Telugu wedding stages.',
      description: 'Kandula Wedding Decorators delivers modern fairy-light canopies, pastel balloon arches, and themed cradle ceremony setups in Ravindra Nagar.',
      address: 'Ravindra Nagar, Kadapa, Andhra Pradesh 516003',
      phone: '+91 94902 44556',
      rating: 4.5,
      reviewCount: 98,
      startingPrice: 42000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    },
    // Planners
    {
      businessName: 'Smiley Events',
      slug: 'smiley-events-kadapa',
      categorySlug: 'event-planners',
      shortDescription: 'End-to-end wedding management, hospitality coordination & stage setups in Chinna Chowku.',
      description: 'Smiley Events manages full-scale celebrations across Rayalaseema including guest hospitality, artist booking, transport coordination, and ritual schedules.',
      address: '42/1201-1, beside 7th Heaven upstairs, Murthunjaya Kunta, Chinna Chowku, Kadapa, Andhra Pradesh 516001',
      phone: '+91 63009 22738',
      rating: 4.9,
      reviewCount: 165,
      startingPrice: 50000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'S M Events',
      slug: 'sm-events-kadapa',
      categorySlug: 'event-planners',
      shortDescription: 'Professional event coordination, entertainment management & guest logistics in Co-operative Colony.',
      description: 'S M Events provides complete on-ground coordination, emcees, wedding entertainment, and vendor synchronization in Co-operative Colony, Kadapa.',
      address: 'Door No. 20/976, Police Line, Co-operative Colony, Kadapa, Andhra Pradesh 516001',
      phone: '+91 83418 34130',
      rating: 4.8,
      reviewCount: 128,
      startingPrice: 45000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Ramana Marriage Events',
      slug: 'ramana-marriage-events-kadapa',
      categorySlug: 'event-planners',
      shortDescription: 'Traditional Telugu wedding coordination from muhurtham planning to reception management.',
      description: 'Ramana Marriage Events guides families through all ritual requirements, purohit coordination, and catering logistics in Chinna Chowk.',
      address: 'Second floor, Chinna Chowk, Kadapa, Andhra Pradesh 516002',
      phone: '+91 98495 33412',
      rating: 4.6,
      reviewCount: 94,
      startingPrice: 40000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Perfect Events',
      slug: 'perfect-events-kadapa',
      categorySlug: 'event-planners',
      shortDescription: 'Birthday parties, engagement ceremonies & family gathering event planning in Ravindra Nagar.',
      description: 'Perfect Events in Ravindra Nagar creates hassle-free milestones, surprise parties, half-saree functions, and anniversary celebrations.',
      address: '8/135, 3rd Street, Ravindra Nagar, Kadapa, Andhra Pradesh 516003',
      phone: '+91 97002 91122',
      rating: 4.5,
      reviewCount: 82,
      startingPrice: 35000,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80&w=1200',
    },
    // Caterers
    {
      businessName: 'Sri Balaji Caterers',
      slug: 'sri-balaji-caterers-kadapa',
      categorySlug: 'caterers',
      shortDescription: 'Authentic Rayalaseema vegetarian wedding feasts, traditional sweets & live snack stalls.',
      description: 'Sri Balaji Caterers is famous across Kadapa for hot pootharekulu, obbattu, rich gutti vankaya curry, and hygienic banana-leaf meal service.',
      address: 'RS Road, near Railway Station, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98491 88720',
      rating: 4.9,
      reviewCount: 280,
      startingPrice: 320,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Lakshmi Caterers & Event Rentals',
      slug: 'sri-lakshmi-caterers-kadapa',
      categorySlug: 'caterers',
      shortDescription: 'Complete catering with luxury tableware, shamiana rentals and authentic multi-course meals.',
      description: 'Sri Lakshmi Caterers on Christian Lane provides both gourmet catering menus and high-end event crockery, chafing dishes, and dining furniture.',
      address: 'Christian Lane, Kadapa, Andhra Pradesh 516001',
      phone: '+91 94403 66521',
      rating: 4.7,
      reviewCount: 165,
      startingPrice: 350,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Satish Caterers',
      slug: 'satish-caterers-kadapa',
      categorySlug: 'caterers',
      shortDescription: 'Specialists in Rayalaseema ragi mudda feasts, non-veg delicacies & wedding catering.',
      description: 'Satish Caterers serves delicious Rayalaseema mutton biryani, natu kodi pulusu, ragi sangati, and multi-cuisine spreads with impeccable hospitality.',
      address: 'Masapet Circle / Sankarapuram–Chinna Chowk area, Kadapa, Andhra Pradesh 516002',
      phone: '+91 99892 45110',
      rating: 4.8,
      reviewCount: 198,
      startingPrice: 300,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Royal Party Rentals & Catering',
      slug: 'royal-party-rentals-catering-kadapa',
      categorySlug: 'caterers',
      shortDescription: 'Grand buffet presentations, live chaat counters & wedding culinary management.',
      description: 'Royal Party Rentals on Madras Road offers live tandoori, North Indian curries, South Indian sweets, and complete waitstaff service.',
      address: '6/210, Madras Road, near APSEB Office, Kadapa, Andhra Pradesh 516001',
      phone: '+91 94402 12345',
      rating: 4.6,
      reviewCount: 140,
      startingPrice: 380,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200',
    },
    // Makeup
    {
      businessName: 'Naari Makeovers Kadapa',
      slug: 'naari-makeovers-kadapa',
      categorySlug: 'makeup-artists',
      shortDescription: 'High-definition bridal makeup, airbrush makeup, muhurtham hair styling & saree draping near Zudio.',
      description: 'Naari Makeovers in Chinna Chowku near Zudio is Kadapa’s premier bridal beauty studio, offering international cosmetics, HD bridal looks, and doorstep on-location wedding prep.',
      address: '1st Floor, Y Junction, 42/347-141, above Apollo Pharmacy, near Zudio, Chinna Chowku, Kadapa, Andhra Pradesh 516001',
      phone: '+91 80089 90798',
      rating: 4.9,
      reviewCount: 320,
      startingPrice: 15000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200',
    },
    // Mehendi
    {
      businessName: 'Ajay Mehandi Tattoo Arts',
      slug: 'ajay-mehandi-tattoo-arts-kadapa',
      categorySlug: 'mehendi-artists',
      shortDescription: 'Intricate bridal marwadi & arabic mehendi designs, organic dark stain cones & guest packages.',
      description: 'Ajay Mehandi at Mangalya Shopping Mall creates detailed bridal portrait mehendi, figure work, lotus motifs, and fast guest application.',
      address: 'Mangalya Shopping Mall, New Bus Stop, SLB Enclave, Y.S. Nagar, Chinna Chowku, Kadapa, Andhra Pradesh 516001',
      phone: '+91 89559 01321',
      rating: 4.9,
      reviewCount: 260,
      startingPrice: 4500,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&q=80&w=1200',
    },
    // DJ
    {
      businessName: 'SKB Audios & DJ',
      slug: 'skb-audios-kadapa',
      categorySlug: 'djs',
      shortDescription: 'Professional concert audio, line array speakers, LED dance floors & high-energy DJ setups.',
      description: 'SKB Audios in Ganagapeta powers sangeet nights, baraat processions, and college fests with thumping bass, intelligent stage lighting, and professional DJs.',
      address: 'Ganagapeta, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98493 54321',
      rating: 4.7,
      reviewCount: 110,
      startingPrice: 15000,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=1200',
    },
    // Invitations
    {
      businessName: 'Balaji Cards Center',
      slug: 'balaji-cards-center-kadapa',
      categorySlug: 'invitation-designers',
      shortDescription: 'Extensive collection of traditional Telugu wedding cards, boxed invites & scroll cards.',
      description: 'Balaji Cards Center opposite Old Bus Stand has over 1000 invitation varieties with personalized Telugu script printing and fast delivery.',
      address: '1/410, RS Road, opposite Old Bus Stand, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98851 43210',
      rating: 4.8,
      reviewCount: 185,
      startingPrice: 35,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Royal Cards & Printers',
      slug: 'royal-cards-printers-kadapa',
      categorySlug: 'invitation-designers',
      shortDescription: 'Laser cut wedding invitations, metallic foil stamping & customized digital invite videos.',
      description: 'Royal Cards & Printers in Nagarajupeta crafts luxury velvet boxes, acrylic cards, and WhatsApp video invitations.',
      address: '4/230, Nagarajupeta, Kadapa, Andhra Pradesh 516001',
      phone: '+91 94401 87654',
      rating: 4.7,
      reviewCount: 142,
      startingPrice: 40,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Sri Srinivasa Wedding Cards',
      slug: 'sri-srinivasa-wedding-cards-kadapa',
      categorySlug: 'invitation-designers',
      shortDescription: 'Budget to luxury Telugu wedding cards with rapid printing near Seven Roads Circle.',
      description: 'Conveniently located on Trunk Road, Sri Srinivasa Wedding Cards provides high-speed offset and screen printing for all event invitations.',
      address: '7/120, Trunk Road, near Seven Roads Circle, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98491 23890',
      rating: 4.6,
      reviewCount: 160,
      startingPrice: 25,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1200',
    },
    {
      businessName: 'Marvelous Printers',
      slug: 'marvelous-printers-kadapa',
      categorySlug: 'invitation-designers',
      shortDescription: 'Modern digital invitation cards, QR code wedding passes & personalized event stationery.',
      description: 'Marvelous Printers in Yerramukkapalli produces bespoke digital cards, wedding luggage tags, and customized welcome signboards.',
      address: 'Yerramukkapalli, Kadapa, Andhra Pradesh 516004',
      phone: '+91 79891 34235',
      rating: 4.8,
      reviewCount: 95,
      startingPrice: 30,
      featured: false,
      coverImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=1200',
    },
    // Wedding Cars
    {
      businessName: 'SMC Car Rentals Kadapa',
      slug: 'smc-car-rentals-kadapa',
      categorySlug: 'wedding-cars',
      shortDescription: 'Luxury decorated bride & groom cars (Audi, BMW, Fortuner, Innova Crysta) with courteous chauffeurs.',
      description: 'SMC Car Rentals in Chinna Chowk provides premium sanitized fleet vehicles with floral hood styling for groom arrivals and guest convoys.',
      address: '42/347-21, Simhapuri Colony, Chinna Chauku, Kadapa, Andhra Pradesh 516001',
      phone: '+91 98850 46589',
      rating: 4.9,
      reviewCount: 135,
      startingPrice: 6500,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
    },
    // Return Gifts
    {
      businessName: 'NS Gifts & Favors',
      slug: 'ns-gifts-kadapa',
      categorySlug: 'return-gifts',
      shortDescription: 'Personalized wedding return gifts, brass pooja hampers, dry fruit boxes & customized favors.',
      description: 'NS Gifts in Ganagapeta specializes in bulk return gifting for marriages, seemantham, and housewarmings with custom laser engraved name tags.',
      address: 'Back side, 12/430-1, Rahamathullah Street, YV Street, Ganagapeta, Kadapa, Andhra Pradesh 516001',
      phone: '+91 90001 44475',
      rating: 4.8,
      reviewCount: 170,
      startingPrice: 120,
      featured: true,
      coverImage: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&q=80&w=1200',
    },
  ];

  for (const v of kadapaVendors) {
    const categoryId = categoryMap[v.categorySlug];
    if (!categoryId) {
      console.warn(`Category slug not found: ${v.categorySlug} for vendor ${v.businessName}`);
      continue;
    }

    const vendor = await prisma.vendor.upsert({
      where: { slug: v.slug },
      update: {
        businessName: v.businessName,
        categoryId,
        shortDescription: v.shortDescription,
        description: v.description,
        address: v.address,
        startingPrice: v.startingPrice,
        rating: v.rating,
        reviewCount: v.reviewCount,
        phone: v.phone,
        featured: v.featured,
        coverImage: v.coverImage,
        city: 'Kadapa',
        state: 'Andhra Pradesh',
        status: 'PUBLISHED',
      },
      create: {
        businessName: v.businessName,
        slug: v.slug,
        categoryId,
        shortDescription: v.shortDescription,
        description: v.description,
        address: v.address,
        startingPrice: v.startingPrice,
        rating: v.rating,
        reviewCount: v.reviewCount,
        phone: v.phone,
        email: `${v.slug.split('-')[0]}@thegatheringco.com`,
        verified: true,
        verifiedLevel: v.featured ? 'PREMIUM' : 'VERIFIED',
        featured: v.featured,
        status: 'PUBLISHED',
        coverImage: v.coverImage,
        city: 'Kadapa',
        state: 'Andhra Pradesh',
        locationId: kadapaLocation.id,
      },
    });

    const packageCount = await prisma.vendorPackage.count({ where: { vendorId: vendor.id } });
    if (packageCount === 0) {
      await prisma.vendorPackage.createMany({
        data: [
          {
            vendorId: vendor.id,
            name: 'Standard Package',
            description: 'Essential service package suitable for celebratory gatherings in Kadapa',
            price: v.startingPrice,
            duration: '1 Event / Day',
            sortOrder: 1,
          },
          {
            vendorId: vendor.id,
            name: 'Grand Celebration Package',
            description: 'Complete premium package with extended service coverage and bespoke arrangements',
            price: Math.round(v.startingPrice * 1.75),
            duration: '2 Days',
            sortOrder: 2,
          },
        ],
      });
    }

    const reviewCount = await prisma.vendorReview.count({ where: { vendorId: vendor.id } });
    if (reviewCount === 0) {
      await prisma.vendorReview.create({
        data: {
          vendorId: vendor.id,
          reviewerName: 'Venkata Reddy',
          rating: v.rating >= 4.8 ? 5.0 : 4.5,
          reviewText: `Outstanding service provided for our wedding celebration in Kadapa. Very punctual and great quality!`,
          verifiedPurchase: true,
          status: 'APPROVED',
        },
      });
    }
  }

  console.log(`Successfully seeded ${kadapaVendors.length} real Kadapa vendors.`);
  console.log('Database seeding complete!');

  // Sync with apps/api/prisma/dev.db and apps/api/src/seed-base64.ts
  const apiDbPath = path.resolve(__dirname, '../../../apps/api/prisma/dev.db');
  const apiSeedB64Path = path.resolve(__dirname, '../../../apps/api/src/seed-base64.ts');

  try {
    fs.copyFileSync(dbPath, apiDbPath);
    console.log(`Copied seeded database to ${apiDbPath}`);

    const dbBytes = fs.readFileSync(dbPath);
    const b64 = dbBytes.toString('base64');
    fs.writeFileSync(apiSeedB64Path, `export const SEED_DB_BASE64 = "${b64}";\n`);
    console.log(`Updated seed-base64.ts with length: ${b64.length}`);
  } catch (err) {
    console.warn('Note: Could not sync with apps/api:', err);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
