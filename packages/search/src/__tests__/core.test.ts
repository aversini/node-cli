import { Mock, SpiedFunction, UnknownFunction } from "jest-mock";

import { jest } from "@jest/globals";
import kleur from "kleur";
import { Search } from "../core";
import { defaultFlags } from "../defaults";

kleur.enabled = false;

let mockLog: Mock<UnknownFunction>,
	mockLogError: Mock<UnknownFunction>,
	mockLogWarning: Mock<UnknownFunction>,
	spyExit: SpiedFunction<{
		(code?: number | undefined): never;
		(code?: number | undefined): never;
	}>,
	spyLog: SpiedFunction<{
		(...data: any[]): void;
		(message?: any, ...optionalParameters: any[]): void;
		(message?: any, ...optionalParameters: any[]): void;
	}>,
	spyLogError: SpiedFunction<{
		(...data: any[]): void;
		(message?: any, ...optionalParameters: any[]): void;
		(message?: any, ...optionalParameters: any[]): void;
	}>,
	spyLogWarning: SpiedFunction<{
		(...data: any[]): void;
		(message?: any, ...optionalParameters: any[]): void;
		(message?: any, ...optionalParameters: any[]): void;
	}>,
	mockExit: any;

/**
 * Some utilities have logging capabilities that needs to be
 * tested a little bit differently:
 * - mocking process.exit
 * - console.log
 * - inquirer.prompt
 */
describe("when testing for utilities with logging side-effects", () => {
	beforeEach(() => {
		mockExit = jest.fn();
		mockLog = jest.fn();
		mockLogError = jest.fn();
		mockLogWarning = jest.fn();

		spyExit = jest.spyOn(process, "exit").mockImplementation(mockExit);
		spyLog = jest.spyOn(console, "log").mockImplementation(mockLog);
		spyLogError = jest.spyOn(console, "error").mockImplementation(mockLogError);
		spyLogWarning = jest
			.spyOn(console, "warn")
			.mockImplementation(mockLogWarning);
	});
	afterEach(() => {
		spyExit.mockRestore();
		spyLog.mockRestore();
		spyLogError.mockRestore();
		spyLogWarning.mockRestore();
	});

	it("should find and list a specific folder based on the arguments", async () => {
		const search = new Search({
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			path: `${process.cwd()}`,
			pattern: "__tests__$",
			short: true,
			stats: false,
			type: "d",
		});
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" src/__tests__");
	});

	it("should find and list details for a folder based on the arguments", async () => {
		const search = new Search({
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			path: `${process.cwd()}`,
			pattern: "__tests__$",
			short: false,
			stats: false,
			type: "d",
		});
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(expect.stringContaining("drwxr-xr-x"));
		expect(mockLog).toHaveBeenCalledWith(
			expect.stringContaining("src/__tests__"),
		);
	});

	it("should find and list a specific file based on the arguments", async () => {
		const search = new Search({
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			path: `${process.cwd()}`,
			pattern: "README.md",
			short: true,
			stats: true,
			type: "f",
		});
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" README.md");
		expect(mockLog).toHaveBeenCalledWith(expect.stringContaining("Duration: "));
		expect(mockLog).toHaveBeenCalledWith(
			expect.stringContaining("Total files matching: 1"),
		);
	});

	it("should find and list a hidden file based on the arguments", async () => {
		const search = new Search({
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			dot: true,
			path: `${process.cwd()}`,
			pattern: "swcrc",
			short: true,
			stats: true,
			type: "f",
		});
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" .swcrc");
		expect(mockLog).toHaveBeenCalledWith(expect.stringContaining("Duration: "));
	});

	it("should find and list files while ignoring the case based on the arguments", async () => {
		const search = new Search({
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			ignoreCase: true,
			path: `${process.cwd()}`,
			pattern: "a",
			short: true,
			stats: true,
			type: "f",
		});
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" README.md");
		expect(mockLog).toHaveBeenCalledWith(" package.json");
		expect(mockLog).toHaveBeenCalledWith(expect.stringContaining("Duration: "));
	});

	it("should find and list all files and directories when there is no patterns or types provided", async () => {
		const search = new Search({
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			path: `${process.cwd()}`,
			short: true,
			stats: true,
		});
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" README.md");
		expect(mockLog).toHaveBeenCalledWith(" package.json");
		expect(mockLog).toHaveBeenCalledWith(" src");
		expect(mockLog).toHaveBeenCalledWith(expect.stringContaining("Duration: "));
	});

	it("should run a command on the file that matches the pattern", async () => {
		const config = {
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			path: `${process.cwd()}`,
			pattern: "package.json",
			short: true,
			stats: false,
			command: "grep name",
		};

		const search = new Search(config);
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" package.json");
		expect(mockLog).toHaveBeenCalledWith(
			expect.stringContaining("@node-cli/search"),
		);
	});

	it("should run a command on the file that matches the pattern but does not return anything", async () => {
		const config = {
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			path: `${process.cwd()}`,
			pattern: "package.json",
			short: true,
			stats: false,
			command: "chmod +r",
		};

		const search = new Search(config);
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" package.json");
		expect(mockLog).not.toHaveBeenCalledWith(
			expect.stringContaining("@node-cli/search"),
		);
	});

	it("should grep some text on the file that matches the pattern", async () => {
		const config = {
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			path: `${process.cwd()}`,
			pattern: "README.md",
			short: true,
			stats: true,
			grep: "^# Node CLI",
		};

		const search = new Search(config);
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" README.md (1 occurrence)");
		expect(mockLog).toHaveBeenCalledWith(
			expect.stringContaining("# Node CLI search package"),
		);
		expect(mockLog).toHaveBeenCalledWith(
			expect.stringContaining("Total files matching: 1"),
		);
	});

	it("should grep some text on the file that matches the pattern", async () => {
		const config = {
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			ignoreCase: true,
			path: `${process.cwd()}`,
			pattern: "package.json",
			short: true,
			stats: false,
			grep: "type",
		};

		const search = new Search(config);
		await search.start();
		expect(mockLog).toHaveBeenCalledWith(" package.json (5 occurrences)");
	});

	it("should exit in error if the grep pattern is invalid", async () => {
		const config = {
			...defaultFlags,
			foldersBlacklist: /node_modules/gi,
			boring: true,
			path: `${process.cwd()}`,
			pattern: "package.json",
			short: true,
			stats: false,
			grep: "description [",
		};

		const search = new Search(config);
		await search.start();
		expect(mockLog).not.toHaveBeenCalledWith(" package.json (1 occurrence)");
		expect(mockExit).toHaveBeenCalledWith(1);
	});
});
