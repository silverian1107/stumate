import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from './casl-ability.factory/casl-ability.factory';
import { CHECK_POLICIES_KEY } from 'src/decorator/customize';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPolicies = this.reflector.get(
      CHECK_POLICIES_KEY,
      context.getHandler(),
    );
    if (!requiredPolicies) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const ability = this.caslAbilityFactory.createForUser(user);

    const policyHandlers = requiredPolicies.map((policy: any) =>
      policy(ability),
    );
    if (policyHandlers.some((can: any) => !can)) {
      throw new ForbiddenException(
        `You do not have permission to perform this action`,
      );
    }

    return true;
  }
}
