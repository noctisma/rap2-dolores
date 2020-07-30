import {
  call,
  put,
  select
} from 'redux-saga/effects'
import * as EntityAction from '../../actions/entity'
import EditorService from '../services/Editor'
import * as RepositoryAction from '../../actions/repository'
import { RootState } from 'actions/types'
import { replace } from 'connected-react-router'
import { StoreStateRouterLocationURI } from 'family'

export function* fetchEntity(action: any) {
  try {
    const payload = yield call(EditorService.fetchEntity, action.id)
    yield put(EntityAction.fetchEntitySucceeded(payload))
    if (action.onResolved) {
      action.onResolved()
    }
  } catch (e) {
    console.error(e.message)
    yield put(EntityAction.fetchEntityFailed(e.message))
    if (action.onRejected) {
      action.onRejected()
    }
  }
}

export function* addEntity(action: any) {
  try {
    console.log(action)
    const payload = yield call(EditorService.addEntity, action.entity)
    yield put(EntityAction.addEntitySucceeded(payload))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(EntityAction.addEntityFailed(e.message))
    if (action.onRejected) { action.onRejected() }
  }
}
export function* updateEntity(action: any) {
  try {
    console.log(action)
    const result = yield call(EditorService.updateEntity, action.entity)
    yield put(EntityAction.updateEntitySucceeded(result))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(EntityAction.updateEntityFailed(e.message))
    if (action.onRejected) { action.onRejected() }
  }
}
export function* moveEntity(action: any) {
  try {
    const params = action.params

    yield call(EditorService.moveEntity, params)
    yield put(EntityAction.moveEntitySucceeded())
    yield put(RepositoryAction.refreshRepository())
    action.onResolved && action.onResolved()
  } catch (e) {
    console.error(e.message)
    yield put(EntityAction.moveEntityFailed(e.message))
    action.onRejected && action.onRejected()
  }
}
export function* deleteEntity(action: any) {
  try {
    yield call(EditorService.deleteEntity, action.id)
    yield put(EntityAction.deleteEntitySucceeded({
      id: action.id,
    }))
    const router = yield select((state: RootState) => state.router)
    yield put(replace(StoreStateRouterLocationURI(router).removeQuery('itf').toString()))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(EntityAction.deleteEntityFailed(e.message))
  }
}
// export function* fetchEntityCount() {
//   try {
//     const count = yield call(EditorService.fetchEntityCount)
//     yield put(EntityAction.fetchEntityCountSucceeded(count))
//   } catch (e) {
//     console.error(e.message)
//     yield put(EntityAction.fetchEntityCountFailed(e.message))
//   }
// }
export function* lockEntity(action: any) {
  try {
    const payload = yield call(EditorService.lockEntity, action.id)
    yield put(EntityAction.lockEntitySucceeded(action.id, payload))
    if (action.onResolved) { action.onResolved() }
  } catch (e) {
    console.error(e.message)
    yield put(EntityAction.lockEntityFailed(e.message))
  }
}
export function* unlockEntity(action: any) {
  try {
    const res = yield call(EditorService.unlockEntity, action.id)
    if (res.isOk) {
      console.log(action)
      yield put(EntityAction.unlockEntitySucceeded(action.id))
      if (action.onResolved) { action.onResolved() }
    } else {
      window.alert(`发生错误：${res.errMsg}`)
    }
  } catch (e) {
    console.error(e.message)
    yield put(EntityAction.unlockEntityFailed(e.message))
  }
}
// export function* sortEntityList(action: any) {
//   try {
//     const count = yield call(EditorService.sortEntityList, action.ids)
//     yield put(EntityAction.sortEntityListSucceeded(count, action.ids, action.moduleId))
//     if (action.onResolved) { action.onResolved() }
//   } catch (e) {
//     console.error(e.message)
//     yield put(EntityAction.sortEntityListFailed(e.message))
//   }
// }
