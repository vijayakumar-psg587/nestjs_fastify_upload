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
    const req= args.filter((val) => (val)
        && (val.raw) && isInstance(val.raw, IncomingMessage))[0];
    console.log('req found:', req);
    if(!req.isMultipart()) {
        throw AppConfigService.getCustomError('FID-REQ', 'Request doesnt contain a file');
    }
    console.log(req.isMultipart());
    const result= await origMethod.apply(this, args);
    console.log(`Execution time:milliseconds`);
    return result;
  };

  return propertyDescriptor;
};
