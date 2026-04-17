'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from './env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: ReturnType<typeof createBrowserClient<any>> | null = null;

export function createClient() {
  if (!client) {
    const { url, anonKey } = getSupabaseEnv();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client = createBrowserClient<any>(url, anonKey);
  }

  return client;
}
