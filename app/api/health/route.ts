import { PrepareApiResponse } from '@/shared/utils';


// region GET /api/health
// Health Checker
export async function GET(_request: Request) {
  return PrepareApiResponse.response({
    data: { live: true },
    message: 'Health Check',
  });
}
