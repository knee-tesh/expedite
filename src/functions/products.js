import getProductService from "../core/product-service";

const CREATE = "create";
const UPDATE = "update";
const DELETE = "delete";
const GET = "get";

const methodMap = {
  [CREATE]: getProductService().createProduct,
  [UPDATE]: getProductService().updateProduct,
  [DELETE]: getProductService().deleteProduct,
  [GET]: getProductService().getProduct,
};

const handler = (event, context) => {
  const { operationName, operationType, entityName, payload } = event;
  console.log(operationName, operationType, entityName);
  const response = methodMap[operationName](payload);
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: response,
    }),
  };
};

export { handler };