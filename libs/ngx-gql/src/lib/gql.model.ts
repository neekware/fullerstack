export class GqlConfig {
  endpoint: string;
}

export interface GqlRequestBody {
  query: string;
  operationName: string;
  variables: { [id: string]: any };
}

export interface GqlResponseBody {
  data: any;
  error?: any;
}
