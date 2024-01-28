import bytes from "bytes";
import fs from "fs-extra";
import { join } from "node:path";
import semver from "semver";
import zlib from "node:zlib";

export const STDOUT = "stdout";
export const IGNORE = "ignore";
export const HASH_KEY = "<hash>";
export const SEMVER_KEY = "<semver>";
export const GLOB_HASH = "+([a-zA-Z0-9_-])";
export const GLOB_SEMVER = "+([0-9]).+([0-9]).+([0-9])*([.a-zA-Z0-9_-])";

const CWD = process.cwd();

export const gzipSizeFromFileSync = (file: string): number => {
	return zlib.gzipSync(fs.readFileSync(file)).length;
};

export const getOutputFile = (file: string): string => {
	return file === "" || file === undefined ? STDOUT : join(CWD, file);
};

export const validateConfigurationFile = (file: string): any => {
	const result = {
		exitCode: 0,
		exitMessage: "",
		data: {},
	};
	if (file === "") {
		result.exitMessage = "Please provide a configuration file";
		result.exitCode = 1;
		return result;
	}

	const configurationFile = file.startsWith("/") ? file : join(CWD, file);

	if (fs.existsSync(configurationFile) === false) {
		result.exitMessage = `Invalid or missing configuration file!\n${configurationFile}`;
		result.exitCode = 1;
		return result;
	}

	return {
		...result,
		data: configurationFile,
	};
};

export const readJSONFile = (file: string): any => {
	try {
		return {
			exitCode: 0,
			exitMessage: "",
			data: fs.readJsonSync(file),
		};
	} catch (error) {
		return {
			exitCode: 1,
			exitMessage: `Failed to read JSON file: ${error.message}`,
		};
	}
};

export const getMostRecentVersion = (data: []) => {
	const keys = [];
	for (const key of Object.keys(data)) {
		keys.push(key);
	}
	keys.sort(semver.rcompare);
	return keys[0];
};

export const percentFormatter = new Intl.NumberFormat("en", {
	style: "percent",
	signDisplay: "exceptZero",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export const formatFooter = (limit: boolean, diff: number | string): string => {
	return `Overall status: ${limit ? "🚫" : "✅"} ${diff}`;
};

export const addMDrow = ({
	type,
	passed = true,
	name = "",
	size = 0,
	diff = "",
	limit = "",
	columns,
}: {
	columns: any;
	type: "header" | "row";
	passed?: boolean;
	name?: string;
	size?: number;
	diff?: string;
	limit?: string;
}) => {
	const totalColumns = columns.length;

	if (type === "header") {
		const separator = " --- |".repeat(totalColumns);
		const header = columns.map((column) => column[Object.keys(column)[0]]);
		return `| ${header.join(" | ")} |\n|${separator}`;
	}
	if (type === "row") {
		const row = columns.map((column) => {
			const key = Object.keys(column)[0];
			if (key === "status") {
				return passed ? "✅" : "🚫";
			}
			if (key === "file") {
				return name.replaceAll("<", "[").replaceAll(">", "]");
			}
			if (key === "size") {
				return `${bytes(size, {
					unitSeparator: " ",
				})}${diff}`;
			}
			if (key === "limits") {
				return limit;
			}
			return "";
		});

		return `| ${row.join(" | ")} |`;
	}
};
