const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const documentClient = DynamoDBDocument.from(client);

function getProductService() {
  const createProduct = async (payload) => {
    console.log("[CALLED] product service createProduct", payload);
    const ProductId = new Date().getTime().toString();
    const params = {
      TableName: process.env.PRODUCT_TABLE_NAME,
      Item: {
        pk: ProductId,
        sk: "",
        ProductId,
        ...payload,
      },
    };
    console.log("[createProduct] params: " + JSON.stringify(params));
    const result = await documentClient.put(params);
    console.log("[createProduct] result: " + JSON.stringify(result));
    return params.Item;
  };

  const updateProduct = async (payload) => {
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    const updateExpression = "SET ";
    for (items in payload) {
      if (items === "ProductId") {
        continue;
      }
      expressionAttributeNames[`#${items}`] = items;
      expressionAttributeValues[`:${items}`] = payload[items];
      updateExpression += `#${items} = :${items}, `;
    }
    return await documentClient.update({
      TableName: process.env.PRODUCT_TABLE_NAME,
      Key: {
        pk: payload.ProductId,
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });
  };

  const deleteProduct = async (payload) => {
    return await documentClient.delete({
      TableName: process.env.PRODUCT_TABLE_NAME,
      Key: {
        pk: payload.ProductId,
      },
    });
  };

  const getProduct = async (payload) => {
    const result = await documentClient.get({
      TableName: process.env.PRODUCT_TABLE_NAME,
      Key: {
        pk: payload.ProductId,
      },
    });
    return result.Item;
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };
}

export default getProductService;
