import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth';
import { UserAPI } from 'src/interfaces/endpoints/user';
import { AuthenticatedRequest } from 'src/types/request';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('/api/user')
export class UserController {
  constructor(@Inject(UserService) private userService: UserService) {}

  @Post('sign-up')
  async signUp(
    @Req() request: AuthenticatedRequest,
    @Body() body: UserAPI['signUp']['body'],
  ): Promise<UserAPI['signUp']['response']> {
    return this.userService.createUser({
      id: request.uid,
      name: body.name,
      type: body.type,
    });
  }

  @Get('sign-in')
  async signIn(
    @Req() request: AuthenticatedRequest,
  ): Promise<UserAPI['signIn']['response']> {
    return this.userService.getUser(request.uid);
  }

  @Post('pair')
  async pair(
    @Req() request: AuthenticatedRequest,
    @Body() body: UserAPI['pairUser']['body'],
  ): Promise<UserAPI['pairUser']['response']> {
    return this.userService.pairUser(request.uid, body.target);
  }
}
