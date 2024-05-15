const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

const documentClient = DynamoDBDocument.from(client);

function getProductService() {
  const createProduct = async (payload) => {
    try {
      console.log("[CALLED] product service createProduct", payload);
      const date = new Date().getTime();
      const ProductId = date.toString();

      const CreatedAt = new Date(date).toISOString();
      const UpdatedAt = new Date(date).toISOString();
      const Version = 1;
      const params = {
        TableName: process.env.PRODUCT_TABLE_NAME,
        Item: {
          pk: ProductId,
          sk: "",
          ...payload,
          ProductId,
          CreatedAt,
          UpdatedAt,
          Version,
        },
      };
      console.log("[createProduct] params: " + JSON.stringify(params));
      const result = await documentClient.put(params);
      console.log("[createProduct] result: " + JSON.stringify(result));
      return params.Item;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateProduct = async (payload) => {
    try {
      console.log("[CALLED] product service updateProduct", payload);
      const expressionAttributeNames = { "#a": "UpdatedAt", "#ver": "Version" };
      const expressionAttributeValues = {
        ":a": new Date().toISOString(),
        ":inc": 1,
      };
      let updateExpression = "SET #a = :a, #ver = #ver + :inc";
      for (let items in payload) {
        if (items === "ProductId") {
          continue;
        }
        expressionAttributeNames[`#${items}`] = items;
        expressionAttributeValues[`:${items}`] = payload[items];
        updateExpression += `, #${items} = :${items}`;
      }
      const result = await documentClient.update({
        TableName: process.env.PRODUCT_TABLE_NAME,
        Key: {
          ProductId: payload.ProductId,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      });
      return result.Attributes;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteProduct = async (payload) => {
    try {
      await documentClient.delete({
        TableName: process.env.PRODUCT_TABLE_NAME,
        Key: {
          ProductId: payload.ProductId,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getProduct = async (payload) => {
    try {
      console.log("[CALLED] getProduct, payload", payload);
      const result = await documentClient.get({
        TableName: process.env.PRODUCT_TABLE_NAME,
        Key: {
          ProductId: payload.ProductId,
        },
      });
      return result.Item;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const listProduct = async (payload) => {
    try {
      const result = await documentClient.scan({
        TableName: process.env.PRODUCT_TABLE_NAME,
      });
      return result.Items;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const createCategory = async (payload) => {
    try {
      console.log("[CALLED] product service createCategory", payload);
      const date = new Date().getTime();
      const TaxonomyId = date.toString();

      const CreatedAt = new Date(date).toISOString();
      const UpdatedAt = new Date(date).toISOString();
      const Version = 1;
      const params = {
        TableName: process.env.PRODUCT_TAXONOMY_TABLE_NAME,
        Item: {
          pk: TaxonomyId,
          sk: "",
          ...payload,
          TaxonomyId,
          CreatedAt,
          UpdatedAt,
          Version,
        },
      };
      console.log("[createProduct] params: " + JSON.stringify(params));
      const result = await documentClient.put(params);
      console.log("[createProduct] result: " + JSON.stringify(result));
      return params.Item;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateCategory = async (payload) => {
    try {
      console.log("[CALLED] product service updateCategory", payload);
      const expressionAttributeNames = { "#a": "UpdatedAt", "#ver": "Version" };
      const expressionAttributeValues = {
        ":a": new Date().toISOString(),
        ":inc": 1,
      };
      let updateExpression = "SET #a = :a, #ver = #ver + :inc";
      for (let items in payload) {
        if (items === "TaxonomyId") {
          continue;
        }
        expressionAttributeNames[`#${items}`] = items;
        expressionAttributeValues[`:${items}`] = payload[items];
        updateExpression += `, #${items} = :${items}`;
      }
      const result = await documentClient.update({
        TableName: process.env.PRODUCT_TAXONOMY_TABLE_NAME,
        Key: {
          TaxonomyId: payload.TaxonomyId,
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      });
      return result.Attributes;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteCategory = async (payload) => {
    try {
      await documentClient.delete({
        TableName: process.env.PRODUCT_TAXONOMY_TABLE_NAME,
        Key: {
          TaxonomyId: payload.TaxonomyId,
        },
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getCategory = async (payload) => {
    try {
      console.log("[CALLED] getCategory, payload", payload);
      const result = await documentClient.get({
        TableName: process.env.PRODUCT_TAXONOMY_TABLE_NAME,
        Key: {
          TaxonomyId: payload.TaxonomyId,
        },
      });
      return result.Item;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const listCategories = async (payload) => {
    try {
      const result = await documentClient.scan({
        TableName: process.env.PRODUCT_TAXONOMY_TABLE_NAME,
      });
      return result.Items;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    listProduct,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    listCategories,
  };
}

export default getProductService;
