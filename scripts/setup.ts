import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import awsconfig from "@/amplify_outputs.json";
import playwrightEnv from "@/playwright.env.json";

import updateUserPool from "./updateUserPool";
import createUser from "./createUser";
import getToken from "./getToken";
import save from "./save";

const userPoolId = awsconfig.auth.user_pool_id;
const userPoolClientId = awsconfig.auth.user_pool_client_id;

const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({
  region: awsconfig.auth.aws_region,
});

const username = playwrightEnv.USERNAME;
const password = playwrightEnv.PASSWORD;

(async () => {
  await updateUserPool({
    cognitoIdentityProviderClient,
    userPoolId,
    userPoolClientId,
  });
  await createUser({
    cognitoIdentityProviderClient,
    email: username,
    password,
  });
  const authResult = await getToken({
    cognitoIdentityProviderClient,
    username,
    password,
    userPoolClientId,
  });

  await save({
    authResult,
    userPoolClientId,
    username,
  });
})()
  .then(() => {
    console.log("Setup completed.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
