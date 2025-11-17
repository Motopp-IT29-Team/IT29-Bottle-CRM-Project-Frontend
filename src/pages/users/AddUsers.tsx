import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField,
    AccordionDetails,
    Accordion,
    AccordionSummary,
    Typography,
    Box,
    MenuItem,
    Divider,
    Select,
    FormControl,
} from '@mui/material';

import '../../styles/style.css';
import { CustomAppBar } from '../../components/CustomAppBar';
import { RequiredTextField } from '../../styles/CssStyled';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { useUserFormData, UserFormData } from '../../hooks/user/useUserFormData';
import { useUserValidation } from '../../hooks/user/useUserValidation';
import { useSubmitUser } from '../../hooks/user/useSubmitUser';

export function AddUsers() {
    const navigate = useNavigate();
    const [roleSelectOpen, setRoleSelectOpen] = useState(false);

    const initialFormData: UserFormData = {
        email: '',
        role: 'ADMIN',
        phone: '',
        alternate_phone: '',
        address_line: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
        profile_pic: null,
        has_sales_access: false,
        has_marketing_access: false,
        is_organization_admin: false,
    };

    const { formData, handleChange, resetForm } = useUserFormData(initialFormData);
    const { validationErrors, validateForm } = useUserValidation();
    const { submitForm } = useSubmitUser(resetForm);

    const backBtnHandle = () => navigate('/app/users');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const errors = validateForm(formData);
        if (Object.keys(errors).length === 0) submitForm(formData);
    };

    const module = 'Users';
    const currentPage = 'Add Users';
    const backBtn = 'Back To Users';

    return (
      <Box sx={{ mt: '60px' }}>
          <CustomAppBar
            backbtnHandle={backBtnHandle}
            module={module}
            backBtn={backBtn}
            crntPage={currentPage}
            onCancel={resetForm}
            onSubmit={handleSubmit}
          />

          <Box sx={{ mt: '120px' }}>
              <form onSubmit={handleSubmit}>
                  <div style={{ padding: '10px' }}>
                      {/* USER INFO */}
                      <div className='leadContainer'>
                          <Accordion defaultExpanded style={{ width: '98%' }}>
                              <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                  <Typography className='accordion-header'>User Information</Typography>
                              </AccordionSummary>

                              <Divider className='divider' />

                              <AccordionDetails>
                                  <Box sx={{ width: '98%', color: '#1A3353', mb: 1 }}>
                                      <div className='fieldContainer'>
                                          <div className='fieldSubContainer'>
                                              <div className='fieldTitle'>Email</div>
                                              <RequiredTextField
                                                required
                                                name='email'
                                                value={formData.email}
                                                onChange={handleChange}
                                                style={{ width: '70%' }}
                                                size='small'
                                                error={!!validationErrors.email}
                                                helperText={validationErrors.email}
                                              />
                                          </div>

                                          <div className='fieldSubContainer'>
                                              <div className='fieldTitle'>Role</div>
                                              <FormControl sx={{ width: '70%' }}>
                                                  <Select
                                                    name='role'
                                                    value={formData.role}
                                                    open={roleSelectOpen}
                                                    onClick={() => setRoleSelectOpen(!roleSelectOpen)}
                                                    IconComponent={() => (
                                                      <div
                                                        onClick={() => setRoleSelectOpen(!roleSelectOpen)}
                                                        className='select-icon-background'
                                                      >
                                                          {roleSelectOpen ? (
                                                            <FiChevronUp className='select-icon' />
                                                          ) : (
                                                            <FiChevronDown className='select-icon' />
                                                          )}
                                                      </div>
                                                    )}
                                                    className={'select'}
                                                    onChange={handleChange}
                                                  >
                                                      {['ADMIN', 'USER'].map((option) => (
                                                        <MenuItem key={option} value={option}>
                                                            {option}
                                                        </MenuItem>
                                                      ))}
                                                  </Select>
                                              </FormControl>
                                          </div>
                                      </div>
                                  </Box>
                              </AccordionDetails>
                          </Accordion>
                      </div>

                      {/* ADDRESS INFO */}
                      <div className='leadContainer'>
                          <Accordion defaultExpanded style={{ width: '98%' }}>
                              <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
                                  <Typography className='accordion-header'>Address</Typography>
                              </AccordionSummary>

                              <Divider className='divider' />

                              <AccordionDetails>
                                  <Box sx={{ width: '98%', color: '#1A3353', mb: 1 }}>
                                      {[
                                          ['address_line', 'street'],
                                          ['city', 'state'],
                                          ['pincode', 'country'],
                                      ].map(([f1, f2]) => (
                                        <div key={f1} className='fieldContainer2'>
                                            {[f1, f2].map((field) => (
                                              <div key={field} className='fieldSubContainer'>
                                                  <div className='fieldTitle'>{field.replace('_', ' ')}</div>
                                                  <TextField
                                                    required
                                                    name={field}
                                                    value={(formData as any)[field]}
                                                    onChange={handleChange}
                                                    style={{ width: '70%' }}
                                                    size='small'
                                                    error={!!validationErrors[field]}
                                                    helperText={validationErrors[field]}
                                                  />
                                              </div>
                                            ))}
                                        </div>
                                      ))}
                                  </Box>
                              </AccordionDetails>
                          </Accordion>
                      </div>
                  </div>
              </form>
          </Box>
      </Box>
    );
}