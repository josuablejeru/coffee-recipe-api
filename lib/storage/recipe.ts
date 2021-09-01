import * as core from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'


export const getRecipeTable = (scope: core.Construct): dynamodb.Table => {
  return new dynamodb.Table(scope, 'CoffeeRecipeTable', {
    tableName: 'coffee-recipes',
    partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: core.RemovalPolicy.DESTROY,
  })
}