import { IProfile } from './profile.types';
import { IUserDetails } from './user.types';

export interface ITeam {
    id: string;
    name: string;
    description: string;
    users: IProfile[];
    created_at: string;
    created_by: IUserDetails;
    created_on_arrow: string;
}
