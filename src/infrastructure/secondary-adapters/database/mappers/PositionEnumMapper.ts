import { PositionEnum } from 'src/domain/enums/PositionEnum';
import { $Enums } from '@prisma/client';
import { SafeTwoWaysMap } from '@code-scarecrow/base/core/SafeTwoWaysMap';
import { SafeMap } from '@code-scarecrow/base/core/SafeMap';

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
