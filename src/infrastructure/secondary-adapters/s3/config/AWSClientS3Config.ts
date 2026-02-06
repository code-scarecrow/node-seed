import { registerAs } from '@nestjs/config';
import { S3ModuleOptions } from 'nestjs-s3';
import { getRequiredConfig } from 'src/base/nest/config';

export const awsClientS3Config = registerAs('aws', (): S3ModuleOptions & { filesBucketName: string } => {
	return {
		config: {
			region: getRequiredConfig('AWS_REGION'),
			credentials: {
				accessKeyId: getRequiredConfig('AWS_ACCESS_KEY_ID'),
				secretAccessKey: getRequiredConfig('AWS_SECRET_ACCESS_KEY'),
			},
			endpoint: getRequiredConfig('AWS_ENDPOINT_S3'),
			forcePathStyle: getRequiredConfig('AWS_FORCE_PATH_STYLE') === 'true',
		},
		filesBucketName: getRequiredConfig('AWS_BUCKET_NAME'),
	};
});
