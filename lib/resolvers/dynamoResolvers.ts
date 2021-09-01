import * as appsync from '@aws-cdk/aws-appsync'
import * as path from 'path'
import * as fs from 'fs'

export const appendResolvers = (datasoucre: appsync.DynamoDbDataSource) => {

  const mapperDirectory = path.resolve(__dirname, '../mappers')

  fs.readdir(mapperDirectory, (err, files: string[]) => {
    files.forEach((file: string) => {
      const resolver = file.split('.')
      const resolverTypeName = resolver[0]
      const resolverFieldName = resolver[1]
      const resolverDirection = resolver[2]

      // TODO: delete this check becouse the schema will be else there
      if (resolverTypeName === 'schema') {
        return
      }

      // check if the file is a response template
      if (resolverDirection === 'res') {
        return 
      }

      datasoucre.createResolver({
        typeName: resolverTypeName,
        fieldName: resolverFieldName,
        requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(mapperDirectory, file)),
        responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(mapperDirectory, `${resolverTypeName}.${resolverFieldName}.res.vtl`))
      })
    })
  })
}
