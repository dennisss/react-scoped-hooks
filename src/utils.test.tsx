import React from 'react';
import renderer from 'react-test-renderer';

export function createAndClick(Component: any) {
	const comp = renderer.create(<Component />);

	let tree = comp.toJSON();
	expect(tree).toMatchSnapshot();

	tree.props.onClick();
	tree = comp.toJSON();
	expect(tree).toMatchSnapshot();
}


test('placeholder', () => {

});