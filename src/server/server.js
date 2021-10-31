const blegh = "whoa";
console.log(`hello ${blegh}`);

const obj = {hey: 1};
const obj2 = {...obj, blegh: 2};
console.log(obj2);

class AppComponent {
	static PropTypes = {
		blegh: "PropTypes!"
	}
}

function fail() {
	throw new Error("BLEGH BLEGH");
}

//fail();

switch (blegh) {
	case 1:
		console.log("HEt");
		break;
    
	case 2:
		console.log("WHOA");
		break;
}