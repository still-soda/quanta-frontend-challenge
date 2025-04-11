<template>
   <TLayout class="bg-white p-4 rounded-md w-full">
      <THeader class="mt-2 flex">
         <TSpace>
            <TButton @click="showDialog = true">创建挑战</TButton>
            <TButton @click="onRefresh" shape="square" theme="default">
               <TIcon name="refresh" :class="{ 'animate-spin': loading }" />
            </TButton>
            <!-- 创建挑战模态框 -->
            <TDialog
               v-model:visible="showDialog"
               :closeBtn="false"
               confirm-btn="创建挑战">
               <TForm>
                  <TFormItem name="title" label="挑战名称">
                     <TInput placeholder="清输入挑战名称"></TInput>
                  </TFormItem>
                  <TFormItem name="difficulty" label="挑战难度">
                     <TSelect showArrow>
                        <TOption
                           v-for="item in selctValues.difficulty"
                           :key="item.label"
                           :label="item.label"
                           :value="item.value" />
                     </TSelect>
                  </TFormItem>
                  <TFormItem name="score" label="挑战分数">
                     <TInput placeholder="请输入分数" type="number"></TInput>
                  </TFormItem>
                  <TFormItem name="type" label="挑战类型">
                     <TInput placeholder="请输入类型"></TInput>
                  </TFormItem>
                  <TFormItem name="tags" label="挑战标签">
                     <TSelect showArrow multiple :max="2">
                        <TOption
                           v-for="item in selctValues.tags"
                           :key="item"
                           :label="item"
                           :value="item" />
                     </TSelect>
                  </TFormItem>
               </TForm>
            </TDialog>
         </TSpace>
         <div class="ml-auto">
            <TInput placeholder="搜索" clearable>
               <template #suffixIcon>
                  <TIcon name="search" :style="{ cursor: 'pointer' }" />
               </template>
            </TInput>
         </div>
      </THeader>
      <TContent>
         <TTable
            hover
            size="medium"
            row-key="id"
            :data="filteredData"
            :sort
            :filterValue
            :loading
            :columns
            @sort-change="onSortChange"
            @filter-change="onFilterChange"></TTable>
      </TContent>
   </TLayout>
</template>

<script setup lang="tsx">
import { Button, Avatar, Icon, TableProps } from 'tdesign-vue-next';
import TagCompoenent from '@/components/Tag/index.vue';
import { formatDateTime } from '@/utils/format-date.utils';
import { IntegralChallenge, Tag } from '@challenge/api/models';
import {
   STATUS_COLOR_MAPPING,
   STATUS_TEXT_MAPPING,
   TAG_TEXT_MAPPING,
} from '@/constant/tags.constant';
import { computed, reactive, ref } from 'vue';
import { useMessage } from '@/hooks/use-message.hook';
import {
   adminGetAllChallenges,
   getAllTags,
   getDefaultAvatar,
} from '@challenge/api';
import { svgToBase64 } from '@challenge/utils';
import { UserIcon } from 'tdesign-icons-vue-next';
import { useUserStore } from '@/stores/user.store';
import { useRouter } from 'vue-router';
import { DIFFICULTY } from '@/constant/select.constant';

const message = useMessage();
const userStore = useUserStore();
const router = useRouter();

// 表格列
const columns = computed<TableProps['columns']>(() => [
   {
      title: '标题',
      colKey: 'title',
      width: 160,
      fixed: 'left',
   },
   {
      title: '作者',
      colKey: 'authorId',
      ellipsis: true,
      align: 'center',
      width: 100,
      cell: (_: any, { row: { authorId } }: any) => {
         return (
            <Avatar image={authorId} hideOnLoadFailed>
               {{ icon: () => <UserIcon /> }}
            </Avatar>
         );
      },
   },
   {
      title: '类型',
      colKey: 'type',
      width: 120,
      align: 'center',
      cell: (_: any, { row: { type } }: any) => TAG_TEXT_MAPPING[type] ?? type,
      filter: {
         type: 'multiple',
         list: dataType.value.map((item) => ({
            value: item,
            label: TAG_TEXT_MAPPING[item] ?? item,
         })),
      },
   },
   {
      title: '状态',
      colKey: 'status',
      width: 100,
      align: 'center',
      cell: (_: any, { row: { status } }: any) => (
         <TagCompoenent color={STATUS_COLOR_MAPPING[status]}>
            {{ default: () => STATUS_TEXT_MAPPING[status] }}
         </TagCompoenent>
      ),
      filter: {
         type: 'multiple',
         list: dataStatus.value.map((item) => ({
            value: item,
            label: STATUS_TEXT_MAPPING[item],
         })),
      },
   },
   {
      title: '难度',
      colKey: 'difficulty',
      width: 100,
      align: 'center',
      cell: (_: any, { row: { difficulty } }: any) =>
         TAG_TEXT_MAPPING[difficulty],
      filter: {
         type: 'multiple',
         list: dataDifficulty.value.map((item) => ({
            value: item,
            label: TAG_TEXT_MAPPING[item],
         })),
      },
   },
   {
      title: '标签',
      colKey: 'tags',
      align: 'center',
      width: 180,
      cell: (_: any, props: any) => {
         return (
            <div class='flex gap-1 flex-shrink-0 flex-wrap justify-center w-full'>
               {props.row.tags.sort().map((tag: Tag) => (
                  <TagCompoenent color='#FF9232'>
                     {{ default: () => tag.name }}
                  </TagCompoenent>
               ))}
            </div>
         );
      },
      filter: {
         type: 'multiple',
         list: dataTags.value.map((item) => ({
            value: item,
            label: item,
         })),
      },
   },
   {
      title: '分数',
      colKey: 'score',
      width: 100,
      align: 'center',
      sorter: (a, b) => a.score - b.score,
   },
   {
      title: '总提交数',
      colKey: 'totalSubmissions',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.totalSubmissions - b.totalSubmissions,
   },
   {
      title: '通过数',
      colKey: 'totalPass',
      width: 120,
      align: 'center',
      sorter: (a, b) => a.totalPass - b.totalPass,
   },
   {
      title: '创建时间',
      colKey: 'createdAt',
      width: 160,
      align: 'center',
      sorter: (a, b) =>
         new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
   },
   {
      title: '操作',
      colKey: 'operation',
      width: 140,
      fixed: 'right',
      cell: (_: any, { row }: any) => {
         return (
            <div class='flex gap-2 flex-shrink-0'>
               <Button
                  shape='square'
                  theme='danger'
                  onClick={() => handleDelete(row)}
                  disabled={
                     row.authorId !== userStore.id && userStore.role !== 2
                  }>
                  {{ icon: () => <Icon name='delete' /> }}
               </Button>
               <Button
                  shape='square'
                  theme='primary'
                  onClick={() => handleEdit(row)}
                  disabled={
                     row.authorId !== userStore.id && userStore.role !== 2
                  }>
                  {{ icon: () => <Icon name='edit' /> }}
               </Button>
               <Button
                  shape='square'
                  theme='success'
                  onClick={() => gotoDetail(row)}>
                  {{ icon: () => <Icon name='list' /> }}
               </Button>
            </div>
         );
      },
   },
]);

// 可筛选数据
const dataAuthor = ref<string[]>([]);
const dataType = ref<string[]>([]);
const dataStatus = ref<number[]>([]);
const dataDifficulty = ref<string[]>([]);
const dataTags = ref<string[]>([]);

// 原始数据
const data = ref<IntegralChallenge[]>([]);

// 加载状态
const loading = ref(false);

// 更新数据
updateData();
async function updateData() {
   loading.value = true;
   try {
      const result = await adminGetAllChallenges();
      data.value = result.data;
      collectData(data.value);
      const avatarMap = await getAvatarMap(data.value);
      data.value.forEach((item) => {
         item.createdAt = formatDateTime(item.createdAt).split(' ')[0];
         item.authorId = avatarMap.get(item.authorId) ?? '';
      });
   } catch (error: any) {
      message.error(error.message, { duration: 3000 });
   } finally {
      loading.value = false;
   }
}
// 收集数据，用于筛选
function collectData(data: IntegralChallenge[]): void {
   const type = new Set<string>();
   const status = new Set<number>();
   const difficulty = new Set<string>();
   const tags = new Set<string>();
   const author = new Set<string>();
   data.forEach((item) => {
      type.add(item.type);
      status.add(item.status);
      difficulty.add(item.difficulty);
      item.tags.forEach((tag) => tags.add(tag.name));
      author.add(item.authorId);
   });
   dataType.value = Array.from(type);
   dataStatus.value = Array.from(status);
   dataDifficulty.value = Array.from(difficulty);
   dataTags.value = Array.from(tags);
   dataAuthor.value = Array.from(author);
}
// 获取默认头像
async function getAvatarMap(
   challenges: IntegralChallenge[]
): Promise<Map<string, string>> {
   const map = new Map<string, Promise<void>>();
   const resolvdMap = new Map<string, string>();
   challenges.forEach((challenge) => {
      if (map.has(challenge.authorId)) return;
      map.set(
         challenge.authorId,
         getDefaultAvatar(challenge.authorId).then((res) => {
            resolvdMap.set(challenge.authorId, svgToBase64(res.data.avatar));
         })
      );
   });
   await Promise.all(map.values());
   return resolvdMap;
}

// 刷新数据
const onRefresh = async () => {
   await updateData();
};

// 过滤条件
const filterValue = ref<TableProps['filterValue']>({});

// 过滤后的数据
const filteredData = computed(() =>
   data.value.filter((item) => {
      return Object.entries(
         filterValue.value as Record<string, string | string[]>
      ).every(([key, value]) => {
         if (!value.length) return true;
         if (key === 'tags') {
            return (value as string[]).every((tag: string) =>
               item.tags.some((t) => t.name === tag)
            );
         }
         return value.includes((item as any)[key]);
      });
   })
);

const onFilterChange: TableProps['onFilterChange'] = (
   filter: TableProps['filterValue']
) => {
   filterValue.value = filter;
};

// 排序
const sort = ref<TableProps['sort']>();

const onSortChange: TableProps['onSortChange'] = (sortValue, options) => {
   sort.value = sortValue;
   data.value = (options.currentDataSource as any) ?? data.value;
};

// 跳转到详情
const gotoDetail = (challenge: IntegralChallenge) => {
   router.push(`/challenge/detail?id=${challenge.id}`);
};

// 删除
const handleDelete = (challenge: IntegralChallenge) => {
   console.log(challenge);
};

// 编辑
const handleEdit = (challenge: IntegralChallenge) => {
   console.log(challenge);
};

// 创建挑战模态框
const showDialog = ref(false);

interface ChallengeCreateForm {
   title: string;
   difficulty: DIFFICULTY;
   score: number;
   type: string;
   tags: string[];
}

const selctValues = {
   difficulty: [
      { label: '简单', value: DIFFICULTY.EASY },
      { label: '中等', value: DIFFICULTY.MEDIUM },
      { label: '困难', value: DIFFICULTY.HARD },
   ],
   tags: [] as string[],
};

updateTags();
async function updateTags() {
   try {
      const res = await getAllTags();
      selctValues.tags = res.data.map((item) => item.name);
   } catch (error) {
      message.error('获取标签失败');
   }
}

const createForm = reactive<ChallengeCreateForm>({
   title: '',
   difficulty: DIFFICULTY.EASY,
   score: 0,
   type: '',
   tags: [],
});
</script>
