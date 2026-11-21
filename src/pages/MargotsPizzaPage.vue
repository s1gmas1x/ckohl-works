<template>
  <q-page id="top" class="margots-page">
    <header class="margots-demo-shell">
      <RouterLink to="/" class="margots-demo-shell__return" aria-label="Back to Ckohl Works">
        <q-icon name="arrow_back" size="18px" />
        <span>Ckohl Works</span>
      </RouterLink>
      <button
        type="button"
        class="margots-demo-shell__brand"
        @click="scrollToSection('top')"
        aria-label="Margot's Pizza, back to top"
      >
        <img :src="margotsEmblem" alt="" />
        <span>Margot's Pizza</span>
      </button>
      <nav class="margots-demo-shell__nav" aria-label="Margot's Pizza sections">
        <button type="button" @click="scrollToSection('menu')">Menu</button>
        <button type="button" @click="scrollToSection('demo-flow')">Tap &amp; Scan</button>
      </nav>
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

    <section class="margots-hero" :style="{ '--margots-hero-image': `url(${heroImage})` }">
      <div class="margots-mobile-title">
        <img :src="margotsEmblem" alt="" class="margots-mobile-title__mark" />
        <div class="margots-mobile-title__copy">
          <p>Colorado Springs</p>
          <p>Margot's Pizza</p>
        </div>
      </div>
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
              color="primary"
              label="View Sample Menu"
              @click="scrollToSection('menu')"
              class="ckw-btn ckw-btn--primary"
            />
            <q-btn
              outline
              no-caps
              label="See the Card Flow"
              @click="scrollToSection('demo-flow')"
              class="ckw-btn ckw-btn--outline"
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
            color="primary"
            label="Back to Menu"
            @click="scrollToSection('menu')"
            class="ckw-btn ckw-btn--primary"
          /><q-btn
            outline
            no-caps
            label="See the Demo Flow"
            @click="scrollToSection('demo-flow')"
            class="ckw-btn ckw-btn--outline"
          />
        </div>
      </div>
    </section>

    <section id="demo-flow" class="margots-section margots-review">
      <div class="margots-container margots-flow__grid">
        <div class="margots-flow__copy">
          <p class="margots-kicker">NFC / QR Demonstration</p>
          <h2 class="margots-heading">One card. A useful next step.</h2>
          <p>
            A customer taps the card or scans its QR code to open this sample destination. A live
            card could guide them to the menu, directions, reviews, or catering.
          </p>
          <small>The printed card is a concept; NFC is not active in this demo.</small>
        </div>
        <div class="margots-tap-card" aria-label="Margot's Pizza tap and scan card concept">
          <div class="margots-tap-card__identity">
            <img :src="margotsEmblem" alt="" />
            <div>
              <strong>Margot's Pizza</strong>
              <span>Colorado Springs · Est. 1925</span>
            </div>
          </div>
          <div class="margots-tap-card__scan">
            <div>
              <span class="margots-tap-card__prompt">Tap or scan</span>
              <p>Open the Margot's Pizza demo</p>
              <q-icon name="nfc" size="32px" aria-hidden="true" />
            </div>
            <a
              href="https://ckohl-works.netlify.app/#/margots-pizza"
              aria-label="Open the Margot's Pizza demo"
            >
              <img :src="demoQr" alt="QR code linking to the Margot's Pizza demo" />
            </a>
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import heroImage from '@/assets/images/mockup/margots-pizza-hero-v2.webp'
import margotsEmblem from '@/assets/images/mockup/margots-emblem.webp'
import demoQr from '@/assets/images/mockup/margots-demo-qr.svg'
import pepperoniImage from '@/assets/images/mockup/margots-pizza-pepperoni-v2.png'
import sausageImage from '@/assets/images/mockup/margots-pizza-sausage-v2.png'
import deluxeImage from '@/assets/images/mockup/margots-pizza-deluxe-v2.png'
import cheeseImage from '@/assets/images/mockup/margots-pizza-cheese-v2.png'

const scrollToSection = (id) => {
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
.margots-mobile-title,
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
  grid-template-columns: auto auto 1fr;
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
  white-space: nowrap;
}
.margots-demo-shell__brand img {
  width: 42px;
  height: 42px;
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
  display: none;
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
.margots-page :deep(.ckw-btn) {
  font-family: 'Julius Sans One', sans-serif;
}
.margots-hero small {
  color: #c7a96c;
}
.margots-hero__grid::after {
  content: '';
  min-height: 420px;
}
.margots-page .ckw-btn--outline {
  color: #f5dfb0 !important;
  border-color: rgba(217, 168, 59, 0.72) !important;
  background: rgba(26, 5, 7, 0.6);
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
.margots-actions-grid :deep(.q-icon) {
  color: #d9a83b;
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
.margots-flow__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 460px);
  gap: 56px;
  align-items: center;
}
.margots-flow__copy small {
  display: block;
  margin-top: 14px;
  color: #bca77f;
}
.margots-tap-card {
  min-width: 0;
  padding: 24px;
  border: 1px solid rgba(217, 168, 59, 0.65);
  border-radius: 12px;
  background: radial-gradient(circle at 85% 10%, #681e28, #330b12 60%, #20070b);
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.28),
    inset 0 0 0 5px #28090e;
}
.margots-tap-card__identity,
.margots-tap-card__scan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.margots-tap-card__identity {
  justify-content: flex-start;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(217, 168, 59, 0.4);
}
.margots-tap-card__identity img {
  width: 65px;
  height: 65px;
  object-fit: contain;
}
.margots-tap-card__identity strong {
  display: block;
  color: #f5dfb0;
  font-family: 'Limelight', Georgia, serif;
  font-size: clamp(1.35rem, 2vw, 1.7rem);
  font-weight: 400;
  line-height: 1.2;
}
.margots-tap-card__identity span,
.margots-tap-card__prompt {
  color: #d9a83b;
  font-family: 'Julius Sans One', sans-serif;
  font-size: 0.66rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.margots-tap-card__scan {
  padding-top: 18px;
}
.margots-review .margots-tap-card__scan p {
  max-width: 200px;
  margin: 6px 0 12px;
  color: #f5dfb0;
  font-size: 0.86rem;
}
.margots-tap-card__scan :deep(.q-icon) {
  color: #d9a83b;
}
.margots-tap-card__scan a {
  display: block;
  flex: 0 0 118px;
  padding: 8px;
  border-radius: 4px;
  background: #fff;
}
.margots-tap-card__scan a:focus-visible {
  outline: 3px solid #f5dfb0;
  outline-offset: 4px;
}
.margots-tap-card__scan a img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
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
  .margots-demo-shell {
    grid-template-columns: auto minmax(0, 1fr);
  }
  .margots-demo-shell__brand,
  .margots-demo-shell__nav {
    display: none;
  }
  .margots-demo-shell__ticker {
    display: block;
  }
  .margots-flow__grid {
    grid-template-columns: 1fr;
    gap: 28px;
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
  .margots-mobile-title {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 16px 56px 16px 12px;
  }
  .margots-mobile-title__mark {
    display: block;
    flex: 0 0 90px;
    width: 90px;
    height: 72px;
    object-fit: contain;
  }
  .margots-mobile-title__copy {
    min-width: 0;
  }
  .margots-mobile-title p:first-child {
    margin: 0 0 8px;
    color: #d9a83b;
    font-family: 'Julius Sans One', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }
  .margots-mobile-title p:last-child {
    margin: 0;
    color: #d9a83b;
    font-family: 'Limelight', Georgia, serif;
    font-size: clamp(1.45rem, 6vw, 2.5rem);
    line-height: 1.1;
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
  .margots-tap-card {
    padding: 18px;
  }
  .margots-tap-card__scan a {
    flex-basis: 96px;
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
