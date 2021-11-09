import {Observable} from "rxjs";
import * as A from "./actions";

/*
mapOp$ takes in a sequence of actions that have statuses on them and turns them
into a sequence of {can, inProgress, error, failed} objects.

Every time we get a new value for can$, the process restarts and we get a new op
*/
export function mapOp$(op$:Observable<any>, can$ = Observable.of(true)): Observable<Op> {
	const operation$ = op$
		.startWith({})
		.combineLatest(can$)
		.map(([action, can]) => {
			// eslint-disable-next-line no-prototype-builtins
			if(!action.hasOwnProperty("status"))
				return {can, inProgress: false, failed:false};

			if(action.status == A.STATUS_REQUEST)
				return {can, inProgress: true, failed: false};
			
			if(action.status == A.STATUS_FAIL)
				return {can, inProgress: false, failed: true, error: action.error};

			return {can, inProgress: false, failed: false};
		})
		.publishReplay(1);

	operation$.connect();
	return operation$;
}

export interface Op {
	can: boolean,
	inProgress: boolean,
	failed: boolean,
	error?: string
}