import { Player } from './Player';

export class Country {
	public id: number;
	public uuid: string;
	public name: string;
	public code: string;
	public players: Player[] | undefined;

	public constructor(props: { id: number; uuid: string; name: string; code: string }, players?: Player[]) {
		this.id = props.id;
		this.uuid = props.uuid;
		this.name = props.name;
		this.code = props.code;
		if (players) this.players = players;
	}
}
