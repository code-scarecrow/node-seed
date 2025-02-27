import { registerAs } from '@nestjs/config';
import { safeGetConfig } from '@code-scarecrow/base';
import { S3ModuleOptions } from 'nestjs-s3';

export const awsClientS3Config = registerAs('aws', (): S3ModuleOptions & { filesBucketName: string } => {
	return {
		config: {
			region: safeGetConfig('AWS_REGION'),
			credentials: {
				accessKeyId: safeGetConfig('AWS_ACCESS_KEY_ID'),
				secretAccessKey: safeGetConfig('AWS_SECRET_ACCESS_KEY'),
			},
			endpoint: safeGetConfig('AWS_ENDPOINT_S3'),
			forcePathStyle: safeGetConfig('AWS_FORCE_PATH_STYLE') === 'true',
		},
		filesBucketName: safeGetConfig('AWS_BUCKET_NAME'),
	};
});
