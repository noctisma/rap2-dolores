import React, { useState, MouseEventHandler } from 'react'
import { connect, Link, StoreStateRouterLocationURI, replace } from '../../family'
import { sortEntityList, deleteEntity } from '../../actions/entity'
import { deleteModule } from '../../actions/module'
import { Module, Repository, RootState, Entity, User } from '../../actions/types'
import { RSortable, CustomScroll } from '../utils'
import InterfaceForm from './InterfaceForm'
import { useConfirm } from 'hooks/useConfirm'
import { GoPencil, GoTrashcan, GoLock } from 'react-icons/go'
import { getCurrentInterface } from '../../selectors/interface'
import { Button, ButtonGroup } from '@material-ui/core/'
import ModuleForm from './ModuleForm'
import EntityEditor from './EntityEditor'
import EntityForm from './EntityForm'
import MoveModuleForm from './MoveModuleForm'
import { useSelector, useDispatch } from 'react-redux'
import './InterfaceList.css'

interface EntityBaseProps {
  repository: Repository
  mod: Module
  active?: boolean
  auth?: User
  ent?: Entity
  curEnt?: Entity
  deleteEntity: typeof deleteEntity
  replace?: typeof replace
}

function EntityBase(props: EntityBaseProps) {
  const { repository, mod, ent, curEnt } = props
  const auth = useSelector((state: RootState) => state.auth)
  const router = useSelector((state: RootState) => state.router)
  const selectHref = StoreStateRouterLocationURI(router)
    .setSearch('ent', ent!.id.toString())
    .href()
  const [open, setOpen] = useState(false)

  const handleDeleteModel: MouseEventHandler<HTMLAnchorElement> = e => {
    e.preventDefault()
    const message = `模型被删除后不可恢复！\n确认继续删除『#${ent!.id} ${ent!.name}』吗？`
    if (window.confirm(message)) {
      const { deleteEntity } = props
      deleteEntity(props.ent!.id, () => {
      })
      const { pathname, hash, search } = router.location
      replace(pathname + hash + search)
    }
  }

  return (
    <div className="Interface clearfix">
      <span>
        <Link
          to={selectHref}
          onClick={e => {
            if (
              curEnt &&
              curEnt.locker &&
              !window.confirm('编辑模式下切换模型，会导致编辑中的资料丢失，是否确定切换模型？')
            ) {
              e.preventDefault()
            } else {
              const top = document.querySelector<HTMLElement>('.InterfaceEditor')!.offsetTop - 10
              // 当接口列表悬浮时切换接口自动跳转到接口顶部
              if (window.scrollY > top) {
                window.scrollTo(0, top)
              }
            }
          }}
        >
          <div className="name">{ent!.name}</div>
          <div className="url">{ent!.namespace}</div>
        </Link>
      </span>
      {repository.canUserEdit ? (
        <div className="toolbar">
          {ent!.locker ? (
            <span className="locked mr5">
              <GoLock />
            </span>
          ) : null}
          {!ent!.locker || ent!.locker.id === auth.id ? (
            <span className="fake-link" onClick={() => setOpen(true)}>
              <GoPencil />
            </span>
          ) : null}
          {/* <InterfaceForm
            title="修改接口"
            repository={repository}
            mod={mod}
            ent={ent}
            open={open}
            onClose={() => setOpen(false)}
          /> */}
          {!ent!.locker ? (
            <Link to="" onClick={handleDeleteModel}>
              <GoTrashcan />
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
const mapStateToProps = (state: RootState) => ({
  curEnt: getCurrentInterface(state),
  router: state.router,
})
const mapDispatchToProps = {
  replace,
  deleteEntity,
}
const EntityWrap = connect(mapStateToProps, mapDispatchToProps)(EntityBase)

interface EntityListProps {
  ents?: Entity[]
  ent?: Entity
  curEnt: Entity
  mod: Module
  repository: Repository
}
function EntityList(props: EntityListProps) {
  const [entityFormOpen, setEntityFormOpen] = useState(false)
  const [moduleFormOpen, setModuleFormOpen] = useState(false)
  const [moveModuleFormOpen, setMoveModuleFormOpen] = useState(false)
  const dispatch = useDispatch()
  const confirm = useConfirm()
  const auth = useSelector((state: RootState) => state.auth)
  const { repository, ent, ents = [], mod } = props

  const handleDeleteModule: MouseEventHandler<HTMLButtonElement> = e => {
    e.preventDefault()
    const message = (
      <div>
        <div>模块被删除后不可恢复！并且会删除相关的接口！</div>
        <div>
          确认继续删除『#${mod.id} ${mod.name}
          』吗？
        </div>
      </div>
    )
    confirm({
      title: '确认删除模块',
      content: message,
    }).then(() => {
      dispatch(
        deleteModule(
          props.mod.id,
          () => {
          },
          repository!.id,
        ),
      )
    })
  }

  const handleSort = (_: any, sortable: any) => {
    dispatch(
      sortEntityList(sortable.toArray(), () => {
        /** empty */
      }),
    )
  }
  return (
    <article className="InterfaceList">
      {repository.canUserEdit ? (
        <div className="header">
          <Button
              className="newIntf"
              variant="outlined"
              fullWidth={true}
              color="primary"
              onClick={() => setEntityFormOpen(true)}
          >
            新建模型
          </Button>

          <EntityForm
            title="新建模型"
            repository={repository}
            mod={mod}
            open={entityFormOpen}
            onClose={() => setEntityFormOpen(false)}
          />

          {/* {entityFormOpen && (
            <EntityForm
              title="修改模型"
              mod={mod}
              repository={repository}
              ent={ent}
              open={entityFormOpen}
              onClose={() => setEntityFormOpen(false)}
            />
            // <EntityEditor ent={ent} mod={module} repository={repository} />
          )} */}
        </div>
      ) : null}
      {ents.length ? (
        <div className="scrollWrapper">
          <CustomScroll>
            <RSortable onChange={handleSort} disabled={!repository.canUserEdit}>
              <ul className="body">
                {ents.map((item: any) => (
                  <li
                    key={item.id}
                    className={item.id === ent!.id ? 'active sortable' : 'sortable'}
                    data-id={item.id}
                  >
                    <EntityWrap
                      repository={repository}
                      mod={mod}
                      ent={item}
                      active={item.id === ent!.id}
                      auth={auth}
                    />
                    {item.name}
                  </li>
                ))}
              </ul>
            </RSortable>
          </CustomScroll>
        </div>
      ) : (
          <div className="alert alert-info">暂无模型，请新建</div>
        )}
    </article>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EntityList)
