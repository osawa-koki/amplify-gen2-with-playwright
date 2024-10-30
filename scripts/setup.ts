import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import awsconfig from "@/amplify_outputs.json";
import cypressEnv from "@/cypress.env.json";

import updateUserPool from "./updateUserPool";
import createUser from "./createUser";
import getToken from "./getToken";

const userPoolId = awsconfig.auth.user_pool_id;
const userPoolClientId = awsconfig.auth.user_pool_client_id;

const cognitoIdentityProviderClient = new CognitoIdentityProviderClient({
  region: awsconfig.auth.aws_region,
});

(async () => {
  await updateUserPool({
    cognitoIdentityProviderClient,
    userPoolId,
    userPoolClientId,
  });
  await createUser({
    cognitoIdentityProviderClient,
    email: cypressEnv.USERNAME,
    password: cypressEnv.PASSWORD,
  });
  await getToken({
    cognitoIdentityProviderClient,
    username: cypressEnv.USERNAME,
    password: cypressEnv.PASSWORD,
    userPoolClientId,
  });
})()
  .then(() => {
    console.log("Setup completed.");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
