import { NextRequest, NextResponse } from 'next/server';
import { DI } from '../../../../infrastructure/database/di';
import { registerUser } from '../../../../modules/auth/services/AuthService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const result = await registerUser(name, email, password, await DI.getEntityManager());
    return NextResponse.json({ success: true, user: result?.user });
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
