import { IUserDetails } from './user.types';
import { IAddress } from './address.types';

export interface IProfile {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    user_details: IUserDetails;
    address: IAddress | null;
    date_of_joining: string | null;
    created_by_email: string | null;
    created_at: string;
    updated_by_email: string | null;
    updated_at: string;
    deactivated_by_email: string | null;
    deactivated_at: string | null;
}
