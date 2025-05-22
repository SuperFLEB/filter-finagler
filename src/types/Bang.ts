type Bang<T, KnownGood extends keyof T = keyof T> = T & Required<{ [K in KnownGood]: Exclude<T[K], null | undefined> }>;
export type {Bang as default};