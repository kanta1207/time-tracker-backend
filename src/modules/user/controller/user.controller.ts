import { Request, Response } from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpGet,
  httpPost,
  queryParam,
  requestBody,
  requestParam,
} from 'inversify-express-utils';
import { TYPES } from '../../../core/type.core';
import { IUserService } from '../interfaces/IUser.service';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { DtoValidationMiddleware } from '../../../middlewares/dto-validation.middleware';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { NotFoundException } from '../../../common/errors/all.exception';
@controller('/users')
export class UserController {
  constructor(
    @inject(TYPES.IUserService) private readonly userService: IUserService,
  ) {}

  @httpGet('/:userId')
  public async getUser(
    @requestParam('userId') id: number,
    req: Request,
    res: Response,
  ) {
    const user = await this.userService.findOneById(id);
    if (!user) throw new NotFoundException('User not found');
    const { email } = user;
    return res.status(200).json({
      email,
    });
  }

  @httpPost('/:userId/email-update', DtoValidationMiddleware(UpdateEmailDto))
  public async updateEmail(
    @requestParam('userId') id: number,
    @requestBody() updateEmailDto: UpdateEmailDto,
    req: Request,
    res: Response,
  ) {
    const { email } = updateEmailDto;
    await this.userService.updateEmailAndSendVerification(id, email);
    return res.status(200).json();
  }

  @httpGet('/email-update/verification')
  public async verifyNewEmail(
    @queryParam('token') token: string,
    req: Request,
    res: Response,
  ) {
    this.userService.verifyUserWithToken(token);
    return res.status(200).json();
  }

  @httpPost(
    '/:userId/password-update',
    DtoValidationMiddleware(UpdatePasswordDto),
  )
  public async updatePassword(
    @requestParam('userId') id: number,
    @requestBody()
    updatePasswordDto: UpdatePasswordDto,
    req: Request,
    res: Response,
  ) {
    const { password } = updatePasswordDto;
    this.userService.updatePassword(id, password);
    return res.status(200).json();
  }

  @httpPost(
    '/:userId/password-update/request',
    DtoValidationMiddleware(ResetPasswordDto),
  )
  public async sendPasswordResetEmail(
    @requestParam('userId') id: number,
    @requestBody() resetPasswordDto: ResetPasswordDto,
    req: Request,
    res: Response,
  ) {
    const { email } = resetPasswordDto;
    // check if email is valid, and send an email to user
    await this.userService.handlePasswordResetRequest(id, email);
    return res.status(200).json();
  }

  @httpGet('/password-update/verification')
  public async verifyUserNewPassword(
    @queryParam('token') token: string,
    req: Request,
    res: Response,
  ) {
    this.userService.verifyUserWithToken(token);
    return res.status(200).json();
  }
}
