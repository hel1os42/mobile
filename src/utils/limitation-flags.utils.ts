export class LimitationFlagsUtils {

    public static FLAG_1 = 'LIMITATION_1';
    public static FLAG_2 = 'LIMITATION_2';
    public static FLAG_4 = 'LIMITATION_4';
    public static FLAG_8 = 'LIMITATION_8';
    public static FLAG_16 = 'LIMITATION_16';
    public static FLAG_32 = 'LIMITATION_32';
    public static FLAG_64 = 'LIMITATION_64';

    static extractFlags(code: number) {
        let flag1 = 1;
        let flag2 = 2;
        let flag4 = 4;
        let flag8 = 8;
        let flag16 = 16;
        let flag32 = 32;
        let flag64 = 64;
        let keys = [];
        if (code & flag64) {
            keys.push(this.FLAG_64);
        }
        if (code & flag32) {
            keys.push(this.FLAG_32);
        }
        if (code & flag16) {
            keys.push(this.FLAG_16);
        }
        if (code & flag8) {
            keys.push(this.FLAG_8);
        }
        if (code & flag4) {
            keys.push(this.FLAG_4);
        }
        if (code & flag2) {
            keys.push(this.FLAG_2);
        }
        if (code & flag1) {
            keys.push(this.FLAG_1);
        }
        return keys;
    }
}