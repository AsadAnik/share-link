import { WhereFilterOp } from 'firebase/firestore';

export type IUnsafeObject<T = unknown> = Record<string, T>;

export enum ECollections {
  PROFILE = 'profiles',
  LINK = 'links',
}

export interface ICollections {
  [ECollections.PROFILE]: ECollections;
  [ECollections.LINK]: ECollections;
}

export interface IWhereQuery {
  field: string;
  operator: WhereFilterOp;
  value: any;
}

export interface IOrderByQuery {
  field: string;
  order: 'asc' | 'desc';
}

export interface IDBQuery {
  where?: IWhereQuery[];
  orderBy?: IOrderByQuery[];
  limit?: number;
}
