export interface MemberModel {
  Name: string;
  email: string;
  password: string;
  staffId: string;
  address: string;
  nic: string;
  qualification: string;
  country: string;
  city: string;
  phoneNumber: string;
  gender: string;
  group: string;
  verified: boolean;
  profileImage: string;
  cv: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
}