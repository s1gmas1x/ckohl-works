<template>
  <div class="phone-preview">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.phone-preview {
  position: relative;
  padding-top: 14px;
  overflow: hidden;
  border: var(--phone-preview-frame-width, 6px) solid #151a20;
  border-radius: var(--phone-preview-frame-radius, 24px);
  background: #090704;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 18px 34px rgba(0, 0, 0, 0.3);
}
.phone-preview::before {
  position: absolute;
  top: 4px;
  left: 50%;
  width: 30%;
  height: 4px;
  border-radius: 999px;
  background: #272b30;
  content: '';
  transform: translateX(-50%);
}
.phone-preview :slotted(img) {
  display: block;
  width: 100%;
  height: auto;
}
</style>
