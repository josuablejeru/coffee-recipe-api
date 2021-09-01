import * as core from '@aws-cdk/core'
import * as lambdaNodejs from '@aws-cdk/aws-lambda-nodejs'
import * as lambda from '@aws-cdk/aws-lambda'
import * as storage from '../storage'

export const resolvePhotoLambda = (scope: core.Stack): lambda.Function => {
  const photoBucket = storage.getPhotoStorage(scope)

  const photoResolverLambda = new lambdaNodejs.NodejsFunction(scope, 'PhotoResolver', {
    functionName: 'PhotoResolver',
    entry: './lambda/photo-resolver.ts',
    handler: 'photoResolver',
    environment: {
      S3_BUCKET: photoBucket.bucketArn,
      S3_URL: photoBucket.bucketWebsiteUrl
    }
  })


  return photoResolverLambda
}