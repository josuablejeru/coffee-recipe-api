import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as api from './api'
import * as datasources from './storage'
import * as photoResolver from './resolvers/resolvePhotos'
import * as dynamoResolvers from './resolvers/dynamoResolvers'

export class CoffeeRecipeApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const recipeApi = api.createApi(this)
    const recipeStorage = datasources.getRecipeTable(this)
    const photoStorage = photoResolver.resolvePhotoLambda(this)

    const recipeDataSource = recipeApi.addDynamoDbDataSource('recipeDatasource', recipeStorage)
    const photoDataSource = recipeApi.addLambdaDataSource('photo', photoStorage, {
      description: 'resolvs all media objects stored in s3'
    })

    dynamoResolvers.appendResolvers(recipeDataSource)

    photoDataSource.createResolver({
      typeName: 'Step',
      fieldName: 'photo',
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
