//import _ from "lodash";

import loginDialog from "./login";
export default {[loginDialog.id] : loginDialog.component};


/* 
//Instruct webpack to package all js files "./", excluding sub directories, at build time
const context = require.context(__dirname, false, /\.js$/);

const components = context
	.keys()
	.filter(name => name.indexOf("index") == -1) //Tell webpack to ignore self
	.map(name => context(name).default);



Components now looks like [{id: A.DIALOG_LOGIN, component: LoginDialog},{id: A.DIALOG_CONFIRM, component: ConfirmDialog}]
 
We want it to look like below:
{
A.DIALOG_LOGIN: LoginDialog,
A.DIALOG_CONFIRM: ConfirmDialog 

console.log(`Context: ${context.keys()}`);
console.log(`Loaded components: ${components}`);

export default _.zipObject(
	components.map(c => c.id),
	components.map(c => c.component)
); */