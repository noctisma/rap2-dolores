import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { YUP_MSG } from '../../family/UIConst'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import { Button, Theme, Dialog, DialogContent, DialogTitle, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { SlideUp } from 'components/common/Transition'
import { Entity, Repository, RootState, Module } from '../../actions/types'
import { updateEntity, addEntity } from '../../actions/entity'
export const STRUCT_TYPE = ['STRUCT', 'EXCEPTION', 'UNION']

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: spacing(2),
    flex: 1,
  },
  preview: {
    marginTop: spacing(1),
  },
  form: {
    minWidth: 500,
    minHeight: 300,
  },
  formTitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 9,
  },
  formItem: {
    marginBottom: spacing(1),
  },
  ctl: {
    marginTop: spacing(3),
  },
}))

const schema = Yup.object().shape<Partial<Entity>>({
  name: Yup.string().required(YUP_MSG.REQUIRED).max(20, YUP_MSG.MAX_LENGTH(20)),
  description: Yup.string().max(1000, YUP_MSG.MAX_LENGTH(1000)),
})

const FORM_STATE_INIT: Entity = {
  id: 0,
  name: '',
  namespace: '',
  type: STRUCT_TYPE[0],
  description: '',
  repositoryId: 0,
  moduleId: 0
}

interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  ent?: Entity
  repository?: Repository
  mod?: Module
}

function InterfaceForm(props: Props) {
  const auth = useSelector((state: RootState) => state.auth)
  const { open, onClose, ent, title, repository, mod } = props
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => (reason !== 'backdropClick' && onClose())}
      TransitionComponent={SlideUp}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.form}>
          <Formik
            initialValues={{
              ...FORM_STATE_INIT,
              ...(ent || {}),
            }}
            validationSchema={schema}
            onSubmit={values => {
              const addOrUpdateEntity = values.id
                ? updateEntity
                : addEntity
              const ent: Entity = {
                ...values,
                creatorId: auth.id,
                repositoryId: repository!.id,
                moduleId: mod!.id,
              }
              dispatch(
                addOrUpdateEntity(ent, () => {
                  // dispatch(refresh())
                  onClose(true)
                })
              )
            }}
            render={({ isSubmitting, setFieldValue, values }) => {
              return (
                <Form>
                  <div className="rmodal-body">
                    <div className={classes.formItem}>
                      <Field
                        name="name"
                        label="名称"
                        component={TextField}
                        fullWidth={true}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="namespace"
                        label="包名"
                        component={TextField}
                        fullWidth={true}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <FormControl>
                        <InputLabel
                          shrink={true}
                          htmlFor="method-label-placeholder"
                        >
                          类型
                        </InputLabel>
                        <Select
                          value={values.type}
                          displayEmpty={true}
                          name="method"
                          onChange={selected => {
                            setFieldValue('type', selected.target.value)
                          }}
                        >
                          {STRUCT_TYPE.map(type => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="description"
                        label="简介"
                        component={TextField}
                        multiline={true}
                        fullWidth={true}
                      />
                    </div>
                  </div>
                  <div className={classes.ctl}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="mr1"
                      disabled={isSubmitting}
                    >
                      提交
                    </Button>
                    <Button onClick={() => onClose()} disabled={isSubmitting}>
                      取消
                    </Button>
                  </div>
                </Form>
              )
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InterfaceForm
