import * as xlsx from 'xlsx';
import EngineTypes from './enums';
import { convertTypeToEnum } from './convertTypeToEnum';
class Engine {
    private sheetNames: string[];
    private numberOfSheets: number
    private title: string
    private description1: string
    private description2: string 
    private workbook: any
    private currentWorksheet: any

    constructor(file: Express.Multer.File){
        this.workbook = xlsx.readFile(file.path);
        this.sheetNames = this.workbook.SheetNames
        this.numberOfSheets = this.sheetNames.length
        const worksheet = this.workbook.Sheets[this.workbook.SheetNames[0]];
        this.title = worksheet.C2?.h ?? null
        this.description1 = worksheet.C6?.h ?? null
        this.description2 = worksheet.C7?.h ?? null
    }

    private async CreateTabs(): Promise<any> {
        let result = [];

        for(let index = 0 ; index < this.numberOfSheets; index++) {
            const response = await this.createTab(index)
            // console.log('response',response)
            result.push(response)
        }

        return result;
    }

    private async createTab(index: number): Promise<any> {
        return {
            orden: index,
            title: this.sheetNames[index],
            tasks: await this.createTasks(index)
        }
    }

    private async createTasks(index: number): Promise<any> {
        const worksheet = this.workbook.Sheets[this.workbook.SheetNames[index]];
        this.currentWorksheet = worksheet
        const data: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const groupedThree = await this.GroupByThreeStar(data)
        const GruopedOne = await this.GroupByOneStar(groupedThree)
        const parseTaskWithObjectives = await this.parseTaskWithObjectives(GruopedOne);
        const replaceAnswersType = await this.replaceAnswersTypes(parseTaskWithObjectives)
        const deleteUneededObjective = await this.deleteLessObjective(replaceAnswersType)
        return deleteUneededObjective
    }

    /**
     * 
     * @param data sheet
     * @returns array of *** groups and delete the first group becase there is title and description 
     */
    private async GroupByThreeStar(data): Promise<any> {
        const result = [];
        let currentGroup = [];
        for (let i = 0; i < data.length; i++) {
          const currentItem = data[i];
          if (Array.isArray(currentItem) && currentItem.length === 1 && currentItem[0] === '***') {
      
            if (currentGroup.length > 0) {
              result.push(currentGroup);
              currentGroup = [];
            }
          } else {
                currentGroup.push(currentItem);
          }
        }
      

        result.shift();
        return result;
    }

    /**
     * 
     * @param data array
     * @returns array of *** groups and and grouped by another array by one * 
     */
    private async GroupByOneStar(data): Promise<any> {
        const groupedData = data.map(innerArray => {
            const groupedInnerArray = [];
            let currentGroup = [];
    
            innerArray.forEach(item => {
                if (item[0] === "*") {
                    if (currentGroup.length > 0) {
                        groupedInnerArray.push(currentGroup);
                        currentGroup = [];
                    }
                }
                currentGroup.push(item);
            });
    
            if (currentGroup.length > 0) {
                groupedInnerArray.push(currentGroup);
            }
    
            return groupedInnerArray;
        });
    
        return groupedData;
    }

    /**
     * 
     * @param data array
     * @returns convert all arrays of three start and one start to task object with objectives
     */
    private async parseTaskWithObjectives(data): Promise<any> {
        let result = [];
        data.map((item,key1) => {
            const columns = []
            const rows = []

            item.map((task) => {
                const types = []

                // [0] - TYPES [1] ; [1] - COLUMN VALUES ; [2++] - ROWS
                task[0]?.map((type) => {
                    types.push(type)
                })

                types?.map((column,index) => {
                    let obj = {
                        type: convertTypeToEnum(column),
                        title: task[1][index] ?? null,
                        orden: index
                    }
                    columns.push(obj)
                })

                task?.map((objective,index1) => {
                    const row = [];
                    if(index1 > 1) {
                        for (let i = 0; i < objective.length; i++){
                            const data = objective[i] ?? null
   
                            let objectiveObj = this.PrePareObjective(convertTypeToEnum(types[i]),data,i)
                            row.push(objectiveObj)
                        }

                    }
                    if(row.length > 0){
                        let rowObjects = {
                            orden: index1,
                            youtubeLink:null,
                            pdf: null,
                            objectives: row
                        }
                        rows.push(rowObjects)
                    }

                })
            })

            result.push({
                specialModuleType: this.findSpecialModuleTypes(columns),
                properties: this.findProperties(rows.flat()),
                orden: key1,
                columns:columns,
                rows: rows,
            }) 
        })
        return result;
    }

    /**
     * 
     * @param data array
     * @returns splice the types like answers and placeholder and set to the prevois object in answer array of placeholder value
     */
    private async replaceAnswersTypes(data) {
        data.forEach((item) => {
            item?.rows?.forEach((item2) => {
                item2?.objectives?.forEach((item3, index, array) => {
                    // HERE
                    if (item3?.moduleType === EngineTypes.ANSWER) {
                        const previousItem = array[index - 1];
                        if (previousItem) {
                            previousItem.answers = item3.values;
                        }
                        array.splice(index, 1);
                    }
                    if (item3?.moduleType === EngineTypes.PLACEHOLDER_TYPE) {
                        const previousItem = array[index - 1];
                        if (previousItem) {
                            previousItem.placeholder = item3?.values[0].value
                        }
                        array.splice(index, 1);
                    }
                })

            });
        });

        return data
    }

    /**
     * 
     * @param data array
     * @returns delete objectivs and columns with types that not needed in front like TABLE .. and delete clear objectives
     */
    private async deleteLessObjective(data) {
        data.forEach((item) => {
            item?.rows?.forEach((item2) => {
                item2.objectives = item2?.objectives?.filter((item3) => {
                    return (
                        item3.moduleType !== '*' && 
                        item3.moduleType !== EngineTypes.PROPERTIES &&
                        item3.moduleType !== EngineTypes.TABLE &&
                        item3.moduleType !== EngineTypes.TABLE_CLEAR && 
                        item3.moduleType !== EngineTypes.ANSWER_CHECK_BOX && 
                        item3.moduleType !== EngineTypes.CHART  
                    );
                });
            });
    
            item.columns = item?.columns?.filter((item3) => {
                return (
                    item3.type !== '*' && 
                    item3.type !== EngineTypes.PROPERTIES &&
                    item3.type !== EngineTypes.TABLE &&
                    item3.type !== EngineTypes.ANSWER 
                );
            });
        });

        // Remove rows with empty objectives
        data.forEach((item) => {
            item.rows = item?.rows?.filter((item2) => item2.objectives.length > 0);
        });
    
        return data;
    }
    
    private findSpecialModuleTypes(columns) {
        let result = null;
        columns.map((item2) => {
            const convertedType = item2.type
            if(convertedType == EngineTypes.IMAGE_RIGHT){
                result = EngineTypes.IMAGE_RIGHT
            }

            if(convertedType == EngineTypes.MIX_DRAG){
                result = EngineTypes.MIX_DRAG
            }

            if(convertedType == EngineTypes.MIX){
                result = EngineTypes.MIX
            }

            if(convertedType == EngineTypes.MERGED){
                result = EngineTypes.MERGED
            }

            if(convertedType == EngineTypes.TABLE){
                result = EngineTypes.TABLE
            }

            if(convertedType == EngineTypes.DRAFT){
                result = EngineTypes.DRAFT
            }

            if(convertedType == EngineTypes.VIDEO){
                result = EngineTypes.VIDEO
            }

            if(convertedType == EngineTypes.CHART){
                result = EngineTypes.CHART
            }

            if(convertedType == EngineTypes.HEIGHT_SPACE){
                result = EngineTypes.HEIGHT_SPACE
            }

            if(convertedType == EngineTypes.SPLITED_SCREEN_RIGHT){
                result = EngineTypes.SPLITED_SCREEN_RIGHT
            }

            if(convertedType == EngineTypes.DONE_SPLITED_SCREEN_RIGHT){
                result = EngineTypes.DONE_SPLITED_SCREEN_RIGHT
            }

            if(convertedType == EngineTypes.SPLITED_SCREEN_LEFT){
                result = EngineTypes.SPLITED_SCREEN_LEFT
            }

            if(convertedType == EngineTypes.DONE_SPLITED_SCREEN_LEFT){
                result = EngineTypes.DONE_SPLITED_SCREEN_LEFT
            }

            if(convertedType == EngineTypes.PDF){
                result = EngineTypes.PDF
            }

            if(convertedType == EngineTypes.COPY){
                result = EngineTypes.COPY
            }
            
        })
        return result 
    }

    private findProperties(task) {
        let result = '';
        let isFirst = true;

        task?.map((item) => {
            item?.objectives.map((item2) => {
                if(item2.moduleType == EngineTypes.PROPERTIES) {
                    result += item2.values[0].value
                }
                if(item2.moduleType == EngineTypes.PROPERTIES){
                    if (!isFirst) {
                        result += ';';
                    }

                    result += item2.values[0].value
                }
                if(item2.moduleType == EngineTypes.SPLITED_SCREEN_LEFT){
                    if (!isFirst) {
                        result += ';';
                    }
                    result += EngineTypes.SPLITED_SCREEN_LEFT + ':' + item2.values[0].value
                }

                if(item2.moduleType == EngineTypes.SPLITED_SCREEN_RIGHT){
                    if (!isFirst) {
                        result += ';';
                    }
        
                    result += EngineTypes.SPLITED_SCREEN_RIGHT + ':' + item2.values[0].value
                }

                if(item2.moduleType == EngineTypes.IMAGE_RIGHT){
                    if (!isFirst) {
                        result += ';';
                    }
                    result += EngineTypes.IMAGE_RIGHT + ':' + item2.values[0].value
                }
            })
        })
        return result 
    }

    private PrePareObjective(moduleType, data, orden){
        if (data && typeof data === 'string') {
            data = data.trim();
        }
        switch (moduleType) {
            case EngineTypes.TYPED_INPUT:
            case EngineTypes.INPUT:
            case EngineTypes.INPUT_CENTERED:
                const checkIfThereAnotherAnswer = data?.trim().includes(';')
                let answer = data?.trim()
                if(checkIfThereAnotherAnswer) {
                    answer = answer?.split(',')
                    answer = answer.map((item) => {return {value:item}})
                } else {
                    answer = [{value: answer}]
                }
                return {
                    moduleType: moduleType,
                    placeholder: null,
                    orden: orden,
                    isFullText: false,
                    values: [],
                    answers: answer,
                };
            
            case EngineTypes.CHECK_BOX:
                let splitedArrr = data?.split(';')
                    const resultt = splitedArrr?.map((item) => {
                    return {
                        value: item?.trim()
                    }
                })
                return {
                    moduleType: moduleType,
                    placeholder: null,
                    orden: orden,
                    isFullText: false,
                    values: resultt,
                    answers: [],
                };  

            case EngineTypes.DRAFT_BANK:
            case EngineTypes.BANK:
            case EngineTypes.SELECT_BOX:
                let splitedArr = data?.split(',')
                const result = splitedArr?.map((item) => {
                    return {
                    value: item?.trim()
                    }
                })
                return {
                    moduleType: moduleType,
                    placeholder: null,
                    orden: orden,
                    isFullText: false,
                    values: result,
                    answers: [],
                };  

            case EngineTypes.COPY:
            case EngineTypes.CIRCLE:
            case EngineTypes.WORD_REGULAR:
            case EngineTypes.OVERFLOW:
            case EngineTypes.GLOBAL_SETTINGS:
            case EngineTypes.SECOND_HEAD:
            case EngineTypes.MAIN_HEAD:
            case EngineTypes.ICON1:
            case EngineTypes.ICON2:
            case EngineTypes.NUMBER_BOLD:
            case EngineTypes.DONE_SPLITED_SCREEN_LEFT:
            case EngineTypes.SPLITED_SCREEN_LEFT:
            case EngineTypes.DONE_SPLITED_SCREEN_RIGHT:
            case EngineTypes.SPLITED_SCREEN_RIGHT:
            case EngineTypes.WORD_BOLD:
            case EngineTypes.ORDEN_BOLD:
            case EngineTypes.HEIGHT_SPACE:
            case EngineTypes.PROPERTIES:
            case EngineTypes.DRAFT:
            case EngineTypes.TYPED_WORD:
            case EngineTypes.TEXT_COPY:
            case EngineTypes.PLACEHOLDER_TYPE:
            case EngineTypes.TABLE:
            case EngineTypes.MERGED:
            case EngineTypes.IMAGE_LEFT:
            case EngineTypes.IMAGE_RIGHT:
            case EngineTypes.MIX_DRAG:
            case EngineTypes.MIX:
            case EngineTypes.ANSWER:
            case EngineTypes.ROOT_INPUT:
            case EngineTypes.WORD:
            case EngineTypes.ORDEN:
            case '*':
                return {
                    moduleType: moduleType,
                    placeholder: null,
                    orden: orden,
                    isFullText: false,
                    values: [{value: data}],
                    answers: [],
                };

            case EngineTypes.TEXT_MODULED:
            case EngineTypes.SONG:
            case EngineTypes.SECOND_HEAD_WHITE:
            case EngineTypes.ICON_DESCRIPTION_ONE:
            case EngineTypes.ICON_DESCRIPTION_TWO:
            case EngineTypes.INSTRUCTION_WHITE:
            case EngineTypes.ORIGIN:
            case EngineTypes.STORY_HEADLINE:
            case EngineTypes.STORY_INSTRUCTION:
            case EngineTypes.CLEAR_TEXT:
            case EngineTypes.HEADLINE2:
            case EngineTypes.QUEST_INSTRUCTION:
            case EngineTypes.EXPLANATION_SPLITED:
            case EngineTypes.EXPLANATION:
            case EngineTypes.INSTRUCTION:
            case EngineTypes.SUB_INSTRUCTION:
            case EngineTypes.TEXT:
            case EngineTypes.TEXT_CENTERED:
                const sheetedData = this.findByTitleAndConvertToStyleSheet(data)
                return {
                    moduleType: moduleType,
                    placeholder: null,
                    orden: orden,
                    isFullText: false,
                    values: [{value: sheetedData}],
                    answers: [],
                };

            case EngineTypes.TEXT_AREA:
            case EngineTypes.PDF:
            case EngineTypes.BORDER:
            case EngineTypes.DIVIDER:
            case EngineTypes.CHART:
            case EngineTypes.VIDEO:
            case EngineTypes.TABLE_CLEAR:
            case EngineTypes.MERGED_EXERCISE:
            case EngineTypes.OPEN_QUESTION:
                return {
                    moduleType: moduleType,
                    placeholder: null,
                    orden: orden,
                    isFullText: false,
                    values: [],
                    answers: [],
                };

            case EngineTypes.OPEN_QUESTION_HAMAROT:
                const checkIfThereAnotherAnswerr = data?.trim().includes(';')
                let answerr = data?.trim()
                if(checkIfThereAnotherAnswerr) {
                    answerr = answerr?.split(';')
                    answerr = answerr.map((item) => {return {value:item}})
                } else {
                    answerr = [{value: answerr}]
                }
                return {
                    moduleType: moduleType,
                    placeholder: null,
                    orden: orden,
                    isFullText: false,
                    values: [],
                    answers: answerr,
                };
            default:
                return moduleType;
        }
        
    } 

    private findByTitleAndConvertToStyleSheet(value) {

        for (const key in this.currentWorksheet) {
            if (this.currentWorksheet.hasOwnProperty(key) && value) {
              const vValue = this.currentWorksheet[key]?.w;
              if (typeof vValue === 'string' && vValue.trim() == value.trim()) {
                return this.currentWorksheet[key].h
              } 
            }
        }

        return value
    }

    public async process(): Promise<any> {
        const obj = {
            title:this.title,
            description1: this.description1,
            description2: this.description2,
            module:4,
            youtubeLink: null,
            pdf: null,
            isInTheBook: false,
            tabs: await this.CreateTabs()
        }

        return obj
    }
    
}

export default Engine;