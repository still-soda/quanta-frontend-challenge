import { mock } from 'mockjs';
import { response } from './utils/response.utils';

function mockAdminGetChallenges() {
   return mock({
      'data|10': [
         {
            id: '@id',
            title: '@ctitle',
            difficulty: '@pick(["easy", "medium", "hard"])',
            score: '@integer(10, 100)',
            type: '@pick(["css", "javascript", "typescript"])',
            authorId: '@id',
            tags: [
               {
                  id: '@id',
                  name: '@ctitle',
                  description: '@cparagraph',
                  color: '@color',
                  creatorId: '@id',
                  createdAt: '@datetime',
                  updatedAt: '@datetime',
                  icon: 'icon',
               },
            ],
            updatedAt: '@datetime',
            createdAt: '@datetime',
         },
      ],
   }).data;
}

export default {};
