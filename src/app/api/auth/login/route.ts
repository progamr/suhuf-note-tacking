import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '../../../../modules/auth/services/AuthService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    await loginUser(email, password);
    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong.';
    const statusCode = errorMessage === 'Invalid credentials.' ? 401 : 
                      errorMessage === 'Invalid email or password.' ? 400 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
