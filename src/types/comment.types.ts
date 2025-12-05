export interface IComment {
    id: string;
    comment: string;
    commented_on: string;
    commented_by: string | null;
    account: string | null;
    lead: string | null;
    opportunity: string | null;
    contact: string | null;
    case: string | null;
    task: string | null;
    invoice: string | null;
    event: string | null;
    profile: string | null;
}
