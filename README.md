Scoping an Conditionality Utilities for React Hooks
===================================================

TLDR: This adds `if` statements, loops, and more to the React Hooks API.

*Use Cases*: Still figuring all of them out, but feel free to help me conditionally go where no react hook has gone before

As of the initial proposal, React hooks doesn't support conditional hook usage like mapping over arrays, if statements, etc.

This package wraps the 

Requirements
------------
- React >= `16.7.0-alpha.0`

Basic Usage
-----------

1. First use this to replace the react hook api functions with the scopeable ones:
	```
	// In a shared file, run this once
	import { registerScopedHooks } from 'react-scoped-hooks';
	registerScopedHooks();
	```

2. Start using it
	```
	// Create an effect conditionally
	import { useEffect } from 'react';
	import { useIf } from 'react-scoped-hooks';
	...
	useIf(someBoolean, () => useEffect(() => {
		// Do stuff here
	}));
	```

NOTE: Step 1 will change the value of `React.useState` and the other standard API functions with equivalent in functionality wrapped versions that allow for conditional behavior. If you aren't using any non-standard API functions in this library, then the wrappers will pass through to the original implementations so there is little overhead to doing this globally. If you don't want to replace them, you can also directly import the wrapped versions as `import { useState } from 'react-scoped-hooks';`.

NOTE2: If you don't replace them globally, be aware that you can NOT mix the wrapped and unwrapped while executing a conditional or scoped block of hooks code.


Advanced Usage
--------------

For now check out the `src/*.test.tsx` files for some examples. The full documentation still needs to be written for this

The workhorse of this library is the `useScope()` function which takes a single argument (a function) and runs it in effecitively a new 'component' such that all calls to the hook API don't impact the ordering of states in the component that called it. 

Example 1: Counting events from in a variable length list of event emitters using `useMapper`

```
import EventEmitter from 'events';
import { useState, useMapper } from 'react-scoped-hooks';

var A = new EventEmitter();
var B = new EventEmitter();

// In this example, we assume that we are given some list of event emitters (A, B) as input to the component and count how many times a specific event is emitted from any of the emitters
function MyComponent() {

	var inputs = [ A, B ];

	var [ nEventsSeen, setNSeen ] = useState(0);

	// NOTE: If the array being mapped over changes, the mapper will take care of rerunning the effect on new elements as needed
	useMapEffect(inputs, (v: EventEmitter) => {

		v.on('tick', () => {
			setNSeen(nEventsSeen + 1);
		});

		return () => {
			v.removeAllListeners();
		}
	});

	return (
		<span>
			I have seen {nEventsSeen} ticks across all emitters
			<br /><br />
			{inputs.map((inp, i) => {
				return (
					<button onClick={() => inp.emit('tick')}>
						Emit on {String.fromCharCode('A'.charCodeAt(0) + i)}
					</button>
				);
			})}
		</span>
	)
}

```

