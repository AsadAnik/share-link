import { IUnsafeObject } from './type';

export interface ILink {
  id: string;
  platform: string;
  url: string;
  user_id: string;
  createdAt: string;
}

export interface ILinkSliceState {
  url: null | ILink;
  isLoading: boolean;
  result: null | IUnsafeObject;
}
