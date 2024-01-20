export default interface IUser {
    id: number;
    username?: string;
    avatar?: string;
    balance: number;
    fullname?: string;
    email: string;
    boughtcourses?: number[];
    completedcourses?: number[];
}