
export class StringValidator {
    
    static stringLimitMax(str: string, length: number) {
        if (str && str.length > length) {
            return str = str.slice(0, str.length - 1); 
        }
        else {
            return str;
        }
    }
}