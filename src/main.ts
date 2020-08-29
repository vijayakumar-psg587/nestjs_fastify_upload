import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {FastifyAdapter, NestFastifyApplication} from "@nestjs/platform-fastify";
import {SERVERADAPTERINSTANCE} from "./server.adapter";
import {AppConfigService} from "./modules/shared/services/app-config.service";
import {CustomExceptionFilter} from "./modules/shared/filters/custom-exception.filter";
import fmp = require('fastify-multipart');
import "reflect-metadata";
let app: NestFastifyApplication;

(async function bootstrap() {
  const appConfig = AppConfigService.getAppCommonConfig();
  const fastifyInstance = SERVERADAPTERINSTANCE.configureFastifyServer();
  // @ts-ignore
  const fastifyAdapter = new FastifyAdapter(fastifyInstance);
  app = await NestFactory.create<NestFastifyApplication>(
      AppModule, fastifyAdapter
  ).catch(err => {
    console.log('err in creating adapter', err);
    process.exit(1);
  });

  console.log(global["dbConnObs"]);
  app.setGlobalPrefix(appConfig.context_path);


  //Swagger Config
  SERVERADAPTERINSTANCE.configureSwagger(app);

  // global exception filter
  app.useGlobalFilters(new CustomExceptionFilter());

  SERVERADAPTERINSTANCE.configureGlobalInterceptors(app);

  // @ts-ignore
  app.register(fmp);
  SERVERADAPTERINSTANCE.configureSecurity(app);
  await SERVERADAPTERINSTANCE.configureDbConn(app);

  await app.listen(appConfig.port, appConfig.host, () => {
    console.log(`Server listening on port - ${appConfig.port}`);
  });
})();

// Code for graceful shutdown
process.on('SIGTERM', async() => {
  try{
    await app.close();
  }catch (err) {
    process.stdout.write(`Error closing the app  - ${err}`);
    process.exit(1);
  }
  process.stdout.write('App is closed because of a SIGTERM event');
  process.exit(1);
});

// TODO: use Promise.all syntax to wrap aroud the await calls (more than one) await that
// and catch the exception , instead of listening to this rejection event
process.on('unhandledRejection', function(errThrown) {
  // this is a stream
  process.stderr.write('unhandled err thrown:' + errThrown);
  process.exit(1);
});