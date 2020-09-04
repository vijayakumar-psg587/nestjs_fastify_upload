import {AppConfigService} from "../../shared/services/app-config.service";
import fastify, {FastifyRequest} from "fastify";
import {IncomingMessage} from "http";
import {isInstance} from "class-validator";
import {AppUtilService} from "../../shared/services/app-util.service";

export const reqFileUploadValidator = (
    target: Object,
    propKey: string,
    propertyDescriptor: PropertyDescriptor
) => {
  const origMethod = propertyDescriptor.value;

  propertyDescriptor.value = async function(...args) {

    //
    const result= await origMethod.apply(this, args);
    console.log(`Execution time:milliseconds`);
    return result;
  };

  return propertyDescriptor;
};
