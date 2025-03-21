import challengeMock from './challenges.mock';
import authMock from './auth.mock';
import assetMock from './asset.mock';
import userMock from './user.mock';
import taskMock from './task.mock';
import tagMock from './tag.mock';
import resolvedMock from './resolved.mock';
import submissionMock from './submission.mock';
import rankMock from './rank.mock';
import notificationMock from './notification.mock';
import heatmapMock from './heatmap.mock';

import express from 'express';

const mocks = [
   ...challengeMock,
   ...authMock,
   ...assetMock,
   ...userMock,
   ...taskMock,
   ...tagMock,
   ...resolvedMock,
   ...submissionMock,
   ...rankMock,
   ...notificationMock,
   ...heatmapMock,
];

const app = express();

app.use(express.json());

mocks.forEach(({ method, url, response }) => {
   url.endsWith('/') && (url += ':id');
   console.log(`[${method.toUpperCase().padStart(4, ' ')}] ${url}`);
   app[method](url, (req, res) => {
      console.log(
         `[LOG] ${method.toUpperCase().padEnd(4, ' ')} ${req.url.padEnd(40, ' ')} ${new Date().toLocaleString()}`
      );
      res.json(response(req));
   });
});

app.listen(4010, () => {
   console.log('\nMock server started at http://localhost:4010\n');
});
