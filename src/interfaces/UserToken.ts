export interface UserToken {
    subject: string,
    userId: string,
    role: string,
    exp?: number
}