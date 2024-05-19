import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import {} from 'firebase-admin/';
import { FirebaseService } from 'src/modules/util/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(FirebaseService) private firebaseService: FirebaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const firebaseAuth = this.firebaseService.getAuth();

    const idToken = request.header('Authorization').replace('Bearer ', '');

    if (idToken === undefined) return false;

    const result = await firebaseAuth.verifyIdToken(idToken);

    request['uid'] = result.uid;

    return true;
  }
}
