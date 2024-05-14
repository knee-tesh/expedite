import getProductService from "../core/product-service";

const CREATE = "create";
const UPDATE = "update";
const DELETE = "delete";
const GET = "get";
const LIST = "list";

const methodMap = {
  [CREATE]: getProductService().createProduct,
  [UPDATE]: getProductService().updateProduct,
  [DELETE]: getProductService().deleteProduct,
  [GET]: getProductService().getProduct,
  [LIST]: getProductService().listProduct,
};

const handler = (event, context) => {
  const { operationName, entityName, payload } = event;
  console.log(
    "[CALLED] handler operationName, entityName",
    operationName,
    entityName
  );
  const response = methodMap[operationName](payload);
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: response,
    }),
  };
};

export { handler };
