import { ApiProvider } from "./apiProvider";

export class CrudProvider<T> extends ApiProvider {
  constructor(private entity: T, baseUri: string, options = {}) {
    super(baseUri, options);
  }

  get(id: string): Promise<T> {
    return this.call("GET", `${this.entityName}/${id}`);
  }

  create(data: Omit<T, 'id'>): Promise<T> {
    return this.call("POST", `${this.entityName}`, data);
  }

  update(id: string, data: Partial<T>): Promise<T> {
    return this.call("PATCH", `${this.entityName}/${id}`, data);
  }

  delete(id: string): Promise<T> {
    return this.call("DELETE", `${this.entityName}/${id}`);
  }

  private get entityName(): string {
    return this.entity.constructor.name.toLowerCase();
  }
}