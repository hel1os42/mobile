export class AboutUtils {

    public static set(title: string, description: string) {
        let t = title ? title.replace(/<[^>]+>/g, '') : '';
        let d = description ? description.replace(/<[^>]+>/g, '') : '';
        if (t !== '' || d !== '') {
            return '<span>' + t + '</span>' + d;
        }
        else {
            return undefined;
        }
    }

    public static get(about: string) {
        let substr, aboutDescription, aboutTitle;
        if (about && about !== '') {
        substr = about.split('<span>')[1] ? about.split('<span>')[1] : '';
        aboutDescription = about.split('</span>')[1] ? about.split('</span>')[1] : '';
        aboutTitle = substr.split('</span>')[0] ? substr.split('</span>')[0] : ''; 
        }
        return {
            title: aboutTitle ? aboutTitle : '',
            description: aboutDescription ? aboutDescription : ''
        }
    }

}