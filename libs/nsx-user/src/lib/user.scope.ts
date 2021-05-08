/* eslint-disable @typescript-eslint/no-unused-vars */

import { tryGet } from '@fullerstack/agx-util';
import { Role, User } from '@prisma/client';

export class UserDataAccessScope {
  private static secureUser(user: User, currentUser?: User): Partial<User> {
    const { password, ...securedUser } = user;
    return securedUser;
  }

  static getSecuredUser(user: User, currentUser?: User): Partial<User> {
    return tryGet(
      () => UserDataAccessScope[currentUser.role.toLowerCase()](user, currentUser),
      UserDataAccessScope.anonymous(user)
    );
  }

  static anonymous(user: User, currentUser?: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user, currentUser);
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

  static user(user: User, currentUser?: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user, currentUser);
    if (user.id !== currentUser?.id) {
      return UserDataAccessScope.anonymous(user, currentUser);
    }

    const { sessionVersion, ...prunedUser } = securedUser;
    return prunedUser;
  }

  static staff(user: User, currentUser?: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user, currentUser);
    return securedUser;
  }

  static admin(user: User, currentUser?: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user, currentUser);
    return securedUser;
  }

  static superuser(user: User, currentUser?: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user, currentUser);
    return securedUser;
  }
}
