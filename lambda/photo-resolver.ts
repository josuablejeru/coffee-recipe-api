import AWS from 'aws-sdk'
import Log from '@dazn/lambda-powertools-logger'

/**
 * graphql resolver for s3 objects
 */
export const photoResolver = async (event: any, context: any, callback: Function) => {

  console.log(`Invoke: event = ${JSON.stringify(event, null, 2)}`)
  console.log(`context = ${JSON.stringify(context, null, 2)}`)

  const bucketName = process.env.S3_BUCKET?.split(':')[5]
  if (!bucketName) {
    Log.error('No bucket name found in S3_BUCKET env variable')
  }

  AWS.config.update({region: process.env.AWS_REGION})
  const s3 = new AWS.S3()

  const key = `stepPhotos/${event.source.recipeId}/${event.source.id}.png`

  const params: Record<string, unknown> = {
    Bucket: 'photo-resolver-test',
    Key: key
  }

  /*
    ** Pre-sign a getObject synchronously
    */
    const response: Record<string, unknown> = {
      bucket: params.Bucket,
      key: params.Key,
      region: process.env.AWS_REGION,
      url: `${process.env.S3_URL}/${key}`
  };

  /*
  ** Pre-sign a putObject synchronously
  */
  response.uploadUrl = s3.getSignedUrl('putObject', params);
  Log.info('s3 response informations: ', response)

  callback(null, response)
};