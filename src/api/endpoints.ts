export const ENDPOINTS = {
    // Auth
    LOGIN: 'auth/login/',
    LOGIN_GOOGLE: 'auth/google/',
    LOGOUT: 'auth/logout/',
    REFRESH: 'auth/refresh/',
    REGISTER: 'auth/register/',
    FORGOT_PASSWORD: 'auth/forgot-password/',

    // Organizations
    ORGANIZATIONS: 'org/',

    // Users
    USERS: 'users/',
    USER_DETAIL: (id: string) => `user/${id}/`,
    USER_RESEND_INVITATION: (id: string) => `user/${id}/resend-invitation/`,
    USER_TOGGLE_STATUS: (id: string) => `user/${id}/status/`,
    USER: 'user/',
    PROFILE: 'profile/',

    // Leads
    LEADS: 'leads/',
    LEAD_DETAIL: (id: string) => `leads/${id}/`,
    LEAD_DUPLICATE_CHECK: 'leads/check-duplicate/',
    LEAD_UPLOAD: 'leads/upload/',
    LEAD_COMMENT: (id: string) => `leads/comment/${id}/`,
    LEAD_ATTACHMENT: (id: string) => `leads/${id}/attachments/`,
    LEAD_ATTACHMENT_DELETE: (attachmentId: string) => `leads/attachments/${attachmentId}/`,
    LEAD_CONVERT: (id: string) => `leads/${id}/convert/`,
    LEAD_CHECK_DUPLICATES: (id: string) => `leads/${id}/check-duplicates/`,

    // Companies
    COMPANIES: 'leads/companies/',
    COMPANY: (id: string) => `leads/company/${id}/`,

    // Contacts
    CONTACTS: 'contacts/',
    CONTACT_DETAIL: (id: string) => `contacts/${id}/`,

    // Accounts
    ACCOUNTS: 'accounts/',
    ACCOUNT_DETAIL: (id: string) => `accounts/${id}/`,
    ACCOUNT_COMMENT: (commentId: string) => `accounts/comment/${commentId}/`,
    ACCOUNT_ATTACHMENT: (attachmentId: string) => `accounts/attachment/${attachmentId}/`,

    // Opportunities
    OPPORTUNITIES: 'opportunities/',
    OPPORTUNITY_DETAIL: (id: string) => `opportunities/${id}/`,
    OPPORTUNITY_COMMENT: (commentId: string) => `opportunities/comment/${commentId}/`,
    OPPORTUNITY_ATTACHMENT: (attachmentId: string) => `opportunities/attachments/${attachmentId}/`,

    // Cases
    CASES: 'cases/',
    CASE_DETAIL: (id: string) => `cases/${id}/`,
    CASE_COMMENT: (commentId: string) => `cases/comment/${commentId}/`,
    CASE_ATTACHMENT: (attachmentId: string) => `cases/attachments/${attachmentId}/`,

    // Activity Logs
    ACTIVITY_LOGS: 'activity-logs/',
} as const;
