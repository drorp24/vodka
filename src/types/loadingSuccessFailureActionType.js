export default class LoadingSuccessFailureActionType {
  constructor(actionType) {
    this.loading = `${actionType}_LOADING`
    this.success = `${actionType}_SUCCESS`
    this.failure = `${actionType}_FAILURE`
  }
}