import { RabbitController } from './rabbit/RabbitController';
import { SuperHeroController } from './super-hero/SuperHeroController';
import { CountryController } from './country/CountryController';
import { ClubController } from './club/ClubController';
import { PlayerController } from './player/PlayerController';
import { WorldCupController } from './world-cup/WorldCupController';
import { UserController } from './user/UserController';
import { HealthCheckController } from './status/HealthCheckController';
import { InfoController } from './status/InfoController';
import { FileController } from './file/FileController';

export const controllers = [
	RabbitController,
	SuperHeroController,
	CountryController,
	ClubController,
	PlayerController,
	WorldCupController,
	UserController,
	HealthCheckController,
	InfoController,
	FileController,
];
