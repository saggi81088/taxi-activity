'use client';

import type { User } from '@/types/user';
import axiosInstance from '@/lib/axios';

// Decode JWT token
function decodeToken(token: string): { data?: Record<string, unknown>; error?: string } {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const jsonPayload = decodeURIComponent(
      [...atob(base64)]
        .map((c) => '%' + ('00' + c.codePointAt(0)?.toString(16)).slice(-2))
        .join('')
    );
    return { data: JSON.parse(jsonPayload) };
  } catch {
    return { error: 'Failed to decode token' };
  }
}

function generateToken(): string {
  const arr = new Uint8Array(12);
  globalThis.crypto.getRandomValues(arr);
  return [...arr].map((v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
  id: 'USR-000',
  avatar: '/assets/avatar.png',
  firstName: 'Sofia',
  lastName: 'Rivers',
  email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = generateToken();
    localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    try {
      // Use Next.js proxy instead of direct CI API call
      const response = await axiosInstance.post('/auth/login', { email, password });

      const { access_token } = response.data;

      if (!access_token) {
        return { error: 'No access token received' };
      }

      // Store the token
      localStorage.setItem('custom-auth-token', access_token);

      // Decode token to verify it contains user data
      const { data: _decodedToken, error: decodeError } = decodeToken(access_token);
      if (decodeError) {
        return { error: decodeError };
      }

      return {};
    } catch (error_: unknown) {
      const err = error_ as Record<string, unknown>;
      let errorMessage = 'Sign in failed';
      
      // Handle axios error response
      if ((err as Record<string, unknown>).response && typeof (err as Record<string, unknown>).response === 'object') {
        const responseData = (err as Record<string, unknown>).response as Record<string, unknown>;
        errorMessage = (responseData.data as Record<string, unknown>)?.message as string || 'Sign in failed';
      } else if ((err as Record<string, unknown>).message) {
        errorMessage = (err as Record<string, unknown>).message as string;
      }
      
      return { error: errorMessage };
    }
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    // Make API request

    // We do not handle the API, so just check if we have a token in localStorage.
    const token = localStorage.getItem('custom-auth-token');

    if (!token) {
      return { data: null };
    }

    // Decode token to get user data with role
    const { data: decodedToken } = decodeToken(token);
    
    if (decodedToken?.data && typeof decodedToken.data === 'object' && decodedToken.data !== null) {
      const tokenData = decodedToken.data as Record<string, unknown>;
      const userData = {
        id: String(tokenData.id || 'USR-000'),
        name: String(tokenData.name || ''),
        email: String(tokenData.email || ''),
        role: String(tokenData.role || 'promoter'),
      } as User;
      // Return user data from JWT
      return {
        data: userData,
      };
    }

    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('custom-auth-token');

    return {};
  }
}

export const authClient = new AuthClient();
