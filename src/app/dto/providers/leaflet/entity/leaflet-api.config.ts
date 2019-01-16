import { IApiConfig } from "../../../interfaces/i-api-settings";

export class LeafletApiConfig implements IApiConfig {
    name: string;
    url: string;
    key: string;
    language: string;
    version: string;

    constructor() {
        this.key = '',
        this.url = 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.js',
        this.language = 'ru_RU',
        this.version = ''
    }
}