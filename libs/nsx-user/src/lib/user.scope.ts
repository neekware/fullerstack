/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import { tryGet } from '@fullerstack/agx-util';
import { Role, User } from '@prisma/client';

export class UserDataAccessScope {
  /**
   * Remove sensitive fields from user object
   * @param user user object to make secure
   * @returns pruned user object
   */
  static secureUser(user: User): Partial<User> {
    const { password, ...securedUser } = user;
    return securedUser;
  }

  /**
   * Remove sensitive fields from user object based on current user's role
   * @param user user object to make secure
   * @param currentUser current authenticated user
   * @returns pruned user object
   */
  static getSecuredUser(user: User, currentUser?: User): Partial<User> {
    return tryGet(
      () => UserDataAccessScope[currentUser.role.toLowerCase()](user, currentUser),
      UserDataAccessScope.anonymous(user)
    );
  }

  /**
   * Anonymize user object
   * @param user user object to anonymize
   * @returns pruned user object
   */
  static anonymous(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    const {
      isActive,
      isVerified,
      email,
      sessionVersion,
      role,
      language,
      permissions,
      groupId,
      ...prunedUser
    } = securedUser;
    return prunedUser;
  }

  /**
   * Prune user object for viewing by user of USER role
   * @param user user object to be pruned for regular users
   * @param currentUser current authenticated user
   * @returns pruned user object
   */
  static user(user: User, currentUser?: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    if (user.id !== currentUser?.id) {
      return UserDataAccessScope.anonymous(user);
    }

    const { sessionVersion, isActive, ...prunedUser } = securedUser;
    return prunedUser;
  }

  /**
   * Prune user object for viewing by user of STAFF role
   * @param user user object to be pruned for staff users
   * @returns pruned user object
   */
  static staff(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    if ([Role.SUPERUSER, Role.ADMIN].some((role) => role === user.role)) {
      const { isActive, sessionVersion, role, permissions, groupId, ...prunedUser } = securedUser;
      return prunedUser;
    }
    return securedUser;
  }

  /**
   * Prune user object for viewing by user of ADMIN role
   * @param user user object to be pruned for admin users
   * @returns pruned user object
   */
  static admin(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    if (user.role === Role.SUPERUSER) {
      const { isActive, sessionVersion, role, permissions, groupId, ...prunedUser } = securedUser;
      return prunedUser;
    }
    return securedUser;
  }

  /**
   * Prune user object for viewing by user of SUPERUSER role
   * @param user user object to be pruned for superuser users
   * @returns pruned user object
   */
  static superuser(user: User): Partial<User> {
    const securedUser = UserDataAccessScope.secureUser(user);
    return securedUser;
  }
}
