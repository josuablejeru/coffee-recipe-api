import * as appsync from '@aws-cdk/aws-appsync'
import * as path from 'path'

export const mapResolverTemplate = (typeName: string, fieldName: string, mapperDir: string) => {
  const templateMap = {
    typeName,
    fieldName,
    requestMappingTemplate: appsync.MappingTemplate.fromFile(path.join(mapperDir, `${typeName}.${fieldName}.req.vtl`)),
    responseMappingTemplate: appsync.MappingTemplate.fromFile(path.join(mapperDir, `${typeName}.${fieldName}.res.vtl`))
  }

  return templateMap
}