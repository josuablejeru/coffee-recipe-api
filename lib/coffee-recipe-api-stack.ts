import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as api from './api'
import * as datasources from './storage'
import * as photoResolver from './resolvers/resolvePhotos'

export class CoffeeRecipeApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const recipeApi = api.createApi(this)
    const recipeStorage = datasources.getRecipeTable(this)
    const photoStorage = photoResolver.resolvePhotoLambda(this)

    const recipeDataSource = recipeApi.addDynamoDbDataSource('id', recipeStorage)
    const photoDataSource = recipeApi.addLambdaDataSource('photo', photoStorage, {
      description: 'resolvs all media objects stored in s3'
    })

    recipeDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getRecipes',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    })

    recipeDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getRecipe',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbGetItem('id', 'id'),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    })

    /*
     * Custom MappingTemplate for instancing a createdAt field
     * with the current DateTime set by dynamodb.
     */
    recipeDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addRecipe',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
      {
        "version" : "2017-02-28",
        "operation" : "PutItem",
        "key": {
            "id" : $util.dynamodb.toDynamoDBJson($util.autoId())
        },
        #set($input = $util.dynamodb.toMapValues($ctx.args.input))
        #set($input.createdAt = $util.dynamodb.toDynamoDB($util.time.nowISO8601()))
        "attributeValues": $util.toJson($input)
      }`),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    })

    photoDataSource.createResolver({
      typeName: 'Step',
      fieldName: 'picture',
      requestMappingTemplate: appsync.MappingTemplate.fromString(`
      {
        "version": "2017-02-28",
        "operation": "Invoke",
        "payload": {
          "source": $util.toJson($context.source),
          "identity": $util.toJson($context.identity)
        }
      }`)
    })
  }
}
