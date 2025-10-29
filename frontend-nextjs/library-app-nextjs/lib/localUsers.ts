export type LocalUser = {
  email: string;
  password: string;
  roles: string[];
};

const globalAny = global as any;
if (!globalAny.__CFC_LOCAL_USERS__) {
  globalAny.__CFC_LOCAL_USERS__ = [
    { email: 'admin@cfc.com', password: '123456', roles: ['ADMIN'] },
    { email: 'user@cfc.com', password: '123456', roles: ['USER'] },
  ] as LocalUser[];
}
const users: LocalUser[] = globalAny.__CFC_LOCAL_USERS__ as LocalUser[];

export function findUserByEmail(email: string): LocalUser | undefined {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function validateUser(email: string, password: string): LocalUser | undefined {
  const u = findUserByEmail(email);
  if (u && u.password === password) return u;
  return undefined;
}

export function createUser(email: string, password: string): LocalUser {
  const exists = findUserByEmail(email);
  if (exists) throw new Error('User already exists');
  const u: LocalUser = { email, password, roles: ['USER'] };
  users.push(u);
  return u;
}


