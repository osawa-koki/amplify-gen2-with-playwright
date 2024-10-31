import fs from 'fs';

import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface Props {
  cognitoIdentityProviderClient: CognitoIdentityProviderClient;
  username: string;
  password: string;
  userPoolClientId: string;
}
export default async function getToken(props: Props) {
  const { cognitoIdentityProviderClient, username, password, userPoolClientId } = props;

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: userPoolClientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    });

    const response = await cognitoIdentityProviderClient.send(command);
    const authResult = response.AuthenticationResult;
    if (authResult == null) {
      throw new Error("AuthenticationResult is null");
    }
    const jsonString = fs.readFileSync('./playwright.env.json', 'utf8');
    const json = JSON.parse(jsonString);
    json.ID_TOKEN = authResult.IdToken;
    json.ACCESS_TOKEN = authResult.AccessToken;
    json.REFRESH_TOKEN = authResult.RefreshToken;
    fs.writeFileSync('./playwright.env.json', JSON.stringify(json, null, 2));
    console.log("success:", authResult);
    return
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}
