export class LimitationFlagsUtils {

    public static FLAGS = [1, 2, 4, 8, 16, 32, 64];

    static extractFlags(code: number) {
     
        let keys = [];
    
        this.FLAGS.forEach(flag => {
            if (code & flag) {
                let key = 'LIMITATION_' + flag;
                keys.push(key);
            }
        })
        return keys;
    }
}