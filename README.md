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
	"name": "nextjsserver"
	// Other properties
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
