import React from 'react';
import { useReducer, useState, useEffect } from './core';

export * from './core';
export * from './conditionals';

export function registerScopedHooks() {
	React.useEffect = useEffect;
	React.useReducer = useReducer;
	React.useState = useState;
}
