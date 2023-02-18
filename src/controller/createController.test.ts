import { createController } from './createController';
import { crudTemplate } from './templates/crudTemplate';

import { fetcher } from './fetcher';
jest.mock('./fetcher');

const mockedFetcher = jest.mocked(fetcher);

beforeEach(() => {
	mockedFetcher.mockClear();
});

describe('Controller module', () => {
	const UserController = createController({
		$url: 'user',
	})(crudTemplate);

	test('Check default values', () => {
		expect(UserController.$url).toBe('user');
		expect(UserController.$base).toBe('custom');
		expect(UserController.$protected).toBe(true);
	});

	test('Check if fetcher has been called', () => {
		UserController.index();
		expect(fetcher).toHaveBeenLastCalledWith('user', 'GET');

		UserController.read({ id: 15 });
		expect(fetcher).toHaveBeenLastCalledWith('user', 'GET', { id: 15 });
		expect(fetcher).toHaveBeenCalledTimes(2);
	});
});
