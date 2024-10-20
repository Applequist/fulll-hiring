export type UserId = number;

/**
 * A User entity.
 */
export class User {
        readonly id: UserId;
        readonly name: string;

        constructor(id: UserId, name: string) {
                this.id = id;
                this.name = name;
        }

};

