export interface IUserChangePassword{
    email: string,
    oldPassword: string,
    newPassword: string,
    reNewPassword: string,
    recaptchaToken: string,

}