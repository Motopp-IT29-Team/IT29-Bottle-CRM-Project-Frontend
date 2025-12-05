import { IUserDetails } from './user.types';

export interface IAttachment {
    id: string;
    created_by: IUserDetails;
    file_name: string;
    created_at: string;
    file_path: string | null;
}
