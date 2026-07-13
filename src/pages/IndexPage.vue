<template>
  <q-page class="home-page">
    <HeroSection />
    <ProcessSection />
    <FeaturedSolutions />
    <DemonstrationsSection />
    <ServicesCareSection />
    <CtaSection />
    <ContactFormSection />
    <SiteFooter />
  </q-page>
</template>

<script setup>
import CtaSection from '@/components/sections/CtaSection.vue'
import ContactFormSection from '@/components/sections/ContactFormSection.vue'
import DemonstrationsSection from '@/components/sections/DemonstrationsSection.vue'
import FeaturedSolutions from '@/components/sections/FeaturedSolutions.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import ServicesCareSection from '@/components/sections/ServicesCareSection.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
</script>
