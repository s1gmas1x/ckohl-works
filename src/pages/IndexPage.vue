<template>
  <q-page class="home-page">
    <HeroSection />
    <TrustBar />
    <FeaturedSolutions />
    <ProcessSection />
    <CtaSection />
    <SiteFooter />
  </q-page>
</template>

<script setup>
import CtaSection from '@/components/sections/CtaSection.vue'
import FeaturedSolutions from '@/components/sections/FeaturedSolutions.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import TrustBar from '@/components/sections/TrustBar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
</script>
