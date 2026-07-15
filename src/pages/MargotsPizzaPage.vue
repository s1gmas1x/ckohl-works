<template>
  <q-page class="margots-page">
    <header class="margots-demo-shell">
      <RouterLink to="/" class="margots-demo-shell__return">
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

    <section class="margots-hero" :style="{ '--margots-hero-image': `url(${heroImage})` }">
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
              href="#menu"
              class="ckw-btn ckw-btn--primary"
            />
            <q-btn
              outline
              no-caps
              label="See the Card Flow"
              href="#demo-flow"
              class="ckw-btn ckw-btn--outline"
            />
          </div>
          <small>This is a static Ckohl Works demonstration. Ordering is not live.</small>
        </div>
      </div>
    </section>

    <section class="margots-section" aria-label="Restaurant actions">
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
            <div
              class="pizza-card__image"
              :class="pizza.variant"
              :style="{ '--pizza-image': `url(${menuPreviewImage})` }"
              role="img"
              :aria-label="pizza.imageAlt"
            ></div>
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
            href="#menu"
            class="ckw-btn ckw-btn--primary"
          /><q-btn
            outline
            no-caps
            label="See the Demo Flow"
            href="#demo-flow"
            class="ckw-btn ckw-btn--outline"
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
import heroImage from '@/assets/images/mockup/margots-pizza-hero.png'
import menuPreviewImage from '@/assets/images/mockup/margots-pizza-mockup.png'

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
    variant: 'pizza-card__image--pepperoni',
    imageAlt: 'Thin deck pepperoni pizza with sauce near the edge and cupped pepperoni',
  },
  {
    name: 'The Classic',
    description: 'Sausage, mozzarella, and house sauce.',
    price: '$17',
    variant: 'pizza-card__image--sausage',
    imageAlt: 'Thin deck sausage pizza with a crisp, lightly blistered edge',
  },
  {
    name: 'The Deluxe',
    description: 'Pepperoni, sausage, green pepper, and mozzarella.',
    price: '$19',
    variant: 'pizza-card__image--deluxe',
    imageAlt: 'Thin deck deluxe pizza with pepperoni, sausage, green pepper, and cheese',
  },
  {
    name: 'The Cheese',
    description: 'House sauce and mozzarella.',
    price: '$15',
    variant: 'pizza-card__image--cheese',
    imageAlt: 'Thin deck cheese pizza with sauce and browned mozzarella',
  },
]
</script>

<style lang="scss" scoped>
.margots-page {
  min-height: 100vh;
  background: #1c0708;
  color: #f5dfb0;
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
  gap: 22px;
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
  text-decoration: none;
  text-transform: none;
}
.margots-demo-shell__return:hover {
  color: #d9a83b;
}
.margots-demo-shell__ticker {
  overflow: hidden;
  color: #c7a96c;
  font-size: 0.7rem;
  font-weight: 800;
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
  padding: 78px 0 72px;
  background:
    linear-gradient(90deg, rgba(25, 3, 5, 0.98), rgba(25, 3, 5, 0.93) 38%, rgba(25, 3, 5, 0.2) 74%),
    var(--margots-hero-image) center / cover no-repeat;
}
.margots-hero__grid,
.margots-location__grid {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr);
  gap: 54px;
  align-items: center;
}
.margots-kicker {
  margin: 0 0 10px;
  color: #d9a83b;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.margots-brand {
  margin: 0;
  color: #d9a83b;
  font-family: Georgia, serif;
  font-size: clamp(2.4rem, 6vw, 5.5rem);
}
.margots-hero h1,
.margots-heading {
  margin: 12px 0;
  color: #f9e8c3;
  font-family: Georgia, serif;
  line-height: 1.08;
}
.margots-hero h1 {
  font-size: clamp(2.25rem, 4vw, 4rem);
}
.margots-hero__copy > p:not(.margots-kicker):not(.margots-brand),
.margots-review p,
.margots-location p {
  max-width: 580px;
  color: #e4cfa6;
  font-size: 1.08rem;
  line-height: 1.7;
}
.margots-actions,
.margots-location__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 26px 0 14px;
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
  padding: 72px 0;
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
  padding: 22px;
  background: #260b0d;
  border: 1px solid rgba(217, 168, 59, 0.45);
}
.margots-actions-grid :deep(.q-icon) {
  color: #d9a83b;
}
.margots-actions-grid h2,
.margots-menu-grid h3 {
  margin: 12px 0 6px;
  color: #f7e5bd;
  font-family: Georgia, serif;
}
.margots-actions-grid p,
.margots-menu-grid p {
  margin: 0;
  color: #d8c19a;
  line-height: 1.55;
}
.margots-heading {
  font-size: clamp(2rem, 4vw, 3rem);
}
.pizza-card__image {
  aspect-ratio: 1.35;
  background-color: #1a0808;
  background-image: var(--pizza-image);
  background-repeat: no-repeat;
  background-size: 450% auto;
  background-position: 4.5% 46.7%;
  border: 1px solid rgba(217, 168, 59, 0.4);
}
.pizza-card__image--sausage {
  background-position: 34.4% 46.7%;
}
.pizza-card__image--deluxe {
  background-position: 64.9% 46.7%;
}
.pizza-card__image--cheese {
  background-position: 95.1% 46.7%;
}
.margots-menu-note {
  margin: -2px 0 24px;
  color: #c7a96c;
  line-height: 1.5;
}
.margots-menu-grid strong {
  display: block;
  margin-top: 12px;
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
}
@media (max-width: 560px) {
  .margots-demo-shell {
    min-height: 44px;
    gap: 14px;
  }
  .margots-demo-shell__ticker {
    font-size: 0.61rem;
  }
  .margots-hero {
    padding-top: 42px;
  }
  .margots-actions-grid,
  .margots-menu-grid {
    grid-template-columns: 1fr;
  }
  .margots-hero {
    background-position: 65% center;
  }
  .margots-hero__grid::after {
    display: none;
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
