import { User } from "types";
import { FirestoreDatabase } from "../implementations/FirestoreDatabaseService"; // Import your DatabaseService

export class UserService {
  private db: FirestoreDatabase;

  constructor() {
    this.db = new FirestoreDatabase(); // Initialize your DatabaseService
  }

  async getUser(userId: string) {
    const user: User = await this.db.getDocument("users", userId);

    return user;
  }

  async getUsers() {
    const users: User[] = await this.db.getCollection("users");

    return users;
  }

  async updateUser(userId: string, data: any) {
    await this.db.updateDocument("users", userId, data);
  }
}
