1. Create `client` directory in root directory
2. Create `server` directory in root directory
3. Create `template.yaml` file in root directory

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: NextJs Application on AWS
Globals:
    Function:
        Timeout: 3
Resources:
    NextJsServerFunction:
        Type: AWS::Serverless::Function
        Properties:
            CodeUri: server/
            Handler: index.lambdaHandler
            Runtime: nodejs12.x
            Events:
                NextJsServer:
                    Type: Api
                    Properties:
                        Path: /
                        Method: any

Outputs:
    NextJsServerApi:
        Description: "API Gateway endpoint URL for Prod stage for NextJs server function"
        Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/nextjsserver/"
    NextJsServerFunction:
        Description: "NextJs server Lambda Function ARN"
        Value: !GetAtt NextJsServerFunction.Arn
    NextJsServerFunctionIamRole:
        Description: "Implicit IAM Role created for NextJs Server function"
        Value: !GetAtt NextJsServerFunctionRole.Arn
```

4. In command line, change into `./server` directory

```bash
cd server
```

5. Initialise NPM in the directory

```bash
npm init -y
```

6. Modify the `./server/package.json` file

```json
{
	// Other properties
	"name": "nextjsserver",
    // Other properties
    "script": {
-       "test": "echo \"Error: no test specified\" && exit 1",
    }
}
```

7. Create an `index.js` file in `./server` directory

```js
// ./server/index.js
exports.lambdaHandler = async (event, context) => {
	try {
		response = {
			statusCode: 200,
			body: JSON.stringify({
				message: "Hello from NextJs Server.",
			}),
		};
	} catch (err) {
		console.log(err);
		return err;
	}

	return response;
};
```

## Test Lambda deployment

1. Return to root directory

```bash
cd ..
```

2. Run `sam build`
3. Run `sam deploy --guided --profile <YOUR_AWS_PROFILE>`

## Create ExpressJs Server

1. In the command line, change into `./server` directory

```bash
cd server
```

2. Install dependencies

```bash
npm i express
```

3. Create a mock endpoint with Express

```js
// ./server/server.js
const express = require("express");
const server = express();

server.get("/", (req, res) => {
	res.send("GET endpoint called.");
});

server.post("/", (req, res) => {
	res.send("POST endpoint called.");
});

server.put("/", (req, res) => {
	res.send("PUT endpoint called.");
});

server.delete("/", (req, res) => {
	res.send("DELETE endpoint called.");
});

module.exports = server;
```

4. Install `serverless-http` as a proxy

```bash
npm i serverless-http
```

5. Modify `./server/index.js`

```js
const server = require("./server");
const serverless = require("serverless-http");
const handler = serverless(server);

exports.lambdaHandler = async (event, context) => {
	return await handler(event, context);
};
```

6. Rebuild and redeploy

```bash
cd ..
sam build
sam deploy --guided --profile <YOUR_AWS_PROFILE>
```

7. Test POST, PUT, DELETE endpoint with Postman

## Version control

1. Initialise `git` in the command line at the root directory

```bash
git init
```

2. In root directory create a `.gitignore` file

```.gitignore
**/node_modules/
.aws-sam/
samconfig.toml
```

## Create NextJs Application

Initialise NPM in `client` directory

```bash
npm init -y
```

Install dependencies

```bash
npm i next@9.5.4 react@16.13.1 react-dom@16.13.1
```

Install development dependencies

```bash
npm i -D rimraf
```

Modify `package.json` so that `main` properties point to `server.js` in `server` directory

```diff
// ./client/package.json
{
-   "main": "index.js"
+   "main": "../server/server.js
    "script": {

    }
}
```

Create `pages` and `components` directories in `client` directory

Create `_app.js` file in `pages` directory

```js
// ./client/pages/_app.js
import React from "react";

const App = ({ Component, pageProps }) => {
	return <Component {...pageProps} />;
};

export default App;
```

Create `index.js` file in `pages` directory

```js
// ./client/pages/index.js

import React from "react";

const HomePage = () => {
	return <div>Home Page</div>;
};

export default HomePage;
```

Create `about.js` file in `pages` directory

```js
import React from "react";

const AboutPage = () => {
	return <div>About Page</div>;
};

export default AboutPage;
```

Create `next.config.js` file in `client` directory

```js
module.exports = {
	distDir: "dist",
};
```

Test our setup

```bash
npm run dev
```

## Using our custom Express server

Modify directory structure in `server` directory

```bash
# ./server
mkdir dependencies
cd dependencies
mkdir nodejs
```

Move the `package.json` file from `./server` directory into the `./server/dependencies/nodejs` directory.

Delete the `node_modules` folder and the `package-lock.json` file in `./server` directory.

Change into the `./server/dependencies/nodejs` directory and install the packages.

```bash
npm i
```

Update the `template.yaml` file

```diff
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: NextJs Application on AWS
Globals:
    Function:
        Timeout: 3
Resources:
    NextJsServerFunction:
        Type: AWS::Serverless::Function
        Properties:
            CodeUri: server/
            Handler: index.lambdaHandler
            Runtime: nodejs12.x
+           Layers:
+               - !Ref NextJsServerDepLayer
            Events:
                NextJsServer:
                    Type: Api
                    Properties:
                        Path: /
                        Method: any
+   NextJsServerDepLayer:
+       Type: AWS::Serverless::LayerVersion
+       Properties:
+           LayerName: next-js-server-dependencies
+           Description: Dependencies for NextJs Server
+           ContentUri: server/dependencies/
+           CompatibleRunTimes:
+               - nodejs12.x
+           RetentionPolicy: Retain

Outputs:
    NextJsServerApi:
        Description: "API Gateway endpoint URL for Prod stage for NextJs server function"
        Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/nextjsserver/"
    NextJsServerFunction:
        Description: "NextJs server Lambda Function ARN"
        Value: !GetAtt NextJsServerFunction.Arn
    NextJsServerFunctionIamRole:
        Description: "Implicit IAM Role created for NextJs Server function"
        Value: !GetAtt NextJsServerFunctionRole.Arn

```
