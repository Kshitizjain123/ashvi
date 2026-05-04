require('dotenv').config()
const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const q = (text, params) => pool.query(text, params)

const PRODUCTS = [
  // Signature
  {
    id: 'rose-bouquet', name: 'Rose Bouquet Candle', category: 'signature',
    price: 1450, mrp: 1650, badge: 'Bestseller', image: 'assets/p-rose-bouquet.jpeg',
    tagline: 'A sculpted rose wrapped in kraft and ribbon, a candle that arrives like a bouquet',
    description: "A single rose, hand sculpted in scented wax and presented in kraft paper with dried baby's breath, finished with a hand tied silk bow. Burns slow and clean from the petals down. Made to be received, not just lit.",
    notes_top: 'Damask rose', notes_heart: 'Geranium, Pink pepper', notes_base: 'Cedar, Musk',
    burn_time: '20 to 24 hours', volume: '180g', vessel: 'Hand wrapped kraft cone',
    is_featured: true, is_bestseller: true,
    ingredients: [
      { name: 'Coconut, soy wax', description: 'Clean burn' },
      { name: 'Damask rose oil', description: 'Heart' },
      { name: 'Cotton wick', description: 'Lead free' },
      { name: "Dried baby's breath", description: 'Bouquet' },
      { name: 'Silk ribbon', description: 'Hand tied' },
    ],
  },
  {
    id: 'kulhad-rose', name: 'Kulhad Rose Candle', category: 'signature',
    price: 980, badge: 'Bestseller', image: 'assets/p-kulhad-rose.jpeg',
    tagline: 'Rose petal candles set in traditional terracotta kulhads',
    description: 'Soft creamy soy wax poured into a hand thrown terracotta kulhad and topped with dried rose petals. The clay drinks in the warmth as the candle burns, releasing a subtle earthen note alongside the rose. Sold as a pair.',
    notes_top: 'Rose petal', notes_heart: 'Sweet vanilla', notes_base: 'Wet earth, Sandalwood',
    burn_time: '18 hours each', volume: '120g + 80g pair', vessel: 'Hand thrown terracotta',
    is_featured: true, is_bestseller: true,
    ingredients: [
      { name: 'Soy wax', description: 'Hand poured' },
      { name: 'Rose petals', description: 'Sun dried' },
      { name: 'Terracotta kulhad', description: 'Hand thrown' },
      { name: 'Bourbon vanilla', description: 'Madagascar' },
      { name: 'Cotton wick', description: 'Lead free' },
    ],
  },
  {
    id: 'bubble-cube', name: 'Bubble Cube Candles', category: 'signature',
    price: 850, badge: 'New', image: 'assets/p-bubble-cube.jpeg',
    tagline: 'Sculptural bubble cubes, playful, architectural, photogenic',
    description: 'Our most photographed candle. A geometric cube of soft bubbles, finished with a single ribbon and presented on a small wooden coaster. Available in ivory, ruby, and forest green.',
    notes_top: 'White peach', notes_heart: 'Cotton flower', notes_base: 'Soft musk',
    burn_time: '22 hours', volume: '160g cube', vessel: 'Wooden coaster included',
    is_featured: true,
    ingredients: [
      { name: 'Soy wax blend', description: 'Sculpting grade' },
      { name: 'Cotton wick', description: 'Lead free' },
      { name: 'Wooden coaster', description: 'Mango wood' },
      { name: 'Silk ribbon', description: 'Hand tied' },
    ],
  },
  {
    id: 'twig-pot', name: 'Twig & Petal Bowl', category: 'signature',
    price: 1180, image: 'assets/p-twig-pot.jpeg',
    tagline: 'A meditative bowl candle, twigs bundled like a small tipi',
    description: 'Soft wax poured into a shallow terracotta dish, finished with foraged twigs tied in twine, dried rose petals, black sesame and a single golden peanut. A quiet, sculptural piece for a meditation corner or low table.',
    notes_top: 'Cardamom', notes_heart: 'Sandalwood, Tobacco leaf', notes_base: 'Vetiver, Smoke',
    burn_time: '20 hours', volume: '150g', vessel: 'Terracotta dish',
    ingredients: [
      { name: 'Soy wax', description: 'Hand poured' },
      { name: 'Foraged twigs', description: 'Jaipur forests' },
      { name: 'Rose petals & sesame', description: 'Garnish' },
      { name: 'Terracotta dish', description: 'Hand thrown' },
    ],
  },
  {
    id: 'crystal-jar', name: 'Crystal Cut Jar Candle', category: 'signature',
    price: 1680, mrp: 1880, badge: 'New', image: 'assets/p-crystal-jar.jpeg',
    tagline: 'A cut glass keepsake jar, finished with a faceted lid',
    description: 'Hand poured soy wax in a heavyweight cut glass jar with a faceted dome lid. Topped with crushed dried rose for the bouquet pour or left clean for the ivory edition. The empty jar lives on as a vanity piece.',
    notes_top: 'White rose', notes_heart: 'Iris, Suede', notes_base: 'Amber, Soft musk',
    burn_time: '40 hours', volume: '220g', vessel: 'Cut glass jar with lid',
    is_featured: true,
    ingredients: [
      { name: 'Coconut, soy wax', description: 'Clean burn' },
      { name: 'Cut glass jar', description: 'Heavyweight' },
      { name: 'Faceted lid', description: 'Press fit' },
      { name: 'Dried rose petals', description: 'Optional top' },
      { name: 'Cotton wick', description: 'Lead free' },
    ],
  },
  {
    id: 'rose-tumbler', name: 'Rose Petal Tumbler', category: 'signature',
    price: 760, image: 'assets/p-rose-tumbler.jpeg',
    tagline: 'Cream wax in a clear tumbler, scattered with dried rose',
    description: 'Soft cream soy wax poured into a clear ribbed tumbler, scattered generously with crushed dried rose petals. A clean, modern interpretation of our rose pour, gentle throw, long burn, and a glass you can keep.',
    notes_top: 'Rose petal', notes_heart: 'Cotton flower, Lychee', notes_base: 'White amber',
    burn_time: '32 hours', volume: '180g', vessel: 'Clear ribbed tumbler',
    ingredients: [
      { name: 'Soy wax', description: 'Hand poured' },
      { name: 'Crushed rose petals', description: 'Sun dried' },
      { name: 'Ribbed tumbler', description: 'Recycled glass' },
      { name: 'Cotton wick', description: 'Lead free' },
    ],
  },
  {
    id: 'champagne-flute', name: 'Champagne Flute Candle', category: 'signature',
    price: 1280, badge: 'New', image: 'assets/p-champagne-flute.jpeg',
    tagline: 'A celebration candle in a real champagne flute, gold tied',
    description: 'A real long stem champagne flute filled with shimmering gold beads and a soft ivory pour, finished with a hand tied gold satin ribbon. Made for housewarmings, anniversaries, and the small celebrations that deserve their own candle.',
    notes_top: 'Bergamot, Pear', notes_heart: 'Champagne accord, White flower', notes_base: 'Vanilla, Soft amber',
    burn_time: '14 hours', volume: '110g', vessel: 'Long stem champagne flute',
    ingredients: [
      { name: 'Soy wax', description: 'Ivory pour' },
      { name: 'Gold glass beads', description: 'Shimmer base' },
      { name: 'Champagne flute', description: 'Lead free crystal' },
      { name: 'Gold satin ribbon', description: 'Hand tied' },
    ],
  },
  // Festive
  {
    id: 'hearts-cluster', name: 'Hearts Cluster Tumbler', category: 'festive',
    price: 880, badge: 'New', image: 'assets/p-hearts-cluster-jar.jpeg',
    tagline: 'Pink and burgundy hearts on a clean ivory pour, in a clear tumbler',
    description: "A bouquet of small wax hearts in two shades of rose, scattered across a soft ivory pour and set in a clear glass tumbler. Made for Valentine's and quiet sentimental gestures.",
    notes_top: 'Rose petal', notes_heart: 'Cotton flower, Strawberry', notes_base: 'Vanilla, White amber',
    burn_time: '28 hours', volume: '160g', vessel: 'Clear glass tumbler',
    is_featured: true,
    ingredients: [
      { name: 'Soy wax', description: 'Ivory pour' },
      { name: 'Sculpted hearts', description: 'Pink + burgundy' },
      { name: 'Glass tumbler', description: 'Lead free' },
      { name: 'Cotton wick', description: 'Center pour' },
    ],
  },
  {
    id: 'valentine-jar', name: 'Valentine Layered Candle', category: 'festive',
    price: 1180, badge: 'New', image: 'assets/p-valentine-jar.jpeg',
    tagline: 'A two layer candle, ruby base, ivory top, crowned with four wax hearts',
    description: 'A statement Valentine candle. The lower half is a translucent ruby pour set with rose petals, the upper half a soft ivory soy pour, finished with four hand sculpted ruby hearts.',
    notes_top: 'Red berries, Pomegranate', notes_heart: 'Damask rose, Geranium', notes_base: 'Vanilla, Cocoa',
    burn_time: '32 hours', volume: '230g', vessel: 'Heavyweight clear tumbler',
    ingredients: [
      { name: 'Soy wax', description: 'Ivory upper' },
      { name: 'Tinted gel layer', description: 'Ruby base' },
      { name: 'Sculpted hearts', description: '4 ruby' },
      { name: 'Dried rose petals', description: 'Suspended' },
    ],
  },
  {
    id: 'diwali-rose', name: 'Diwali Rose Diya', category: 'festive',
    price: 720, badge: 'Limited', image: 'assets/p-rose-diyas-batch.jpeg',
    tagline: 'A rose blooming inside a hand painted clay diya, for the festival of lights',
    description: 'A red wax rose nested in soft white wax, set in a hand painted terracotta diya. Released only for Diwali. Each piece is signed and dated.',
    notes_top: 'Saffron', notes_heart: 'Rose, Marigold', notes_base: 'Sandalwood',
    burn_time: '12 hours', volume: '110g', vessel: 'Painted terracotta diya',
    ingredients: [
      { name: 'Soy & beeswax blend', description: 'Festive pour' },
      { name: 'Hand painted diya', description: 'Terracotta' },
      { name: 'Sculpted rose', description: 'Hand shaped' },
      { name: 'Cotton wick', description: 'Lead free' },
    ],
  },
  {
    id: 'holi-hearts', name: 'Rose Heart Set', category: 'festive',
    price: 980, image: 'assets/p-heart-roses.jpeg',
    tagline: 'Four sculpted rose hearts in pastel, ivory, blush, ruby, lavender',
    description: 'Four hand sculpted rose heart candles in our seasonal pastel palette, ivory, blush, ruby and lavender, nested in shredded paper inside a white gift box.',
    notes_top: 'Bergamot', notes_heart: 'Pastel florals', notes_base: 'Vanilla',
    burn_time: '8 hours each', volume: '4 × 45g', vessel: 'White gift box, ribbon tied',
    ingredients: [
      { name: 'Soy wax', description: 'Pastel tinted' },
      { name: 'Sculpted rose hearts', description: 'Hand shaped' },
      { name: 'White gift box', description: 'Ribbon tied' },
      { name: 'Cotton wicks', description: 'Lead free' },
    ],
  },
  {
    id: 'cinnamon-stack', name: 'Cinnamon Stack Candle', category: 'festive',
    price: 580, image: 'assets/p-collection.jpeg',
    tagline: 'A small jar candle with cinnamon sticks tied in red',
    description: "Honeyed beeswax poured into a small glass jar, with two whole cinnamon sticks tied in red bakers' twine. Smells like a kitchen at festival time.",
    notes_top: 'Cinnamon', notes_heart: 'Honey', notes_base: 'Brown sugar',
    burn_time: '14 hours', volume: '90g', vessel: 'Glass tea light jar',
    ingredients: [
      { name: 'Beeswax', description: 'Nilgiris apiary' },
      { name: 'Cinnamon sticks', description: 'Whole, tied' },
      { name: 'Glass jar', description: 'Recycled' },
      { name: 'Cotton wick', description: 'Lead free' },
    ],
  },
  // Gifting
  {
    id: 'mom-dad-set', name: 'Mom & Dad Pair', category: 'gifting',
    price: 1680, badge: 'New', image: 'assets/p-mom-dad-set.jpeg',
    tagline: "A pink 'MOM' and a blue 'DAD' candle, made for baby showers and new parents",
    description: "A pair of clear glass tumblers poured in soft ivory soy wax, each topped with sculpted lettering, MOM in soft pink, DAD in pastel blue. Presented as a pair in a kraft box with a hand tied bow.",
    notes_top: 'Cotton flower', notes_heart: 'Powder, Soft musk', notes_base: 'Vanilla',
    burn_time: '24 hours each', volume: '2 × 140g', vessel: 'Clear tumblers, paired',
    is_featured: true,
    ingredients: [
      { name: 'Soy wax', description: 'Ivory pour' },
      { name: 'Sculpted lettering', description: 'MOM + DAD' },
      { name: 'Wax hearts', description: 'Pink + blue' },
      { name: 'Kraft gift box', description: 'Ribbon tied' },
    ],
  },
  {
    id: 'wedding-favours', name: 'Wedding Favour Boxes', category: 'gifting',
    price: 4800, badge: 'Made to Order', image: 'assets/p-gift-boxes.jpeg',
    tagline: 'Twelve hand tied favour boxes with a sculpted candle inside each',
    description: 'Twelve white card boxes, each containing a sculpted shape candle, tied with red satin ribbon and finished with a hand stamped Ashvi sticker and calligraphed name tag.',
    volume: '12 favours · 4-week lead time',
    ingredients: [
      { name: 'Sculpted shape candle', description: '1 per box' },
      { name: 'White card box', description: 'Premium stock' },
      { name: 'Satin ribbon', description: 'Choice of colour' },
      { name: 'Calligraphed tags', description: 'Custom names' },
    ],
  },
  {
    id: 'discovery', name: 'The Discovery Box', category: 'gifting',
    price: 1480, image: 'assets/p-collection.jpeg',
    tagline: 'A first taste, six tea lights and a small bubble cube',
    description: 'Our welcome gift. Six pastel tea lights from the festive range and a single ivory bubble cube, presented in a wooden tray with a hand tied ribbon.',
    volume: 'Set of 7',
    ingredients: [
      { name: 'Pastel tea lights', description: '6 pieces' },
      { name: 'Bubble cube', description: '1 ivory' },
      { name: 'Wooden serving tray', description: 'Mango wood' },
    ],
  },
  {
    id: 'evening-ritual', name: 'The Evening Ritual', category: 'gifting',
    price: 2280, badge: 'Bestseller', image: 'assets/p-rose-bouquet.jpeg',
    tagline: 'Our Rose Bouquet candle paired with a Kulhad Rose pair',
    description: 'A considered pairing for slow evenings, our hand wrapped Rose Bouquet candle and the kulhad pair, presented in a hand tied kraft and silk box with a calligraphed note.',
    volume: 'Set of 3 · gift boxed',
    is_bestseller: true,
    ingredients: [
      { name: 'Rose Bouquet candle', description: '180g' },
      { name: 'Kulhad Rose pair', description: '120g + 80g' },
      { name: 'Kraft + silk box', description: 'Hand tied' },
      { name: 'Calligraphed card', description: 'Optional message' },
    ],
  },
]

async function seed() {
  // Get category UUIDs
  const { rows: cats } = await q('SELECT id, slug FROM categories')
  const catMap = Object.fromEntries(cats.map(c => [c.slug, c.id]))

  for (const product of PRODUCTS) {
    const slug = product.id
    const categoryId = catMap[product.category] || null

    // Upsert product (skip if already exists)
    const existing = await q('SELECT id FROM products WHERE slug = $1', [slug])
    let productId

    if (existing.rows[0]) {
      productId = existing.rows[0].id
      console.log(`  skipped (exists): ${product.name}`)
    } else {
      productId = uuidv4()
      await q(
        `INSERT INTO products (id, name, slug, tagline, description, volume, category_id, price, mrp, badge,
           notes_top, notes_heart, notes_base, burn_time, vessel, is_featured, is_bestseller)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)`,
        [
          productId, product.name, slug, product.tagline || null, product.description || null,
          product.volume || null, categoryId, product.price, product.mrp || null, product.badge || null,
          product.notes_top || null, product.notes_heart || null, product.notes_base || null,
          product.burn_time || null, product.vessel || null,
          product.is_featured || false, product.is_bestseller || false,
        ]
      )

      // Image
      if (product.image) {
        await q(
          'INSERT INTO product_images (id, product_id, url, is_main, sort_order) VALUES ($1,$2,$3,true,0)',
          [uuidv4(), productId, product.image]
        )
      }

      // Ingredients
      for (let i = 0; i < (product.ingredients || []).length; i++) {
        const ing = product.ingredients[i]
        await q(
          'INSERT INTO product_ingredients (id, product_id, name, description, sort_order) VALUES ($1,$2,$3,$4,$5)',
          [uuidv4(), productId, ing.name, ing.description, i]
        )
      }

      // Inventory
      await q(
        'INSERT INTO inventory (id, product_id, quantity) VALUES ($1,$2,50) ON CONFLICT (product_id) DO NOTHING',
        [uuidv4(), productId]
      )

      console.log(`  inserted: ${product.name}`)
    }
  }

  console.log('Seed complete.')
  await pool.end()
}

seed().catch(err => { console.error(err); process.exit(1) })
