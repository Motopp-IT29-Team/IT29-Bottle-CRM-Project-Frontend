import { IAccount } from './account.types';
import { IContact } from './contact.types';
import { IUserDetails } from './user.types';
import { ITeam } from './team.types';
import { IProfile } from './profile.types';
import { IAttachment } from './attachment.types';
import { IComment } from './comment.types';

export interface ITask {
    id: string;
    title: string;
    status: string;
    priority: string;
    due_date: string;
    account: IAccount;
    created_by: IUserDetails;
    created_at: string;
    contacts: IContact[];
    teams: ITeam[];
    assigned_to: IProfile[];
    task_attachment: IAttachment[];
    task_comments: IComment[];
}
