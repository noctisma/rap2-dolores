// import * as OrganizationAction from '../actions/organization'
// import * as RespositoryAction from '../actions/repository'
import * as ModuleEffects from './effects/module'
import * as InterfaceEffects from './effects/interface'
import * as EntityEffects from './effects/entity'
import * as PropertyEffects from './effects/property'

export default {
  reducers: {},
  sagas: {
    MODULE_ADD: ModuleEffects.addModule,
    MODULE_UPDATE: ModuleEffects.updateModule,
    MODULE_MOVE: ModuleEffects.moveModule,
    MODULE_DELETE: ModuleEffects.deleteModule,

    INTERFACE_FETCH: InterfaceEffects.fetchInterface,
    INTERFACE_ADD: InterfaceEffects.addInterface,
    INTERFACE_UPDATE: InterfaceEffects.updateInterface,
    INTERFACE_MOVE: InterfaceEffects.moveInterface,
    INTERFACE_DELETE: InterfaceEffects.deleteInterface,
    INTERFACE_COUNT: InterfaceEffects.fetchInterfaceCount,
    INTERFACE_LOCK: InterfaceEffects.lockInterface,
    INTERFACE_UNLOCK: InterfaceEffects.unlockInterface,

    ENTITY_FETCH: EntityEffects.fetchEntity,
    ENTITY_LOCK: EntityEffects.lockEntity,
    ENTITY_UNLOCK: EntityEffects.unlockEntity,
    ENTITY_ADD: EntityEffects.addEntity,
    ENTITY_UPDATE: EntityEffects.updateEntity,
    ENTITY_MOVE: EntityEffects.moveEntity,
    ENTITY_DELETE: EntityEffects.deleteEntity,

    PROPERTY_ADD: PropertyEffects.addProperty,
    PROPERTIES_UPDATE: PropertyEffects.updateProperties,
    PROPERTIES_ENTITY_UPDATE: PropertyEffects.updateEntityProperties,
    PROPERTY_DELETE: PropertyEffects.deleteProperty,
  },
  listeners: {},
}
