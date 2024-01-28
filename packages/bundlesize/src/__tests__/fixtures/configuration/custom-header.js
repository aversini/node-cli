export default {
	report: {
		header: "## Custom Header",
		previous: "../stats/previous.json",
		current: "../stats/current.json",
	},
	sizes: [
		{
			path: "../data/**/file*.txt",
			limit: "1.5 kB",
		},
	],
};
