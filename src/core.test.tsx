import React from 'react';
import { useState } from './core';
import { createAndClick } from './utils.test';


test('useState works as normal in the top-level', () => {

	function Component() {
		let [ state, setState ] = useState(0);

		return (
			<span onClick={() => {
				setState(state + 1);
			}}>
				{state}
			</span>
		)
	}

	createAndClick(Component);
});

// NOTE: We currently don't support involving two different scopes which is problematic


// TODO: If the default value changes, the state shouldn't change if it has already been loaded
