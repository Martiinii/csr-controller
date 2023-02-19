# Database controllers for client side rendering

This is library for creating client side type-safe database controllers. Integrates out of box with typescript, ORM, Next.JS.

## Installation

Install package with `npm i csr-controller`

## Features

### Creating controller

To create your first controller use:
```ts
    type User = {
        name: string,
        age: number
    } & CRUDBase;
    
    type UpdateUserType = User & CRUDBase;

	const UserController = createController<User, CRUDBase, UpdateUserType>({
		$url: 'user',
	})(crudTemplate);
```
First, we can skip generics and just call `createController()`, but for type safety it is recommended way. Every `Controller` needs three generics:
1. Object type. In our case it's `User`
2. Create new object type. In our case it's default option - `CRUDBase` It is made as: `{ id: string | null }`
3. Update object type, simillar to create new object type.

Calling the function, we must specify `$url` - it's the api path. We can also specify `$base`. It is default to `"custom"`.

In our case, using `UserController` every action would fetch `relativeServerPath:port/custom/user`

Next, we must provide template. Here we provide `crudTemplate`. It is preferred when using web server as it makes direct fetch calls to api and can be shared between projects. In the feature there will be `electronTemplate` that makes IPC calls.

### Adding controller behaviour

To add controller behaviour such as making database calls/fetching external api use:
```ts
const routes = controllerRegistry().register(UserController, {
    index: async () => {
        const users = await db.getUsers(); // Make call to database to fetch all users
        return users;
    },
    read: async data => {
        const user = await db.getUser({ id: data.id }); // Make call to database to fetch single user by id
        return user;
    }
}).handle();
```

We can use this routes with web servers