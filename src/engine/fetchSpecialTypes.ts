import EngineTypes from "./enums"
const specialTypes = [
    EngineTypes.IMAGE_RIGHT,
    EngineTypes.MIX_DRAG,
    EngineTypes.COPY,
    EngineTypes.SPLITED_SCREEN_LEFT,
    EngineTypes.SPLITED_SCREEN_RIGHT,
    EngineTypes.DONE_SPLITED_SCREEN_RIGHT,
    EngineTypes.DONE_SPLITED_SCREEN_LEFT,
    EngineTypes.PROPERTIES,
    EngineTypes.TABLE,
    EngineTypes.TABLE_CLEAR,
    EngineTypes.VIDEO,
    EngineTypes.CHART,
    EngineTypes.PDF,
    EngineTypes.EXPLANATION,
    EngineTypes.OVERFLOW,
    EngineTypes.BANK,
]

export const fetchSpecialTypes = (item):string => {

    let result = ''
    let isFirst = true;

    const exercise = item.exercise
    const propertyName = `exercise${exercise}`;
    item[propertyName].data.map(async (subItem) => {
        subItem.collectionsRows.map(async (row) => {
            row.collectionRow.map(async (objc) => {
                if (specialTypes.includes(objc.module_type)) {
                    if (!isFirst) {
                        result += ';';
                    }
                    result += objc.module_type;
                    isFirst = false;
                }
            })
        })
    })

    return result;
}

export const fetchPropertiesValue = (item):string => {

    let result = ''
    let isFirst = true;

    const exercise = item.exercise
    const propertyName = `exercise${exercise}`;
    item[propertyName].data.map(async (subItem) => {
        subItem.collectionsRows.map(async (row) => {
            row.collectionRow.map(async (objc) => {
                if(objc.module_type == EngineTypes.PROPERTIES){
                    if (!isFirst) {
                        result += ';';
                    }

                    objc.collectionValues.map(async (val) => {
                        result += val.value
                    })
                }
                if(objc.module_type == EngineTypes.SPLITED_SCREEN_LEFT){
                    if (!isFirst) {
                        result += ';';
                    }
                    objc.collectionValues.map(async (val) => {
                        result += EngineTypes.SPLITED_SCREEN_LEFT + ':' + val.value
                    })
                }

                if(objc.module_type == EngineTypes.SPLITED_SCREEN_RIGHT){
                    if (!isFirst) {
                        result += ';';
                    }
                    objc.collectionValues.map(async (val) => {
                        result += EngineTypes.SPLITED_SCREEN_RIGHT + ':' + val.value
                    })
                }

                if(objc.module_type == EngineTypes.IMAGE_RIGHT){
                    if (!isFirst) {
                        result += ';';
                    }
                    objc.collectionValues.map(async (val) => {
                        result += EngineTypes.IMAGE_RIGHT + ':' + val.value
                    })
                }

                if(objc.module_type == EngineTypes.OVERFLOW){
                    if (!isFirst) {
                        result += ';';
                    }
                    objc.collectionValues.map(async (val) => {
                        result += EngineTypes.OVERFLOW + ':' + val.value
                    })
                }
            })
        })
    })

    return result;
}