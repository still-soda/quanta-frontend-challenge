<template>
   <TSpace direction="vertical">
      <TCard :bordered="false">
         <TRow>
            <TButton shape="square" theme="default" @click="handleBack">
               <template #icon>
                  <TIcon name="chevron-left" />
               </template>
            </TButton>
         </TRow>
      </TCard>
      <TCard :bordered="false">
         <TDescriptions
            title="挑战信息"
            bordered
            :label-style="{
               width: '150px',
               textAlign: 'center',
            }">
            <TDescriptionsItem
               v-for="item in layout"
               :key="item.key"
               :label="item.title">
               <div
                  v-if="item.key === 'tags'"
                  class="flex gap-1 flex-shrink-0 flex-wrap">
                  <TagComponent
                     v-for="tag in challenge?.tags"
                     :key="tag._id"
                     color="#FF9232">
                     {{ TAG_TEXT_MAPPING[tag.name] ?? tag.name }}
                  </TagComponent>
               </div>

               <div v-else-if="item.key === 'id'">
                  <TTypographyText copyable>
                     {{ challenge?.id }}
                  </TTypographyText>
               </div>

               <div v-else-if="item.key === 'status'">
                  <TagComponent
                     :color="STATUS_COLOR_MAPPING[challenge?.status ?? 0]">
                     {{ STATUS_TEXT_MAPPING[challenge?.status ?? 0] }}
                  </TagComponent>
               </div>

               <div v-else-if="item.key === 'difficulty'">
                  {{
                     TAG_TEXT_MAPPING[challenge?.difficulty ?? ''] ??
                     challenge?.difficulty
                  }}
               </div>

               <div
                  v-else-if="item.key === 'totalPass'"
                  class="flex items-center gap-2">
                  {{ challenge?.totalPass }}
                  <TIcon name="check-circle" class="text-green-base" />
               </div>

               <div v-else-if="item.key === 'type'">
                  {{
                     TAG_TEXT_MAPPING[challenge?.type ?? ''] ?? challenge?.type
                  }}
               </div>

               <div v-else-if="item.key === 'fastestSolvers'">
                  <TAvatarGroup>
                     <TTooltip
                        v-for="user in fastestSolvers"
                        :key="user.id"
                        :content="user.username">
                        <TAvatar
                           :image="user.avatar"
                           :icon
                           size="small"
                           hideOnLoadFailed />
                     </TTooltip>
                  </TAvatarGroup>
               </div>

               <div v-else-if="item.key === 'passRate'">
                  <TProgress theme="line" :percentage="passRate" />
               </div>

               <div v-else-if="item.key === 'authorId'">
                  <TTypographyText copyable>
                     {{ author?.id }}
                  </TTypographyText>
               </div>

               <div v-else-if="item.key === 'author'">
                  {{ author?.username }}
               </div>

               <div v-else>
                  <div>
                     {{ challenge?.[item.key as keyof IntegralChallenge] }}
                  </div>
               </div>
            </TDescriptionsItem>
            <TDescriptionsItem label="挑战描述" :span="2">
               <MdEditor v-model="challengeDetail" no-mermaid read-only />
            </TDescriptionsItem>
            <TDescriptionsItem label="挑战图片">
               <TSpace>
                  <TImage
                     v-for="(img, idx) in challengeImages"
                     :key="idx"
                     :src="img"
                     class="rounded-md" />
               </TSpace>
            </TDescriptionsItem>
         </TDescriptions>
      </TCard>

      <TCard :bordered="false">
         <div class="-mt-3">
            <TTypographyTitle level="h5">判题流程</TTypographyTitle>
         </div>
         <div class="h-[34rem]">
            <CustomFlow :ref="FLOW_KEY" readonly />
         </div>
      </TCard>
   </TSpace>
</template>

<script setup lang="tsx">
import { useMessage } from '@/hooks/use-message.hook';
import { IntegralChallenge } from '@challenge/api/models';
import TagComponent from '@/components/Tag/index.vue';
import { adminGetChallengeById, adminGetChallengeDetail } from '@challenge/api';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
   STATUS_COLOR_MAPPING,
   STATUS_TEXT_MAPPING,
   TAG_TEXT_MAPPING,
} from '@/constant/tags.constant';
import { resolveDoc } from '@challenge/utils';
import { UserIcon } from 'tdesign-icons-vue-next';
import CustomFlow from '@/components/CustomFlow/index.vue';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { useChallengeFlow } from '../composabals/use-challenge-flow';
import { useAuthor } from '../composabals/use-author';
import { useFastestSolvers } from '../composabals/use-fastest-solvers';
import { challengeInfoLayout } from './challenge-info-layout';

const icon = () => <UserIcon />;

const router = useRouter();
const route = useRoute();
const message = useMessage();

// 挑战信息布局
const layout = challengeInfoLayout;

// 拦截获取 Challenge ID
const challengeId = route.query.id as string;
if (typeof challengeId !== 'string') {
   message.error('未知 Challenge ID');
   router.push('/challenge/manage');
}

// 在获取 Challenge 详情后调用
const { updateAuthor, author } = useAuthor();
const { updateFastestSolvers, fastestSolvers } = useFastestSolvers();

// use 更新流程数据
const { updateChallengeFlow, FLOW_KEY } = useChallengeFlow();

// 获取 Challenge 详情
const challengeDetail = ref('');
const challengeImages = ref<string[]>([]);
const challenge = ref<IntegralChallenge | null>(null);

updateChallengeDetail();
async function updateChallengeDetail() {
   try {
      // 获取 Challenge 内容
      const detailRes = await adminGetChallengeDetail(challengeId);
      const { description, images } = resolveDoc(detailRes.data);
      challengeDetail.value = description;
      challengeImages.value = images.split('\n').map((s) => s.trim());
      // 获取 Challenge 详情
      const challengeRes = await adminGetChallengeById(challengeId);
      challenge.value = challengeRes.data;
      challenge.value.createdAt = new Date(challenge.value.createdAt)
         .toLocaleString()
         .split('/')
         .join('-');
      // 获取作者信息
      updateAuthor(challenge.value.authorId);
      updateFastestSolvers(challenge.value.fastestSolvers);
      // 获取流程数据
      updateChallengeFlow(challenge.value.flowdataId);
   } catch (error) {
      message.error('获取 Challenge 详情失败');
      handleBack();
   }
}

// 计算通过率
const passRate = computed(() =>
   parseFloat(
      (
         ((challenge.value?.totalPass ?? 0) /
            (challenge.value?.totalSubmissions ?? 1)) *
         100
      ).toFixed(2)
   )
);

// 返回挑战管理页面
const handleBack = () => {
   router.push('/challenge/manage');
};
</script>
