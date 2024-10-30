import {
  CognitoIdentityProviderClient,
  UpdateUserPoolCommand,
  UpdateUserPoolClientCommand,
} from "@aws-sdk/client-cognito-identity-provider";

interface DisableEmailVerificationProps {
  cognitoIdentityProviderClient: CognitoIdentityProviderClient;
  userPoolId: string;
}

async function disableEmailVerification(props: DisableEmailVerificationProps) {
  const { cognitoIdentityProviderClient, userPoolId } = props;

  try {
    const command = new UpdateUserPoolCommand({
      UserPoolId: userPoolId,
      AutoVerifiedAttributes: [],
      UserAttributeUpdateSettings: {
        AttributesRequireVerificationBeforeUpdate: [],
      },
      VerificationMessageTemplate: {
        DefaultEmailOption: "CONFIRM_WITH_CODE",
      },
      MfaConfiguration: "OFF",
    });
    const response = await cognitoIdentityProviderClient.send(command);
    console.log("User pool updated successfully:", response);
  } catch (error) {
    console.error("Error updating user pool:", error);
  }
}

interface EnableUserPasswordAuthProps {
  cognitoIdentityProviderClient: CognitoIdentityProviderClient;
  userPoolId: string;
  userPoolClientId: string;
}
async function enableUserPasswordAuth(props: EnableUserPasswordAuthProps) {
  const { cognitoIdentityProviderClient, userPoolId, userPoolClientId } = props;

  try {
    const command = new UpdateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientId: userPoolClientId,
      ExplicitAuthFlows: [
        "ALLOW_CUSTOM_AUTH",
        "ALLOW_REFRESH_TOKEN_AUTH",
        "ALLOW_USER_SRP_AUTH",
        "ALLOW_USER_PASSWORD_AUTH",
      ],
    });

    const response = await cognitoIdentityProviderClient.send(command);
    console.log("Success: enableUserPasswordAuth", response);
  } catch (error) {
    console.error("Error: enableUserPasswordAuth", error);
  }
}

interface Props {
  cognitoIdentityProviderClient: CognitoIdentityProviderClient;
  userPoolId: string;
  userPoolClientId: string;
}
export default async function updateUserPool(props: Props) {
  const { cognitoIdentityProviderClient, userPoolId, userPoolClientId } = props;

  await disableEmailVerification({
    cognitoIdentityProviderClient,
    userPoolId,
  });
  await enableUserPasswordAuth({
    cognitoIdentityProviderClient,
    userPoolId,
    userPoolClientId,
  });
}
