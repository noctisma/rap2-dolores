import React, { useState } from 'react'
import { connect, Link, replace, StoreStateRouterLocationURI } from '../../family'
import {  RSortable } from '../utils'
import ModuleForm from './ModuleForm'

import { useSelector, useDispatch } from 'react-redux'
import { GoPackage, GoDiffModified } from 'react-icons/go'
import { deleteModule, sortModuleList } from '../../actions/module'
// import { deleteModel, sortModelList } from '../../actions/model'
import { Module, Repository, RootState, User } from '../../actions/types'

interface ModuleBaseProps {
  repository: Repository
  mod: Module
  active?: boolean
  auth?: User
  deleteModule: typeof deleteModule
  replace?: typeof replace
}
function ModuleBase(props: ModuleBaseProps) {
  const { mod} = props
  const router = useSelector((state: RootState) => state.router)
  const uri = StoreStateRouterLocationURI(router).removeSearch('itf')
  const selectHref = uri.setSearch('mod', mod!.id.toString()).href()

  return (
    <div className="Module clearfix">
      <Link to={selectHref} className="name">
        {mod.name}
      </Link>
    </div>
  )
}

interface ModelBaseProps {
  repository: Repository
  active?: boolean
  auth?: User
  // deleteModule: typeof deleteModule
  replace?: typeof replace
}

// function ModelBase(props: ModuleBaseProps) {
//   const { model } = props
//   const router = useSelector((state: RootState) => state.router)
//   const uri = StoreStateRouterLocationURI(router).removeSearch('itf')
//   const selectHref = uri.setSearch('model', mod!.id.toString()).href()

//   return (
//     <div className="Module clearfix">
//       <Link to={selectHref} className="name">
//         模型管理
//       </Link>
//     </div>
//   )
// }

const mapStateToModuleBaseProps = (state: any) => ({
  router: state.router,
})
const mapDispatchToModuleBaseProps = ({
  deleteModule,
  replace,
})

const ModuleWrap = connect(mapStateToModuleBaseProps, mapDispatchToModuleBaseProps)(ModuleBase)

// const ModelWarp = connect()()

interface ModuleListProps {
  mods?: Module[]
  mod?: Module
  repository: Repository
}
function ModuleList(props: ModuleListProps) {
  const [open, setOpen] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)

  const dispatch = useDispatch()
  const auth = useSelector((state: RootState) => state.auth)
  const { repository, mods = [], mod } = props
  const handleSort = (_: any, sortable: any) => {
    dispatch(sortModuleList(sortable.toArray(), () => {
      /** empty */
    }))
  }
  return (
    <RSortable onChange={handleSort} disabled={!repository.canUserEdit}>
      <ul className="ModuleList clearfix">
        {mods.map((item: any) => (
          <li
            key={item.id}
            className={item.id === mod!.id ? 'active sortable' : 'sortable'}
            data-id={item.id}
          >
            <ModuleWrap
              key={item.id}
              mod={item}
              active={item.id === mod!.id}
              repository={repository}
              auth={auth}
            />
          </li>
        ))}
        {/* 编辑权限：拥有者或者成员 */}
        {repository.canUserEdit ? (
          <li>
            <span className="fake-link" onClick={() => setOpen(true)}>
              <GoPackage className="fontsize-14" /> 新建模块
            </span>
            <ModuleForm
              title="新建模块"
              repository={repository}
              open={open}
              onClose={() => setOpen(false)}
            />
          </li>
        ) : null}
      </ul>
    </RSortable>
  )
}
const mapStateToProps = (state: RootState) => ({
  auth: state.auth,
  router: state.router,
})
const mapDispatchToProps = ({
  replace,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModuleList)
