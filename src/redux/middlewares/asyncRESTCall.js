// import rest from 'rest';
// import mime from 'rest/interceptor/mime'
import { getOr, omit } from 'lodash/fp'
import { AsyncRESTMetaType } from '../../types/asyncRESTMeta';
import LoadingSuccessFailureActionType from "../../types/loadingSuccessFailureActionType"

// const client = rest.wrap(mime);
const serverHost = getOr(null, '__myapp.server_host_url', window)

const asyncRESTCall = store => next => action => {  
  if (getOr(undefined, 'payload.meta.type', action) === AsyncRESTMetaType) {
    const actionTypeTriple = new LoadingSuccessFailureActionType(action.type)
    const {dispatch} = store
    const route = getOr(null, 'payload.meta.route', action)
    if (route === null) {
      successOrFailure(`action: ${action.type.loading}, missing route: ${JSON.stringify(action.payload)}`, dispatch, actionTypeTriple.failure, action)
    }
    const method = getOr(null, 'payload.meta.method', action)
    if (route === null) {
      successOrFailure(`action: ${action.type.loading}, missing method (GET/POST...): ${JSON.stringify(action.payload)}`, dispatch, actionTypeTriple.failure, action)
    }
    if (serverHost === null) {
      successOrFailure(`action: ${action.type.loading}, missin host (from config.js), can't resolve path`, dispatch, actionTypeTriple.failure, action)
    }
    const path = `${serverHost}${action.payload.meta.route}`
    const body = getOr(undefined, 'payload.body', action)

    dispatch({
      type: actionTypeTriple.loading, ...omit('payload.meta.type', action)
    })

    fetch(path, {
      method,
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }).then((response) => {
      successOrFailure(response, dispatch, actionTypeTriple.success, action)
    }, (response) => {
      successOrFailure(response, dispatch, actionTypeTriple.failure, action)
    })
  }
  return next(action)
}

const successOrFailure = (payload, dispatch, type, previousAction) => {
  payload.json().then((result) => {
    dispatch({
      type,
      payload: result,
      previousAction
    })
  })
}

export default asyncRESTCall