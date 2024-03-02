export default [
	...(process.env.UNIT_TESTS !== 'false' ? ['__tests__/*'] : []),
	...(process.env.E2E_TESTS === 'true' ? ['__tests_e2e__/*'] : []),
];
