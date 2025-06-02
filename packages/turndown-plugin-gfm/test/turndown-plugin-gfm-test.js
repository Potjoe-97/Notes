import Attendant from 'turndown-attendant';
import TurndownService from 'turndown';
import { gfm } from '../src/lib/gfm.js';
import { fileURLToPath } from "url";
import { dirname } from "path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const attendant = new Attendant({
	file: `${scriptDir}/index.html`,
	TurndownService: TurndownService,
	beforeEach: function(turndownService) {
		turndownService.use(gfm);
	},
});

attendant.run();
