import { defaultsFlags, defaultsParameters } from "./defaults.js";
import {
	logger,
	meowOptionsHelper,
	meowParserHelper,
	shallowMerge,
} from "./utilities.js";

import fs from "fs-extra";
import meow from "meow";
import { parser } from "@node-cli/parser";
import path from "node:path";

export type Flags = {
	cache?: number;
	cors?: boolean;
	gzip?: boolean;
	http2?: boolean;
	logs?: boolean;
	open?: boolean;
	port?: number;
};

export type Parameters = {
	path?: string;
};

export type Configuration = {
	flags?: Flags;
	parameters?: Parameters;
	usage?: boolean;
	examples?: string;
};

export const config: Configuration = parser(
	{
		flags: {
			cache: {
				shortFlag: "c",
				default: defaultsFlags.cache,
				description: "Time in seconds for caching files",
				type: "number",
			},
			cors: {
				shortFlag: "C",
				default: defaultsFlags.cors,
				description: "Set CORS headers to * to allow requests from any origin",
				type: "boolean",
			},
			gzip: {
				shortFlag: "g",
				default: defaultsFlags.gzip,
				description: "Enable GZIP compression",
				type: "boolean",
			},
			help: {
				shortFlag: "h",
				description: "Display help instructions",
				type: "boolean",
			},
			http2: {
				shortFlag: "H",
				default: defaultsFlags.http2,
				description: "Set HTTP to version 2",
				type: "boolean",
			},
			logs: {
				shortFlag: "l",
				default: defaultsFlags.logs,
				description: "Log HTTP requests at the prompt",
				type: "boolean",
			},
			open: {
				shortFlag: "o",
				default: defaultsFlags.open,
				description: "Open in your default browser",
				type: "boolean",
			},
			port: {
				shortFlag: "p",
				default: defaultsFlags.port,
				description: "Port to listen on",
				type: "number",
			},
			version: {
				shortFlag: "v",
				description: "Output the current version",
				type: "boolean",
			},
		},
		parameters: {
			path: {
				default: "current folder",
				description: "the path to serve files from",
			},
		},
		usage: true,
	},
	defaultsFlags,
	defaultsParameters
);

// const { helpText, options } = meowOptionsHelper({
// 	flags: {
// 		cache: {
// 			shortFlag: "c",
// 			default: defaults.cache,
// 			description: "Time in seconds for caching files",
// 			type: "number",
// 		},
// 		cors: {
// 			shortFlag: "C",
// 			default: defaults.cors,
// 			description: "Set CORS headers to * to allow requests from any origin",
// 			type: "boolean",
// 		},
// 		gzip: {
// 			shortFlag: "g",
// 			default: defaults.gzip,
// 			description: "Enable GZIP compression",
// 			type: "boolean",
// 		},
// 		help: {
// 			shortFlag: "h",
// 			description: "Display help instructions",
// 			type: "boolean",
// 		},
// 		http2: {
// 			shortFlag: "H",
// 			default: defaults.http2,
// 			description: "Set HTTP to version 2",
// 			type: "boolean",
// 		},
// 		logs: {
// 			shortFlag: "l",
// 			default: defaults.logs,
// 			description: "Log HTTP requests at the prompt",
// 			type: "boolean",
// 		},
// 		open: {
// 			shortFlag: "o",
// 			default: defaults.open,
// 			description: "Open in your default browser",
// 			type: "boolean",
// 		},
// 		port: {
// 			shortFlag: "p",
// 			default: defaults.port,
// 			description: "Port to listen on",
// 			type: "number",
// 		},
// 		version: {
// 			shortFlag: "v",
// 			description: "Output the current version",
// 			type: "boolean",
// 		},
// 	},
// 	parameters: {
// 		path: {
// 			default: "current folder",
// 			description: "the path to serve files from",
// 		},
// 	},
// 	usage: true,
// });
// const cli = meow(helpText, options);
// meowParserHelper({ cli });

// const customCfg = cli.flags;
// if (cli.input.length > 0) {
// 	let customPath: string = cli.input[0];
// 	if (fs.pathExistsSync(customPath)) {
// 		customCfg.path = path.resolve(customPath);
// 	} else {
// 		logger.printErrorsAndExit([`Folder ${customPath} does not exist!`], 0);
// 	}
// }

/**
 * Merging default configuration with the
 * preferences shared by the user.
 */
// const config: {
// cache?: number;
// cors?: boolean;
// http2?: boolean;
// gzip?: boolean;
// logs?: boolean;
// open?: boolean;
// path?: string;
// port?: number;
// } = shallowMerge(defaults, customCfg);

// export { config };
