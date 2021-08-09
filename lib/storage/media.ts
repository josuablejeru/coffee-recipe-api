import * as core from '@aws-cdk/core'
import * as s3 from '@aws-cdk/aws-s3'

const getPhotoStorage = (scope: core.Stack) => {
  const photoBucket = new s3.Bucket(scope, 'photo-storage', {
    bucketName: 'photo-storage',
    enforceSSL: true,
    removalPolicy: core.RemovalPolicy.DESTROY
  })
}