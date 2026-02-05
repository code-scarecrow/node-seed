import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AxiosInstanceFactory {
	public getInstance(): AxiosInstance {
		return axios.create();
	}
}
