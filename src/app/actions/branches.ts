// app/actions/branch.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function switchBranch(bid: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthenticated');

  // 1. verify the branch belongs to this user’s restaurant
  const { data: valid } = await supabase
    .from('branch_settings')
    .select('id')
    .eq('id', bid)
    .single();
  if (!valid) throw new Error('Branch not found');

  // 2. remember it for every subsequent request
  (await cookies())
    .set('app_branch', bid, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return bid; // convenience
}