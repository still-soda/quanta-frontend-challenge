import { Page } from 'playwright';
import {
  MouseFlowData,
  TestpointFlowData,
  TriggerFlowData,
} from '../flow-data';
import {
  handleMouseActions,
  handleTriggerAction,
} from './actions/actions.handler';

type Data = TestpointFlowData | MouseFlowData | TriggerFlowData | any;

export function handleActions(page: Page, data: Data) {
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
