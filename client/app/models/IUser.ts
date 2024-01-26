export default interface IUser {
    id: number;
    username?: string;
    avatar?: string;
    balance: number;
    fullname?: string;
    email: string;
    isverified: boolean;
    role: 'user' | 'admin';
}