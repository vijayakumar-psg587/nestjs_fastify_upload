import { SwaggerModel } from '../swagger.model';

export class SwaggerModelBuilder {
  private swaggerModel: SwaggerModel;

  constructor() {
    this.swaggerModel = {
      context_path: '',
      description: '',
      email: '',
      name: '',
      server: '',
      title: '',
      tos: '',
      url: '',
      version: '',
    };
  }

  setContext(path:string) :SwaggerModelBuilder{
      this.swaggerModel.context_path = path;
      return this;
  }

  setUrl(url: string) :SwaggerModelBuilder{
      this.swaggerModel.url = url;
      return this;
  }

  setTOS(tos: string) :SwaggerModelBuilder{
      this.swaggerModel.tos = tos;
      return this;
  }

  setVersion(version:string) :SwaggerModelBuilder{
      this.swaggerModel.version = version;
      return this;
  }

  setEmail(email: string):SwaggerModelBuilder{
      this.swaggerModel.email = email;
      return this;
  }

  setServer(server: string):SwaggerModelBuilder {
      this.swaggerModel.server = server;
      return this;
  }

  setDescription(description:string) {
      this.swaggerModel.description = description;
      return this;
  }

  setTitle(title: string):SwaggerModelBuilder {
      this.swaggerModel.title = title;
      return this;
  }

  build(): SwaggerModel{
      return this.swaggerModel;
  }
}
