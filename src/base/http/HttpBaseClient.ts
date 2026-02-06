import { Injectable } from '@nestjs/common';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { AxiosInstanceFactory } from './AxiosInstanceFactory';
import { AxiosLoggerInterceptor } from '../logger';

@Injectable()
export abstract class HttpBaseClient {
	public httpClient: AxiosInstance;
	constructor(protected baseUrl: string, axiosInterceptor: AxiosLoggerInterceptor, axiosFactory: AxiosInstanceFactory) {
		this.httpClient = axiosFactory.getInstance();
		axiosInterceptor.configureClient(this.httpClient);
	}

	public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return (await this.httpClient.get<T>(this.baseUrl + url, config)).data;
	}

	public async post<B, T = unknown>(url: string, payload: B, config?: AxiosRequestConfig): Promise<T> {
		return (await this.httpClient.post(this.baseUrl + url, payload, config)).data;
	}

	public async put<B, T = unknown>(url: string, payload: B, config?: AxiosRequestConfig): Promise<T> {
		return (await this.httpClient.put(this.baseUrl + url, payload, config)).data;
	}

	public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
		return (await this.httpClient.delete(this.baseUrl + url, config)).data;
	}

	public async patch<B, T = unknown>(url: string, payload: B, config?: AxiosRequestConfig): Promise<T> {
		return (await this.httpClient.patch(this.baseUrl + url, payload, config)).data;
	}
}
