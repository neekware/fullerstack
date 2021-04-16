export enum Role {
  USER = 'USER',
  STAFF = 'STAFF',
  ADMIN = 'ADMIN',
}

/** Hydrating options for a User response DTO object */
export interface UserResponseOptions {
  seekretKey?: string;
  includeToken?: boolean;
  includeEmail?: boolean;
}
