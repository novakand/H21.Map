import { IApiConfig } from "../../../interfaces/i-api-settings";

export class YandexApiConfig implements IApiConfig {
    name: string;
    url: string;
    key: string;
    language: string;
    version: string;

    constructor() {
        this.key = '',
            this.url = 'https://api-maps.yandex.ru/2.1.72?lang=en_US&onload=APILoaded',
            this.language = 'ru_RU',
            this.version = ''
    }
}