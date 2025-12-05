import { IAccount } from './account.types';
import { IContact } from './contact.types';
import { IUserDetails } from './user.types';
import { ITeam } from './team.types';
import { IProfile } from './profile.types';
import { IOrganization } from './organization.types';

export interface ICase {
    id: string;
    name: string;
    status: string;
    priority: string;
    case_type: string;
    closed_on: string | null;
    description: string;
    created_by: IUserDetails;
    created_at: string;
    is_active: boolean;
    account: IAccount;
    contacts: IContact[];
    teams: ITeam[];
    assigned_to: IProfile[];
    org: IOrganization;
    created_on_arrow: string;
}
