import { tryGet } from '@fullerstack/agx-util';
import { User } from '@prisma/client';

export class UserDataAccessScope {
  private static secureUser(user: User): Partial<User> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...securedUser } = user;
    return securedUser;
  }

  static getSecuredUser(user: User, currentUser?: User): Partial<User> {
    return tryGet(
      () => UserDataAccessScope[currentUser.role.toLowerCase()](user),
      UserDataAccessScope.anonymous(user)
    );
  }

  static anonymous(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      isActive,
      isVerified,
      email,
      sessionVersion,
      role,
      permissions,
      groupId,
      ...prunedUser
    } = securedUser;
    return prunedUser;
  }

  static user(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sessionVersion, ...prunedUser } = securedUser;
    return prunedUser;
  }

  static staff(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    return securedUser;
  }

  static admin(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    return securedUser;
  }

  static superuser(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    return securedUser;
  }
}
