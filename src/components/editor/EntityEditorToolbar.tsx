import React from 'react'
import { Button, makeStyles, Theme, createStyles } from '@material-ui/core'
import LoadingButton from '../common/LoadingButton'
import Create from '@material-ui/icons/Create'
import KeyboardTab from '@material-ui/icons/KeyboardTab'
import Save from '@material-ui/icons/Save'
import Cancel from '@material-ui/icons/Cancel'
import { useSelector } from 'react-redux'
import { RootState } from 'actions/types'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
    rightIcon: {
      marginLeft: theme.spacing(1),
    },
    iconSmall: {
      fontSize: 20,
    },
  })
)

interface Props {
  auth: any,
  repository: any,
  locker?: any,
  editable: boolean,
  entId: number,
  moveEntity: any
  handleSaveEntityAndProperties: any
  handleUnlockEntity: any
  handleMoveEntity: any
  handleLockEntity: any
}

function EntityEditorToolbar(props: Props) {
  const { editable, locker, repository, handleLockEntity, handleMoveEntity,
    handleSaveEntityAndProperties, handleUnlockEntity } = props

  const loading = useSelector((state: RootState) => state.loading)

  const classes = useStyles()
  if (!repository.canUserEdit) { return null }
  if (editable) {
    return (
      <div className="EntityEditorToolbar">
        <LoadingButton
          className={classes.button}
          onClick={handleSaveEntityAndProperties}
          variant="contained"
          color="primary"
          disabled={loading}
          label="保存"
        >
          <Save className={classes.rightIcon} />
        </LoadingButton>
        <Button className={classes.button} onClick={handleUnlockEntity} variant="contained">
          取消
          <Cancel className={classes.rightIcon} />
        </Button>
        <span className="locker-warning hide">已经锁定当前实体！</span>
      </div>
    )
  }
  if (locker) {
    return (
      <div className="EntityEditorToolbar">
        <div className="alert alert-danger">当前实体已经被 <span className="nowrap">{locker.fullname}</span> 锁定！</div>
      </div>
    )
  }
  return (
    <div className="EntityEditorToolbar">
      <Button className={classes.button} onClick={handleMoveEntity} variant="contained">
        移动 / 复制
        <KeyboardTab className={classes.rightIcon} />
      </Button>
      <LoadingButton className={classes.button} onClick={handleLockEntity} variant="contained" color="primary" disabled={loading} label="编辑">
        <Create className={classes.rightIcon} />
      </LoadingButton>
    </div>
  )
}

export default EntityEditorToolbar
