import { Page } from 'playwright';
import {
  ClickMouseFlowData,
  MoveMouseFlowData,
  ScrollMouseFlowData,
} from '../../flow-data';

export type Detail =
  | ClickMouseFlowData['detail']
  | MoveMouseFlowData['detail']
  | ScrollMouseFlowData['detail'];

export async function handleMouseActions(page: Page, detail: Detail) {}

export async function handleTriggerAction(page: Page, detail: any) {}
