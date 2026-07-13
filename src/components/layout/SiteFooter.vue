<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <div class="site-footer__brand">
        <BrandMark />
        <p>Practical digital tools for local businesses.</p>
      </div>

      <nav class="site-footer__links" aria-label="Solutions">
        <span>Solutions</span>
        <a href="#solutions">Tap-and-Scan Pages</a>
        <a href="#solutions">Digital Contact Cards</a>
        <a href="#services">Business Websites &amp; Care</a>
      </nav>

      <nav class="site-footer__links" aria-label="Company">
        <span>Company</span>
        <a href="#how-it-works">How It Works</a>
        <a href="#demonstrations">Demonstrations</a>
        <a href="#contact">Contact</a>
      </nav>

      <div class="site-footer__links">
        <span>Let's Connect</span>
        <div class="site-footer__socials" aria-label="Social links">
          <a
            href="https://www.linkedin.com/in/chad-kohl401"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <q-icon name="business_center" size="20px" />
          </a>
          <a href="mailto:chad_kohl@ckohl.com" aria-label="Email CKohl Works">
            <q-icon name="mail_outline" size="20px" />
          </a>
        </div>
        <a href="mailto:chad_kohl@ckohl.com">chad_kohl@ckohl.com</a>
        <small>&copy; {{ year }} CKohl Works. All rights reserved.</small>
      </div>
    </div>
  </footer>
</template>

<script setup>
import BrandMark from '@/components/ui/BrandMark.vue'

const year = new Date().getFullYear()
</script>

<style lang="scss" scoped>
.site-footer {
  padding: 34px 0 30px;
  background: var(--ckw-footer-bg);
  border-top: 1px solid var(--ckw-border);
}

.site-footer__inner {
  display: grid;
  grid-template-columns: minmax(240px, 1.3fr) repeat(3, minmax(150px, 0.6fr));
  gap: 38px;
  width: min(var(--ckw-container), calc(100% - 32px));
  margin: 0 auto;
}

.site-footer__brand {
  display: grid;
  gap: 14px;
  align-content: start;
}

.site-footer__brand p {
  max-width: 260px;
  margin: 0;
  color: var(--ckw-text-primary);
  line-height: 1.6;
}

.site-footer__links {
  display: grid;
  gap: 8px;
  align-content: start;
}

.site-footer__links span {
  margin-bottom: 4px;
  color: var(--ckw-text-strong);
  font-weight: 800;
}

.site-footer__links a,
.site-footer__links small {
  color: var(--ckw-text-muted);
  font-size: 0.95rem;
  line-height: 1.45;
  text-decoration: none;
}

.site-footer__links a:hover {
  color: var(--ckw-orange);
}

.site-footer__socials {
  display: flex;
  gap: 10px;
}

.site-footer__socials a {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--ckw-border-strong);
  border-radius: 8px;
  color: var(--ckw-text-strong);
}

@media (max-width: 860px) {
  .site-footer__inner {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .site-footer__brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 520px) {
  .site-footer__inner {
    grid-template-columns: 1fr;
  }
}
</style>
