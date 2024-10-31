import fs from 'fs';
import { AuthenticationResultType } from '@aws-sdk/client-cognito-identity-provider';

import { jwtDecode } from "jwt-decode";

interface Props {
  authResult: AuthenticationResultType;
  userPoolClientId: string;
  username: string;
}
export default async function save(props: Props) {
  const { authResult, userPoolClientId, username } = props;

  const idToken = authResult.IdToken;
  const accessToken = authResult.AccessToken;
  const refreshToken = authResult.RefreshToken;
  const decodedToken = jwtDecode(idToken!);
  const sub = decodedToken.sub!;
  const prefix = `CognitoIdentityServiceProvider.${userPoolClientId}.${sub}`;
  const context = {
    cookies: [],
    origins: [
      {
        origin: 'http://127.0.0.1:3000',
        localStorage: [
          {
            name: `${prefix}.idToken`,
            value: idToken
          },
          {
            name: `${prefix}.accessToken`,
            value: accessToken
          },
          {
            name: `${prefix}.refreshToken`,
            value: refreshToken
          },
          {
            name: `${prefix}.signInDetails`,
            value: JSON.stringify({
              authFlowType: 'ALLOW_USER_PASSWORD_AUTH',
              loginId: username
            })
          },
          {
            name: `CognitoIdentityServiceProvider.${userPoolClientId}.LastAuthUser`,
            value: sub
          }
        ]
      }
    ]
  }
  fs.writeFileSync('./storageState.json', JSON.stringify(context, null, 2));
}
