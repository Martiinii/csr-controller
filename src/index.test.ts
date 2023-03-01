import { createController, createSubController, CRUDBase } from './';
import { crudTemplate } from './template/';

import { fetcher } from './utils';

jest.mock('./utils');

const mockedFetcher = jest.mocked(fetcher);

beforeEach(() => {
	mockedFetcher.mockClear();
});

describe('Controller module', () => {
	type User = {
		name: string;
		age: number;
	};

	const UserController = createController<User, CRUDBase, CRUDBase>({
		$url: 'users',
	})(crudTemplate, {
		statistics: createSubController<{ stat: number }>({ $url: 'stats' })(crudTemplate),
	});

	describe('Check default values', () => {
		test('User controller', () => {
			expect(UserController.$url).toBe('users');
			expect(UserController.$base).toBe('custom');
			expect(UserController.$protected).toBe(true);
		});

		test('Statistic sub-controller', () => {
			expect(UserController.statistics.$url).toBe('stats');
			expect(UserController.statistics.$base).toBe('custom');
			expect(UserController.statistics.$protected).toBe(true);
		});
	});

	describe('Fetcher calls', () => {
		test('User controller', () => {
			UserController.index();
			expect(fetcher).toHaveBeenLastCalledWith({ $base: 'custom', $protected: true, $url: 'users' }, 'GET');

			UserController.read({ id: 15 });
			expect(fetcher).toHaveBeenLastCalledWith({ $base: 'custom', $protected: true, $url: 'users' }, 'GET', {
				id: 15,
			});

			expect(fetcher).toHaveBeenCalledTimes(2);
		});

		test('Statistic sub-controller', () => {
			UserController.statistics.read({ id: 123 });
			expect(fetcher).toHaveBeenLastCalledWith(
				{ $base: 'custom', $protected: true, $url: 'stats', $parentUrl: 'users' },
				'GET',
				{ id: 123 }
			);

			expect(fetcher).toHaveBeenCalledTimes(1);
		});
	});
});
