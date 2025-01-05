<template>
   <div
      class="p-4 overflow-visible dashboard"
      :style="{ height: `calc(100vh - ${navigatorHeight}px)` }">
      <!-- 挑战热力图 -->
      <HeatMapComponent />
      <!-- 站内排名 -->
      <SiteRankComponent />
      <!-- 挑战得分 -->
      <ChallengeScoreComponent />
      <!-- 最新挑战 -->
      <ChallengesComponent />
      <!-- 排名统计 -->
      <StatisticsComponent />
      <!-- 最近提交 -->
      <SubmitComponent />
   </div>
</template>

<script setup lang="ts">
import HeatMapComponent from './components/HeatMap/index.vue';
import SiteRankComponent from './components/SiteRank/index.vue';
import ChallengeScoreComponent from './components/CallengeScore/index.vue';
import ChallengesComponent from './components/Challenges/index.vue';
import StatisticsComponent from './components/Statistics/index.vue';
import SubmitComponent from './components/Submit/index.vue';
import { inject } from 'vue';

const navigatorHeight = inject('navigatorHeight');
</script>

<style lang="scss" scoped>
.dashboard {
   display: grid;
   grid-template-columns: 13.6875rem 6.0625rem 1fr 13.6875rem 13.6875rem;
   grid-template-rows: 19.3125rem minmax(24.4375rem, 1fr);
   gap: 1.25rem;
}
</style>
