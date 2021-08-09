
/**
 * graphql resolver for s3 objects
 */
export const photoResolver = (event: any, context: any, callback: Function) => {
  console.log(`Invoke: event = ${JSON.stringify(event, null, 2)}`)
  console.log(`context = ${JSON.stringify(context, null, 2)}`)
  const response = {
    url: 'http://localhost/profilePictures/foo.png',
    uploadUrl: 'http://localhost/profilePictures/foo.png?upload'
  };

  callback(null, response)
};