export default interface UserModel {
    id: number;
    email: string;
    fullName: string;
    role: 'USER' | 'ADMIN';
    enabled: boolean;
    accountNonLocked: boolean;
    accountNonExpired: boolean;
    credentialsNonExpired: boolean;
    password?: string; // Usually excluded in responses, but defined for completeness
}

