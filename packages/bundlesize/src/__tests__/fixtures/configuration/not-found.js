export default {
	report: {
		previous: "../stats/previous.json",
		current: "../stats/current.json",
	},
	sizes: [
		{
			path: "../data/file.txt",
			limit: "1.5 kB",
		},
		{
			path: "/tmp/data/file-does-not-exist.txt",
			limit: "1.5 kB",
		},
	],
};
