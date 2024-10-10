import { IUnsafeObject } from './type';

export interface ILink {
  id: string;
  platform: string;
  link: string;
  user_id: string;
  createdAt: string;
}

export interface ILinkSliceState {
  link: null | ILink;
  isLoading: boolean;
  result: null | IUnsafeObject;
}
