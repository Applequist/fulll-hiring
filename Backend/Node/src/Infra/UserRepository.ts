import User from '../Domain/User.js';

interface UserRepository {
	createUser(name: string): User;
	getUsers(): User[];
	getUserById(id: number): User | undefined;
}

class InMemoryUsers implements UserRepository {
	createUser(name: string): User {
		throw new Error('Method not implemented.');
	}
	getUsers(): User[] {
		throw new Error('Method not implemented.');
	}
	getUserById(id: number): User | undefined {
		throw new Error('Method not implemented.');
	}
}

export const Users = new InMemoryUsers();


