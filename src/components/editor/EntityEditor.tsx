import React, { Component } from 'react'
import { PropTypes, connect, _ } from '../../family'
import EntityEditorToolbar from './EntityEditorToolbar'
import InterfaceSummary, {
  BODY_OPTION,
  REQUEST_PARAMS_TYPE,
  rptFromStr2Num,
} from './InterfaceSummary'
import EntityPropertyList from './EntityPropertyList'
import { fetchRepository } from '../../actions/repository'
import { RootState } from 'actions/types'
import { lockEntity, unlockEntity, fetchEntity, updateEntity } from '../../actions/entity'
import { updateEntityProperties } from 'actions/property'
import Spin from '../../components/utils/Spin'

type EntityEditorProps = {
  auth: any
  ent: any
  mod: any
  repository: any
  lockEntity: typeof lockEntity
  fetchEntity: typeof fetchEntity
  unlockEntity: typeof unlockEntity
  updateEntity: typeof updateEntity
  updateEntityProperties: typeof updateEntityProperties
}

type EntityEditorState = {
  summaryState: any
  ent: any
  properties: any
  editable: boolean
  moveEntityDialogOpen: boolean
}
// TODO 2.x 参考 MySQL Workbench 的字段编辑器
// TODO 2.x 支持复制整个接口到其他模块、其他项目
class EntityEditor extends Component<EntityEditorProps, EntityEditorState> {
  static childContextTypes = {
    handleLockEntity: PropTypes.func.isRequired,
    handleUnlockEntity: PropTypes.func.isRequired,
    // handleSaveInterfaceAndProperties: PropTypes.func.isRequired,
    handleAddMemoryProperty: PropTypes.func.isRequired,
    handleAddMemoryProperties: PropTypes.func.isRequired,
    handleDeleteMemoryProperty: PropTypes.func.isRequired,
    handleChangeProperty: PropTypes.func.isRequired,
  }
  constructor(props: any) {
    super(props)
    this.state = {
      ...EntityEditor.mapPropsToState(props),
      summaryState: {
        bodyOption: BODY_OPTION.FORM_DATA,
        requestParamsType: REQUEST_PARAMS_TYPE.QUERY_PARAMS,
      },
      moveEntityDialogOpen: false,
    }
    this.summaryStateChange = this.summaryStateChange.bind(this)
  }
  static mapPropsToState(prevProps: any, prevStates: any = {}) {
    const { auth, ent } = prevProps
    const editable = !!(ent.locker && ent.locker.id === auth.id)
    return {
      ...prevStates,
      ent,
      // 编辑模式下不替换 properties
      properties:
        editable && prevStates.properties
          ? prevStates.properties
          : ent.properties?.map((property: any) => ({ ...property })),
      editable,
    }
  }
  getChildContext() {
    return _.pick(this, Object.keys(EntityEditor.childContextTypes))
  }

  summaryStateChange(summaryState: any) {
    this.setState({ summaryState })
  }

  componentWillReceiveProps(nextProps: any) {
    console.log(this.state.properties)
    if (
      nextProps.ent.id === this.state.ent.id &&
      nextProps.ent.updatedAt === this.state.ent.updatedAt &&
      this.state.properties !== undefined
    ) {
      return
    }
    const prevStates = this.state
    this.setState(EntityEditor.mapPropsToState(nextProps, prevStates))
  }

  fetchEntityProperties() {
    // 发现接口信息没有 properties 就发起请求
    console.log(this.props)
    console.log(this.state)
    if (this.state.properties === undefined) {
      this.props.fetchEntity(this.state.ent.id, () => { })
    }
  }

  componentDidMount() {
    this.fetchEntityProperties()
  }

  componentDidUpdate() {
    this.fetchEntityProperties()
  }

  render() {
    const { auth, repository, mod } = this.props
    const { editable, ent } = this.state
    const { id, locker } = this.state.ent
    console.log(this.props)
    if (!id) {
      return null
    }
    return (
      <article className="InterfaceEditor">
        <EntityEditorToolbar
          locker={locker}
          auth={auth}
          repository={repository}
          editable={editable}
          entId={ent.id}
          moveEntity={this.handleMoveEntity}
          handleLockEntity={this.handleLockEntity}
          handleMoveEntity={this.handleMoveEntity}
          handleSaveEntityAndProperties={this.handleSaveEntityAndProperties}
          handleUnlockEntity={this.handleUnlockEntity}
        />
        {this.state.properties ? (
          <EntityPropertyList
            scope="entity"
            title="模型参数"
            label="模型"
            properties={this.state.properties}
            auth={auth}
            editable={editable}
            repository={repository}
            mod={mod}
            entityId={ent.id}
            bodyOption={this.state.summaryState.bodyOption}
            requestParamsType={this.state.summaryState.requestParamsType}
            handleChangeProperty={this.handleChangeProperty}
            handleDeleteMemoryProperty={this.handleDeleteMemoryProperty}
          />
        ) : (
            <Spin />
          )}
      </article>
    )
  }
  handleAddMemoryProperty = (property: any, cb: any) => {
    this.handleAddMemoryProperties([property], cb)
  }
  handleAddMemoryProperties = (properties: any, cb: any) => {
    const requestParamsType = this.state.summaryState.requestParamsType
    const rpt = rptFromStr2Num(requestParamsType)

    properties.forEach((item: any) => {
      if (item.memory === undefined) {
        item.memory = true
      }
      if (item.id === undefined) {
        item.id = _.uniqueId('memory-')
      }
      item.pos = rpt
    })
    const nextState = { properties: [...this.state.properties, ...properties] }
    this.setState(nextState, () => {
      if (cb) {
        cb(properties)
      }
    })
  }
  handleDeleteMemoryProperty = (property: any, cb: any) => {
    const properties = [...this.state.properties]
    const index = properties.findIndex(item => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1)

      // 清除后代属性
      const deletedParentIds = [property.id]
      for (let index = 0; index < properties.length; index++) {
        if (deletedParentIds.indexOf(properties[index].parentId) !== -1) {
          deletedParentIds.push(properties[index].id)
          properties.splice(index--, 1)
          index = 0 // 强制从头开始查找，避免漏掉后代属性
        }
      }

      this.setState({ properties }, () => {
        if (cb) {
          cb()
        }
      })
    }
  }
  handleChangeProperty = (property: any) => {
    const properties = [...this.state.properties]
    const index = properties.findIndex(item => item.id === property.id)
    if (index >= 0) {
      properties.splice(index, 1, property)
      this.setState({ properties })
    }
  }
  handleChangeEntity = (newItf: any) => {
    console.log(newItf)
    // this.setState({
    //   itf: {
    //     ...this.state.itf,
    //     ...newItf,
    //   },
    // })
  }
  handleSaveEntityAndProperties = (e: any) => {
    e.preventDefault()
    const { ent } = this.state
    const { updateEntityProperties, updateEntity } = this.props
    updateEntity(
      {
        id: ent.id,
        name: ent.name,
        namespace: ent.namespace,
        type: ent.type,
        description: ent.description,
      },
      () => {
        /** empty */
      },
    )

    updateEntityProperties(this.state.ent.id, this.state.properties, this.state.summaryState, () => {
      this.handleUnlockEntity()
    })
    console.log('111111')

  }
  handleMoveEntity = () => {
    this.setState({
      moveEntityDialogOpen: true,
    })
  }
  handleMoveEntitySubmit = () => {
    /** empty */
  }
  handleLockEntity = () => {
    const { ent, lockEntity } = this.props
    console.log(ent)
    lockEntity(ent.id)
  }
  handleUnlockEntity = () => {
    const { ent, unlockEntity } = this.props
    console.log(ent)
    unlockEntity(ent.id)
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  fetchRepository,
})

const mapDispatchToProps = {
  fetchEntity,
  lockEntity,
  unlockEntity,
  updateEntityProperties,
  updateEntity,
}
export default connect(mapStateToProps, mapDispatchToProps)(EntityEditor)
