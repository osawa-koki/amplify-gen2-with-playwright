import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  AdminConfirmSignUpCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import awsconfig from "@/amplify_outputs.json";

interface CreateUserProps {
  cognitoIdentityProviderClient: CognitoIdentityProviderClient;
  email: string;
  password: string;
}
export default async function createUser(props: CreateUserProps) {
  const { cognitoIdentityProviderClient, email, password } = props;

  try {
    const command = new SignUpCommand({
      ClientId: awsconfig.auth.user_pool_client_id,
      Username: email,
      Password: password,
    });
    const response = await cognitoIdentityProviderClient.send(command);
    console.log("User created successfully:", response);

    const confirmCommand = new AdminConfirmSignUpCommand({
      UserPoolId: awsconfig.auth.user_pool_id,
      Username: email,
    });
    await cognitoIdentityProviderClient.send(confirmCommand);
    console.log("User confirmed successfully");

    const updateCommand = new AdminUpdateUserAttributesCommand({
      UserPoolId: awsconfig.auth.user_pool_id,
      Username: email,
      UserAttributes: [
        {
          Name: "email_verified",
          Value: "true",
        },
      ],
    });
    await cognitoIdentityProviderClient.send(updateCommand);
    console.log("User email verified successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
}
