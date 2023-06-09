// ts-check

import { Logger, Spinner } from "@node-cli/logger";

const log = new Logger();

log.timestamp = true;
// log.boring = true;
log.prefix = "==>";

log.info("hello world");
log.error("hello world");
log.warn("hello warning");
log.log();
log.printBox(["hello world", "hello world hello world"], {
	padding: 0,
	textAlignment: "right",
	title: "hello world box title",
	width: 40,
	// fullscreen: true,
	newLineAfter: false,
	margin: 1,
	// borderColor: "red",
});
// log.log();
// log.log("after the box");

const spinner = new Spinner({
	text: "Updating package.json...",
	// color: "red",
});
spinner.start();
setTimeout(() => {
	spinner.text = "Almost there...";
	setTimeout(() => {
		spinner.stop("Process completed successfully!", Spinner.WARNING);
	}, 100);
}, 200);
