<template>
  <q-page id="top" class="margots-page">
    <header class="margots-demo-shell">
      <RouterLink to="/" class="margots-demo-shell__return" aria-label="Back to Ckohl Works">
        <q-icon name="arrow_back" size="18px" />
        <span>Ckohl Works</span>
      </RouterLink>
      <div
        class="margots-demo-shell__ticker"
        aria-label="Ckohl Works demonstration only. Ordering is not live."
      >
        <div class="margots-demo-shell__ticker-track" aria-hidden="true">
          <span>Ckohl Works demonstration only</span>
          <span>Restaurant destination example</span>
          <span>Ordering is not live</span>
          <span>Ckohl Works demonstration only</span>
          <span>Restaurant destination example</span>
          <span>Ordering is not live</span>
        </div>
      </div>
    </header>

    <nav class="margots-site-nav" aria-label="Margot's Pizza" @keydown.esc="closeMenu">
      <div class="margots-container margots-site-nav__inner">
        <button
          type="button"
          class="margots-demo-shell__brand"
          aria-label="Margot's Pizza, back to top"
          @click="scrollToSection('top')"
        >
          <img :src="margotsEmblem" alt="" />
          <span>
            <small>Colorado Springs</small>
            Margot's Pizza
          </span>
        </button>
        <button
          ref="menuToggle"
          type="button"
          class="margots-site-nav__toggle"
          aria-controls="margots-section-links"
          :aria-expanded="menuOpen"
          aria-label="Toggle section navigation"
          @click="menuOpen = !menuOpen"
        >
          <q-icon :name="menuOpen ? 'close' : 'menu'" size="26px" aria-hidden="true" />
        </button>
        <div
          id="margots-section-links"
          class="margots-demo-shell__nav"
          :class="{ 'is-open': menuOpen }"
        >
          <button type="button" @click="scrollToSection('menu')">Menu</button>
          <button type="button" @click="scrollToSection('demo-flow')">Demo Flow</button>
        </div>
      </div>
    </nav>

    <section class="margots-hero" :style="{ '--margots-hero-image': `url(${heroImage})` }">
      <div
        class="margots-mobile-art"
        role="img"
        aria-label="Margot holding a thin pepperoni pizza against a Colorado mountain backdrop"
      ></div>
      <div class="margots-container margots-hero__grid">
        <div class="margots-hero__copy">
          <p class="margots-kicker">Colorado Springs</p>
          <p class="margots-brand">Margot's Pizza</p>
          <h1>A classic Colorado Springs pizza tradition, preserved.</h1>
          <p>
            See how a restaurant NFC card or QR code can bring customers to the menu, directions,
            and the next useful action.
          </p>
          <div class="margots-actions">
            <q-btn
              unelevated
              no-caps
              label="View Sample Menu"
              @click="scrollToSection('menu')"
              class="margots-button margots-button--primary"
            />
            <q-btn
              unelevated
              no-caps
              label="See the Card Flow"
              @click="scrollToSection('demo-flow')"
              class="margots-button"
            />
          </div>
          <small>This is a static Ckohl Works demonstration. Ordering is not live.</small>
        </div>
      </div>
    </section>

    <section class="margots-section" aria-label="Restaurant actions">
      <div class="margots-mobile-mark margots-container">
        <img :src="margotsEmblem" alt="Illustrated Margot holding a pizza" />
        <strong>Margot's Pizza</strong>
        <span>Est. 1925</span>
      </div>
      <div class="margots-container margots-actions-grid">
        <article v-for="action in actions" :key="action.title">
          <q-icon :name="action.icon" size="28px" />
          <h2>{{ action.title }}</h2>
          <p>{{ action.description }}</p>
        </article>
      </div>
    </section>

    <section id="menu" class="margots-section">
      <div class="margots-container">
        <p class="margots-kicker">Signature Pizzas</p>
        <h2 class="margots-heading">
          A menu preview built for the phone in front of the customer.
        </h2>
        <p class="margots-menu-note">Sample items and prices for this restaurant demonstration.</p>
        <div class="margots-menu-grid">
          <article v-for="pizza in pizzas" :key="pizza.name">
            <img
              class="pizza-card__image"
              :src="pizza.image"
              :alt="pizza.imageAlt"
              loading="lazy"
            />
            <h3>{{ pizza.name }}</h3>
            <p>{{ pizza.description }}</p>
            <strong>{{ pizza.price }}</strong>
          </article>
        </div>
      </div>
    </section>

    <section id="demo-destinations" class="margots-section margots-location">
      <div class="margots-container margots-location__grid">
        <div>
          <p class="margots-kicker">Configured Destinations</p>
          <h2 class="margots-heading">One card can guide a customer to the useful next step.</h2>
          <p>
            This demo would connect a customer to a restaurant's menu, directions, review request,
            or catering inquiry.<br /><span>Destinations are illustrative and not live.</span>
          </p>
        </div>
        <div class="margots-location__actions">
          <q-btn
            unelevated
            no-caps
            label="Back to Menu"
            @click="scrollToSection('menu')"
            class="margots-button margots-button--primary"
          /><q-btn
            unelevated
            no-caps
            label="See the Demo Flow"
            @click="scrollToSection('demo-flow')"
            class="margots-button"
          />
        </div>
      </div>
    </section>

    <section id="demo-flow" class="margots-section margots-review">
      <div class="margots-container">
        <p class="margots-kicker">NFC / QR Demonstration</p>
        <h2 class="margots-heading">
          Menu, directions, reviews, and contact can all begin with one tap or scan.
        </h2>
        <p>
          For a live customer, these buttons would be configured with the restaurant's real
          destinations and updated manually during the early beta.
        </p>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import heroImage from '@/assets/images/mockup/margots-pizza-hero-v2.webp'
import margotsEmblem from '@/assets/images/mockup/margots-emblem.webp'
import pepperoniImage from '@/assets/images/mockup/margots-pizza-pepperoni-v2.png'
import sausageImage from '@/assets/images/mockup/margots-pizza-sausage-v2.png'
import deluxeImage from '@/assets/images/mockup/margots-pizza-deluxe-v2.png'
import cheeseImage from '@/assets/images/mockup/margots-pizza-cheese-v2.png'

const menuOpen = ref(false)
const menuToggle = ref(null)

const closeMenu = () => {
  if (!menuOpen.value) return
  menuOpen.value = false
  menuToggle.value?.focus()
}

const scrollToSection = (id) => {
  closeMenu()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const actions = [
  {
    icon: 'menu_book',
    title: 'Menu',
    description: 'Show customers the current favorites and prices.',
  },
  { icon: 'place', title: 'Directions', description: 'Make the next location simple to reach.' },
  {
    icon: 'star_outline',
    title: 'Reviews',
    description: 'Give happy customers a clear next step.',
  },
  { icon: 'event', title: 'Catering', description: 'Bring event inquiries to the right contact.' },
]
const pizzas = [
  {
    name: 'The Margot',
    description: 'Pepperoni, mozzarella, and house sauce.',
    price: '$17',
    image: pepperoniImage,
    imageAlt: 'Thin deck pepperoni pizza with sauce near the edge and cupped pepperoni',
  },
  {
    name: 'The Classic',
    description: 'Sausage, mozzarella, and house sauce.',
    price: '$17',
    image: sausageImage,
    imageAlt: 'Thin deck sausage pizza with a crisp, lightly blistered edge',
  },
  {
    name: 'The Deluxe',
    description: 'Pepperoni, sausage, green pepper, and mozzarella.',
    price: '$19',
    image: deluxeImage,
    imageAlt: 'Thin deck deluxe pizza with pepperoni, sausage, green pepper, and cheese',
  },
  {
    name: 'The Cheese',
    description: 'House sauce and mozzarella.',
    price: '$15',
    image: cheeseImage,
    imageAlt: 'Thin deck cheese pizza with sauce and browned mozzarella',
  },
]
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&family=Limelight&family=Montserrat:wght@400;500;600;700&display=swap');

.margots-page {
  min-height: 100vh;
  background: #1c0708;
  color: #f5dfb0;
  font-family: 'Montserrat', sans-serif;
}
.margots-mobile-art {
  display: none;
}
.margots-mobile-mark {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 30px;
  text-align: center;
}
.margots-mobile-mark::before,
.margots-mobile-mark::after {
  position: absolute;
  top: 100px;
  width: calc(50% - 155px);
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(217, 168, 59, 0.65));
  content: '';
}
.margots-mobile-mark::before {
  left: 0;
}
.margots-mobile-mark::after {
  right: 0;
  transform: rotate(180deg);
}
.margots-mobile-mark img {
  display: block;
  width: 200px;
  height: auto;
}
.margots-mobile-mark strong {
  margin-top: -8px;
  color: #d9a83b;
  font-family: 'Limelight', Georgia, serif;
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.15;
}
.margots-mobile-mark span {
  margin-top: 6px;
  color: #d9a83b;
  font-family: 'Julius Sans One', sans-serif;
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
#menu,
#demo-flow,
#top {
  scroll-margin-top: 60px;
}
.margots-container {
  width: min(1160px, calc(100% - 32px));
  margin: 0 auto;
}
.margots-demo-shell {
  position: sticky;
  top: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 24px;
  align-items: center;
  min-height: 48px;
  padding: 0 max(16px, calc((100% - 1160px) / 2));
  background: #100304;
  border-bottom: 1px solid rgba(217, 168, 59, 0.28);
  overflow: hidden;
}
.margots-demo-shell__return {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  color: #f5dfb0;
  letter-spacing: 0;
  font-family: 'Julius Sans One', sans-serif;
  text-decoration: none;
  text-transform: none;
}
.margots-demo-shell__return:hover {
  color: #d9a83b;
}
.margots-site-nav {
  position: relative;
  z-index: 9;
  background: #1c0708;
  border-bottom: 1px solid rgba(217, 168, 59, 0.28);
}
.margots-site-nav__inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.margots-site-nav__toggle {
  display: none;
}
.margots-demo-shell__brand small {
  display: block;
  margin-bottom: 3px;
  font-family: 'Julius Sans One', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.12em;
}
.margots-demo-shell__brand {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #d9a83b;
  font-family: 'Limelight', Georgia, serif;
  font-size: 1.05rem;
  text-decoration: none;
  text-align: left;
}
.margots-demo-shell__brand img {
  width: 78px;
  height: 58px;
  object-fit: contain;
}
.margots-demo-shell__nav {
  display: flex;
  justify-content: flex-end;
  gap: 24px;
}
.margots-demo-shell__nav button {
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: #f5dfb0;
  font-family: 'Julius Sans One', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-decoration: none;
  text-transform: uppercase;
}
.margots-demo-shell__nav button:hover,
.margots-demo-shell__nav button:focus-visible {
  color: #d9a83b;
}
.margots-demo-shell__ticker {
  overflow: hidden;
  color: #c7a96c;
  font-size: 0.7rem;
  font-family: 'Julius Sans One', sans-serif;
  letter-spacing: 0.09em;
  white-space: nowrap;
  text-transform: uppercase;
}
.margots-demo-shell__ticker-track {
  display: inline-flex;
  gap: 34px;
  width: max-content;
  animation: margots-demo-ticker 24s linear infinite;
}
.margots-demo-shell__ticker-track span::before {
  margin-right: 34px;
  color: #d9a83b;
  content: '*';
}
@keyframes margots-demo-ticker {
  to {
    transform: translateX(-50%);
  }
}
.margots-hero {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  min-height: 620px;
  padding: 64px 0 60px;
  background:
    linear-gradient(90deg, rgba(25, 3, 5, 0.98), rgba(25, 3, 5, 0.93) 38%, rgba(25, 3, 5, 0.2) 74%),
    var(--margots-hero-image) center top / cover no-repeat;
}
.margots-hero__grid,
.margots-location__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  gap: 44px;
  align-items: center;
}
.margots-kicker {
  margin: 0 0 10px;
  color: #d9a83b;
  font-size: 0.75rem;
  font-family: 'Julius Sans One', sans-serif;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.margots-brand {
  margin: 0;
  color: #d9a83b;
  font-family: 'Limelight', Georgia, serif;
  font-size: clamp(2.5rem, 4vw, 4rem);
  line-height: 1.12;
}
.margots-hero h1,
.margots-heading {
  margin: 16px 0;
  color: #f9e8c3;
  font-family: 'Limelight', Georgia, serif;
  line-height: 1.08;
}
.margots-hero h1 {
  max-width: 620px;
  font-size: clamp(2rem, 3vw, 3rem);
}
.margots-hero__copy > p:not(.margots-kicker):not(.margots-brand),
.margots-review p,
.margots-location p {
  max-width: 580px;
  color: #e4cfa6;
  font-size: 1rem;
  line-height: 1.65;
}
.margots-actions,
.margots-location__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 22px 0 12px;
}
.margots-page .margots-button {
  --button-gold: #d9a83b;
  min-height: 48px;
  padding: 8px 22px;
  border: 1px solid var(--button-gold);
  border-radius: 0;
  background: #260b0d;
  color: #f7e5bd;
  font-family: 'Julius Sans One', sans-serif;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.margots-page .margots-button::after {
  position: absolute;
  inset: 4px;
  background: conic-gradient(from 90deg at 1px 1px, transparent 25%, var(--button-gold) 0) 0 0 /
    calc(100% - 1px) calc(100% - 1px);
  mask: conic-gradient(at 9px 9px, transparent 25%, #000 0) 0 0 / calc(100% - 9px) calc(100% - 9px);
  pointer-events: none;
  content: '';
}
.margots-page .margots-button--primary {
  --button-gold: #f5cf79;
  background: #7d451c;
}
.margots-page .margots-button:focus-visible {
  outline: 2px solid #f5cf79;
  outline-offset: 3px;
}
.margots-hero small {
  color: #c7a96c;
}
.margots-hero__grid::after {
  content: '';
  min-height: 420px;
}
.margots-section {
  padding: 56px 0;
  border-top: 1px solid rgba(217, 168, 59, 0.3);
}
.margots-actions-grid,
.margots-menu-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.margots-actions-grid article,
.margots-menu-grid article {
  min-width: 0;
  padding: 18px;
  background: #260b0d;
  border: 1px solid rgba(217, 168, 59, 0.45);
}
.margots-actions-grid article {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-height: 164px;
  padding: 20px;
  background: #23090b;
  border-color: rgba(217, 168, 59, 0.28);
}
.margots-actions-grid :deep(.q-icon) {
  color: #d9a83b;
  line-height: 1;
}
.margots-actions-grid h2,
.margots-menu-grid h3 {
  margin: 12px 0 8px;
  color: #f7e5bd;
  font-family: 'Limelight', Georgia, serif;
  font-weight: 400;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.margots-actions-grid h2 {
  margin: 10px 0 6px;
  font-size: clamp(1.35rem, 2vw, 1.75rem);
}
.margots-menu-grid h3 {
  font-size: clamp(1.4rem, 2vw, 1.8rem);
}
.margots-actions-grid p,
.margots-menu-grid p {
  margin: 0;
  color: #d8c19a;
  font-size: 0.94rem;
  line-height: 1.55;
}
.margots-heading {
  max-width: 900px;
  font-size: clamp(1.8rem, 2.8vw, 2.5rem);
  line-height: 1.2;
}
.pizza-card__image {
  display: block;
  width: 100%;
  aspect-ratio: 1.35;
  object-fit: cover;
  border: 1px solid rgba(217, 168, 59, 0.4);
}
.margots-menu-note {
  margin: 0 0 22px;
  color: #c7a96c;
  line-height: 1.5;
}
.margots-menu-grid strong {
  display: block;
  margin-top: 14px;
  color: #d9a83b;
}
.margots-location {
  background: #250809;
}
.margots-location p span {
  color: #c7a96c;
  font-size: 0.9rem;
}
.margots-location__actions {
  justify-content: flex-end;
}
.margots-review {
  background: linear-gradient(180deg, #160506, #260b0d);
}
.margots-review p {
  margin: 0;
}
@media (max-width: 860px) {
  .margots-site-nav__inner {
    width: calc(100% - 16px);
  }
  .margots-demo-shell__brand {
    margin-inline-start: -8px;
    gap: 0;
    font-size: clamp(1.25rem, 5.5vw, 2rem);
    line-height: 1.1;
  }
  .margots-demo-shell__brand img {
    width: clamp(88px, 26vw, 112px);
    height: 84px;
    flex-shrink: 0;
    object-position: left center;
  }
  .margots-site-nav__toggle {
    display: grid;
    place-items: center;
    flex: 0 0 44px;
    min-height: 44px;
    padding: 0;
    border: 0;
    background: transparent;
    color: #f5dfb0;
    cursor: pointer;
  }
  .margots-demo-shell__nav {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    flex-direction: column;
    gap: 0;
    min-width: 160px;
    border: 1px solid rgba(217, 168, 59, 0.45);
    background: #260b0d;
  }
  .margots-demo-shell__nav.is-open {
    display: flex;
  }
  .margots-demo-shell__nav button {
    min-height: 44px;
    padding: 0 16px;
    text-align: left;
  }
  .margots-demo-shell {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .margots-hero {
    display: block;
    min-height: 0;
    padding-top: 0;
    padding-bottom: 28px;
    background: #1c0708;
  }
  .margots-section[aria-label='Restaurant actions'] {
    padding-top: 0;
  }
  .margots-mobile-art {
    display: block;
    width: 100%;
    aspect-ratio: 1570 / 1002;
    background: var(--margots-hero-image) center / cover no-repeat;
  }
  .margots-mobile-mark {
    margin-bottom: 0;
    padding: 0 0 24px;
  }
  .margots-mobile-mark::before,
  .margots-mobile-mark::after {
    display: none;
  }
  .margots-mobile-mark strong {
    margin-top: -12px;
    color: #d9a83b;
    font-family: 'Limelight', Georgia, serif;
    font-size: clamp(1.6rem, 6vw, 2.5rem);
    font-weight: 400;
  }
  .margots-mobile-mark span {
    margin-top: 8px;
    color: #d9a83b;
    font-family: 'Julius Sans One', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
  }
  .margots-mobile-mark img {
    display: block;
    width: min(210px, 55vw);
    height: auto;
  }
  .margots-hero__copy {
    padding-top: 0;
  }
  .margots-hero__copy > .margots-kicker,
  .margots-hero__copy > .margots-brand {
    display: none;
  }
  .margots-hero__grid::after {
    display: none;
  }
  .margots-hero__grid,
  .margots-location__grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .margots-actions-grid,
  .margots-menu-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .margots-location__actions {
    justify-content: flex-start;
  }
  .margots-section {
    padding: 44px 0;
  }
  .margots-section[aria-label='Restaurant actions'] {
    padding-top: 0;
  }
}
@media (max-width: 560px) {
  .margots-demo-shell {
    min-height: 44px;
    gap: 14px;
  }
  .margots-demo-shell__ticker {
    font-size: 0.61rem;
  }
  .margots-mobile-art {
    aspect-ratio: 1 / 1;
    background-position: right center;
  }
  .margots-actions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .margots-actions-grid article {
    padding: 16px;
  }
  .margots-actions-grid h2 {
    font-size: 1.25rem;
  }
  .margots-menu-grid {
    grid-template-columns: 1fr;
  }
  .margots-hero h1 {
    font-size: clamp(1.8rem, 8vw, 2.3rem);
  }
  .margots-actions .q-btn,
  .margots-location__actions .q-btn {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .margots-demo-shell__ticker-track {
    animation: none;
  }
}
</style>
