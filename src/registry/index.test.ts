import { createController, createSubController, CRUDBase } from '../';
import { crudTemplate } from '../template';
import { controllerRegistry } from '../registry';

describe('Register module', () => {
	type User = {
		name: string;
		age: number;
	};

	const UserController = createController<User, CRUDBase, CRUDBase>({
		$url: 'users',
		$server: 'example',
	})(crudTemplate)({
		subcontrollers: {
			statistics: createSubController<{ stat: number }>({ $url: 'stats' }),
		},
		methods: {
			fullStat: t => () => {
				return t.read({ id: 225 });
			},
		},
	});

	const routes = controllerRegistry().register(UserController, UserController).handle();

	test('Register handle', () => {
		expect(routes.has('users')).toBeTruthy();

		expect(routes.get('users')).toMatchObject({
			$url: 'users',
			$server: 'example',
			$base: 'custom',
			$protected: true,
			stats: {
				$url: 'stats',
				$server: 'example',
				$base: 'custom',
				$protected: true,
				$parentUrl: 'users',
			},
		});
	});
});
