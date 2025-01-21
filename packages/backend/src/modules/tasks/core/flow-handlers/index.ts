import { Page } from 'playwright';
import {
  handleMouseActions,
  handleTriggerAction,
} from './actions/actions.handler';
import { ActionData } from './index.type';

export function handleActions(page: Page, data: ActionData) {
  if (data.type === 'mouse') {
    return handleMouseActions(page, data.detail);
  }

  if (data.type === 'trigger') {
    return handleTriggerAction(page, data.detail);
  }

  if (data.type === 'testpoint') {
    return;
  }
}
