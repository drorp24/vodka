export const AsyncRESTMetaType = "AsyncRESTMetaType"
export default class AsyncRESTMeta {
  constructor(route, method, customHost) {
    this.type = AsyncRESTMetaType
    this.route = route
    this.method = method
    this.customHost = customHost
  }
}