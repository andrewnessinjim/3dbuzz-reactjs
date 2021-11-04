// Actions shared by client and server

//Not all actions will have a status
export const STATUS_REQUEST = "STATUS_REQUEST";
export const STATUS_FAIL = "STATUS_FAIL";
export const STATUS_SUCCESS = "STATUS_SUCCESS";

//--------------Helpers (to overwrite the status field)--------------
export function request(action) {
	return {...action, status: STATUS_REQUEST};
}

export function fail(action, error) {
	return {...action, status: STATUS_FAIL, error};
}

export function succeed(action) {
	return {...action, status: STATUS_SUCCESS};
}