export interface IPolicy {
  checks: {
    [key: string]: INessusItem
  },
  structure: IPolicyNode[]
}

export interface IPolicyNode {
  tagName: string;
  attributes?: { [key: string]: string };
  content?: IPolicyNode[];
  description?: string;
}

export interface INessusItem {
  [key: string]: string;
}