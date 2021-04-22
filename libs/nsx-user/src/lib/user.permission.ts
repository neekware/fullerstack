import { tryGet } from '@fullerstack/agx-util';
import { User } from '@prisma/client';

export class UserDataAccess {
  private static secureUser(user: User): Partial<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...securedUser } = user;
    return securedUser;
  }

  static getSecuredUser(user: User, currentUser?: User): Partial<User> {
    return tryGet(
      () => UserDataAccess[currentUser.role.toUpperCase()](user),
      UserDataAccess.user(user)
    );
  }

  static user(user: User): Partial<User> {
    const securedUser = UserDataAccess.secureUser(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sessionVersion, ...prunedUser } = securedUser;
    return prunedUser;
  }

  static staff(user: User): Partial<User> {
    const securedUser = UserDataAccess.secureUser(user);
    return securedUser;
  }

  static admin(user: User): Partial<User> {
    const securedUser = UserDataAccess.secureUser(user);
    return securedUser;
  }

  static superuser(user: User): Partial<User> {
    const securedUser = UserDataAccess.secureUser(user);
    return securedUser;
  }
}
