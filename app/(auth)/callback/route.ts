import { createClient } from '@/utils/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('chegou aqui');

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('redirect_to') ?? '/reset-password';
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${requestUrl.origin}/${next}`);
    }
  }

  supabase.auth.signOut();
  return NextResponse.redirect(`${requestUrl.origin}/login`);
}
