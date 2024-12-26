export interface PaginatedMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface WithId {
  _id: string;
}

export interface PaginatedResult<T extends WithId> {
  meta: PaginatedMeta;
  result: T[];
}
