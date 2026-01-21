export interface Users {
  address: string;
  device_token: string;
  dob: string;
  email: string;
  id: number;
  name: string;
  phone: string;
  user_img: string;
  status: string;
  type: string;
}
export class Users implements Users {
  constructor(
    public address: string,
    public device_token: string,
    public dob: string,
    public email: string,
    public id: number,
    public name: string,
    public phone: string,
    public user_img: string,
    public status: string,
    public type: string
  ) {}
}
