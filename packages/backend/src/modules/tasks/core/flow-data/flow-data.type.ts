export interface FlowData {
  type: string;
  detail: Record<
    string,
    | number
    | string
    | boolean
    | Array<number | string | boolean>
    | Record<string, number | string | boolean>
    | Record<string, object>
  > & { type: string };
}
