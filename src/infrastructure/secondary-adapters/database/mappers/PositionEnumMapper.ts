import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { $Enums } from '@prisma/client';
import { SafeMap } from 'src/base/dataStructures/SafeMap';

class SafeTwoWaysMap<K, V> {
	private readonly map: SafeMap<K, V>;
	private readonly reverseMap: SafeMap<V, K>;

	constructor(map: SafeMap<K, V>) {
		this.map = map;
		this.reverseMap = new SafeMap<V, K>();

		map.forEach((value, key) => {
			this.reverseMap.set(value, key);
		});
	}

	public get(key: K): V {
		return this.map.get(key);
	}

	public getRev(key: V): K {
		return this.reverseMap.get(key);
	}
}

export const positionEnumMap: SafeTwoWaysMap<$Enums.players_position, PositionEnum> = new SafeTwoWaysMap(
	new SafeMap([
		[$Enums.players_position.Goalkeeper, PositionEnum.GK],
		[$Enums.players_position.Center_Back, PositionEnum.CB],
		[$Enums.players_position.Right_Back, PositionEnum.RB],
		[$Enums.players_position.Left_Back, PositionEnum.LB],
		[$Enums.players_position.Center_Midfielder, PositionEnum.CM],
		[$Enums.players_position.Right_Midfielder, PositionEnum.RM],
		[$Enums.players_position.Left_Midfielder, PositionEnum.LM],
		[$Enums.players_position.Center_Forward, PositionEnum.CF],
		[$Enums.players_position.Right_Striker, PositionEnum.RS],
		[$Enums.players_position.Left_Striker, PositionEnum.LS],
	]),
);
