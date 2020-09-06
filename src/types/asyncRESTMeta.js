export const AsyncRESTMetaType = "AsyncRESTMetaType"
export default class AsyncRESTMeta {
  constructor(route, method) {
    this.type = AsyncRESTMetaType
    this.route = route
    this.method = method
  }
}