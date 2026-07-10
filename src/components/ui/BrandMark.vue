<template>
  <RouterLink :to="to" class="brand-mark" :aria-label="ariaLabel">
    <span class="brand-mark__sigil" aria-hidden="true">
      <span>{{ leftBrace }}</span>
      <strong>CK</strong>
      <span>{{ rightBrace }}</span>
    </span>
    <span class="brand-mark__wordmark">
      <span>C K O H L</span>
      <span>W O R K S</span>
    </span>
  </RouterLink>
</template>

<script setup>
defineProps({
  to: {
    type: [String, Object],
    default: '/',
  },
  ariaLabel: {
    type: String,
    default: 'CKohl Works home',
  },
})

const leftBrace = '{{'
const rightBrace = '}}'
</script>

<style lang="scss" scoped>
.brand-mark {
  display: inline-grid;
  gap: 3px;
  width: fit-content;
  color: var(--ckw-text-strong);
  text-decoration: none;
}

.brand-mark__sigil {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1;
}

.brand-mark__sigil span {
  color: var(--ckw-orange);
  font-weight: 900;
}

.brand-mark__sigil strong {
  color: var(--ckw-text-strong);
  font-size: 1.6rem;
  font-weight: 750;
}

.brand-mark__wordmark {
  display: flex;
  gap: 15px;
  color: var(--ckw-text-strong);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.42em;
  line-height: 1;
  text-transform: uppercase;
}

.brand-mark__wordmark span:last-child {
  color: var(--ckw-orange);
}

@media (max-width: 600px) {
  .brand-mark__sigil {
    gap: 6px;
    font-size: 1.55rem;
  }

  .brand-mark__sigil strong {
    font-size: 1.28rem;
  }

  .brand-mark__wordmark {
    gap: 10px;
    font-size: 0.52rem;
    letter-spacing: 0.32em;
  }
}
</style>
