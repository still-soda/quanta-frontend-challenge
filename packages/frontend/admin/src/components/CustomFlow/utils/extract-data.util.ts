import { FlowData } from '@challenge/core';

export type ExtractData<T extends FlowData> = Omit<T['detail'], 'type'>;
