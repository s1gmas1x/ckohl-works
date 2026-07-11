<template>
  <q-page class="margots-page">
    <section class="margots-hero">
      <div class="margots-container margots-hero__grid">
        <div class="margots-hero__copy">
          <p class="margots-kicker">Ckohl Works demonstration</p>
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
              label="View Menu"
              href="#menu"
              class="ckw-btn ckw-btn--primary"
            />
            <q-btn
              outline
              no-caps
              label="Find a Location"
              href="#locations"
              class="ckw-btn ckw-btn--outline"
            />
          </div>
          <small>This is a static Ckohl Works demonstration. Ordering is not live.</small>
        </div>
        <figure class="margots-hero__visual">
          <img :src="mockup" alt="Margot's Pizza flapper illustration holding a pizza" />
        </figure>
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
        <h2 class="margots-heading">A menu that works on the phone in front of the customer.</h2>
        <div class="margots-menu-grid">
          <article v-for="pizza in pizzas" :key="pizza.name">
            <div class="pizza-card__image" :class="pizza.variant"></div>
            <h3>{{ pizza.name }}</h3>
            <p>{{ pizza.description }}</p>
            <strong>{{ pizza.price }}</strong>
          </article>
        </div>
      </div>
    </section>

    <section id="locations" class="margots-section margots-location">
      <div class="margots-container margots-location__grid">
        <div>
          <p class="margots-kicker">Find Margot's</p>
          <h2 class="margots-heading">Good pizza should be easy to find.</h2>
          <p>
            Colorado Springs, CO<br />Classic restaurant recreation<br /><span
              >Demo location only</span
            >
          </p>
        </div>
        <div class="margots-location__actions">
          <q-btn
            unelevated
            no-caps
            color="primary"
            label="Get Directions"
            href="#locations"
            class="ckw-btn ckw-btn--primary"
          /><q-btn
            outline
            no-caps
            label="Read Reviews"
            href="#reviews"
            class="ckw-btn ckw-btn--outline"
          />
        </div>
      </div>
    </section>

    <section id="reviews" class="margots-section margots-review">
      <div class="margots-container">
        <p class="margots-kicker">Customer Experience Demo</p>
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
import mockup from '@/assets/images/mockup/margots-pizza-mockup.png'

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
  },
  {
    name: 'The Classic',
    description: 'Sausage, mozzarella, and house sauce.',
    price: '$17',
    variant: 'pizza-card__image--sausage',
  },
  {
    name: 'The Deluxe',
    description: 'Pepperoni, sausage, green pepper, and mozzarella.',
    price: '$19',
    variant: 'pizza-card__image--deluxe',
  },
  {
    name: 'The Cheese',
    description: 'House sauce and mozzarella.',
    price: '$15',
    variant: 'pizza-card__image--cheese',
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
.margots-hero {
  padding: 110px 0 72px;
  background:
    radial-gradient(circle at 68% 40%, rgba(184, 116, 25, 0.3), transparent 34%),
    linear-gradient(120deg, #250809, #120405);
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
.margots-hero__visual {
  min-height: 420px;
  border: 1px solid rgba(217, 168, 59, 0.6);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
  overflow: hidden;
}
.margots-hero__visual img {
  display: block;
  width: 185%;
  max-width: none;
  height: 100%;
  min-height: 420px;
  object-fit: cover;
  object-position: 77% 17%;
  transform: translateX(-41%);
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
  background: radial-gradient(circle at 50% 50%, #e9aa42 0 38%, #9d351e 39% 54%, #4b1712 55%);
  border: 1px solid rgba(217, 168, 59, 0.4);
}
.pizza-card__image--sausage {
  filter: hue-rotate(12deg);
}
.pizza-card__image--deluxe {
  filter: saturate(1.4) hue-rotate(-10deg);
}
.pizza-card__image--cheese {
  filter: sepia(0.35) brightness(1.1);
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
  .margots-hero {
    padding-top: 90px;
  }
  .margots-actions-grid,
  .margots-menu-grid {
    grid-template-columns: 1fr;
  }
  .margots-hero__visual {
    max-width: 420px;
    min-height: 300px;
  }
  .margots-hero__visual img {
    min-height: 300px;
  }
  .margots-actions .q-btn,
  .margots-location__actions .q-btn {
    width: 100%;
  }
}
</style>
