require("source-map-support").install();
const Jasmine = require("jasmine");

const jasmine = new Jasmine();
jasmine.loadConfig({
	spec_dir: "./build",
	spec_files: ["**/tests/*.js"]
});

jasmine.execute();