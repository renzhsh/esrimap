/**
 * 官方网站
 */
const Load_Offical_Mode = 'offical';
/**
 * 自定义
 */
const Load_Custom_Mode = 'custom';

export default class {
    constructor() {
        this.mode = Load_Offical_Mode;
        this.customUrl = "";
    }

    UseOffical() {
        this.mode = Load_Offical_Mode;
    }

    UseUrl(value) {
        this.mode = Load_Custom_Mode;
        this.customUrl = value;
    }

    get IsOffical() {
        return this.mode == Load_Offical_Mode;
    }

    get LoadOptions() {
        if (this.mode == Load_Offical_Mode) {
            return {}
        } else {
            return {
                url: this.customUrl
            };
        }
    }
}