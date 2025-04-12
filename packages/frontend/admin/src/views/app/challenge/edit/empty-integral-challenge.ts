import { IntegralChallenge } from '@challenge/api/models';

const EMPTY_INTEGRAL_CHALLENGE: IntegralChallenge = {
   id: '',
   title: '',
   createdAt: '',
   updatedAt: '',
   status: 0,
   answerTemplate: [],
   authorId: '',
   contentId: '',
   difficulty: '',
   fastestSolvers: [],
   score: 0,
   screenshots: [],
   tags: [],
   standardAnswer: [],
   totalPass: 0,
   totalSubmissions: 0,
   type: '',
};
export default EMPTY_INTEGRAL_CHALLENGE;
