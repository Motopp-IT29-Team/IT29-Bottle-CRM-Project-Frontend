import styled from '@emotion/styled';
import { Fab, Tab, TextField, Toolbar } from '@mui/material';

export const CustomToolbar = styled(Toolbar)`
    height: 50px !important;
    min-height: 50px !important;
    max-height: 50px !important;
    display: flex;
    justify-content: space-between;
    background-color: #1a3353;
`;
export const CustomTab = styled(Tab)`
    height: 36px !important;
    min-height: 36px !important;
    max-height: 36px !important;
    text-transform: none;
    font-weight: bold;
    font-size: 15px;
    padding: 0 15px;
    border-radius: 5px 5px 0 0;
`;

export const RequiredTextField = styled(TextField)``;

export const FabLeft = styled(Fab)({
    height: '40px',
    minHeight: '40px',
    width: '20px',
    minWidth: '20px',
    borderRadius: '7px 0px 0px 7px',
    backgroundColor: 'whitesmoke',
    marginRight: '7px',
    boxShadow: '0px 1px 1px -1px rgba(0,0,0,0.2), 0px 0px 3px 0px rgba(0,0,0,0.14), 0px 1px 0px 0px rgba(0,0,0,0.12)',
});
export const FabRight = styled(Fab)({
    height: '40px',
    minHeight: '40px',
    width: '20px',
    minWidth: '20px',
    borderRadius: '0px 7px 7px 0px',
    backgroundColor: 'whitesmoke',
    marginLeft: '7px',
    boxShadow: '0px 1px 1px -1px rgba(0,0,0,0.2), 0px 0px 3px 0px rgba(0,0,0,0.14), 0px 1px 0px 0px rgba(0,0,0,0.12)',
});
