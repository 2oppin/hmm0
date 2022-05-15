import {Axios, AxiosRequestConfig} from 'axios';

export type HttpMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ApiOptions = {
  secure: boolean;
  port?: number;
};
export class ApiProvider {
  private cli;
  private options: ApiOptions;
  private authHeaders: { [key: string]: string } = {};
  constructor(private baseUri: string, options: Partial<ApiOptions> = {}) {
    this.options = {
      secure: options.secure || false,
      port: options.port || (options.secure ? 443 : 80),
      ...options,
    };
    this.cli = new Axios();
  }

  setAuth(type: 'jwt', token: string) {
    if (type === 'jwt')
      return this.authHeaders['Authorization'] = `Bearer ${token}`;

    throw new Error(`Unsupported auth type: ${type}`);
  }

  call(method: HttpMethods, path: string, data?: any): Promise<any> {
    const conf: AxiosRequestConfig = {
      method,
      url: `${this.baseUri}${path}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        ...this.authHeaders,
      },
      data,
    };
    return this.cli.request(conf)
      .then(res => res.data);
  }
}