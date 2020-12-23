const server = require("./server");
const serverless = require("serverless-http");
const handler = serverless(server);
exports.lambdaHandler = async (event, context) => {
	return await handler(event, context);
};
