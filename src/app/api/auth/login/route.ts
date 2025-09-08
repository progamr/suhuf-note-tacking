import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '../../../../modules/auth/services/AuthService';
import { DI } from '../../../../infrastructure/database/di';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await loginUser(email, password, await DI.getEntityManager());
    return NextResponse.json({ success: true, user: result?.userT });
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
