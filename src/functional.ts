import { useEffect, useScope, useState } from './core';
import { useLastState } from './utils';

export type MappedEffectFunction<T> = (v: T) => (void|(() => void))


type KeyType = string|number;

/**
 * Creates an effect for every element of an array
 * 
 * NOTE: This does internally diff the array, so if you care about efficiency, provide a keying function as the third argument
 */
export function useMapEffect<T>(arr: T[], fn: MappedEffectFunction<T>, getKey?: (v: T, index: number) => KeyType) {
	if(!getKey) {
		getKey = (v, i) => i;
	}
	
	return useScope(() => {
		arr.map((v) => {
			useEffect(() => fn(v), [v]);
		});
	});
}
