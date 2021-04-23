import { Type } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BaseResolver<T extends Type<unknown>>(classRef: T): any {
  @Resolver({ isAbstract: true })
  abstract class BaseResolverHost {
    @Query(() => [classRef], { name: `findAll${classRef.name}` })
    async findAll(): Promise<T[]> {
      return [];
    }
  }
  return BaseResolverHost;
}
