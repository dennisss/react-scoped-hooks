
import React, {
	useEffect as useReactEffect,
	useState as useReactState,
	useReducer as useReactReducer
} from 'react';

interface Effect {
	dirty: boolean;
	init: (() => any)|null;
	cleanup: (() => any)|null;
	values: any[]|null|undefined;
}

interface ScopeState {
	states: any[]; // Current value of every single state that we have defined in this state
	effects: Effect[];
}

interface ScopeRuntime {
	scope: ScopeState;
	callback: () => void;

	// Used for keeping track of what the next position in the scope's arrays we are at
	stateIdx: number;
	effectIdx: number;
}


var activeRuntime : ScopeRuntime|null = null;

// NOTE: Don't touch this. This is just for internal usage
export { activeRuntime as __activeRuntime };


export function useState<T>(value: T|(() => T)) : [T, (newValue: T) => void] {
	if(!activeRuntime) {
		return useReactState(value);
	}

	var boundRuntime = activeRuntime;
	var scope = boundRuntime.scope;
	var idx = boundRuntime.stateIdx++;

	var currentValue: T;

	if(scope.states.length > idx) {
		currentValue = scope.states[idx];
	}
	else {
		if(scope.states.length !== idx) {
			throw new Error('Expected to be the very next state');
		}

		if(typeof(value) === 'function') {
			currentValue = (value as () => T)();
		}
		else {
			currentValue = value;
		}

		// Add a new entry and continue using default
		scope.states.push(currentValue);
	}

	return [currentValue, (newValue) => {
		scope.states[idx] = newValue;
		boundRuntime.callback();
	}];
}

export function useReducer<T, A>(reducer: (value: T, action: A) => T, initialValue: T) : [ T, (action: A) => void ] {
	if(!activeRuntime) {
		return useReactReducer(reducer, initialValue);
	}

	let [ value, setValue ] = useState(initialValue);

	return [value, (action: A) => {
		setValue(reducer(value, action));
	}];
}


export type EffectFunction = () => (void|(() => void));

// TODO: The subtle difference is that these must run on each mount
export function useEffect(fn: EffectFunction, vals?: any[]) {
	if(!activeRuntime) {
		return useReactEffect(fn, vals);
	}

	var boundRuntime = activeRuntime;
	var scope = boundRuntime.scope;
	var idx = boundRuntime.effectIdx++;

	// Whether or not we need to rerun the given initialization function
	var dirty = false;

	var oldExists = scope.effects.length > idx;
	if(oldExists) {
		let old = scope.effects[idx];

		if(!vals || !old.values || vals.length !== old.values.length) {
			dirty = true;
		}
		else {
			for(var i = 0; i < vals.length; i++) {
				if(vals[i] !== old.values[i]) {
					dirty = true;
					break;
				}
			}
		}
	}
	else {
		dirty = true;
	}

	if(dirty) {
		var e : Effect = {
			dirty: true,
			init: fn,
			cleanup: null,
			values: vals
		};

		if(oldExists) {
			e.cleanup = scope.effects[idx].cleanup;
			scope.effects[idx] = e;
		}
		else {
			if(scope.effects.length !== idx) {
				throw new Error('Expected to be the very next effect');
			}

			scope.effects.push(e);
		}
	}
}

/**
 * Essentially allows for doing conditional useState execution by wrapping an entire function in a new queue
 * Such that any useState calls inside of the given function do NOT effect any outer functions
 */
export function useScope<T>(fn: (() => T)|null) : T|null {

	const defaultScope : ScopeState = {
		states: [],
		effects: []
	};

	let [ scope, updateScope ] = useState<ScopeState>(defaultScope);


	// Should run on every cycle to refresh changes internally
	useEffect(() => {
		scope.effects.map((e) => {
			if(e.dirty) {
				var oldCleanup = e.cleanup;

				if(e.init) {
					e.cleanup = e.init();
				}

				// TODO: verify that react calls the new function before calling the old cleanup function
				if(oldCleanup) {
					oldCleanup();
				}

				e.dirty = false;
			}
		});
	});

	// For when the entire component is unmounted
	useEffect(() => {
		return () => {
			scope.effects.map((e) => {
				if(e.cleanup) {
					e.cleanup();
				}
			});
		};
	}, []);

	var runtime: ScopeRuntime = {
		scope: scope,
		callback: () => {
			// Trigger next level down to update. We assume that the caller of this function did any needed updates on the state object already 
			updateScope(scope);
		},

		stateIdx: 0,
		effectIdx: 0
	};

	// Run it!
	let lastActiveRuntime = activeRuntime;
	activeRuntime = runtime;
	var ret = fn? fn() : null;
	activeRuntime = lastActiveRuntime;


	// Cleaning up all no longer in existance hooks
	// NOTE: This behavior is different than how react implements it (React would complain if the number of calls to useState/useEffect changed between renders)
	if(runtime.stateIdx < scope.states.length) {
		scope.states.splice(runtime.stateIdx, scope.states.length - runtime.stateIdx);
	}
	if(runtime.effectIdx < scope.effects.length) {
		var removed = scope.effects.splice(runtime.effectIdx, scope.effects.length - runtime.effectIdx);
		removed.map((e) => {
			if(e.cleanup) {
				e.cleanup();
			}
		});
	}

	return ret;
}
