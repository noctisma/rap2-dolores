import React, { Component, Children } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import InputLabel from '@material-ui/core/InputLabel'
import Input from '@material-ui/core/Input'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import { TYPES, PrimitiveType, CollectionType } from '../../utils/consts'
import { Property, Entity } from '../../actions/types'
import { SlideUp } from 'components/common/Transition'
import { NavigateBefore, NavigateNext } from '@material-ui/icons'
import { type } from 'jquery'
import { set } from 'nprogress'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 80,
        },
    }),
)

interface Props {
    title?: string
    open: boolean
    onClose: (isOk?: boolean) => void
    handleChangePropertyField: (id: any, key: any, value: any) => void
    property?: any
    entities?: Entity[]
}

interface TypeGroup {
    type?: string
    keyType?: string
}

export default function PropertyTypeSelect(props: Props) {
    const classes = useStyles()
    // const [typeArray, setTypeArray] = React.useState<TypeGroup[]>([]);

    const parser = (property: any): TypeGroup[] => {
        const typeArrayCopy: TypeGroup[] = []
        console.log(property)
        if (property === undefined || property.type === undefined) {
            typeArrayCopy.push({
                type: 'String'
            })
        } else {
            const typeSplit = property.type.split('<')
            typeSplit.forEach((item: any) => {
                item = item.replace(/>/g, '')
                if (item.indexOf(',') > 0) {
                    const itemSplit = item.split(',')
                    const lastItem = typeArrayCopy.pop()
                    if (lastItem !== undefined) {
                        lastItem.keyType = itemSplit[0]
                        typeArrayCopy.push(lastItem)
                    }
                    typeArrayCopy.push({ type: itemSplit[1]})
                } else {
                    typeArrayCopy.push({ type: item })
                }
            })
        }
        // console.log(typeArrayCopy);
        // setTypeArray(typeArrayCopy);
        // React.useEffect(() => {
        //     setTypeArray(defaultVals)
        //     // console.log(typeArray) //dx1
        // },[defaultVals])
        console.log(typeArrayCopy)
        return typeArrayCopy
    }

    const { open, onClose, handleChangePropertyField, property, entities } = props
    const defaultV = parser(property)
    // const defaultVals: TypeGroup[] = parser(property);

    // const [typeArray, setTypeArray] = React.useState(parser(property));
    const [typeArray, setTypeArray] = React.useState<TypeGroup[]>(defaultV)

    React.useEffect(() => {
        if (format(typeArray) !== property.type) {
            setTypeArray(parser(property))
        }
    }, [property])

    console.log(defaultV)
    // const aa = parser(property)
    // console.log(typeArray);
    // React.useEffect(() => {
    //     setTypeArray(defaultV);
    //   },[defaultV])
    // setTypeArray(parser(property));

    const PrimitiveSelectType = {
        groupName: '基本类型',
        options: PrimitiveType
    }
    const CollectionSelectType = {
        groupName: '集合类型',
        options: CollectionType
    }
    const ObjectSelectType = {
        groupName: '对象类型',
        options: entities === undefined ? [] : entities
    }

    /**
     *
     * @param oIndex 外层位置
     * @param iIndex 内层位置
     * @param event 事件
     */
    const handleChange = (oIndex: number, event: React.ChangeEvent<{ value: unknown }>) => {
        const typeStr = event.target.value as string
        let typeArrayCopy = []
        typeArrayCopy = typeArray.filter((_, i) => i < oIndex)
        if (CollectionType.includes(typeStr)) {
            if ('Map' === typeStr) {
                typeArrayCopy = typeArrayCopy.concat([{ type: typeStr, keyType: 'String'}])
            } else {
                typeArrayCopy = typeArrayCopy.concat([{ type: typeStr}])
            }
            // 集合类型下的值可以为任意类型
            typeArrayCopy = typeArrayCopy.concat({ type: 'String' })
        } else { // 基本类型和对象类型都直接渲染自己
            typeArrayCopy = typeArrayCopy.concat({ type: typeStr })
        }
        setTypeArray(typeArrayCopy)
    }

    /**
     * Map key修改，值修改值
     * @param oIndex
     * @param event
     */
    const handleMapKeyChange = (oIndex: number, event: React.ChangeEvent<{ value: unknown }>) => {
        const typeStr = event.target.value as string
        typeArray[oIndex].keyType = typeStr
        setTypeArray(typeArray.filter((_, i) => i > 0))
    }

    const handleClickOpen = () => {
        handleChangePropertyField(property.id, 'type', format(typeArray))
        handleClose()
    }

    const handleClose = () => {
        // setTypeArray([]);
        console.log(property)
        onClose()
    }

    const format = (typeAr: any[]): any => {
        let outString = ''

        typeAr.forEach((item, index) => {
            outString += item.type
            if (index !== typeAr.length - 1) {
                outString += '<'
            }
            if (item.keyType !== undefined) {
                outString += item.keyType + ','
            }

        })

        for (let i = 1; i < typeAr.length; i++) {
            outString += '>'
        }
        return outString
    }

    console.log(format(typeArray))
    console.log(property.type)
    if (format(typeArray) !== property.type) {
        console.log(format(typeArray))
        console.log(property.type)
        // setTypeArray(parser(property.type))
    }

    return (

        <Dialog disableBackdropClick={true} disableEscapeKeyDown={true} open={open} onClose={() => handleClose}>
            <DialogTitle>属性类型选择器</DialogTitle>
            <DialogContent>
                {format(typeArray)}
                <form className={classes.container}>
                    {
                        typeArray.map((item, oIndex) => (
                            <div key={oIndex}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="demo-customized-select-label">Value-{oIndex}</InputLabel>
                                    <Select
                                        labelId="demo-mutiple-name-label"
                                        defaultValue={item.type}
                                        onChange={(e) => handleChange(oIndex, e)}
                                        input={<Input />}
                                    >
                                        {PrimitiveSelectType.options.map(typeOption => (
                                            <option key={typeOption} value={typeOption}>
                                                {typeOption}
                                            </option>
                                        ))}
                                        {CollectionSelectType.options.map(typeOption => (
                                            <option key={typeOption} value={typeOption}>
                                                {typeOption}
                                            </option>
                                        ))}
                                        {ObjectSelectType.options.map((entity) => (
                                            <option key={entity.name} value={entity.name}>
                                                {entity.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormControl>
                                {item.keyType !== undefined ?
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="demo-customized-select-label">Key-{oIndex}</InputLabel>
                                        <Select
                                            labelId="demo-mutiple-name-label"
                                            defaultValue={item.keyType}
                                            onChange={(e) => handleMapKeyChange(oIndex, e)}
                                            input={<Input />}
                                        >
                                            {PrimitiveType.map(type => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    : ''
                                }
                            </div>
                        ))
                    }
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClickOpen} color="primary">
                    确定
                    </Button>
                <Button onClick={() => handleClose()}>
                    取消
                    </Button>
            </DialogActions>
        </Dialog>
        // </div>
    )
}
