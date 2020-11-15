// import rest from 'rest';
// import mime from 'rest/interceptor/mime'
import { getOr, omit } from 'lodash/fp'
import { AsyncRESTMetaType } from '../../types/asyncRESTMeta';
import LoadingSuccessFailureActionType from "../../types/loadingSuccessFailureActionType"

// const client = rest.wrap(mime);
const defaultServerHost = getOr(null, '__myapp.server_host_url', window)

const asyncRESTCall = store => next => action => {  
  if (getOr(undefined, 'payload.meta.type', action) === AsyncRESTMetaType) {
    const actionTypeTriple = new LoadingSuccessFailureActionType(action.type)
    const {dispatch} = store
    let actualHost = defaultServerHost
    const route = getOr(null, 'payload.meta.route', action)
    if (route === null) {
      successOrFailure(`action: ${actionTypeTriple.loading}, missing route: ${JSON.stringify(action.payload)}`, dispatch, actionTypeTriple.failure, action, actionTypeTriple)
    }
    const method = getOr(null, 'payload.meta.method', action)
    if (method === null) {
      successOrFailure(`action: ${actionTypeTriple.loading}, missing method (GET/POST...): ${JSON.stringify(action.payload)}`, dispatch, actionTypeTriple.failure, action, actionTypeTriple)
    }
    const customHost = getOr(null, 'payload.meta.customHost', action)
    if(customHost !== null){
      actualHost = customHost
    }
    if (!actualHost) {
      successOrFailure(`action: ${actionTypeTriple.loading}, missin host (from config.js), can't resolve path`, dispatch, actionTypeTriple.failure, action, actionTypeTriple)
    }
    const path = `${actualHost}${action.payload.meta.route}`
    const body = getOr(undefined, 'payload.body', action)

    dispatch({
      ...omit('payload.meta.type', action), 
      type: actionTypeTriple.loading
    })

    fetch(path, {
      method,
      mode: "cors",
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': "http://localhost:3000"
      },
      body: JSON.stringify(body)
    }).then((response) => {
      successOrFailure(response, dispatch, actionTypeTriple.success, action, actionTypeTriple)
    }, (response) => {
      successOrFailure(response, dispatch, actionTypeTriple.failure, action, actionTypeTriple)
    })
  }
  return next(action)
}

const successOrFailure = (payload, dispatch, type, previousAction, originalType) => {
  try {
    payload.json().then((result) => {
      dispatch({
        type,
        payload: result,
        previousAction
      })
    }) 
  } catch (error) {
    dispatch({
      type: originalType.failure,
      payload: null,
      previousAction
    })
  }  
}

export default asyncRESTCall