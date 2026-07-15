<template>
  <section id="solutions" class="content-section featured-solutions">
    <div class="section-inner">
      <SectionHeading
        eyebrow="What we build"
        title="Three useful ways to meet customers where they are."
        description="Start with the focused business page or site that solves the next customer problem, then keep it current with real support."
      />

      <div class="featured-solutions__grid">
        <SolutionCard v-for="solution in solutions" :key="solution.title" :solution="solution" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { solutions } from '@/data/home.js'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import SolutionCard from '@/components/ui/SolutionCard.vue'
</script>

<style lang="scss" scoped>
.featured-solutions {
  padding-top: 72px;
  padding-bottom: 72px;
}

.featured-solutions__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
}

@media (max-width: 900px) {
  .featured-solutions__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .featured-solutions {
    padding-top: 54px;
    padding-bottom: 54px;
  }
}
</style>
