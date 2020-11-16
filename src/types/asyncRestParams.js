export const AsyncRestParamsType = "AsyncRestParamsType"
export default class AsyncRestParams {
  constructor(route, method, customHost) {
    this.type = AsyncRestParamsType
    this.route = route
    this.method = method
    this.customHost = customHost
  }
}