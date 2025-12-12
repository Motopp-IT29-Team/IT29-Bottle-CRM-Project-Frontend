import { IAccount } from './account.types';
import { IContact } from './contact.types';
import { IProfile } from './profile.types';
import { IUserDetails } from './user.types';
import { ITag } from './tag.types';
import { IAttachment } from './attachment.types';
import { ITeam } from './team.types';

export interface IOpportunity {
    id: string;
    name: string;
    stage: string;
    currency: string;
    amount: number;
    lead_source: string;
    probability: number;
    budget_range: string;
    decision_timeframe: string;
    contacts: IContact[];
    closed_by: IProfile | null;
    closed_on: string | null;
    description: string;
    assigned_to: IProfile[];
    created_by: IUserDetails;
    created_at: string;
    is_active: boolean;
    tags: ITag[];
    opportunity_attachment: IAttachment[];
    teams: ITeam[];
    created_on_arrow: string;
    account: IAccount;
}
