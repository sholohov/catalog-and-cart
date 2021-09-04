export default class BaseApi {
    readonly baseUrl = '/data/'

    async get<T = unknown>(url: string): Promise<T> {
        return (await fetch(this.baseUrl + url.replace('^/', ''))).json()
    }
}