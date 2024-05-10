export default [
	...(process.env.UNIT_TESTS !== 'false' ? ['__tests__/*'] : []),
	...(process.env.FUNCTIONAL_TESTS === 'true' ? ['__tests_functional__/*'] : []),
];
