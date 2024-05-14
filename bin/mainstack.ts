import * as cdk from 'aws-cdk-lib';
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { GraphqlApi, Definition, AuthorizationType, MappingTemplate } from 'aws-cdk-lib/aws-appsync';
import { Function, Runtime, Code, Architecture } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';

export interface CustomProps extends cdk.StackProps {
  rootDirectory? : string;
}

export default class Mainstack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: CustomProps) {
    super(scope, id, props);

    // Create DynamoDB Table
    const productTable = new dynamodb.Table(this, 'Products', {
      partitionKey: { name: 'ProductId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change as needed
    });

    const productTaxonomyAttributesTable = new dynamodb.Table(this, 'ProductTaxonomyAttributes', {
      partitionKey: { name: 'TaxonomyId', type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Change as needed
    });

    productTaxonomyAttributesTable.addGlobalSecondaryIndex({
      partitionKey: { name: 'ParentId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'Name', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
      indexName: 'ParentIndex'
    })

    const schemaPath = props?.rootDirectory + '/graphql/schema.graphql';
    const lambdaPath =  props?.rootDirectory + '/../build/products/products';

    // Create AppSync API
    const productAPIs = new GraphqlApi(this, 'ProductAPIs', {
      name: 'product',
      definition: Definition.fromFile(schemaPath),
      authorizationConfig:{
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        }
      }
    });

    const handlerName = 'products'

    const handler = new Function(this, handlerName, {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromInline(lambdaPath),
      architecture: Architecture.ARM_64,
      memorySize: 1024,
      functionName: handlerName,
      handler: `${handlerName}.handler`,
      timeout: cdk.Duration.seconds(30),
      environment: {
        PRODUCT_TABLE_NAME: productTable.tableName,
        PRODUCT_TAXONOMY_TABLE_NAME: productTaxonomyAttributesTable.tableName,
      }
    });

    // Create a log group for the Lambda function
    const logGroup = new LogGroup(this, 'MyLambdaFunctionLogGroup', {
      logGroupName: `/aws/lambda/products`,
      retention: RetentionDays.ONE_DAY, // Set retention period as needed
    });

    // Add permission for the Lambda function to write logs to the log group
    logGroup.grantWrite(handler);

    const dbPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'dynamodb:Query',
        'dynamodb:Scan',
        'dynamodb:GetItem',
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem',
      ],
      resources: [
        productTable.tableArn,
        productTaxonomyAttributesTable.tableArn,
      ],
    })

    handler.addToRolePolicy(dbPolicy);

    const lambdaDataSource = productAPIs.addLambdaDataSource('productsDS', handler);
    lambdaDataSource.createResolver('getProductById',{
      typeName: 'Query',
      fieldName: 'getProductById',
      requestMappingTemplate: MappingTemplate.fromString(`
      {
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "operationName": "get",
          "entityName": "Product",
          "payload": $util.toJson($ctx.args)
        }
      }
      `),
      responseMappingTemplate: MappingTemplate.fromString('$utils.toJson($context.result)'),
    });

    lambdaDataSource.createResolver('listProducts',{
      typeName: 'Query',
      fieldName: 'listProducts',
      requestMappingTemplate: MappingTemplate.fromString(`
      {
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "operationName": "list",
          "entityName": "Product",
          "payload": $util.toJson($ctx.args)
        }
      }
      `),
      responseMappingTemplate: MappingTemplate.fromString('$utils.toJson($context.result)'),
    });

    lambdaDataSource.createResolver('createProduct',{
      typeName: 'Mutation',
      fieldName: 'createProduct',
      requestMappingTemplate: MappingTemplate.fromString(`
      {
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "operationName": "create",
          "entityName": "Product",
          "payload": $util.toJson($ctx.args.input)
        }
      }
      `),
      responseMappingTemplate: MappingTemplate.fromString('$utils.toJson($context.result)'),
    });

    lambdaDataSource.createResolver('updateProduct',{
      typeName: 'Mutation',
      fieldName: 'updateProduct',
      requestMappingTemplate: MappingTemplate.fromString(`
      {
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "operationName": "update",
          "entityName": "Product",
          "payload": $util.toJson($ctx.args.input)
        }
      }
      `),
      responseMappingTemplate: MappingTemplate.fromString('$utils.toJson($context.result)'),
    });

    lambdaDataSource.createResolver('deleteProduct',{
      typeName: 'Mutation',
      fieldName: 'deleteProduct',
      requestMappingTemplate: MappingTemplate.fromString(`
      {
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "operationName": "delete",
          "entityName": "Product",
          "payload": $util.toJson($ctx.args.input)
        }
      }
      `),
      responseMappingTemplate: MappingTemplate.fromString('$utils.toJson($context.result)'),
    });

    // Create CodePipeline
    // const pipeline = new codepipeline.Pipeline(this, 'EcommercePipeline');

    // Define CodePipeline stages and actions
    // const sourceStage = pipeline.addStage({
    //   stageName: 'Source',
    //   actions: [
    //     new codepipeline_actions.GitHubSourceAction({
    //       actionName: 'ExpeditePipeline',
    //       output: new codepipeline.Artifact(),
    //       owner: 'knee-tesh',
    //       repo: 'expedite',
    //       branch: 'main',
    //     }),
    //   ],
    // });

    // const buildStage = pipeline.addStage({
    //   stageName: 'Build',
    //   actions: [
    //     new codepipeline_actions.CodeBuildAction({
    //       actionName: 'Build',
    //       project: new codebuild.PipelineProject(this, 'MyBuildProject'),
    //       input: sourceStage.actions[0].actionProperties.outputs[0],
    //     }),
    //   ],
    // });

  }
}
