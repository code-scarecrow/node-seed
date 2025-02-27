export interface ICoreUrls {
	[key: string]: string;
}

export interface IHttpCoreConfig {
	apiKey: string;
	coreUrls: ICoreUrls;
}
