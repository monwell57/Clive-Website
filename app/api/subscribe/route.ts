// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/mailchimp';

export async function POST(request: Request) {
  const { email, journey } = await request.json();
  
  if (!email || !journey) {
    return NextResponse.json(
      { error: 'Email and journey are required' },
      { status: 400 }
    );
  }
  
  const result = await subscribeToNewsletter(email, journey);
  
  if (result.success) {
    return NextResponse.json({ 
      message: 'Successfully subscribed!' 
    });
  } else {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }
}