Scoping an Conditionality Utilities for React Hooks
===================================================

TLDR: This adds `if` statements, loops, and more to the React Hooks API.

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
	import ReactSH from 'react-scoped-hooks';
	ReactSH.register();
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


