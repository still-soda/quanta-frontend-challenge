import { Page } from 'playwright';
import {
  ExpectTestpointFlowData,
  ScreenShotTestpointFlowData,
} from '../../flow-data';

export async function handleExpectTestpointAction(
  page: Page,
  detail: ExpectTestpointFlowData['detail'],
) {}

export async function handleScreenShotTestpointAction(
  page: Page,
  detail: ScreenShotTestpointFlowData['detail'],
  testImageName: string,
) {}
