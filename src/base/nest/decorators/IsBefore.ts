import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsBefore(property: string, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			name: 'isBefore',
			target: object.constructor,
			propertyName: propertyName,
			options: { ...validationOptions },
			constraints: [property],
			validator: {
				validate(value: string, args: ValidationArguments) {
					const [_, relatedValue] = getReferencePropperty(args);
					if (!relatedValue) return false;
					return new Date(value) < new Date(relatedValue);
				},
				defaultMessage(args: ValidationArguments): string {
					const [relatedPropertyName, relatedValue] = getReferencePropperty(args);
					if (!relatedValue) return `Propperty '${relatedPropertyName}' not found.`;
					return `The '${args.property}' must be before the '${args.constraints}'`;
				},
			},
		});
	};
}

function getReferencePropperty(args: ValidationArguments): [string, string | undefined] {
	const [relatedPropertyName] = args.constraints;
	return [relatedPropertyName, (args.object as string[])[relatedPropertyName]];
}
