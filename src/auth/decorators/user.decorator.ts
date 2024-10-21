import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Repository } from 'typeorm'
import { AuthEntity } from '../entities/auth.entity';

export const CurrentUser = createParamDecorator(
	(data: keyof Repository<AuthEntity>, ctx: ExecutionContext) => {
	  const request = ctx.switchToHttp().getRequest();
	  const user = request.user;
  
	  return data ? user[data] : user;
	},
  );