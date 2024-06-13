import { User } from '../entities/user';
import { DefineAPI } from './type';

export type UserAPI = DefineAPI<{
  signUp: {
    basePath: '/api/user';
    path: 'sign-up';
    body: Pick<User, 'name' | 'type'>;
    method: 'POST';
    response: User;
  };
  signIn: {
    basePath: '/api/user';
    path: 'sign-in';
    body: void;
    method: 'GET';
    response: User | null;
  };
  pairUser: {
    basePath: '/api/user';
    path: 'pair';
    body: {
      target: User['id'];
    };
    method: 'POST';
    response: void;
  };
  listUsers: {
    basePath: '/api/user';
    path: 'list';
    body: {
      ids: User['id'][];
    };
    method: 'POST';
    response: User[];
  };
}>;
