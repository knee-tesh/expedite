## AWS Fullstack Developer Assignment

### Overview

This streamlined assignment is designed to evaluate your fundamental expertise in developing, and maintaining robust backend services, APIs, and microservices. Your task is to create microservices for a simplified real-life scenario, using node.js integrating with Appsync & Lambda.

### eCommerce Application

You've been tasked with developing a microservice to manage product information. This microservice will be used in the AWS Amplify hosted eCommerce application. This application should support high traffic & high performance.
This assignment assumes that the candidate has an AWS account set up. Prerequisites:

**Product Data Model in DynamoDB**

1. Table Name: **Products**

   > - ProductId : Unique identifier for each product.
   > - Name : Name of the product.
   > - Description : A detailed description of the product.
   > - Price : The price of the product.
   > - Category : Category to which the product belongs.
   > - Stock : Inventory count.
   > - CreatedAt : Timestamp when the product was added.
   > - UpdatedAt : Timestamp of the last update to the product.
   >   Primary Key:
   > - Partition Key: ProductId

2. Table Name: **ProductTaxonomyAttributes**

   > - TaxonomyId : A unique identifier for each category or tag.
   > - Name : The name of the category or tag.
   > - Description : A brief description of the category or tag.
   > - ParentId : An identifier linking to the parent category for hierarchical structures.
   >   For top-level categories, this could be null or a specific value like "root".
   > - Type : Distinguishes between different types of taxonomy, such as 'category' or
   >   'tag'.

   > Primary Key:
   >
   > - Partition Key: TaxonomyId

   > Secondary Indexes:
   > **_Global Secondary Index_** -
   >
   > - Name: ParentIndex
   > - Partition Key: ParentId
   > - Sort Key: Name

### Tasks

1. MicroserviceDevelopment
   Develop a microservice using Node.js to manage product information such as creating, retrieving, updating, and deleting products. Ensure interaction with DynamoDB database for storage. Make assumptions to include the input & output
2. IntegrationwithAWSLambda&AWSAppSync
   AWS Lambda Integration: Package Node.js application into AWS Lambda functions. Configure Lambda functions to handle requests and connect with DynamoDB.
   AWS AppSync Integration: Set up an AWS AppSync GraphQL API for the frontend to interact with the backend services seamlessly.
3. Deploymentstrategy
   Configure AWS CodePipeline to automate the build, test, and deployment processes. Use AWS CodeBuild to execute build specifications and run tests every time the code is updated in the repository.

### Deliverables

- Source Code Repositories: Provide URLs to the GitHub repositories for each service
- Diagrams are welcome.
- Keep explanations clear and concise.
  Evaluation Criteria
- Functionality and Code Quality: Efficient and readable code using best practices in Node.js development.
- AWS Integration Proficiency: Effective use of AWS services, demonstrating a solid understanding of serverless architecture.
- Deployment Acumen: Correct implementation of CI/CD pipelines and infrastructure as code for seamless deployment and scalability.
  Submission
- Please submit your response in a single PDF document that includes a code repository link
- A short video demo is optional
- Clearly label each section and ensure explanations are well-defined and concise.
  Notes for Candidates
- This assignment is designed to be completed within 3-4 hours.
- Focus on demonstrating your ability to create microservices as per best practices
  & integrate with AppSync/Lambda.
