// import { UserEntity } from '@fullerstack/nsx-common';
// import {
//   Resolver,
//   Query,
//   Parent,
//   Mutation,
//   Args,
//   ResolveField,
//   Info,
//   Int,
// } from '@nestjs/graphql';
// import { GraphQLResolveInfo } from 'graphql';
// import { User } from './user.models';
// import { UserService } from './user.service';

// @Resolver((of) => User)
// // @UseGuards(GqlAuthGuard)
// export class UserResolver {
//   constructor(private userService: UserService) {}

//   @Query((returns) => User)
//   async me(@UserEntity() user: User): Promise<User> {
//     return user;
//   }

//   // @UseGuards(GqlAuthGuard)
//   // @Query((returns) => User)
//   // async users(@Args('data') where: Prisma.UserWhereInput) {
//   //   return this.userService.users({ where });
//   // }

//   // @UseGuards(GqlAuthGuard)
//   // @Mutation((returns) => User)
//   // async updateUser(
//   //   @UserEntity() user: User,
//   //   @Args('data') newUserData: UpdateUserInput
//   // ) {
//   //   return this.userService.updateUser(user.id, newUserData);
//   // }

//   // @UseGuards(GqlAuthGuard)
//   // @Mutation((returns) => User)
//   // async changePassword(
//   //   @UserEntity() user: User,
//   //   @Args('data') changePassword: ChangePasswordInput
//   // ) {
//   //   return this.userService.changePassword(
//   //     user.id,
//   //     user.password,
//   //     changePassword
//   //   );
//   // }

//   // @ResolveField('posts')
//   // posts(@Parent() author: User) {
//   //   return this.prisma.user.findUnique({ where: { id: author.id } }).posts();
//   // }
// }
