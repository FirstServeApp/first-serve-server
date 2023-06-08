import { IUserDto } from './dtos/user.dto.ts'

declare global {
  namespace Express {
    interface Request {
      user?: IUserDto;
    }

    interface AuthenticatedRequest extends Request {
      user: IUserDto;
    }
  }
}
