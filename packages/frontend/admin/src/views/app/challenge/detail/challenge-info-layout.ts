import { IntegralChallenge } from '@challenge/api/models';

export interface Layout {
   title: string;
   key: keyof IntegralChallenge | 'passRate' | 'author';
}

export const challengeInfoLayout: Layout[] = [
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
