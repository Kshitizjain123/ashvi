const { v4: uuidv4 } = require('uuid')

const topLevelCategories = [
  {
    name: 'Signature',
    slug: 'signature',
    sort_order: 1,
    description: 'Sculptural rose, bouquet and bubble candles, hand poured one at a time.',
  },
  {
    name: 'Festive',
    slug: 'festive',
    sort_order: 2,
    description: 'Limited seasonal pieces poured in small batches for Diwali, Holi, Christmas and more.',
  },
  {
    name: 'Gift Sets',
    slug: 'gifting',
    sort_order: 3,
    description: 'Considered pairings, presented in our signature white and ribbon boxes.',
  },
]

const festiveSubcategories = [
  {
    name: 'Diwali',
    slug: 'diwali',
    sort_order: 1,
    description: 'Rose diyas and warm ritual candles for the festival of lights.',
  },
  {
    name: 'Holi',
    slug: 'holi',
    sort_order: 2,
    description: 'Pastel hearts and joyful small-batch candles for colour-filled celebrations.',
  },
  {
    name: 'Christmas',
    slug: 'christmas',
    sort_order: 3,
    description: 'Cinnamon, ruby accents and cozy seasonal pours for winter gifting.',
  },
  {
    name: "Valentine's",
    slug: 'valentine',
    sort_order: 4,
    description: 'Heart-topped candles and rose-led pours for sentimental gifting.',
  },
]

async function ensureDefaultCategories(db) {
  const client = await db.pool.connect()
  await client.query('BEGIN')
  try {
    for (const category of topLevelCategories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, parent_id, sort_order, description, is_active)
         VALUES ($1, $2, $3, NULL, $4, $5, true)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           parent_id = NULL,
           sort_order = EXCLUDED.sort_order,
           description = COALESCE(categories.description, EXCLUDED.description),
           is_active = true`,
        [uuidv4(), category.name, category.slug, category.sort_order, category.description]
      )
    }

    const { rows } = await client.query('SELECT id FROM categories WHERE slug = $1', ['festive'])
    const festiveId = rows[0]?.id
    if (!festiveId) throw new Error('Festive category could not be created.')

    for (const category of festiveSubcategories) {
      await client.query(
        `INSERT INTO categories (id, name, slug, parent_id, sort_order, description, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           parent_id = EXCLUDED.parent_id,
           sort_order = EXCLUDED.sort_order,
           description = COALESCE(categories.description, EXCLUDED.description),
           is_active = true`,
        [uuidv4(), category.name, category.slug, festiveId, category.sort_order, category.description]
      )
    }

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

module.exports = { ensureDefaultCategories }
