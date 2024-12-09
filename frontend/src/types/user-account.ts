export class UserAccount {
  id!: number;
  emailAddress!: string;
  phoneNumber!: number;
  firstName!: string;
  lastName!: string;
  peselNumber!: number;
  documentType!: string;
  documentSerie!: string;
  avatarUrl!: string | null;
  address!: string;
  password!: string;
  repeatedPassword!: string;
}
