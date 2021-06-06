export interface JwtDto {
  userId: string;
  sessionVersion: number;
}

export const JWT_BEARER_REALM = 'Bearer';
