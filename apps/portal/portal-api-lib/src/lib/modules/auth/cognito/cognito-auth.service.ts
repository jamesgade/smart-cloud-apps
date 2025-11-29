import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import config from '../../../config';
import { UserLoginHistoryService } from '../user/user-login-history.service';
import { cognitoidentityserviceprovider } from '../../../config/aws.config';

@Injectable()
export class CognitoAuthService {
  private userPool: CognitoUserPool;
  constructor(
    private readonly userLoginHistoryService: UserLoginHistoryService
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: config.COGNITO_POOL_ID,
      ClientId: config.COGNITO_CLIENT_ID,
    });
  }

  authenticateUser(email: string, password: string, req?: any) {
    const authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    const userData = {
      Username: email,
      Pool: this.userPool,
    };

    const newUser = new CognitoUser(userData);

    return new Promise((resolve, reject) => {
      return newUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          if (err.code === 'NotAuthorizedException') {
            const log = 'Invalid Email or Password.';
            this.userLoginHistoryService.userLoginHistory(
              null,
              req,
              log,
              'FAILED'
            );
            reject(new HttpException(log, HttpStatus.UNAUTHORIZED));
          } else if (err.code === 'UserNotConfirmedException') {
            const log = 'Please confirm your registration first';
            this.userLoginHistoryService.userLoginHistory(
              null,
              req,
              log,
              'FAILED'
            );
            reject(new HttpException(log, HttpStatus.UNAUTHORIZED));
          } else if (err.code === 'UserNotFoundException') {
            const log = 'User not found. Please register first';
            this.userLoginHistoryService.userLoginHistory(
              null,
              req,
              log,
              'FAILED'
            );
            reject(new HttpException(log, HttpStatus.UNAUTHORIZED));
          } else if (err.code === 'UserAccountLockedException') {
            const log = 'Your account is locked. Please contact support';
            this.userLoginHistoryService.userLoginHistory(
              null,
              req,
              log,
              'FAILED'
            );
            reject(new HttpException(log, HttpStatus.UNAUTHORIZED));
          } else {
            this.userLoginHistoryService.userLoginHistory(
              null,
              req,
              err,
              'FAILED'
            );
            reject(new HttpException(`${err}`, HttpStatus.UNAUTHORIZED));
          }
        },
      });
    });
  }

  async adminGetUser(username: string): Promise<any> {
    try {
      const result = await cognitoidentityserviceprovider
        .adminGetUser({
          UserPoolId: config.COGNITO_POOL_ID,
          Username: username,
        })
        .promise();
      return result;
    } catch (error: any) {
      if (error.code === 'UserNotFoundException') {
        return null;
      }
      throw error;
    }
  }

  async adminSetUserPassword(username: string, password: string): Promise<void> {
    try {
      const params = {
        UserPoolId: config.COGNITO_POOL_ID,
        Username: username,
        Password: password,
        Permanent: true,
      };
      
      const result = await cognitoidentityserviceprovider
        .adminSetUserPassword(params)
        .promise();
        
    } catch (error: any) {
      console.error('AdminSetUserPassword failed:', error);
      throw new HttpException(
        `Failed to set user password: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
