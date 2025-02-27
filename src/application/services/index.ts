import { ClubService } from './ClubService';
import { CountryService } from './CountryService';
import { FileService } from './FileService';
import { PlayerService } from './PlayerService';
import { RabbitService } from './RabbitService';
import { SuperHeroService } from './SuperHeroService';
import { UserService } from './UserService';
import { WorldCupService } from './WorldCupService';

export const services = [
	UserService,
	RabbitService,
	SuperHeroService,
	CountryService,
	ClubService,
	PlayerService,
	WorldCupService,
	FileService,
];
