import { Page } from 'playwright';
import {
  handleMouseActions,
  handleTriggerAction,
} from './actions/actions.handler';
import { ActionData } from './index.type';
import { handleScreenShotTestpointAction } from './testpoints/testpoints.handler';

export function handleActions(page: Page, data: ActionData) {
  if (data.type === 'mouse') {
    return handleMouseActions(page, data.detail);
  }

  if (data.type === 'trigger') {
    return handleTriggerAction(page, data.detail);
  }

  if (data.type === 'testpoint') {
    const { type, score, name } = data.detail;
    if (data.detail.type === 'screenshot') {
      const { threshold } = data.detail;
      // return handleScreenShotTestpointAction({
      //   page,
      //   detail: data.detail,
      //   testImageName: data.detail.,

      // })
    }
    return;
  }
}
