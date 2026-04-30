// ===== Shared Ashvi components: icons, logo, ticker, nav, footer, drawers =====
const { useState, useEffect, useRef, useMemo } = React;

const fmtPrice = (n) => '₹ ' + n.toLocaleString('en-IN');

// ----- Icons -----
const Icon = ({ name, size = 18 }) => {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
    bag: <><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    close: <><path d="M6 6l12 12M18 6L6 18" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    arrowSm: <><path d="M3 8h10" /><path d="m9 4 4 4-4 4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <><path d="M5 12h14" /></>,
    chevron: <><path d="m6 9 6 6 6-6" /></>,
    star: <><path d="M12 2l3 7 7 .8-5 5 1.5 7L12 18l-6.5 3.8L7 14.8l-5-5 7-.8L12 2z" fill="currentColor" stroke="none" /></>,
    leaf: <><path d="M11 20A7 7 0 0 1 9.8 6.5C15 4 19 4 19 4s-1 11-7 14a7 7 0 0 1-1 2Z" /><path d="M19 4S6 9 9.5 16" /></>,
    spark: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6 8 8M16 16l2.4 2.4M5.6 18.4 8 16M16 8l2.4-2.4" /></>,
    truck: <><path d="M3 6h13v9H3z" /><path d="M16 9h4l2 3v3h-6" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></>,
    box: <><path d="m3 7 9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></>,
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" /></>,
    heart: <><path d="M12 21s-7-4.5-9-9.5A5 5 0 0 1 12 6a5 5 0 0 1 9 5.5C19 16.5 12 21 12 21Z" /></>,
    sliders: <><path d="M4 6h10" /><path d="M18 6h2" /><circle cx="16" cy="6" r="2" /><path d="M4 12h4" /><path d="M12 12h8" /><circle cx="10" cy="12" r="2" /><path d="M4 18h12" /><path d="M20 18h0" /><circle cx="18" cy="18" r="2" /></>,
    flame: <><path d="M12 21c-4 0-7-3-7-7 0-3 2-5 3-7 0 3 2 4 3 3 0-3-1-6 0-8 1 2 5 5 5 11 0 5-3 8-4 8Z" /></>
  };
  return <svg {...common}>{paths[name]}</svg>;
};

// ----- Logo -----
const LogoMark = ({ size = 30 }) => (
  <svg width={size * 0.9} height={size} viewBox="0 0 30 32" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 4l1 2 -1 1 -1 -1 1 -2z" fill="currentColor" />
    <path d="M15 8c-3 0-6 3-6 6 0 1 .5 2 1.5 2.5C12 17 14 16 15 14" />
    <path d="M15 8c3 0 6 3 6 6 0 1 -.5 2 -1.5 2.5C18 17 16 16 15 14" />
    <path d="M15 14v8" />
  </svg>
);

const Logo = ({ onClick }) => (
  <div className="logo" onClick={onClick} style={{ width: 168, height: 132, overflow: 'visible', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: -8, marginBottom: -8 }}>
    <img
      src="assets/logo-ashvi.png"
      alt="Ashvi, Flavours of Elegance"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        objectPosition: 'center',
        display: 'block'
      }}
    />
  </div>
);

// ----- Ticker -----
const Ticker = ({ items }) => {
  const doubled = [...items, ...items, ...items, ...items];
  return (
    <div className="ticker">
      <div className="ticker-track">
        {doubled.map((t, i) => (
          <div key={i} className="ticker-item">
            <span>{t}</span>
            <span className="ticker-dot" />
          </div>
        ))}
      </div>
    </div>
  );
};

// ----- Navbar -----
const Navbar = ({ currentPage, currentCategoryId, navigate, cartCount, openCart, openSearch, categories }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [currentPage, currentCategoryId]);
  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header className="nav">
      <div className="nav-inner">
        <button className="nav-hamburger" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <span></span><span></span><span></span>
        </button>
        <nav className="nav-links">
          <a className={'nav-link' + (currentPage === 'about' ? ' active' : '')} onClick={() => navigate({ page: 'about' })}>About</a>
          {categories.map(c => (
            <a key={c.id} className={'nav-link' + (currentPage === 'category' && currentCategoryId === c.id ? ' active' : '')} onClick={() => navigate({ page: 'category', categoryId: c.id })}>
              {c.name}
            </a>
          ))}
        </nav>
        <Logo onClick={() => navigate({ page: 'home' })} />
        <div className="nav-actions">
          <button className="nav-icon nav-icon-search" onClick={openSearch} aria-label="Search">
            <Icon name="search" size={18} />
          </button>
          <button className="nav-icon nav-icon-account" aria-label="Account">
            <Icon name="user" size={18} />
          </button>
          <button className="nav-icon" onClick={openCart} aria-label="Cart">
            <Icon name="bag" size={18} />
            {cartCount > 0 && <span className="nav-cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <div className={'mobile-menu-scrim' + (menuOpen ? ' open' : '')} onClick={() => setMenuOpen(false)}></div>
      <aside className={'mobile-menu' + (menuOpen ? ' open' : '')} aria-hidden={!menuOpen}>
        <div className="mobile-menu-head">
          <span className="mobile-menu-eyebrow">Menu</span>
          <button className="nav-icon" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <nav className="mobile-menu-links">
          <a className={'mobile-menu-link' + (currentPage === 'home' ? ' active' : '')} onClick={() => navigate({ page: 'home' })}>Home</a>
          {categories.map(c => (
            <a key={c.id} className={'mobile-menu-link' + (currentPage === 'category' && currentCategoryId === c.id ? ' active' : '')} onClick={() => navigate({ page: 'category', categoryId: c.id })}>
              {c.name}
            </a>
          ))}
          <a className={'mobile-menu-link' + (currentPage === 'about' ? ' active' : '')} onClick={() => navigate({ page: 'about' })}>About</a>
        </nav>
        <div className="mobile-menu-foot">
          <button className="mobile-menu-action" onClick={() => { setMenuOpen(false); openSearch(); }}>
            <Icon name="search" size={16} /><span>Search</span>
          </button>
          <button className="mobile-menu-action" onClick={() => { setMenuOpen(false); openCart(); }}>
            <Icon name="bag" size={16} /><span>Cart {cartCount > 0 ? `(${cartCount})` : ''}</span>
          </button>
        </div>
        <p className="mobile-menu-tag">Flavours of elegance, hand poured in Jaipur.</p>
      </aside>
    </header>
  );
};

// ----- Footer -----
const Footer = ({ navigate }) => (
  <footer className="footer">
    <div className="container">
      <div className="footer-top">
        <div>
          <span style={{ width: 150, height: 120, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <img
              src="assets/logo-ashvi.png"
              alt="Ashvi"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                filter: 'brightness(0) invert(0.92) sepia(0.18) saturate(1.1)',
                display: 'block'
              }}
            />
          </span>
          <p className="footer-brand-text">Hand poured, hand sculpted candles made in small batches at our Jaipur atelier. Rooted in tradition, finished with quiet care.</p>
        </div>
        <div>
          <h5>Shop</h5>
          <ul>
            <li><a onClick={() => navigate({ page: 'category', categoryId: 'signature' })}>Signature</a></li>
            <li><a onClick={() => navigate({ page: 'category', categoryId: 'festive' })}>Festive</a></li>
            <li><a onClick={() => navigate({ page: 'category', categoryId: 'gifting' })}>Gift Sets</a></li>
            <li><a>New Arrivals</a></li>
            <li><a>Bestsellers</a></li>
          </ul>
        </div>
        <div>
          <h5>House</h5>
          <ul>
            <li><a onClick={() => navigate({ page: 'about' })}>Our Story</a></li>
            <li><a>Atelier Visit</a></li>
            <li><a>Wedding Gifting</a></li>
            <li><a>Wholesale</a></li>
            <li><a>Contact</a></li>
          </ul>
        </div>
        <div>
          <h5>Care</h5>
          <ul>
            <li><a>Shipping & Returns</a></li>
            <li><a>Candle Care</a></li>
            <li><a>Chocolate Storage</a></li>
            <li><a>Track Order</a></li>
            <li><a>FAQs</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Ashvi. All rights reserved.</span>
        <div className="links">
          <a>Privacy</a><a>Terms</a><a>Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

// ----- Search overlay -----
const SearchOverlay = ({ open, onClose, products, navigate }) => {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
    else setQ('');
  }, [open]);
  const results = useMemo(() => {
    if (!q.trim()) return products.slice(0, 4);
    const t = q.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(t) || p.categoryName.toLowerCase().includes(t) || p.tagline.toLowerCase().includes(t)).slice(0, 5);
  }, [q, products]);
  return (
    <div className={'search-overlay' + (open ? ' open' : '')} onClick={onClose}>
      <div className="search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-row">
          <Icon name="search" size={22} />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search candles, gift sets…" />
          <button className="nav-icon" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="search-suggestions">
          <h6>{q ? `${results.length} results` : 'Popular right now'}</h6>
          {results.map(p => (
            <div key={p.id} className="search-suggestion" onClick={() => { navigate({ page: 'product', productId: p.id }); onClose(); }}>
              {p.image
                ? <img src={p.image} alt={p.name} className="search-suggestion-img" style={{ objectFit: 'cover' }} />
                : <div className={'placeholder search-suggestion-img'}><span className="placeholder-label" style={{ fontSize: 8, padding: '2px 4px' }}>{p.name.split(' ')[0]}</span></div>}
              <div style={{ flex: 1 }}>
                <div className="search-suggestion-name">{p.name}</div>
                <div className="search-suggestion-cat">{p.categoryName} · {fmtPrice(p.price)}</div>
              </div>
              <Icon name="arrowSm" size={16} />
            </div>
          ))}
          {q && results.length === 0 && <p style={{ color: 'var(--espresso-soft)', fontSize: 14 }}>No results, try "candle" or "rose"</p>}
        </div>
      </div>
    </div>
  );
};

// ----- Cart drawer -----
const CartDrawer = ({ open, onClose, cart, products, updateQty, removeItem }) => {
  const items = cart.map(c => ({ ...c, product: products.find(p => p.id === c.id) })).filter(i => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const shipping = subtotal > 1499 || subtotal === 0 ? 0 : 89;
  return (
    <>
      <div className={'drawer-backdrop' + (open ? ' open' : '')} onClick={onClose} />
      <aside className={'drawer' + (open ? ' open' : '')}>
        <div className="drawer-head">
          <h3>Your Cart <span style={{ color: 'var(--gold)', fontSize: 16 }}>· {items.length}</span></h3>
          <button className="drawer-close" onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty">
            <span className="quote-mark">“</span>
            <p>Your cart is quiet. <br/>Begin with something hand poured.</p>
          </div>
        ) : (
          <div className="drawer-items">
            {items.map(i => (
              <div key={i.id} className="cart-item">
                {i.product.image
                  ? <img src={i.product.image} alt={i.product.name} className="cart-item-img" style={{ objectFit: 'cover' }} />
                  : <div className={'placeholder cart-item-img'}><span className="placeholder-label" style={{ fontSize: 8 }}>{i.product.name.split(' ')[0]}</span></div>}
                <div className="cart-item-info">
                  <h4>{i.product.name}</h4>
                  <div className="cart-item-cat">{i.product.categoryName}</div>
                  <div className="qty-row">
                    <button className="qty-btn" onClick={() => updateQty(i.id, i.qty - 1)}><Icon name="minus" size={12} /></button>
                    <span className="qty-num">{i.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(i.id, i.qty + 1)}><Icon name="plus" size={12} /></button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price">{fmtPrice(i.product.price * i.qty)}</div>
                  <button className="cart-remove" onClick={() => removeItem(i.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {items.length > 0 && (
          <div className="drawer-foot">
            <div className="drawer-row"><span className="l">Subtotal</span><span style={{ fontWeight: 600 }}>{fmtPrice(subtotal)}</span></div>
            <div className="drawer-row"><span className="l">Shipping</span><span style={{ fontWeight: 600 }}>{shipping === 0 ? 'Complimentary' : fmtPrice(shipping)}</span></div>
            <div className="drawer-row total"><span className="l" style={{ fontSize: 14 }}>Total · incl. tax</span><span className="v">{fmtPrice(subtotal + shipping)}</span></div>
            <button className="btn"><span>Proceed to Checkout</span><Icon name="arrow" size={16} /></button>
          </div>
        )}
      </aside>
    </>
  );
};

// ----- Image placeholder helper -----
const Placeholder = ({ tone = 'cream', label, style }) => (
  <div className={'placeholder tone-' + tone} style={style}>
    {label && <span className="placeholder-label">{label}</span>}
  </div>
);

// ----- Product card -----
const ProductCard = ({ product, navigate, addToCart }) => {
  const [hover, setHover] = useState(false);
  return (
    <article className="product-card"
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onClick={() => navigate({ page: 'product', productId: product.id })}>
      <div className="product-img-wrap">
        {product.badge && <span className={'product-tag' + (product.badge === 'Bestseller' ? ' gold' : '')}>{product.badge}</span>}
        {product.image
          ? <img src={product.image} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)' }} className="product-img" />
          : <Placeholder tone={product.tone} label={product.name.split(' ').slice(0, 2).join(' ')} />}
        <button className="product-quick" onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}>
          + Add to Cart
        </button>
      </div>
      <div className="product-meta">
        <div>
          <h3 className="product-name">{product.name}</h3>
          <div className="product-cat">{product.categoryName}</div>
        </div>
        <div className="product-price">{fmtPrice(product.price)}</div>
      </div>
    </article>
  );
};

Object.assign(window, { Icon, LogoMark, Logo, Ticker, Navbar, Footer, SearchOverlay, CartDrawer, Placeholder, ProductCard, fmtPrice });
