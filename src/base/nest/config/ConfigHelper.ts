export const getRequiredConfig = (configKey: string): string => {
	const val = process.env[configKey];
	if (val === undefined) {
		throw new Error(configKey + ' is required in the environment variables');
	}
	return val;
};
