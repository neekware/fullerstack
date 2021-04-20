import { User } from '@prisma/client';

export class UserDataAccess {
  private static secureUser(user: User): Partial<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...securedUser } = user;
    return securedUser;
  }

  static self(user: User): Partial<User> {
    const securedUser = UserDataAccess.secureUser(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sessionVersion, ...prunedUser } = securedUser;
    return prunedUser;
  }

  static staff(user: User): Partial<User> {
    const securedUser = UserDataAccess.secureUser(user);
    return securedUser;
  }

  static admin(requester: User, user: User): Partial<User> {
    const securedUser = UserDataAccess.secureUser(user);
    return securedUser;
  }

  static superuser(requester: User, user: User): Partial<User> {
    const securedUser = UserDataAccess.secureUser(user);
    return securedUser;
  }
}
