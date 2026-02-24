declare module "better-sqlite3" {
  class Database {
    constructor(path: string);
    exec(sql: string): unknown;
    close(): void;
  }

  export default Database;
}

declare module "recharts";

