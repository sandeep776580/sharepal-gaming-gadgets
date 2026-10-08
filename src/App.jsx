import { useMemo, useState } from "react";
import {
  Search,
  MapPin,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Star,
  CalendarDays,
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock3,
  Plus,
  Minus,
  Heart,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import productData from "../data/product-list.json";
import "./App.css";

function App() {
  const products = productData.products || [];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState("popular");
  const [wishlist, setWishlist] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(12);

  const categories = [
    "All",
    "PS5",
    "Gaming Consoles",
    "Controllers",
    "Gaming Accessories",
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory === "PS5") {
      result = result.filter((product) =>
        product.name.toLowerCase().includes("ps5")
      );
    }

    if (selectedCategory === "Controllers") {
      result = result.filter((product) =>
        product.name.toLowerCase().includes("controller")
      );
    }

    if (selectedCategory === "Gaming Consoles") {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes("ps5") ||
          product.name.toLowerCase().includes("playstation") ||
          product.name.toLowerCase().includes("xbox")
      );
    }

    if (selectedCategory === "Gaming Accessories") {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes("portal") ||
          product.name.toLowerCase().includes("wheel") ||
          product.name.toLowerCase().includes("accessory")
      );
    }

    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchText)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.per_day_rent - b.per_day_rent);
    }

    if (sortBy === "price-high") {
      result.sort((a, b) => b.per_day_rent - a.per_day_rent);
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    if (sortBy === "popular") {
      result.sort((a, b) => b.booked_count - a.booked_count);
    }

    return result;
  }, [products, selectedCategory, search, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleProducts);

  const addToCart = (product) => {
    if (product.out_of_stock) return;

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartTotal = cart.reduce(
    (total, item) => total + item.per_day_rent * item.quantity,
    0
  );

  const scrollToProducts = () => {
    document
      .getElementById("products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="container announcement-inner">
          <span>🎮 India's trusted rental platform for gaming & gadgets</span>
          <span className="announcement-right">
            Easy rentals • Doorstep delivery • Flexible plans
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="container header-inner">
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>

          <a href="#" className="logo">
            <span className="logo-share">share</span>
            <span className="logo-pal">pal</span>
          </a>

          <nav className={`main-nav ${mobileMenuOpen ? "open" : ""}`}>
            <a href="#products">Gaming</a>
            <a href="#categories">Categories</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#faq">FAQs</a>
          </nav>

          <div className="header-actions">
            <button
              className="icon-button"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <button className="location-button">
              <MapPin size={18} />
              <span>Bangalore</span>
              <ChevronDown size={15} />
            </button>

            <button
              className="cart-button"
              onClick={() => setShowCart(true)}
              aria-label="Shopping cart"
            >
              <ShoppingCart size={21} />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="search-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="container">
                <div className="search-box-large">
                  <Search size={20} />
                  <input
                    autoFocus
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search gaming consoles, controllers and more..."
                  />
                  {search && (
                    <button onClick={() => setSearch("")}>
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="container hero-grid">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="eyebrow">
              <span className="eyebrow-dot"></span>
              GAMING GADGETS ON RENT
            </div>

            <h1>
              Game more.
              <br />
              <span>Spend less.</span>
            </h1>

            <p>
              Rent the latest gaming consoles, controllers and accessories in
              Bangalore. Get premium gaming gear delivered straight to your
              doorstep.
            </p>

            <div className="hero-buttons">
              <button className="primary-button" onClick={scrollToProducts}>
                Explore Gaming Gear
                <ChevronRight size={18} />
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                How it works
              </button>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <ShieldCheck size={18} />
                <span>Verified Products</span>
              </div>

              <div className="trust-item">
                <Truck size={18} />
                <span>Doorstep Delivery</span>
              </div>

              <div className="trust-item">
                <RotateCcw size={18} />
                <span>Easy Returns</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            <div className="hero-glow"></div>

            <div className="hero-console-card">
              <div className="hero-card-label">TRENDING NOW</div>

              {products[0]?.image && (
                <img
                  src={products[0].image}
                  alt={products[0].name}
                  className="hero-product-image"
                />
              )}

              <div className="hero-product-info">
                <div>
                  <h3>PS5 + Games</h3>
                  <p>100+ Games + Controller</p>
                </div>

                <strong>
                  ₹{products[0]?.per_day_rent || 200}
                  <small>/day</small>
                </strong>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rental Date Bar */}
      <section className="rental-bar-section">
        <div className="container">
          <div className="rental-bar">
            <div className="rental-heading">
              <CalendarDays size={23} />
              <div>
                <strong>Plan your rental</strong>
                <span>Select your rental dates</span>
              </div>
            </div>

            <div className="date-fields">
              <label>
                <span>START DATE</span>
                <input type="date" />
              </label>

              <div className="date-arrow">→</div>

              <label>
                <span>END DATE</span>
                <input type="date" />
              </label>
            </div>

            <button className="primary-button small" onClick={scrollToProducts}>
              Browse Products
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section" id="categories">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-kicker">EXPLORE</span>
              <h2>Gaming categories</h2>
            </div>

            <button className="text-button" onClick={scrollToProducts}>
              View all <ChevronRight size={17} />
            </button>
          </div>

          <div className="category-grid">
            <button
              className={`category-card ${
                selectedCategory === "All" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("All");
                scrollToProducts();
              }}
            >
              <div className="category-icon">🎮</div>
              <strong>All Gaming</strong>
              <span>Explore everything</span>
            </button>

            <button
              className={`category-card ${
                selectedCategory === "PS5" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("PS5");
                scrollToProducts();
              }}
            >
              <div className="category-icon">◉</div>
              <strong>PlayStation</strong>
              <span>PS5 & more</span>
            </button>

            <button
              className={`category-card ${
                selectedCategory === "Controllers" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("Controllers");
                scrollToProducts();
              }}
            >
              <div className="category-icon">🎮</div>
              <strong>Controllers</strong>
              <span>Extra controllers</span>
            </button>

            <button
              className={`category-card ${
                selectedCategory === "Gaming Accessories" ? "active" : ""
              }`}
              onClick={() => {
                setSelectedCategory("Gaming Accessories");
                scrollToProducts();
              }}
            >
              <div className="category-icon">⚡</div>
              <strong>Accessories</strong>
              <span>Gaming essentials</span>
            </button>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="products-section" id="products">
        <div className="container">
          <div className="section-heading products-heading">
            <div>
              <span className="section-kicker">GAMING GADGETS</span>
              <h2>Gaming gadgets on rent</h2>
              <p>
                Choose from our collection of premium gaming products available
                in Bangalore.
              </p>
            </div>

            <div className="product-controls">
              <div className="result-count">
                {filteredProducts.length} products
              </div>

              <div className="sort-wrapper">
                <SlidersHorizontal size={17} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="filter-tabs">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category ? "filter-tab active" : "filter-tab"
                }
                onClick={() => {
                  setSelectedCategory(category);
                  setVisibleProducts(12);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {displayedProducts.length > 0 ? (
            <div className="product-grid">
              {displayedProducts.map((product, index) => (
                <motion.article
                  className="product-card"
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    duration: 0.4,
                    delay: Math.min(index * 0.04, 0.25),
                  }}
                >
                  <div className="product-image-wrapper">
                    {product.tag && (
                      <span className="product-tag">{product.tag}</span>
                    )}

                    <button
                      className={`wishlist-button ${
                        wishlist.includes(product.id) ? "liked" : ""
                      }`}
                      onClick={() => toggleWishlist(product.id)}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={18}
                        fill={
                          wishlist.includes(product.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                    />

                    {product.out_of_stock && (
                      <div className="out-of-stock-overlay">
                        <span>Currently unavailable</span>
                      </div>
                    )}
                  </div>

                  <div className="product-content">
                    <div className="product-rating">
                      <Star size={14} fill="currentColor" />
                      <strong>
                        {product.rating > 0 ? product.rating.toFixed(1) : "New"}
                      </strong>

                      {product.booked_count > 0 && (
                        <span>
                          • {product.booked_count.toLocaleString()}+ booked
                        </span>
                      )}
                    </div>

                    <h3 className="product-name">{product.name}</h3>

                    <div className="product-bottom">
                      <div className="product-price">
                        <strong>₹{product.per_day_rent}</strong>
                        <span>/ day</span>
                      </div>

                      <button
                        className={
                          product.out_of_stock
                            ? "add-button disabled"
                            : "add-button"
                        }
                        disabled={product.out_of_stock}
                        onClick={() => addToCart(product)}
                      >
                        {product.out_of_stock ? "Unavailable" : "Add"}
                        {!product.out_of_stock && <Plus size={17} />}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="empty-products">
              <div className="empty-icon">
                <Search size={30} />
              </div>
              <h3>No products found</h3>
              <p>Try another search or category.</p>
              <button
                className="primary-button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                Show all products
              </button>
            </div>
          )}

          {visibleProducts < filteredProducts.length && (
            <div className="load-more-wrapper">
              <button
                className="secondary-button"
                onClick={() => setVisibleProducts((current) => current + 12)}
              >
                Load more products
                <ChevronDown size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" id="how-it-works">
        <div className="container">
          <div className="center-heading">
            <span className="section-kicker">SIMPLE & EASY</span>
            <h2>How renting works</h2>
            <p>
              Get your favourite gaming gear delivered to your doorstep in just
              a few simple steps.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <div className="step-icon">
                <Search size={26} />
              </div>
              <h3>Choose your gear</h3>
              <p>
                Browse our collection and choose the gaming gadget you want to
                rent.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <div className="step-icon">
                <CalendarDays size={26} />
              </div>
              <h3>Select your dates</h3>
              <p>
                Pick your rental dates and provide your delivery details.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <div className="step-icon">
                <Truck size={26} />
              </div>
              <h3>Get it delivered</h3>
              <p>
                Your gaming gear is carefully packed and delivered to your
                doorstep.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <div className="step-icon">
                <RotateCcw size={26} />
              </div>
              <h3>Play & return</h3>
              <p>
                Enjoy your gaming experience and return the product when you're
                done.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container stats-grid">
          <div className="stat">
            <strong>10K+</strong>
            <span>Products rented</span>
          </div>

          <div className="stat">
            <strong>4.7/5</strong>
            <span>Average rating</span>
          </div>

          <div className="stat">
            <strong>50K+</strong>
            <span>Happy customers</span>
          </div>

          <div className="stat">
            <strong>24/7</strong>
            <span>Customer support</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="container faq-container">
          <div className="center-heading">
            <span className="section-kicker">FAQ</span>
            <h2>Frequently asked questions</h2>
          </div>

          <div className="faq-list">
            <details>
              <summary>
                How does gaming gadget rental work?
                <Plus size={20} />
              </summary>
              <p>
                Select the gaming product you want, choose your rental dates,
                complete your booking and get the product delivered to your
                doorstep.
              </p>
            </details>

            <details>
              <summary>
                Do you deliver gaming products in Bangalore?
                <Plus size={20} />
              </summary>
              <p>
                Yes. This page is designed specifically for gaming gadget
                rentals in Bangalore.
              </p>
            </details>

            <details>
              <summary>
                What happens if the product is unavailable?
                <Plus size={20} />
              </summary>
              <p>
                Products marked as unavailable cannot be added to the rental
                cart. You can choose another available product instead.
              </p>
            </details>

            <details>
              <summary>
                Can I rent a PS5 with games and controllers?
                <Plus size={20} />
              </summary>
              <p>
                Yes. The supplied product catalogue contains several PS5
                combinations with games and one or more controllers.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <div>
              <span className="section-kicker">READY TO PLAY?</span>
              <h2>Bring the gaming experience home.</h2>
              <p>
                Rent premium gaming gear without buying expensive hardware.
              </p>
            </div>

            <button className="primary-button" onClick={scrollToProducts}>
              Browse Gaming Products
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo footer-logo">
              <span className="logo-share">share</span>
              <span className="logo-pal">pal</span>
            </a>

            <p>
              Rent gaming consoles, gadgets and accessories without the heavy
              price tag.
            </p>

            <div className="footer-location">
              <MapPin size={17} />
              Bangalore, India
            </div>
          </div>

          <div className="footer-column">
            <h4>Gaming</h4>
            <a href="#products">PS5</a>
            <a href="#products">Controllers</a>
            <a href="#products">Gaming Accessories</a>
            <a href="#categories">All Categories</a>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <a href="#how-it-works">How It Works</a>
            <a href="#faq">FAQs</a>
            <a href="#products">Products</a>
          </div>

          <div className="footer-column">
            <h4>Need help?</h4>
            <a href="#faq">Help Centre</a>
            <a href="#faq">Rental FAQs</a>
            <a href="#faq">Contact Support</a>
          </div>
        </div>

        <div className="container footer-bottom">
          <span>© 2026 SharePal Gaming Rentals. Assignment recreation.</span>
          <span>Made for the SharePal frontend assignment.</span>
        </div>
      </footer>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div
              className="cart-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
            />

            <motion.aside
              className="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28 }}
            >
              <div className="cart-header">
                <div>
                  <span className="section-kicker">YOUR CART</span>
                  <h2>Rental cart</h2>
                </div>

                <button
                  className="close-button"
                  onClick={() => setShowCart(false)}
                >
                  <X size={22} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="cart-empty">
                  <ShoppingCart size={42} />
                  <h3>Your cart is empty</h3>
                  <p>Add gaming products to start your rental.</p>

                  <button
                    className="primary-button"
                    onClick={() => {
                      setShowCart(false);
                      scrollToProducts();
                    }}
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div className="cart-item" key={item.id}>
                        <img src={item.image} alt={item.name} />

                        <div className="cart-item-content">
                          <h4>{item.name}</h4>

                          <strong>₹{item.per_day_rent}/day</strong>

                          <div className="quantity-controls">
                            <button onClick={() => removeFromCart(item.id)}>
                              <Minus size={15} />
                            </button>

                            <span>{item.quantity}</span>

                            <button onClick={() => addToCart(item)}>
                              <Plus size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-footer">
                    <div className="cart-total">
                      <span>Estimated daily rental</span>
                      <strong>₹{cartTotal}</strong>
                    </div>

                    <button className="primary-button checkout-button">
                      Continue to booking
                      <ChevronRight size={18} />
                    </button>

                    <small>
                      Final rental price may depend on rental duration and
                      delivery details.
                    </small>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;