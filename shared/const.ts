export const API_BASE_URL =
  (process.env.NODE_ENV || process.env.NEXT_PUBLIC_NODE_ENV) === 'development'
    ? `http://localhost:${process.env.PORT ?? process.env.NEXT_PUBLIC_PORT}/api`
    : 'http://dev.suno.com/api';

export const X_NEXT_TOKEN = 'x-next-token';

export const BG_GRADIENT =
  'bg-gradient-to-r from-[#E2335E] via-[#3E41F1] to-[#24AFD4]';
