export class FileData {
	public name: string;
	public size: number;
	public timestamp: Date;

	public constructor(name: string, size: number, timestamp: Date) {
		this.name = name;
		this.size = size;
		this.timestamp = timestamp;
	}
}
