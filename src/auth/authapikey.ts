import {
	Injectable, CanActivate, ExecutionContext, UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthApikeyGuard implements CanActivate {
	constructor() {}

	async canActivate(
		context: ExecutionContext,
	): Promise<boolean> {
		const req = context.switchToHttp().getRequest();
		const { apikey } = req.headers;
		const secret =  process.env.API_KEY;
		if (apikey === secret) return true;
		throw new UnauthorizedException();
	}
}
