export type ApiMeta = {
  code: number;
  success: boolean;
  message: string;
};

/** GET /news/stats/published-count */
export type PublishedNewsCountResponse = {
  meta: ApiMeta;
  data: { publishedCount: number };
};

/** GET /news/stats/total-count */
export type TotalNewsCountResponse = {
  meta: ApiMeta;
  data: { totalCount: number };
};

/** GET /students/stats/registered-count */
export type RegisteredStudentsCountResponse = {
  meta: ApiMeta;
  data: { count: number };
};

/** GET /students/stats/last-week-registered-count */
export type LastWeekRegisteredStudentsCountResponse = {
  meta: ApiMeta;
  data: { count: number };
};
