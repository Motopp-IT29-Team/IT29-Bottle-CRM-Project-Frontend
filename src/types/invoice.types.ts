import { IAddress } from './address.types';
import { IUserDetails } from './user.types';
import { ITeam } from './team.types';
import { IOrganization } from './organization.types';

export interface IInvoice {
    id: string;
    invoice_title: string;
    invoice_number: string;
    status: string;
    due_date: string;
    name: string;
    email: string;
    phone: string;
    from_address: IAddress;
    to_address: IAddress;
    created_at: string;
    created_by: IUserDetails;
    currency: string;
    quantity: number;
    rate: number;
    tax: number;
    total_amount: number;
    amount_due: number;
    amount_paid: number;
    is_email_sent: boolean;
    details: string;
    teams: ITeam[];
    assigned_to: IUserDetails[];
    org: IOrganization;
}

export interface IInvoiceHistory {
    id: string;
    invoice_title: string;
    invoice_number: string;
    status: string;
    due_date: string;
    name: string;
    email: string;
    phone: string;
    created_at: string;
    currency: string;
    quantity: number;
    rate: number;
    total_amount: number;
    amount_due: number;
    amount_paid: number;
    is_email_sent: boolean;
    details: string;
    updated_by: IUserDetails;
}
