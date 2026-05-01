// ===== Ashvi pages =====
const { useState: useState2, useEffect: useEffect2, useMemo: useMemo2 } = React;

// ----- HOME -----
const HomePage = ({ navigate, addToCart, products, categories, reviews }) => {
  const featured = products.filter((p) => p.badge === 'Bestseller' || p.badge === 'New').slice(0, 4);
  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow-row">
              <span className="eyebrow">Hand sculpted in Jaipur</span>
            </div>
            <h1 className="hero-title">
              Quiet luxuries,<br />
              <em>made by hand</em><br />
              <span className="hero-script">flavours of elegance.</span>
            </h1>
            <p className="hero-body">
              Hand poured, hand sculpted candles fragranced like perfume, made in small batches at our Jaipur atelier. Slow burns, sculptural shapes, and finishes that ask to be unwrapped slowly.
            </p>
            <div className="hero-actions">
              <button className="btn" onClick={() => navigate({ page: 'category', categoryId: 'signature' })}>
                <span>Shop the House</span><Icon name="arrow" size={14} />
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div style={{ gridRow: '1 / span 2', gridColumn: 1, overflow: 'hidden', position: 'relative' }}>
              <img src="assets/p-rose-bouquet.jpeg" alt="Rose Bouquet Candle" style={{ width: '100%', height: '125%', objectFit: 'cover', objectPosition: 'center', marginTop: '-12%' }} />
            </div>
            <img src="assets/p-bubble-cube.jpeg" alt="Bubble Cube" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <img src="assets/p-kulhad-rose.jpeg" alt="Kulhad Rose" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="hero-stamp">
              <div className="hero-stamp-inner">
                <span className="dot"></span>
                <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontFamily: 'var(--sans)', fontWeight: 600 }}>Est. 2024</span>
                <span style={{ fontFamily: 'var(--script)', fontSize: 22, lineHeight: 1 }}>by hand</span>
                <span className="dot"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo banners */}
      <section className="section section-cream tight banners-section">
        <div className="container">
          <div className="banners">
            <div className="banner" onClick={() => navigate({ page: 'category', categoryId: 'gifting' })}>
              <img src="assets/p-gift-boxes.jpeg" alt="Wedding favours" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="banner-content">
                <span className="banner-eyebrow">Wedding Season</span>
                <h3 className="banner-title">Favours, considered<br />down to the ribbon.</h3>
              </div>
              <div className="banner-arrow"><Icon name="arrow" size={16} /></div>
            </div>
            <div className="banner" onClick={() => navigate({ page: 'category', categoryId: 'festive' })}>
              <img src="assets/p-diwali-rose.jpeg" alt="Diwali rose diya" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="banner-content">
                <span className="banner-eyebrow">Limited Edition</span>
                <h3 className="banner-title">Diwali Rose<br />Diyas.</h3>
              </div>
              <div className="banner-arrow"><Icon name="arrow" size={16} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section section-cream" style={{ paddingTop: 40 }}>
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">Featured</span>
              <h2 className="section-title">A few <em>new arrivals</em></h2>
              <p className="section-sub">Drawn from the workbench this season, small batch pieces that won't last beyond the month.</p>
            </div>
            <button className="link-underline" onClick={() => navigate({ page: 'category', categoryId: 'signature' })}>
              View all <Icon name="arrowSm" size={14} />
            </button>
          </div>
          <div className="product-grid">
            {featured.map((p) => <ProductCard key={p.id} product={p} navigate={navigate} addToCart={addToCart} />)}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="section section-sandstone">
        <div className="quote-block">
          <span className="quote-mark">“</span>
          <p className="quote-text">
            True elegance lives in the smaller things, the throw of a candle at dusk,<br />the snap of dark chocolate, a ribbon tied by hand.
          </p>
          <div className="quote-cite">
            <span className="quote-cite-name">, The House of Ashvi</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">Shop by House</span>
              <h2 className="section-title">Three quiet <em>obsessions.</em></h2>
            </div>
          </div>
          <div className="cat-grid">
            {categories.map((c) =>
            <div key={c.id} className="cat-card" onClick={() => navigate({ page: 'category', categoryId: c.id })}>
                <img src={c.image} alt={c.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s cubic-bezier(0.2, 0, 0.2, 1)' }} className="cat-card-img" />
                <div className="cat-overlay">
                  <h3>{c.name}</h3>
                  <p>{c.blurb}</p>
                  <span className="cat-link">Explore</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* USP */}
      <section className="usp-wrap-section section section-sandstone">
        <div className="container">
          <div className="usp-wrap">
            <div className="usp-visual">
              <img src="assets/p-twig-pot.jpeg" alt="Atelier" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <span className="eyebrow">The Ashvi Standard</span>
              <h2 className="section-title" style={{ marginBottom: 32 }}>Why it tastes,<br /><em>and burns, different.</em></h2>
              <div className="usp-list">
                <div className="usp-item">
                  <div className="usp-num">01</div>
                  <div className="usp-content">
                    <h4>Sourced, not bought</h4>
                    <p>Cacao from a single Idukki estate. Saffron from one farm in Pampore. Beeswax from one apiary in the Nilgiris. We know our growers by name.</p>
                  </div>
                </div>
                <div className="usp-item">
                  <div className="usp-num">02</div>
                  <div className="usp-content">
                    <h4>Worked by hand, in small batches</h4>
                    <p>Every candle is hand poured, every shape sculpted by hand. We refuse to scale faster than we can finish each piece, and that's the point.</p>
                  </div>
                </div>
                <div className="usp-item">
                  <div className="usp-num">03</div>
                  <div className="usp-content">
                    <h4>Clean throughout</h4>
                    <p>No paraffin, no soy lecithin, no shortcuts. Coconut, soy wax, cotton wicks, single origin cocoa butter. The label tells the truth.</p>
                  </div>
                </div>
                <div className="usp-item">
                  <div className="usp-num">04</div>
                  <div className="usp-content">
                    <h4>Finished like a gift</h4>
                    <p>Every order leaves the atelier in hand tied kraft and silk, with a calligraphed card. The unboxing is part of the product.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-head" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div className="left" style={{ margin: '0 auto' }}>
              <span className="eyebrow">From our table</span>
              <h2 className="section-title">Notes from <em>our patrons.</em></h2>
            </div>
          </div>
          <div className="review-grid">
            {reviews.map((r, i) =>
            <div key={i} className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-meta">
                  <div className="review-avatar">{r.initial}</div>
                  <div>
                    <div className="review-name">{r.name}</div>
                    <div className="review-loc">{r.loc}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>);

};

// ----- CATEGORY -----
const CategoryPage = ({ categoryId, navigate, addToCart, products, categories }) => {
  const cat = categories.find((c) => c.id === categoryId) || categories[0];
  const all = products.filter((p) => p.category === cat.id);
  const [sortOpen, setSortOpen] = useState2(false);
  const [sort, setSort] = useState2('Featured');
  const [filters, setFilters] = useState2({ price: [], tag: [] });
  const [openFG, setOpenFG] = useState2({ price: true, tag: true });

  const sortOptions = ['Featured', 'Newest', 'Price · Low to High', 'Price · High to Low'];
  const priceFilters = [
  { id: 'p1', label: 'Under ₹1,000', test: (p) => p.price < 1000 },
  { id: 'p2', label: '₹1,000 to ₹2,000', test: (p) => p.price >= 1000 && p.price < 2000 },
  { id: 'p3', label: 'Above ₹2,000', test: (p) => p.price >= 2000 }];

  const tagFilters = [
  { id: 't1', label: 'Bestsellers', test: (p) => p.badge === 'Bestseller' },
  { id: 't2', label: 'New Arrivals', test: (p) => p.badge === 'New' },
  { id: 't3', label: 'Single Origin', test: (p) => p.badge === 'Single Origin' },
  { id: 't4', label: 'Limited', test: (p) => p.badge === 'Limited' || p.badge === 'Made to Order' }];


  const filtered = useMemo2(() => {
    let res = [...all];
    if (filters.price.length) {
      const tests = priceFilters.filter((f) => filters.price.includes(f.id)).map((f) => f.test);
      res = res.filter((p) => tests.some((t) => t(p)));
    }
    if (filters.tag.length) {
      const tests = tagFilters.filter((f) => filters.tag.includes(f.id)).map((f) => f.test);
      res = res.filter((p) => tests.some((t) => t(p)));
    }
    if (sort === 'Price · Low to High') res.sort((a, b) => a.price - b.price);
    if (sort === 'Price · High to Low') res.sort((a, b) => b.price - a.price);
    return res;
  }, [all, filters, sort]);

  const toggle = (group, id) => {
    setFilters((f) => ({ ...f, [group]: f[group].includes(id) ? f[group].filter((x) => x !== id) : [...f[group], id] }));
  };

  return (
    <div className="page">
      <section className="category-hero">
        <div className="breadcrumb">
          <a onClick={() => navigate({ page: 'home' })} style={{ cursor: 'pointer' }}>Home</a> <span style={{ margin: '0 12px', color: 'var(--gold)' }}>/</span> {cat.name}
        </div>
        <h1>{cat.name}</h1>
        <p>{cat.long}</p>
      </section>
      <div className="cat-layout">
        <aside className="filter-panel">
          <h6 style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 24, paddingBottom: 12, borderBottom: '1px solid var(--espresso)' }}>
            <Icon name="sliders" size={14} /> &nbsp; Filters
          </h6>
          <div className="filter-group">
            <h6>Price</h6>
            {priceFilters.map((f) =>
            <div key={f.id} className={'filter-option' + (filters.price.includes(f.id) ? ' checked' : '')} onClick={() => toggle('price', f.id)}>
                <span className="filter-checkbox">{filters.price.includes(f.id) && <Icon name="arrowSm" size={10} />}</span>
                <span>{f.label}</span>
                <span className="filter-count">{all.filter(f.test).length}</span>
              </div>
            )}
          </div>
          <div className="filter-group">
            <h6>Collection</h6>
            {tagFilters.map((f) => {
              const cnt = all.filter(f.test).length;
              if (cnt === 0) return null;
              return (
                <div key={f.id} className={'filter-option' + (filters.tag.includes(f.id) ? ' checked' : '')} onClick={() => toggle('tag', f.id)}>
                  <span className="filter-checkbox">{filters.tag.includes(f.id) && <Icon name="arrowSm" size={10} />}</span>
                  <span>{f.label}</span>
                  <span className="filter-count">{cnt}</span>
                </div>);

            })}
          </div>
          {(filters.price.length > 0 || filters.tag.length > 0) &&
          <button className="link-underline" onClick={() => setFilters({ price: [], tag: [] })}>Clear all</button>
          }
        </aside>
        <div>
          <div className="cat-toolbar">
            <span className="cat-count">{filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}</span>
            <div className="sort-select" onClick={() => setSortOpen((o) => !o)}>
              <span>Sort · {sort}</span>
              <Icon name="chevron" size={14} />
              <div className={'sort-menu' + (sortOpen ? ' open' : '')}>
                {sortOptions.map((s) =>
                <button key={s} className={s === sort ? 'active' : ''} onClick={() => {setSort(s);setSortOpen(false);}}>{s}</button>
                )}
              </div>
            </div>
          </div>
          {filtered.length === 0 ?
          <div style={{ padding: 80, textAlign: 'center', color: 'var(--espresso-soft)' }}>
              <span className="quote-mark" style={{ fontSize: 64 }}>“</span>
              <p>Nothing matches those filters yet, try clearing one.</p>
            </div> :

          <div className="product-grid three">
              {filtered.map((p) => <ProductCard key={p.id} product={p} navigate={navigate} addToCart={addToCart} />)}
            </div>
          }
        </div>
      </div>
    </div>);

};

// ----- PRODUCT DETAIL -----
const ProductPage = ({ productId, navigate, addToCart, products }) => {
  const p = products.find((x) => x.id === productId) || products[0];
  const [imgIdx, setImgIdx] = useState2(0);
  const [qty, setQty] = useState2(1);
  const [option, setOption] = useState2(p.weight ? 'Standard' : 'Standard');
  useEffect2(() => {setImgIdx(0);setQty(1);window.scrollTo({ top: 0, behavior: 'smooth' });}, [productId]);

  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const angles = ['FRONT', 'DETAIL', 'LIFESTYLE', 'PACKAGING'];

  return (
    <div className="page">
      <div className="pdp-wrap">
        <div className="pdp-breadcrumb">
          <a onClick={() => navigate({ page: 'home' })} style={{ cursor: 'pointer' }}>Home</a>
          <span style={{ margin: '0 10px', color: 'var(--gold)' }}>/</span>
          <a onClick={() => navigate({ page: 'category', categoryId: p.category })} style={{ cursor: 'pointer' }}>{p.categoryName}</a>
          <span style={{ margin: '0 10px', color: 'var(--gold)' }}>/</span>
          <span style={{ color: 'var(--espresso)' }}>{p.name}</span>
        </div>

        <div className="pdp-grid">
          <div className="pdp-thumbs">
            {[p.image, ...(p.gallery || [])].slice(0, 4).map((src, i) =>
            <div key={i} className={'pdp-thumb' + (i === imgIdx ? ' active' : '')} onClick={() => setImgIdx(i)}>
                {src ? <img src={src} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : <Placeholder tone={p.tone} label={'IMG ' + (i + 1)} style={{ position: 'absolute', inset: 0 }} />}
              </div>
            )}
          </div>
          <div className="pdp-main">
            {p.image ?
            <img src={p.image} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> :
            <Placeholder tone={p.tone} label={p.name} />}
          </div>
          <div className="pdp-info">
            {p.badge && <span className="eyebrow" style={{ color: 'var(--gold)' }}>● &nbsp; {p.badge}</span>}
            <h1 className="pdp-title">{p.name}</h1>
            <p className="pdp-tag-line">{p.tagline}</p>
            <div className="pdp-price-row">
              <span className="pdp-price">{fmtPrice(p.price)}</span>
              {p.mrp && <span className="pdp-price-strike">{fmtPrice(p.mrp)}</span>}
            </div>
            <div className="pdp-tax">Inclusive of all taxes · Free shipping above ₹1,499</div>

            <p className="pdp-desc">{p.description}</p>

            {p.notes &&
            <>
                <div className="pdp-options-label">Fragrance Notes</div>
                <div className="pdp-options" style={{ marginBottom: 28 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, width: '100%' }}>
                    <div><div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Top</div><div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontStyle: 'italic' }}>{p.notes.top}</div></div>
                    <div><div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Heart</div><div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontStyle: 'italic' }}>{p.notes.heart}</div></div>
                    <div><div style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>Base</div><div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontStyle: 'italic' }}>{p.notes.base}</div></div>
                  </div>
                </div>
              </>
            }

            <div className="pdp-options-label">{p.category === 'candles' ? 'Size' : 'Format'}</div>
            <div className="pdp-options">
              {(p.category === 'candles' ? ['Travel · 100g', 'Standard · ' + (p.size || '220g'), 'Statement · 380g'] : ['Standard', 'Add gift wrap']).map((o) =>
              <button key={o} className={'pdp-option' + (o.startsWith('Standard') || o === 'Standard' ? ' active' : '')}>{o}</button>
              )}
            </div>

            <div className="pdp-actions">
              <div className="pdp-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}><Icon name="minus" size={14} /></button>
                <span className="v">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)}><Icon name="plus" size={14} /></button>
              </div>
              <button className="btn" onClick={() => addToCart(p.id, qty)}>
                <span>Add to Cart</span><Icon name="bag" size={14} />
              </button>
              <button className="btn-outline btn" style={{ flex: '0 0 auto', padding: '18px 22px' }} aria-label="wishlist">
                <Icon name="heart" size={16} />
              </button>
            </div>

            <div className="pdp-meta-list">
              <div className="pdp-meta-list-item"><span className="ic"><Icon name="truck" size={16} /></span><span><strong>Free shipping</strong> on orders above ₹1,499 · ships in 2 working days</span></div>
              <div className="pdp-meta-list-item"><span className="ic"><Icon name="box" size={16} /></span><span><strong>Hand tied kraft & silk box</strong> · calligraphed gift note on request</span></div>
              <div className="pdp-meta-list-item"><span className="ic"><Icon name="shield" size={16} /></span><span><strong>Made to last</strong> · {p.category === 'candles' ? p.burn + ' burn time' : 'best within 4 weeks of dispatch'}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients block */}
      <section className="ingredients">
        <div className="container">
          <div className="ingredients-grid">
            <div>
              <span className="eyebrow">Inside the {p.category === 'candles' ? 'candle' : 'piece'}</span>
              <h2>What's in it,<br /><em>and why.</em></h2>
              <p>We list every ingredient by source. Nothing hides behind a perfume number or an industry abbreviation. The label is the first taste of the brand.</p>
            </div>
            <div className="ingredient-list">
              {p.ingredients.map((ing, i) =>
              <div key={i} className="ingredient-pill">
                  <span className="dot"></span>
                  <span className="name">{ing.name}</span>
                  <span className="desc">{ing.desc}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section section-cream">
        <div className="container">
          <div className="section-head">
            <div className="left">
              <span className="eyebrow">You might also love</span>
              <h2 className="section-title">From the <em>same hand.</em></h2>
            </div>
            <button className="link-underline" onClick={() => navigate({ page: 'category', categoryId: p.category })}>
              All {p.categoryName} <Icon name="arrowSm" size={14} />
            </button>
          </div>
          <div className="product-grid three">
            {related.map((r) => <ProductCard key={r.id} product={r} navigate={navigate} addToCart={addToCart} />)}
          </div>
        </div>
      </section>
    </div>);

};

// ----- ABOUT -----
const AboutPage = ({ navigate }) =>
<div className="page">
    <section className="about-hero">
      <div className="about-hero-text">
        <span className="eyebrow">Our Story</span>
        <h1>More than a<br /><em>source of light.</em></h1>
        <p>At Ashvi, we believe that a candle is more than just a source of light, it is an experience, a living memory, and a sanctuary of serenity. Our journey began with a singular, heartfelt passion: to bridge the gap between high end luxury and the intimate comfort of home.</p>
      </div>
      <div className="about-hero-img" style={{ backgroundImage: 'url(assets/brand-flatlay.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
    </section>

    <section className="section-sandstone">
      <div className="container" style={{ maxWidth: 880, paddingTop: 96, paddingBottom: 64 }}>
        <span className="eyebrow" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>Our Vision</span>
        <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Everyday spaces,<br /><em>retreats of calm.</em></h2>
        <p style={{ fontSize: 19, lineHeight: 1.7, textAlign: 'center', color: 'var(--espresso)', maxWidth: 720, margin: '0 auto', textWrap: 'pretty' }}>Founded on the principles of elegance and intentionality, Ashvi was born from the desire to transform everyday spaces into retreats of calm. We see the home as a canvas, and our candles as the finishing touches that bring a room to life. Fragrance is the most powerful way to connect with your surroundings, evoking emotions and memories that linger long after the flame is extinguished.</p>
      </div>

      <div className="container">
        <span className="eyebrow" style={{ display: 'block', textAlign: 'center', marginBottom: 8 }}>The Artisanal Touch</span>
        <h3 style={{ textAlign: 'center', marginBottom: 56, fontSize: 32 }}>Where artistry meets utility.</h3>
      </div>

      <div className="about-pillars">
        <div className="about-pillar">
          <span className="num">i</span>
          <h3>Meticulously Hand Poured</h3>
          <p>Every jar, mold and glass is filled with precision and care, one piece at a time, by the same hands that designed it.</p>
        </div>
        <div className="about-pillar">
          <span className="num">ii</span>
          <h3>Artistically Designed</h3>
          <p>Our candles are made to double as sculptural decor pieces, fitting seamlessly into modern and minimalist aesthetics.</p>
        </div>
        <div className="about-pillar">
          <span className="num">iii</span>
          <h3>Sustainably Sourced</h3>
          <p>We prioritise high quality waxes and premium fragrance oils for a clean, sophisticated throw that fills your room without overwhelming it.</p>
        </div>
      </div>
    </section>

    <section className="about-story">
      <div>
        <div style={{ position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden' }}>
          <img src="assets/p-kulhad-rose.jpeg" alt="The Ashvi atelier" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <p className="about-script-pull">"Luxury should be accessible,<br />tactile, and deeply personal."</p>
      </div>
      <div className="about-story-text">
        <span className="eyebrow">Beyond the Flame</span>
        <h2>Sensory experiences, <em>made to be shared.</em></h2>
        <p>We understand that life's most precious moments are meant to be shared. That is why we have expanded our craft into bespoke gift hampers, collections curated to be more than just gifts. They are sensory experiences designed to turn any occasion, from a quiet housewarming to a grand celebration, into a lasting memory.</p>

        <span className="eyebrow" style={{ display: 'block', marginTop: 40, marginBottom: 12 }}>The Flavours of Elegance</span>
        <p>Our signature tagline reflects our belief that luxury should be accessible, tactile, and deeply personal. Whether you're looking for a statement decor piece to anchor your living room or a soothing scent to unwind after a long day, Ashvi is here to provide the glow.</p>
        <p>With Ashvi, you aren't just buying a product. You're bringing home a piece of our passion. Join us in celebrating the beauty of light, the power of scent, and the art of elegant living.</p>
        <p style={{ fontFamily: 'var(--script)', fontSize: 28, color: 'var(--gold)', marginTop: 32 }}>, The Ashvi Atelier</p>

        <button className="btn" style={{ marginTop: 24 }} onClick={() => navigate({ page: 'category', categoryId: 'signature' })}>
          <span>Shop the House</span><Icon name="arrow" size={14} />
        </button>
      </div>
    </section>
  </div>;


Object.assign(window, { HomePage, CategoryPage, ProductPage, AboutPage });