import * as core from '@aws-cdk/core'
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs'
import * as lambda from '@aws-cdk/aws-lambda'

export const resolvePhotoLambda = (scope: core.Stack): lambda.Function => {
  const photoResolverLambda = new lambdaNodejs.NodejsFunction(scope, 'PhotoResolver', {
    functionName: 'PhotoResolver',
    entry: './lambda/photo-resolver.ts',
    handler: 'photoResolver'
  })

  return photoResolverLambda
}