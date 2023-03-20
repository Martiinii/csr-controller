import { IpcRenderer } from 'electron';
import { createController, createSubController, CRUDBase } from './';
import { crudTemplate, ipcTemplate } from './template/';

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

	let UserController = createController<User, CRUDBase, CRUDBase>({
		$url: 'users',
		$server: 'example',
	})(ipcTemplate(null as unknown as IpcRenderer))({
		subcontrollers: {
			statistics: createSubController<{ stat: number }>({ $url: 'stats' }),
		},
		methods: {
			fullStat: t => () => {
				return t.read({ id: 225 });
			},
		},
	});

	// For testing if template changes correctly
	UserController = UserController.$clone(crudTemplate(fetch));

	// For testing if server changes correctly
	UserController = UserController.$changeServer('');

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

	describe('Check server change', () => {
		test('User controller', () => {
			expect(UserController.$server).toBe('');
		});

		test('Statistic sub-controller', () => {
			expect(UserController.statistics.$server).toBe('');
		});
	});

	describe('Fetcher calls', () => {
		test('User controller', () => {
			UserController.index();
			expect(fetcher).toHaveBeenLastCalledWith(
				expect.any(Function),
				{ $base: 'custom', $protected: true, $url: 'users', $server: '' },
				'GET'
			);

			UserController.read({ id: 15 });
			expect(fetcher).toHaveBeenLastCalledWith(
				expect.any(Function),
				{ $base: 'custom', $protected: true, $url: 'users', $server: '' },
				'GET',
				{
					id: 15,
				}
			);

			expect(fetcher).toHaveBeenCalledTimes(2);
		});

		test('Statistic sub-controller', () => {
			UserController.statistics.read({ id: 123 });
			expect(fetcher).toHaveBeenLastCalledWith(
				expect.any(Function),
				{ $base: 'custom', $protected: true, $url: 'stats', $parentUrl: 'users', $server: '' },
				'GET',
				{ id: 123 }
			);

			UserController.statistics.index();
			expect(fetcher).toHaveBeenLastCalledWith(
				expect.any(Function),
				{ $base: 'custom', $protected: true, $url: 'stats', $parentUrl: 'users', $server: '' },
				'GET'
			);

			expect(fetcher).toHaveBeenCalledTimes(2);
		});

		test('Custom defined method', () => {
			UserController.fullStat();
			expect(fetcher).toHaveBeenCalledWith(
				expect.any(Function),
				{ $base: 'custom', $protected: true, $url: 'users', $server: '' },
				'GET',
				{
					id: 225,
				}
			);
		});
	});
});
