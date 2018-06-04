export class LimitationFlagsUtils {

public static LIMIT_MAX_OFFER_TOTAL_REDEMPTIONS = 1;      
public static LIMIT_MAX_OFFER_DAILY_REDEMPTIONS = 2;  
public static LIMIT_MAX_USER_TOTAL_REDEMPTIONS = 4;  
public static LIMIT_MAX_USER_DAILY_REDEMPTIONS = 8;  
public static LIMIT_MAX_USER_WEEKLY_REDEMPTIONS = 16;  
public static LIMIT_MAX_USER_MONTHLY_REDEMPTIONS = 32;  
public static LIMIT_MIN_USER_LEVEL = 64;
public static LIMIT_MIN_REFERRAL_POINTS = 128;
public static LIMIT_MIN_REDEMPTION_POINTS = 256;

    public static FLAGS = [
        LimitationFlagsUtils.LIMIT_MAX_OFFER_DAILY_REDEMPTIONS,  
        LimitationFlagsUtils.LIMIT_MAX_USER_TOTAL_REDEMPTIONS,  
        LimitationFlagsUtils.LIMIT_MAX_USER_DAILY_REDEMPTIONS,  
        LimitationFlagsUtils.LIMIT_MAX_USER_WEEKLY_REDEMPTIONS,  
        LimitationFlagsUtils.LIMIT_MAX_USER_MONTHLY_REDEMPTIONS,  
        LimitationFlagsUtils.LIMIT_MAX_OFFER_TOTAL_REDEMPTIONS,     
        LimitationFlagsUtils.LIMIT_MIN_USER_LEVEL,
        LimitationFlagsUtils.LIMIT_MIN_REFERRAL_POINTS,
        LimitationFlagsUtils.LIMIT_MIN_REDEMPTION_POINTS
    ];

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