import EngineTypes from "./enums";

export const convertTypeToEnum = (typeInHebrew: string):string => {
    try {
        typeInHebrew = typeInHebrew?.trim()
        switch (typeInHebrew) {
            case '*':
              return '*';
            case 'אות':
              return EngineTypes.WORD;
            case 'מספור':
              return EngineTypes.ORDEN;
            case 'הוראה':
              return EngineTypes.INSTRUCTION;
            case 'תת הוראה':
              return EngineTypes.SUB_INSTRUCTION;
            case 'שדה טקסט':
              return EngineTypes.TEXT;
            case 'שדה טקסט אמצע':
              return EngineTypes.TEXT_CENTERED;
            case 'הקלדה':
              return EngineTypes.INPUT;
            case 'הקלדה אמצע':
              return EngineTypes.INPUT_CENTERED;
            case 'שדה בחירה':
              return EngineTypes.SELECT_BOX;
            case 'הסבר':
              return EngineTypes.EXPLANATION;
            case 'הסבר נפרד':
              return EngineTypes.EXPLANATION_SPLITED;
            case 'הקלדת שורש':
              return EngineTypes.ROOT_INPUT;
            case 'תשובה':
              return EngineTypes.ANSWER;
            case 'מחסן מילים':
              return EngineTypes.BANK;
            case 'העתקה':
              return EngineTypes.MIX;
            case 'גרירה':
              return EngineTypes.MIX_DRAG;
            case 'רב ברירה':
              return EngineTypes.CHECK_BOX;
            case 'תמונה ימין':
              return EngineTypes.IMAGE_RIGHT;
            case 'תמונה שמאל':
              return EngineTypes.IMAGE_LEFT;
            case 'אחיד':
              return EngineTypes.MERGED;
            case 'טבלה':
              return EngineTypes.TABLE;
            case 'הסבר כללי':
              return EngineTypes.QUEST_INSTRUCTION;
            case 'פלייס הולדר':
              return EngineTypes.PLACEHOLDER_TYPE;
            case 'שאלה פתוחה':
              return EngineTypes.OPEN_QUESTION;
            case 'מאוחד':
              return EngineTypes.MERGED_EXERCISE;
            case 'שדה קובייה':
              return EngineTypes.TEXT_COPY;
            case 'כותרת 2':
              return EngineTypes.HEADLINE2;
            case 'שדה טקסט נקי':
              return EngineTypes.CLEAR_TEXT;
            case 'מילה נתונה':
              return EngineTypes.TYPED_WORD;
            case 'הקלדה נתונה':
              return EngineTypes.TYPED_INPUT;
            case 'שאלה פתוחה המרות':
              return EngineTypes.OPEN_QUESTION_HAMAROT;
            case 'תגיות':
              return EngineTypes.DRAFT_BANK;
            case 'טיוטה':
              return EngineTypes.DRAFT;
            case 'טבלה נקי':
              return EngineTypes.TABLE_CLEAR;
            case 'סרטון':
              return EngineTypes.VIDEO;
            case 'גרף':
              return EngineTypes.CHART;
            case 'מאוחד קדימה':
              return EngineTypes.FORWARD_TEXT;
            case 'הגדרות':
              return EngineTypes.PROPERTIES;
            case 'רווח':
              return EngineTypes.HEIGHT_SPACE;
            case 'מספור כהה':
              return EngineTypes.ORDEN_BOLD;
            case 'אות כהה':
              return EngineTypes.WORD_BOLD;
            case 'הוראה טקסט':
              return EngineTypes.STORY_INSTRUCTION;
            case 'כותרת טקסט':
              return EngineTypes.STORY_HEADLINE;
            case 'מקור':
              return EngineTypes.ORIGIN;
            case 'תצוגה ימין':
              return EngineTypes.SPLITED_SCREEN_RIGHT;
            case 'סיום תצוגה ימין':
              return EngineTypes.DONE_SPLITED_SCREEN_RIGHT;
            case 'תצוגה שמאל':
              return EngineTypes.SPLITED_SCREEN_LEFT;
            case 'סיום תצוגה שמאל':
              return EngineTypes.DONE_SPLITED_SCREEN_LEFT;
            case 'מספר בולד':
              return EngineTypes.NUMBER_BOLD;
            case 'אייקון כהה':
              return EngineTypes.ICON1;
            case 'אייקון בהיר':
              return EngineTypes.ICON2;
            case 'פס':
              return EngineTypes.DIVIDER;
            case 'כותרת ראשית':
              return EngineTypes.MAIN_HEAD;
            case 'כותרת משנית':
              return EngineTypes.SECOND_HEAD;
            case 'הגדרות כלליות':
              return EngineTypes.GLOBAL_SETTINGS;
            case 'תשובה רב ברירה':
              return EngineTypes.ANSWER_CHECK_BOX;
            case 'הוראה לבן':
              return EngineTypes.INSTRUCTION_WHITE;
            case 'מסגרת':
              return EngineTypes.BORDER;
            case 'אות רגילה':
              return EngineTypes.WORD_REGULAR;
            case 'גלילה':
              return EngineTypes.OVERFLOW;
            case 'שירה':
              return EngineTypes.SONG;
            case 'כותרת משנית לבן':
              return EngineTypes.SECOND_HEAD_WHITE;
            case 'מלל אייקון':
              return EngineTypes.ICON_DESCRIPTION_ONE;
            case 'מלל אייקון אפור':
              return EngineTypes.ICON_DESCRIPTION_TWO;
            case 'נקודה':
              return EngineTypes.CIRCLE;
            case 'טקסט מעוצב':
              return EngineTypes.TEXT_MODULED;
            case 'pdf':
              return EngineTypes.PDF;
            case 'הקלדה מותאם':
              return EngineTypes.TEXT_AREA;
            case 'העתק':
              return EngineTypes.COPY;
            case 'הקלדה נקי':
              return EngineTypes.INPUT_CLEAR;
            case 'הקלדה אמצע נקי':
              return EngineTypes.INPUT_CENTERED_CLEAR;
            case 'הקלדת שורש נקי':
              return EngineTypes.ROOT_INPUT_CLEAR;
            default:
              return EngineTypes.UNKNOWN;
        }
    } catch(e) {
        console.log('e',e)
    }

}