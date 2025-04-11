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
               <div class="rounded-inside border-gray-200">
                  <pre class="text-wrap">{{ challengeDetail }}</pre>
               </div>
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
            <CustomFlow ref="flow" readonly />
         </div>
      </TCard>
   </TSpace>
</template>

<script setup lang="tsx">
import { useMessage } from '@/hooks/use-message.hook';
import { IntegralChallenge, User } from '@challenge/api/models';
import TagComponent from '@/components/Tag/index.vue';
import {
   adminGetChallengeById,
   adminGetChallengeDetail,
   adminReadFile,
   getDefaultAvatar,
   getUserById,
} from '@challenge/api';
import { computed, ref, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
   STATUS_COLOR_MAPPING,
   STATUS_TEXT_MAPPING,
   TAG_TEXT_MAPPING,
} from '@/constant/tags.constant';
import { resolveDoc, svgToBase64 } from '@challenge/utils';
import { UserIcon } from 'tdesign-icons-vue-next';
import CustomFlow from '@/components/CustomFlow/index.vue';

const icon = () => <UserIcon />;

const router = useRouter();
const route = useRoute();
const message = useMessage();

interface Layout {
   title: string;
   key: keyof IntegralChallenge | 'passRate' | 'author';
}

const layout: Layout[] = [
   { title: '挑战名称', key: 'title' },
   { title: '挑战ID', key: 'id' },
   { title: '作者名称', key: 'author' },
   { title: '作者ID', key: 'authorId' },
   { title: '挑战难度', key: 'difficulty' },
   { title: '挑战类型', key: 'type' },
   { title: '挑战状态', key: 'status' },
   { title: '挑战分数', key: 'score' },
   { title: '挑战标签', key: 'tags' },
   { title: '创建时间', key: 'createdAt' },
   { title: '总提交', key: 'totalSubmissions' },
   { title: '通过人数', key: 'totalPass' },
   { title: '最快解决者', key: 'fastestSolvers' },
   { title: '提交通过率', key: 'passRate' },
];

// 拦截获取 Challenge ID
const challengeId = route.query.id as string;
if (typeof challengeId !== 'string') {
   message.error('未知 Challenge ID');
   router.push('/challenge/manage');
}

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

// 获取作者信息，在获取 Challenge 详情后调用
const author = ref<User>();
async function updateAuthor(authorId: string) {
   try {
      const res = await getUserById(authorId);
      res.data.avatar =
         res.data.avatar ??
         svgToBase64((await getDefaultAvatar(authorId)).data.avatar);
      author.value = res.data;
   } catch (error) {
      message.error('获取作者信息失败');
   }
}

// 获取最快解决者信息，在获取 Challenge 详情后调用
const fastestSolvers = ref<User[]>([]);
async function updateFastestSolvers(resolverIds: string[]) {
   try {
      const res = await Promise.all(resolverIds.map((id) => getUserById(id)));
      const datas = res.map((item) => item.data);
      const avatarPromises = datas
         .filter((item) => !item.avatar)
         .map(async (item) => {
            return getDefaultAvatar(item.id).then((res) => {
               item.avatar = svgToBase64(res.data.avatar);
            });
         });
      await Promise.all(avatarPromises);
      fastestSolvers.value = datas;
      console.log(fastestSolvers.value);
   } catch (error) {
      message.error('获取最快解决者失败');
   }
}

// 更新流程数据
const customFlowRef = useTemplateRef<InstanceType<typeof CustomFlow>>('flow');
async function updateChallengeFlow(flowdataId?: string) {
   if (!customFlowRef.value || !flowdataId) return;
   try {
      const res = await adminReadFile(flowdataId);
      const { data } = res;
      if (data) {
         customFlowRef.value.updateFlowData(data);
      }
   } catch (error) {
      message.error('获取挑战流程失败');
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

<style lang="css" scoped>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
</style>
