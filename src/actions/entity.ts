export const addEntity = (entity: any, onResolved: any) => ({
  type: 'ENTITY_ADD',
  entity,
  onResolved,
})
export const addEntitySucceeded = (model: any) => ({
  type: 'ENTITY_ADD_SUCCEEDED',
  model,
})
export const addEntityFailed = (message: any) => ({
  type: 'ENTITY_ADD_FAILED',
  message,
})

export const updateEntity = (entity: any, onResolved: any) => ({
  type: 'ENTITY_UPDATE',
  entity: entity,
  onResolved,
})
export const updateEntitySucceeded = (payload: any) => ({
  type: 'ENTITY_UPDATE_SUCCEEDED',
  payload,
})
export const updateEntityFailed = (message: any) => ({
  type: 'ENTITY_UPDATE_FAILED',
  message,
})

export const moveEntity = (params: any, onResolved: any) => ({
  type: 'ENTITY_MOVE',
  params,
  onResolved,
})
export const moveEntitySucceeded = () => ({
  type: 'ENTITY_MOVE_SUCCEEDED',
})
export const moveEntityFailed = (message: any) => ({
  type: 'ENTITY_MOVE_FAILED',
  message,
})

export const deleteEntity = (id: any, onResolved: any) => ({
  type: 'ENTITY_DELETE',
  id,
  onResolved,
})
export const deleteEntitySucceeded = (id: any) => ({
  type: 'ENTITY_DELETE_SUCCEEDED',
  id,
})
export const deleteEntityFailed = (message: any) => ({
  type: 'ENTITY_DELETE_FAILED',
  message,
})

export const sortEntityList = (ids: any, onResolved: any) => ({
  type: 'ENTITY_LIST_SORT',
  ids,
  onResolved,
})
export const sortEntityListSucceeded = (count: any) => ({
  type: 'ENTITY_LIST_SORT_SUCCEEDED',
  count,
})
export const sortEntityListFailed = (message: any) => ({
  type: 'ENTITY_LIST_SORT_FAILED',
  message,
})

export const fetchEntity = (id: number, onResolved: any) => ({
  type: 'ENTITY_FETCH',
  id,
  onResolved,
})

export const fetchEntitySucceeded = (payload: any) => ({
  type: 'ENTITY_FETCH_SUCCEEDED',
  payload,
})
export const fetchEntityFailed = (message: any) => ({
  type: 'ENTITY_FETCH_FAILED',
  message,
})

export const lockEntity = (id: any, onResolved?: any) => ({
  type: 'ENTITY_LOCK',
  id,
  onResolved,
})
export const lockEntitySucceeded = (entId: any, locker: any) => ({
  type: 'ENTITY_LOCK_SUCCEEDED',
  payload: {
    entId,
    locker,
  },
})
export const lockEntityFailed = (message: any) => ({
  type: 'ENTITY_LOCK_FAILED',
  message,
})

export const unlockEntity = (id: any, onResolved?: any) => ({
  type: 'ENTITY_UNLOCK',
  id,
  onResolved,
})
export const unlockEntitySucceeded = (entId: any) => ({
  type: 'ENTITY_UNLOCK_SUCCEEDED',
  payload: {
    entId,
  },
})
export const unlockEntityFailed = (message: any) => ({
  type: 'ENTITY_UNLOCK_FAILED',
  message,
})
