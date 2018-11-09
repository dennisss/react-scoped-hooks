import { useScope } from './core';

export type ConditionalOutcome<T> = () => T;

//function useIf<T, V>(expr: true extends boolean, trueValue: ConditionalOutcome<T>, falseValue?: ConditionalOutcome<V>) : T;
//function useIf<T, V>(expr: false extends boolean, trueValue: ConditionalOutcome<T>, falseValue?: ConditionalOutcome<V>) : V;
function useIf<T, V>(expr: boolean, trueValue: ConditionalOutcome<T>, falseValue?: ConditionalOutcome<V>) {

	// The important point is that all possible branches trigger a distinct execution of useState/useEffect
	var trueRet = useScope(expr? trueValue : null);
	var falseRet = useScope(expr? null : falseValue);

	if(expr) {
		return trueRet;
	}
	else {
		return falseRet;
	}
}

export { useIf };
