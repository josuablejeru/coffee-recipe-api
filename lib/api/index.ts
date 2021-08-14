import * as core from '@aws-cdk/core'
import * as appsync from '@aws-cdk/aws-appsync'
import * as path from 'path'

export const createApi = (scope: core.Construct) => {
  const _api = new appsync.GraphqlApi(scope, 'API', {
    name: 'coffe-recipe',
    schema: appsync.Schema.fromAsset(path.resolve(__dirname, '../mappers/schema.graphql')),
    logConfig: {
      fieldLogLevel: appsync.FieldLogLevel.ALL
    },
    xrayEnabled: true
  })

  return _api
}