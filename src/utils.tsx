import { useState } from './core';

/**
 * Like useState, except this will change take a new state as input and will return the last value of it (or null if this is the first time it is running)
 */
export function useLastState<T>(v: T) : T|null {
	let [ state, setState ] = useState<T|null>(null);
	setState(v);
	return state;
}

