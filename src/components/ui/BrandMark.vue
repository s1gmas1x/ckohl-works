<template>
  <RouterLink :to="to" class="brand-mark" :aria-label="ariaLabel">
    <span class="brand-mark__sigil" aria-hidden="true">
      <span>{{ leftBraces }}</span>
      <strong>CK</strong>
      <span>{{ rightBraces }}</span>
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

const leftBraces = '{{'
const rightBraces = '}}'
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
  gap: 7px;
  color: var(--ckw-text-strong);
  font-family: 'Orbitron', var(--ckw-font-body);
  font-size: 1.95rem;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 1;
}

.brand-mark__sigil span {
  color: var(--ckw-orange);
  font-family: 'Inter', var(--ckw-font-body);
  font-weight: 100;
}

.brand-mark__sigil strong {
  color: var(--ckw-text-strong);
  font-size: 1.58rem;
  font-weight: 500;
}

.brand-mark__wordmark {
  display: flex;
  gap: 15px;
  color: var(--ckw-text-strong);
  font-family: 'Orbitron', var(--ckw-font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.3em;
  line-height: 1;
  text-transform: uppercase;
}

.brand-mark__wordmark span:last-child {
  color: var(--ckw-orange);
}

@media (max-width: 600px) {
  .brand-mark__sigil {
    gap: 5px;
    font-size: 1.58rem;
  }

  .brand-mark__sigil strong {
    font-size: 1.28rem;
  }

  .brand-mark__wordmark {
    gap: 10px;
    font-size: 0.57rem;
    letter-spacing: 0.32em;
  }
}
</style>
