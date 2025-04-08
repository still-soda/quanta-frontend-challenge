import { Page } from 'playwright';
import { HandlerOptions } from './flow-handlers/index.type';
import { buildMap, IFlowData } from '../_src/flow-node';

interface Environment {
   IS_PRE: boolean;
   preStore: {
      screenshotsMap: Record<string, Buffer>;
   };
}

export async function run(
   flowdata: HandlerOptions[],
   page: Page,
   options: {
      method: 'pre-execute' | 'execute';
      screenshotsMap?: Record<string, Buffer>;
   }
) {}
