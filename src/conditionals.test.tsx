import React from 'react';
import { createAndClick } from './utils.test';
import { useState } from './core';
import { useIf } from './conditionals';


test('useIf can change between two different states', () => {

	function Component() {
		let [ condition, changeCondition ] = useState(false);

		let value = useIf(
			condition,
			() => useState('I will be second')[0],
			() => useState('I should come first')[0]
		);

		return (
			<span onClick={() => changeCondition(!condition)}>{value}</span>
		);
	}

	createAndClick(Component);
});
