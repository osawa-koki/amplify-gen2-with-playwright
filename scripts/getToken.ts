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
    return authResult;
  } catch (error) {
    console.error("error:", error);
    throw error;
  }
}
