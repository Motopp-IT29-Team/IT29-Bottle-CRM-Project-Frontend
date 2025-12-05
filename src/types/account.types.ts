import { IAttachment } from './attachment.types';
import { IUserDetails } from './user.types';
import { ITag } from './tag.types';
import { ILead } from './lead.types';
import { IContact } from './contact.types';
import { IProfile } from './profile.types';
import { ITeam } from './team.types';
import { IOrganization } from './organization.types';

export interface IAccount {
    id: string;
    name: string;
    email: string;
    phone: string;
    industry: string;
    billing_address_line: string;
    billing_street: string;
    billing_city: string;
    billing_state: string;
    billing_postcode: string;
    billing_country: string;
    website: string;
    description: string;
    account_attachment: IAttachment[];
    created_by: IUserDetails;
    created_at: string;
    is_active: boolean;
    tags: ITag[];
    status: string;
    lead: ILead | null;
    contact_name: string;
    contacts: IContact[];
    assigned_to: IProfile[];
    teams: ITeam[];
    org: IOrganization;
}
