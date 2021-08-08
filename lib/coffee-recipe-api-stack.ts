import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync'
import * as api from './api'
import * as datasources from './storage'

export class CoffeeRecipeApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const recipeApi = api.createApi(this)
    const recipeStorage = datasources.getRecipeTable(this)

    const recipeDataSource = recipeApi.addDynamoDbDataSource('id', recipeStorage)

    recipeDataSource.createResolver({
      typeName: 'Query',
      fieldName: 'getRecipes',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbScanTable(),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultList(),
    })

    recipeDataSource.createResolver({
      typeName: 'Mutation',
      fieldName: 'addRecipe',
      requestMappingTemplate: appsync.MappingTemplate.dynamoDbPutItem(
        appsync.PrimaryKey.partition('id').auto(),
        appsync.Values.projecting('input')
      ),
      responseMappingTemplate: appsync.MappingTemplate.dynamoDbResultItem(),
    })
  }
}
