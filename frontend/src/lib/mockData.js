// ============================================================================
// GALERIE — Mock Data Layer
// Single source of placeholder data. Easy to remove once a real API is wired.
// All prices in ₹. Realistic Indian marketplace catalog (not art-only).
// All image URLs verified to resolve (200) on images.unsplash.com.
// ============================================================================

export const CATEGORIES = [
  { id: "smartphones", name: "Smartphones", parent: "Electronics", min: 8000, max: 160000 },
  { id: "laptops", name: "Laptops", parent: "Electronics", min: 25000, max: 250000 },
  { id: "audio", name: "Audio", parent: "Electronics", min: 999, max: 30000 },
  { id: "wearables", name: "Wearables", parent: "Electronics", min: 2000, max: 60000 },
  { id: "accessories", name: "Accessories", parent: "Electronics", min: 299, max: 60000 },
  { id: "clothing", name: "Clothing", parent: "Fashion", min: 299, max: 9999 },
  { id: "footwear", name: "Footwear", parent: "Fashion", min: 499, max: 14999 },
  { id: "home-kitchen", name: "Home & Kitchen", parent: "Home", min: 199, max: 60000 },
  { id: "beauty", name: "Beauty & Personal Care", parent: "Beauty", min: 149, max: 5000 },
  { id: "art-decor", name: "Art & Decor", parent: "Art", min: 399, max: 25000 },
];

export const VENDORS = [
  { id: "v1", name: "Nova Electronics", studio: "Nova Electronics", city: "Bengaluru", rating: 4.8, trust: 94, joined: "2023-03", logo: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80" },
  { id: "v2", name: "Atelier Mode", studio: "Atelier Mode", city: "Mumbai", rating: 4.6, trust: 88, joined: "2023-07", logo: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80" },
  { id: "v3", name: "Sonic Lab", studio: "Sonic Lab", city: "Delhi", rating: 4.7, trust: 91, joined: "2022-11", logo: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=200&q=80" },
  { id: "v4", name: "Maison Living", studio: "Maison Living", city: "Pune", rating: 4.5, trust: 85, joined: "2024-01", logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80" },
  { id: "v5", name: "Glow Beauty Co.", studio: "Glow Beauty Co.", city: "Hyderabad", rating: 4.4, trust: 82, joined: "2024-05", logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&q=80" },
  { id: "v6", name: "Canvas & Frame", studio: "Canvas & Frame", city: "Jaipur", rating: 4.9, trust: 96, joined: "2022-06", logo: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200&q=80" },
];

const img = (id) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

const PHONE1 = "photo-1592750475338-74b7b21085ab";
const PHONE2 = "photo-1553062407-98eeb64c6a62";
const PHONE3 = "photo-1511707171634-5f897ff02aa9";
const MAC = "photo-1517336714731-489689fd1ca8";
const LAPTOP = "photo-1496181133206-80ce9b88a853";
const EARBUDS = "photo-1606220588913-b3aacb4d2f46";
const HEADPHONES1 = "photo-1505740420928-5e560c06d30e";
const HEADPHONES2 = "photo-1487215078519-e21cc028cb29";
const GALBUDS = "photo-1590658268037-6bf12165a8df";
const WATCH1 = "photo-1546868871-7041f2a55e12";
const WATCH2 = "photo-1523275335684-37898b6baf30";
const MOUSE = "photo-1527864550417-7fd91fc51a46";
const TEE = "photo-1521572163474-6864f9cf17ab";
const JEANS = "photo-1542272604-787c3835535d";
const OVERCOAT = "photo-1591047139829-d91aecb6caea";
const SNEAKERS = "photo-1542291026-7eec264c27ff";
const BOOTS = "photo-1605812860427-4024433a70fd";
const BEAUTY = "photo-1556228720-195a672e8a03";
const LAMP = "photo-1507473885765-e6ed057f782c";
const ART = "photo-1546435770-a3e426bf472b";
const KITCHEN = "photo-1558618666-fcd25c85cd64";

export const PRODUCTS = [
  { id: "p1", name: "iPhone 15 (128GB)", category: "smartphones", vendor: "v1", price: 69900, mrp: 79900, stock: 42, rating: 4.7, reviews: 1284, image: img(PHONE1), desc: "Dynamic Island, A16 Bionic, 48MP main camera. The everyday icon, reimagined.", tags: ["featured","trending"] },
  { id: "p2", name: "Samsung Galaxy S24 Ultra", category: "smartphones", vendor: "v1", price: 124999, mrp: 139999, stock: 18, rating: 4.6, reviews: 642, image: img(PHONE2), desc: "Galaxy AI, 200MP camera, titanium frame. Built for the next decade.", tags: ["featured"] },
  { id: "p3", name: "OnePlus 12R", category: "smartphones", vendor: "v1", price: 39999, mrp: 45999, stock: 65, rating: 4.5, reviews: 510, image: img(PHONE3), desc: "Snapdragon 8 Gen 3, 100W charging, ProXDR display.", tags: ["trending"] },
  { id: "p4", name: "Redmi Note 13 Pro", category: "smartphones", vendor: "v1", price: 22999, mrp: 25999, stock: 120, rating: 4.3, reviews: 2310, image: img(PHONE1), desc: "200MP camera, 120Hz AMOLED, value flagship killer.", tags: [] },
  { id: "p5", name: "MacBook Air M2", category: "laptops", vendor: "v1", price: 99900, mrp: 114900, stock: 24, rating: 4.8, reviews: 890, image: img(MAC), desc: "M2 chip, 18-hour battery, silent fanless design. Featherlight.", tags: ["featured","trending"] },
  { id: "p6", name: "Lenovo IdeaPad Slim 3", category: "laptops", vendor: "v1", price: 42990, mrp: 52990, stock: 38, rating: 4.2, reviews: 412, image: img(LAPTOP), desc: "Intel Core i5, 16GB RAM, 512GB SSD. Workhorse for everyday.", tags: [] },
  { id: "p7", name: "ASUS ROG Strix G16", category: "laptops", vendor: "v1", price: 149990, mrp: 169990, stock: 9, rating: 4.6, reviews: 188, image: img(LAPTOP), desc: "RTX 4070, 240Hz, RGB keyboard. Built for the arena.", tags: ["trending"] },
  { id: "p8", name: "Sony WH-1000XM5", category: "audio", vendor: "v3", price: 29990, mrp: 34990, stock: 31, rating: 4.8, reviews: 1540, image: img(HEADPHONES1), desc: "Industry-leading noise cancellation. Silence, refined.", tags: ["featured","trending"] },
  { id: "p9", name: "boAt Airdopes 141", category: "audio", vendor: "v3", price: 1299, mrp: 2990, stock: 320, rating: 4.1, reviews: 8800, image: img(EARBUDS), desc: "42-hour playback, ENx tech. Sound for the streets.", tags: ["trending"] },
  { id: "p10", name: "JBL Flip 6 Speaker", category: "audio", vendor: "v3", price: 7999, mrp: 9999, stock: 76, rating: 4.6, reviews: 2100, image: img(HEADPHONES2), desc: "Waterproof, bold bass, 12 hours of play. Take it anywhere.", tags: [] },
  { id: "p11", name: "Apple Watch Series 9", category: "wearables", vendor: "v1", price: 41900, mrp: 45900, stock: 27, rating: 4.7, reviews: 690, image: img(WATCH1), desc: "Double-tap gesture, S9 chip, brightest Apple display yet.", tags: ["featured"] },
  { id: "p12", name: "Noise ColorFit Pro 5", category: "wearables", vendor: "v3", price: 3499, mrp: 6999, stock: 210, rating: 4.0, reviews: 3200, image: img(WATCH2), desc: "1.85\" AMOLED, BT calling, 7-day battery. Smart, accessible.", tags: [] },
  { id: "p13", name: "Apple USB-C Charger 20W", category: "accessories", vendor: "v1", price: 1900, mrp: 2100, stock: 540, rating: 4.5, reviews: 4100, image: img(EARBUDS), desc: "Fast, safe, compact. The essential power companion.", tags: [] },
  { id: "p14", name: "Logitech MX Master 3S", category: "accessories", vendor: "v3", price: 8999, mrp: 11995, stock: 44, rating: 4.8, reviews: 920, image: img(MOUSE), desc: "Quiet clicks, 8K DPI, multi-device flow. The pro's pointer.", tags: ["trending"] },
  { id: "p15", name: "Premium Cotton Tee — Obsidian", category: "clothing", vendor: "v2", price: 899, mrp: 1499, stock: 480, rating: 4.4, reviews: 1200, image: img(TEE), desc: "240gsm combed cotton, relaxed fit. A wardrobe foundation.", tags: ["trending"] },
  { id: "p16", name: "Selvedge Denim Jeans — Indigo", category: "clothing", vendor: "v2", price: 2999, mrp: 4999, stock: 130, rating: 4.5, reviews: 640, image: img(JEANS), desc: "Japanese selvedge, raw denim. Ages beautifully with you.", tags: ["featured"] },
  { id: "p17", name: "Wool-blend Overcoat — Charcoal", category: "clothing", vendor: "v2", price: 6999, mrp: 9999, stock: 38, rating: 4.6, reviews: 210, image: img(OVERCOAT), desc: "Tailored silhouette, structured shoulders. Winter authority.", tags: [] },
  { id: "p18", name: "Runner Pro Sneakers — White", category: "footwear", vendor: "v2", price: 4499, mrp: 6999, stock: 95, rating: 4.5, reviews: 880, image: img(SNEAKERS), desc: "Energy-return foam, breathable knit. Mile after mile.", tags: ["featured","trending"] },
  { id: "p19", name: "Leather Chelsea Boots — Tan", category: "footwear", vendor: "v2", price: 8999, mrp: 12999, stock: 42, rating: 4.7, reviews: 320, image: img(BOOTS), desc: "Full-grain leather, Goodyear-welted. Built to last decades.", tags: [] },
  { id: "p20", name: "Cast Iron Dutch Oven 5L", category: "home-kitchen", vendor: "v4", price: 3499, mrp: 5999, stock: 60, rating: 4.6, reviews: 540, image: img(KITCHEN), desc: "Enamelled, oven-to-table. Heirloom cookware for slow food.", tags: ["trending"] },
  { id: "p21", name: "Aroma Diffuser & Mood Lamp", category: "home-kitchen", vendor: "v4", price: 1799, mrp: 2999, stock: 150, rating: 4.3, reviews: 980, image: img(LAMP), desc: "Ultrasonic mist, 7-colour ambient light. Set the atmosphere.", tags: [] },
  { id: "p22", name: "Stainless Steel Cookware Set (7)", category: "home-kitchen", vendor: "v4", price: 8999, mrp: 14999, stock: 28, rating: 4.5, reviews: 360, image: img(KITCHEN), desc: "Tri-ply, induction-ready. The complete kitchen arsenal.", tags: [] },
  { id: "p23", name: "Vitamin C Brightening Serum", category: "beauty", vendor: "v5", price: 749, mrp: 1299, stock: 260, rating: 4.2, reviews: 4100, image: img(BEAUTY), desc: "10% vitamin C, hyaluronic. Glow that shows in a week.", tags: ["trending"] },
  { id: "p24", name: "Hydra-Glow Moisturizer", category: "beauty", vendor: "v5", price: 599, mrp: 999, stock: 180, rating: 4.3, reviews: 2600, image: img(BEAUTY), desc: "Ceramide + niacinamide. 48-hour hydration, no greasy feel.", tags: [] },
  { id: "p25", name: "Matte Liquid Lipstick Set", category: "beauty", vendor: "v5", price: 899, mrp: 1799, stock: 220, rating: 4.1, reviews: 1900, image: img(BEAUTY), desc: "6 nude shades, transfer-proof. All-day wear, zero compromise.", tags: [] },
  { id: "p26", name: "Starry Night — Framed Print", category: "art-decor", vendor: "v6", price: 4999, mrp: 7999, stock: 35, rating: 4.9, reviews: 420, image: img(ART), desc: "Museum-grade giclée, oak frame. Van Gogh, immortalized.", tags: ["featured"] },
  { id: "p27", name: "Abstract Indigo Canvas 36\"", category: "art-decor", vendor: "v6", price: 8999, mrp: 14999, stock: 14, rating: 4.8, reviews: 160, image: img(ART), desc: "Hand-stretched, original composition. A statement wall.", tags: ["trending"] },
  { id: "p28", name: "Brass Sculptural Table Lamp", category: "art-decor", vendor: "v6", price: 6499, mrp: 9999, stock: 22, rating: 4.7, reviews: 240, image: img(LAMP), desc: "Warm dimmable glow, solid brass. Light as sculpture.", tags: ["featured"] },
  { id: "p29", name: "Minimalist Ceramic Vase", category: "art-decor", vendor: "v6", price: 1299, mrp: 2299, stock: 88, rating: 4.6, reviews: 510, image: img(ART), desc: "Matte glaze, sculptural form. Quiet elegance for any shelf.", tags: [] },
  { id: "p30", name: "Galaxy Buds2 Pro", category: "audio", vendor: "v3", price: 17999, mrp: 22999, stock: 7, rating: 4.5, reviews: 720, image: img(GALBUDS), desc: "24-bit hi-fi audio, intelligent ANC. Pocket-sized concert.", tags: ["trending"] },
];

// ---- Reviews (mock) ----
export const REVIEWS = [
  { id: "r1", product: "p1", vendor: "v1", author: "Aarav S.", rating: 5, verified: true, date: "2026-09-12", body: "Camera is unreal and battery lasts a full day. Worth every rupee.", helpful: 42, status: "normal", signals: { accountAgeDays: 540, textSimilarity: 0.1, burst: false } },
  { id: "r2", product: "p1", vendor: "v1", author: "Anonymous", rating: 5, verified: false, date: "2026-09-25", body: "amazing amazing amazing best product ever must buy now!!!", helpful: 0, status: "flagged", signals: { accountAgeDays: 2, textSimilarity: 0.92, burst: true } },
  { id: "r3", product: "p8", vendor: "v3", author: "Meera K.", rating: 5, verified: true, date: "2026-09-18", body: "Noise cancellation is witchcraft. I forget the world exists on flights.", helpful: 88, status: "normal", signals: { accountAgeDays: 810, textSimilarity: 0.05, burst: false } },
  { id: "r4", product: "p8", vendor: "v3", author: "Rohit P.", rating: 4, verified: true, date: "2026-09-20", body: "Great sound, slightly tight on ears first week. Loosens up.", helpful: 21, status: "needs_review", signals: { accountAgeDays: 320, textSimilarity: 0.2, burst: false } },
  { id: "r5", product: "p16", vendor: "v2", author: "Diya M.", rating: 5, verified: true, date: "2026-09-22", body: "Denim breaks in beautifully. Stitching is impeccable.", helpful: 34, status: "normal", signals: { accountAgeDays: 690, textSimilarity: 0.08, burst: false } },
  { id: "r6", product: "p23", vendor: "v5", author: "Sneha R.", rating: 5, verified: false, date: "2026-09-28", body: "best serum best serum best serum", helpful: 0, status: "flagged", signals: { accountAgeDays: 1, textSimilarity: 0.97, burst: true } },
  { id: "r7", product: "p26", vendor: "v6", author: "Kabir T.", rating: 5, verified: true, date: "2026-09-15", body: "The frame quality is museum-grade. Colors are vivid and true.", helpful: 56, status: "normal", signals: { accountAgeDays: 1200, textSimilarity: 0.04, burst: false } },
];

// ---- Orders (mock, multi-vendor) ----
export const ORDERS = [
  {
    id: "GAL-10241", date: "2026-09-28", status: "shipped", payment: "paid", total: 72899,
    items: [
      { product: "p1", vendor: "v1", qty: 1, gross: 69900, commissionPct: 8, commission: 5592, net: 64308, shipStatus: "shipped", refund: "none" },
      { product: "p9", vendor: "v3", qty: 2, gross: 2598, commissionPct: 10, commission: 260, net: 2338, shipStatus: "delivered", refund: "none" },
    ],
  },
  {
    id: "GAL-10238", date: "2026-09-21", status: "delivered", payment: "paid", total: 10997,
    items: [
      { product: "p16", vendor: "v2", qty: 1, gross: 2999, commissionPct: 12, commission: 360, net: 2639, shipStatus: "delivered", refund: "none" },
      { product: "p18", vendor: "v2", qty: 1, gross: 4499, commissionPct: 12, commission: 540, net: 3959, shipStatus: "delivered", refund: "none" },
      { product: "p20", vendor: "v4", qty: 1, gross: 3499, commissionPct: 10, commission: 350, net: 3149, shipStatus: "delivered", refund: "none" },
    ],
  },
  {
    id: "GAL-10230", date: "2026-09-14", status: "processing", payment: "paid", total: 108899,
    items: [
      { product: "p5", vendor: "v1", qty: 1, gross: 99900, commissionPct: 8, commission: 7992, net: 91908, shipStatus: "processing", refund: "none" },
      { product: "p14", vendor: "v3", qty: 1, gross: 8999, commissionPct: 10, commission: 900, net: 8099, shipStatus: "processing", refund: "none" },
    ],
  },
];

// ---- Vendor intelligence (mock) ----
export const VENDOR_TRUST = {
  score: 88, standing: "Excellent", eligible: false,
  trend: [82, 83, 81, 84, 85, 86, 85, 88],
  signals: [
    { label: "On-time delivery", value: 94, weight: "high", target: 95 },
    { label: "Verified-review share", value: 78, weight: "high", target: 85 },
    { label: "Cancellation rate", value: 3.2, weight: "medium", target: 2, invert: true },
    { label: "Refund rate", value: 4.1, weight: "medium", target: 3, invert: true },
    { label: "Quality complaints", value: 2.8, weight: "medium", target: 2, invert: true },
    { label: "Median first response", value: 3.1, weight: "high", target: 2, unit: "h", invert: true },
  ],
  whatIf: [
    { action: "Cut first response from 3.1h to 2h", delta: 1.5 },
    { action: "Raise verified-review share to 85%", delta: 2.1 },
    { action: "Reduce refund rate to 3%", delta: 0.8 },
  ],
};

export const VENDOR_DEMAND = [
  { product: "p1", level: "High", actual: 142, forecast: 168, confidence: 0.88, cover: 18, velocity: 12, category: "Smartphones" },
  { product: "p8", level: "High", actual: 98, forecast: 115, confidence: 0.91, cover: 9, velocity: 8, category: "Audio" },
  { product: "p30", level: "High", actual: 64, forecast: 80, confidence: 0.79, cover: 4, velocity: 7, category: "Audio" },
  { product: "p3", level: "Stable", actual: 88, forecast: 90, confidence: 0.93, cover: 22, velocity: 4, category: "Smartphones" },
  { product: "p9", level: "High", actual: 210, forecast: 240, confidence: 0.95, cover: 30, velocity: 10, category: "Audio" },
  { product: "p4", level: "Low", actual: 40, forecast: 35, confidence: 0.86, cover: 48, velocity: 1, category: "Smartphones" },
];

export const VENDOR_INSIGHTS = [
  { id: "i1", title: "Galaxy Buds2 Pro will stock out in 4 days", confidence: 91, evidence: "Selling 7/day, 7 units left, cover 4d", status: "new", page: "inventory", action: "Create restock draft", urgent: true },
  { id: "i2", title: "2 reviews flagged for manipulation", confidence: 87, evidence: "Burst timing + 0.94 text similarity + 1-day-old accounts", status: "new", page: "reviews", action: "Open flagged review", urgent: false },
  { id: "i3", title: "First response time slipped to 3.1h", confidence: 78, evidence: "Last 14 days avg 3.1h vs target 2h — costs ~1.5 trust points", status: "new", page: "trust", action: "Open tickets", urgent: false },
  { id: "i4", title: "Sony WH-1000XM5 demand up 22% this week", confidence: 84, evidence: "Velocity 8/day, forecast 115 next month", status: "acted", page: "demand", action: "View demand", urgent: false },
];

export const VENDOR_REVENUE = {
  total: 1842300, last30: 312400, commission: 147390, net: 1694910,
  trend: [120, 145, 132, 168, 190, 175, 210, 240, 222, 268, 290, 312],
  byProduct: [
    { product: "p1", revenue: 699000, units: 10 },
    { product: "p5", revenue: 399600, units: 4 },
    { product: "p8", revenue: 299900, units: 10 },
    { product: "p3", revenue: 159996, units: 4 },
    { product: "p4", revenue: 91996, units: 4 },
  ],
};

export const ADMIN_STATS = {
  gmv: 48230000, orders: 1284, vendors: 6, commission: 3858400,
  customers: 8421, products: 30, pendingReviews: 2,
};

// ---- Helpers ----
export const getProduct = (id) => PRODUCTS.find((p) => p.id === id);
export const getVendor = (id) => VENDORS.find((v) => v.id === id);
export const getCategory = (id) => CATEGORIES.find((c) => c.id === id);
export const reviewsFor = (productId) => REVIEWS.filter((r) => r.product === productId);
export const vendorRating = (vid) => {
  const rs = REVIEWS.filter((r) => r.vendor === vid);
  if (!rs.length) return getVendor(vid)?.rating ?? 4.5;
  return rs.reduce((s, r) => s + r.rating, 0) / rs.length;
};

// Price-range validation flag
export function priceFlag(product) {
  const cat = getCategory(product.category);
  if (!cat) return null;
  if (product.price < cat.min || product.price > cat.max) {
    return `Price outside expected range for ${cat.name} (₹${cat.min}–₹${cat.max})`;
  }
  return null;
}