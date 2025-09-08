import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '../../../../modules/auth/services/AuthService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    await registerUser(name, email, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    const statusCode = errorMessage === 'Invalid credentials.' ? 401 : 
                      errorMessage === 'Invalid form data.' ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
