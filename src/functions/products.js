import getProductService from "../core/product-service";

const CREATE = "create";
const UPDATE = "update";
const DELETE = "delete";
const GET = "get";
const LIST = "list";

const productMethodsMap = {
  [CREATE]: getProductService().createProduct,
  [UPDATE]: getProductService().updateProduct,
  [DELETE]: getProductService().deleteProduct,
  [GET]: getProductService().getProduct,
  [LIST]: getProductService().listProduct,
};

const categoryMethodsMap = {
  [CREATE]: getProductService().createCategory,
  [UPDATE]: getProductService().updateCategory,
  [DELETE]: getProductService().deleteCategory,
  [GET]: getProductService().getCategory,
  [LIST]: getProductService().listCategories,
};

const methodMap = { Product: productMethodsMap, Category: categoryMethodsMap };

const handler = (event, context) => {
  const { operationName, entityName, payload } = event;
  console.log(
    "[CALLED] handler operationName, entityName",
    operationName,
    entityName
  );
  const response = methodMap[entityName][operationName](payload);
  return response;
};

export { handler };
