// ===== Ashvi product catalog — handcrafted candles =====

const CATEGORIES = [
  {
    id: 'signature',
    name: 'Signature',
    tag: 'Sculpted',
    blurb: 'Sculptural rose, bouquet and bubble candles, our most photographed pieces, hand poured one at a time.',
    long: 'Each signature candle is hand sculpted from soy and beeswax, inspired by florals, festivals and quiet rituals. These are the pieces our patrons keep on a shelf long after the wick is gone.',
    image: 'assets/p-rose-bouquet.jpeg'
  },
  {
    id: 'festive',
    name: 'Festive',
    tag: 'Seasonal',
    blurb: 'Diwali diyas, Holi pastels, Christmas bubble cubes, small editions made for the moments that matter.',
    long: 'Limited seasonal pieces poured in small batches. Diwali rose diyas, Holi heart sets, Christmas bubble cubes, each retired when the season passes.',
    image: 'assets/p-diwali-rose.jpeg'
  },
  {
    id: 'gifting',
    name: 'Gift Sets',
    tag: 'Curated',
    blurb: 'Considered pairings, presented in our signature white and ribbon boxes with calligraphed name tags.',
    long: 'Each set is composed for a moment, a quiet evening, a thoughtful thank you, a wedding favour. Boxed in white card and finished with hand tied ribbon.',
    image: 'assets/p-gift-boxes.jpeg'
  }
];

const PRODUCTS = [
  // Signature
  {
    id: 'rose-bouquet', name: 'Rose Bouquet Candle', category: 'signature', categoryName: 'Signature',
    price: 1450, mrp: 1650, badge: 'Bestseller',
    image: 'assets/p-rose-bouquet.jpeg',
    tagline: 'A sculpted rose wrapped in kraft and ribbon, a candle that arrives like a bouquet',
    description: 'A single rose, hand sculpted in scented wax and presented in kraft paper with dried baby\'s breath, finished with a hand tied silk bow. Burns slow and clean from the petals down. Made to be received, not just lit.',
    notes: { top: 'Damask rose', heart: 'Geranium, Pink pepper', base: 'Cedar, Musk' },
    burn: '20 to 24 hours', size: '180g', vessel: 'Hand wrapped kraft cone',
    ingredients: [
      { name: 'Coconut, soy wax', desc: 'Clean burn' },
      { name: 'Damask rose oil', desc: 'Heart' },
      { name: 'Cotton wick', desc: 'Lead free' },
      { name: 'Dried baby\'s breath', desc: 'Bouquet' },
      { name: 'Silk ribbon', desc: 'Hand tied' }
    ]
  },
  {
    id: 'kulhad-rose', name: 'Kulhad Rose Candle', category: 'signature', categoryName: 'Signature',
    price: 980, badge: 'Bestseller',
    image: 'assets/p-kulhad-rose.jpeg',
    tagline: 'Rose petal candles set in traditional terracotta kulhads',
    description: 'Soft creamy soy wax poured into a hand thrown terracotta kulhad and topped with dried rose petals. The clay drinks in the warmth as the candle burns, releasing a subtle earthen note alongside the rose. Sold as a pair.',
    notes: { top: 'Rose petal', heart: 'Sweet vanilla', base: 'Wet earth, Sandalwood' },
    burn: '18 hours each', size: '120g + 80g pair', vessel: 'Hand thrown terracotta',
    ingredients: [
      { name: 'Soy wax', desc: 'Hand poured' },
      { name: 'Rose petals', desc: 'Sun dried' },
      { name: 'Terracotta kulhad', desc: 'Hand thrown' },
      { name: 'Bourbon vanilla', desc: 'Madagascar' },
      { name: 'Cotton wick', desc: 'Lead free' }
    ]
  },
  {
    id: 'bubble-cube', name: 'Bubble Cube Candles', category: 'signature', categoryName: 'Signature',
    price: 850, badge: 'New',
    image: 'assets/p-bubble-cube.jpeg',
    tagline: 'Sculptural bubble cubes, playful, architectural, photogenic',
    description: 'Our most photographed candle. A geometric cube of soft bubbles, finished with a single ribbon and presented on a small wooden coaster. Available in ivory, ruby, and forest green.',
    notes: { top: 'White peach', heart: 'Cotton flower', base: 'Soft musk' },
    burn: '22 hours', size: '160g cube', vessel: 'Wooden coaster included',
    ingredients: [
      { name: 'Soy wax blend', desc: 'Sculpting grade' },
      { name: 'Cotton wick', desc: 'Lead free' },
      { name: 'Wooden coaster', desc: 'Mango wood' },
      { name: 'Silk ribbon', desc: 'Hand tied' }
    ]
  },
  {
    id: 'twig-pot', name: 'Twig & Petal Bowl', category: 'signature', categoryName: 'Signature',
    price: 1180,
    image: 'assets/p-twig-pot.jpeg',
    tagline: 'A meditative bowl candle, twigs bundled like a small tipi',
    description: 'Soft wax poured into a shallow terracotta dish, finished with foraged twigs tied in twine, dried rose petals, black sesame and a single golden peanut. A quiet, sculptural piece for a meditation corner or low table.',
    notes: { top: 'Cardamom', heart: 'Sandalwood, Tobacco leaf', base: 'Vetiver, Smoke' },
    burn: '20 hours', size: '150g', vessel: 'Terracotta dish',
    ingredients: [
      { name: 'Soy wax', desc: 'Hand poured' },
      { name: 'Foraged twigs', desc: 'Jaipur forests' },
      { name: 'Rose petals & sesame', desc: 'Garnish' },
      { name: 'Terracotta dish', desc: 'Hand thrown' }
    ]
  },
  {
    id: 'crystal-jar', name: 'Crystal Cut Jar Candle', category: 'signature', categoryName: 'Signature',
    price: 1680, mrp: 1880, badge: 'New',
    image: 'assets/p-crystal-jar.jpeg',
    tagline: 'A cut glass keepsake jar, finished with a faceted lid',
    description: 'Hand poured soy wax in a heavyweight cut glass jar with a faceted dome lid. Topped with crushed dried rose for the bouquet pour or left clean for the ivory edition. The empty jar lives on as a vanity piece.',
    notes: { top: 'White rose', heart: 'Iris, Suede', base: 'Amber, Soft musk' },
    burn: '40 hours', size: '220g', vessel: 'Cut glass jar with lid',
    ingredients: [
      { name: 'Coconut, soy wax', desc: 'Clean burn' },
      { name: 'Cut glass jar', desc: 'Heavyweight' },
      { name: 'Faceted lid', desc: 'Press fit' },
      { name: 'Dried rose petals', desc: 'Optional top' },
      { name: 'Cotton wick', desc: 'Lead free' }
    ]
  },
  {
    id: 'rose-tumbler', name: 'Rose Petal Tumbler', category: 'signature', categoryName: 'Signature',
    price: 760,
    image: 'assets/p-rose-tumbler.jpeg',
    tagline: 'Cream wax in a clear tumbler, scattered with dried rose',
    description: 'Soft cream soy wax poured into a clear ribbed tumbler, scattered generously with crushed dried rose petals. A clean, modern interpretation of our rose pour, gentle throw, long burn, and a glass you can keep.',
    notes: { top: 'Rose petal', heart: 'Cotton flower, Lychee', base: 'White amber' },
    burn: '32 hours', size: '180g', vessel: 'Clear ribbed tumbler',
    ingredients: [
      { name: 'Soy wax', desc: 'Hand poured' },
      { name: 'Crushed rose petals', desc: 'Sun dried' },
      { name: 'Ribbed tumbler', desc: 'Recycled glass' },
      { name: 'Cotton wick', desc: 'Lead free' }
    ]
  },
  {
    id: 'champagne-flute', name: 'Champagne Flute Candle', category: 'signature', categoryName: 'Signature',
    price: 1280, badge: 'New',
    image: 'assets/p-champagne-flute.jpeg',
    tagline: 'A celebration candle in a real champagne flute, gold tied',
    description: 'A real long stem champagne flute filled with shimmering gold beads and a soft ivory pour, finished with a hand tied gold satin ribbon. Made for housewarmings, anniversaries, and the small celebrations that deserve their own candle.',
    notes: { top: 'Bergamot, Pear', heart: 'Champagne accord, White flower', base: 'Vanilla, Soft amber' },
    burn: '14 hours', size: '110g', vessel: 'Long stem champagne flute',
    ingredients: [
      { name: 'Soy wax', desc: 'Ivory pour' },
      { name: 'Gold glass beads', desc: 'Shimmer base' },
      { name: 'Champagne flute', desc: 'Lead free crystal' },
      { name: 'Gold satin ribbon', desc: 'Hand tied' }
    ]
  },

  // Festive
  {
    id: 'hearts-cluster', name: 'Hearts Cluster Tumbler', category: 'festive', categoryName: 'Festive',
    price: 880, badge: 'New',
    image: 'assets/p-hearts-cluster-jar.jpeg',
    tagline: 'Pink and burgundy hearts on a clean ivory pour, in a clear tumbler',
    description: 'A bouquet of small wax hearts in two shades of rose, scattered across a soft ivory pour and set in a clear glass tumbler. Made for Valentine\'s and quiet sentimental gestures. Each tumbler holds a single cotton wick that burns down through the wax.',
    notes: { top: 'Rose petal', heart: 'Cotton flower, Strawberry', base: 'Vanilla, White amber' },
    burn: '28 hours', size: '160g', vessel: 'Clear glass tumbler',
    ingredients: [
      { name: 'Soy wax', desc: 'Ivory pour' },
      { name: 'Sculpted hearts', desc: 'Pink + burgundy' },
      { name: 'Glass tumbler', desc: 'Lead free' },
      { name: 'Cotton wick', desc: 'Center pour' }
    ]
  },
  {
    id: 'valentine-jar', name: 'Valentine Layered Candle', category: 'festive', categoryName: 'Festive',
    price: 1180, badge: 'New',
    image: 'assets/p-valentine-jar.jpeg',
    tagline: 'A two layer candle, ruby base, ivory top, crowned with four wax hearts',
    description: 'A statement Valentine candle. The lower half is a translucent ruby pour set with rose petals, the upper half a soft ivory soy pour, finished with four hand sculpted ruby hearts and a single shimmering pearl. Burns down through both layers.',
    notes: { top: 'Red berries, Pomegranate', heart: 'Damask rose, Geranium', base: 'Vanilla, Cocoa' },
    burn: '32 hours', size: '230g', vessel: 'Heavyweight clear tumbler',
    ingredients: [
      { name: 'Soy wax', desc: 'Ivory upper' },
      { name: 'Tinted gel layer', desc: 'Ruby base' },
      { name: 'Sculpted hearts', desc: '4 ruby' },
      { name: 'Dried rose petals', desc: 'Suspended' }
    ]
  },
  {
    id: 'diwali-rose', name: 'Diwali Rose Diya', category: 'festive', categoryName: 'Festive',
    price: 720, badge: 'Limited',
    image: 'assets/p-rose-diyas-batch.jpeg',
    tagline: 'A rose blooming inside a hand painted clay diya, for the festival of lights',
    description: 'A red wax rose nested in soft white wax, set in a hand painted terracotta diya. Released only for Diwali. Each piece is signed and dated.',
    notes: { top: 'Saffron', heart: 'Rose, Marigold', base: 'Sandalwood' },
    burn: '12 hours', size: '110g', vessel: 'Painted terracotta diya',
    ingredients: [
      { name: 'Soy & beeswax blend', desc: 'Festive pour' },
      { name: 'Hand painted diya', desc: 'Terracotta' },
      { name: 'Sculpted rose', desc: 'Hand shaped' },
      { name: 'Cotton wick', desc: 'Lead free' }
    ]
  },
  {
    id: 'holi-hearts', name: 'Rose Heart Set', category: 'festive', categoryName: 'Festive',
    price: 980,
    image: 'assets/p-heart-roses.jpeg',
    tagline: 'Four sculpted rose hearts in pastel, ivory, blush, ruby, lavender',
    description: 'Four hand sculpted rose heart candles in our seasonal pastel palette, ivory, blush, ruby and lavender, nested in shredded paper inside a white gift box. The ribbon tied lid lifts to reveal the set. Made for Valentine\'s, anniversaries, and Holi.',
    notes: { top: 'Bergamot', heart: 'Pastel florals', base: 'Vanilla' },
    burn: '8 hours each', size: '4 × 45g', vessel: 'White gift box, ribbon tied',
    ingredients: [
      { name: 'Soy wax', desc: 'Pastel tinted' },
      { name: 'Sculpted rose hearts', desc: 'Hand shaped' },
      { name: 'White gift box', desc: 'Ribbon tied' },
      { name: 'Cotton wicks', desc: 'Lead free' }
    ]
  },
  {
    id: 'cinnamon-stack', name: 'Cinnamon Stack Candle', category: 'festive', categoryName: 'Festive',
    price: 580,
    image: 'assets/p-collection.jpeg',
    tagline: 'A small jar candle with cinnamon sticks tied in red',
    description: 'Honeyed beeswax poured into a small glass jar, with two whole cinnamon sticks tied in red bakers\' twine. Smells like a kitchen at festival time.',
    notes: { top: 'Cinnamon', heart: 'Honey', base: 'Brown sugar' },
    burn: '14 hours', size: '90g', vessel: 'Glass tea light jar',
    ingredients: [
      { name: 'Beeswax', desc: 'Nilgiris apiary' },
      { name: 'Cinnamon sticks', desc: 'Whole, tied' },
      { name: 'Glass jar', desc: 'Recycled' },
      { name: 'Cotton wick', desc: 'Lead free' }
    ]
  },

  // Gifting
  {
    id: 'mom-dad-set', name: 'Mom & Dad Pair', category: 'gifting', categoryName: 'Gift Sets',
    price: 1680, badge: 'New',
    image: 'assets/p-mom-dad-set.jpeg',
    tagline: 'A pink \'MOM\' and a blue \'DAD\' candle, made for baby showers and new parents',
    description: 'A pair of clear glass tumblers poured in soft ivory soy wax, each topped with sculpted lettering, MOM in soft pink, DAD in pastel blue, with hand placed wax hearts. Presented as a pair in a kraft box with a hand tied bow. A favourite for baby shower favours and new parent gifts.',
    notes: { top: 'Cotton flower', heart: 'Powder, Soft musk', base: 'Vanilla' },
    burn: '24 hours each', size: '2 × 140g', vessel: 'Clear tumblers, paired',
    ingredients: [
      { name: 'Soy wax', desc: 'Ivory pour' },
      { name: 'Sculpted lettering', desc: 'MOM + DAD' },
      { name: 'Wax hearts', desc: 'Pink + blue' },
      { name: 'Kraft gift box', desc: 'Ribbon tied' }
    ]
  },
  {
    id: 'wedding-favours', name: 'Wedding Favour Boxes', category: 'gifting', categoryName: 'Gift Sets',
    price: 4800, badge: 'Made to Order',
    image: 'assets/p-gift-boxes.jpeg',
    tagline: 'Twelve hand tied favour boxes with a sculpted candle inside each',
    description: 'Twelve white card boxes, each containing a sculpted shape candle (rose, deer, star), tied with red satin ribbon and finished with a hand stamped Ashvi sticker and calligraphed name tag.',
    weight: '12 favours · 4-week lead time',
    ingredients: [
      { name: 'Sculpted shape candle', desc: '1 per box' },
      { name: 'White card box', desc: 'Premium stock' },
      { name: 'Satin ribbon', desc: 'Choice of colour' },
      { name: 'Calligraphed tags', desc: 'Custom names' }
    ]
  },
  {
    id: 'discovery', name: 'The Discovery Box', category: 'gifting', categoryName: 'Gift Sets',
    price: 1480,
    image: 'assets/p-collection.jpeg',
    tagline: 'A first taste, six tea lights and a small bubble cube',
    description: 'Our welcome gift. Six pastel tea lights from the festive range and a single ivory bubble cube, presented in a wooden tray with a hand tied ribbon.',
    weight: 'Set of 7',
    ingredients: [
      { name: 'Pastel tea lights', desc: '6 pieces' },
      { name: 'Bubble cube', desc: '1 ivory' },
      { name: 'Wooden serving tray', desc: 'Mango wood' }
    ]
  },
  {
    id: 'evening-ritual', name: 'The Evening Ritual', category: 'gifting', categoryName: 'Gift Sets',
    price: 2280, badge: 'Bestseller',
    image: 'assets/p-rose-bouquet.jpeg',
    tagline: 'Our Rose Bouquet candle paired with a Kulhad Rose pair',
    description: 'A considered pairing for slow evenings, our hand wrapped Rose Bouquet candle and the kulhad pair, presented in a hand tied kraft and silk box with a calligraphed note.',
    weight: 'Set of 3 · gift boxed',
    ingredients: [
      { name: 'Rose Bouquet candle', desc: '180g' },
      { name: 'Kulhad Rose pair', desc: '120g + 80g' },
      { name: 'Kraft + silk box', desc: 'Hand tied' },
      { name: 'Calligraphed card', desc: 'Optional message' }
    ]
  }
];

const TICKER_ITEMS = [
  'Free shipping on orders above ₹1,499',
  'Hand poured in small batches, in Jaipur',
  'Wedding & Diwali gifting now open',
  'Sculpted candles · made one at a time'
];

const REVIEWS = [
  {
    text: 'The Rose Bouquet arrived wrapped like a real bouquet. I almost didn\'t want to light it, but when I did, the throw was gentle, never overpowering.',
    name: 'Aanya R.', loc: 'Jaipur', initial: 'A'
  },
  {
    text: 'Ordered the Kulhad pair as a housewarming gift. The terracotta detail is so thoughtful, and the rose petals on top make it feel like a real ritual.',
    name: 'Vikram S.', loc: 'Bengaluru', initial: 'V'
  },
  {
    text: 'The Diwali diya candle was the most photographed thing on our table this year. The sculpted rose looks unreal in person.',
    name: 'Meera K.', loc: 'Delhi', initial: 'M'
  }
];

window.ASHVI_DATA = { CATEGORIES, PRODUCTS, TICKER_ITEMS, REVIEWS };
