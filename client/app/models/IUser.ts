export default interface IUser {
    id: number;
    username?: string;
    avatar?: string;
    balance: number;
    name?: string;
    surname?: string;
    email: string;
    isverified: boolean;
    role: 'user' | 'admin';
}