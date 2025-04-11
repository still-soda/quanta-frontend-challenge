<template>
   <div class="flex flex-col gap-4">
      <div class="flex gap-4">
         <Card icon="work-history" title="提交总数" data="8192" />
         <Card icon="data-checked" title="总判题数" data="8177" />
         <Card icon="task-checked-1" title="总通过率" data="64.54%" />
         <Card icon="code" title="今日提交数" data="64" />
      </div>
      <div class="flex gap-4">
         <div class="card grow-[2]">
            <SubmissionTrend :data="[150, 230, 224, 218, 135, 147, 176]" />
         </div>
         <div class="flex flex-col gap-4 bg-white rounded-md p-4 flex-1">
            <div class="text-md font-bold">通过情况</div>
            <SubmissionCard icon="check-circle" title="总通过量" data="8192" />
            <SubmissionCard icon="close-circle" title="总失败量" data="8192" />
         </div>
      </div>
      <div class="flex gap-4">
         <div class="card grow-[2]">
            <SubmissionCountRank
               :image-size="25"
               :data="[150, 230, 224, 218, 135, 147, 176]" />
         </div>
         <div class="card">
            <HotChallenge :data="[150, 230, 224, 218, 135, 147, 176]" />
         </div>
      </div>
      <div class="flex gap-4">
         <div class="card">
            <DifficultyDistribution />
         </div>
         <div class="card grow-[2]">
            <LowestPassProblems />
         </div>
         <div class="card items-start">
            <MachinesStatus />
         </div>
      </div>
   </div>
</template>

<script setup lang="tsx">
import { Icon } from 'tdesign-vue-next';
import SubmissionTrend from './components/SubmissionTrend/index.vue';
import SubmissionCountRank from './components/SubmissionCountRank/index.vue';
import HotChallenge from './components/HotChallenge/index.vue';
import DifficultyDistribution from './components/DifficultyDistribution/index.vue';
import LowestPassProblems from './components/LowestPassProblems/index.vue';
import MachinesStatus from './components/MachinesStatus/index.vue';

interface CardProps {
   icon: string;
   title: string;
   data: string | number;
}

const Card = ({ icon, title, data }: CardProps) => {
   return (
      <div class='card '>
         <div class='flex items-center justify-center size-14 bg-orange-high rounded-full'>
            <Icon name={icon} class='size-6 text-white' />
         </div>
         <div class='flex flex-col gap-1'>
            <div class='text-gray-500'>{title}</div>
            <div class='text-2xl font-bold'>{data}</div>
         </div>
      </div>
   );
};

const SubmissionCard = ({ icon, title, data }: CardProps) => {
   return (
      <div class='flex flex-col  text-white rounded-md py-3 px-6 justify-center bg-orange-high'>
         <div class='flex gap-1 items-center font-medium'>
            <Icon name={icon} class='size-4' />
            <div>{title}</div>
         </div>
         <div class='flex flex-col gap-1 justify-center pl-1'>
            <div class='text-2xl font-bold'>{data}</div>
         </div>
      </div>
   );
};
</script>

<style scoped></style>
