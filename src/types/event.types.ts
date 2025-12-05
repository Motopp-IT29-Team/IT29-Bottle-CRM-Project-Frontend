import { IContact } from './contact.types';
import { IUserDetails } from './user.types';
import { ITeam } from './team.types';
import { IProfile } from './profile.types';
import { IAttachment } from './attachment.types';
import { IComment } from './comment.types';
import { IOrganization } from './organization.types';

export interface IEvent {
    id: string;
    name: string;
    event_type: string;
    status: string;
    is_active: boolean;
    disabled: boolean;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    description: string;
    date_of_meeting: string;
    created_by: IUserDetails;
    created_at: string;
    contacts: IContact[];
    teams: ITeam[];
    assigned_to: IProfile[];
    event_attachment: IAttachment[];
    event_comments: IComment[];
    org: IOrganization;
}
