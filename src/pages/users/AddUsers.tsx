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
    Tooltip,
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
    const [password, setPassword] = useState('');

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
        const errors = validateForm(formData, password);
        if (Object.keys(errors).length === 0) submitForm(formData, password);
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

                                      {/*<div className='fieldContainer2'>*/}
                                      {/*    <div className='fieldSubContainer'>*/}
                                      {/*        <div className='fieldTitle'>Password</div>*/}
                                      {/*        <RequiredTextField*/}
                                      {/*          required*/}
                                      {/*          name='password'*/}
                                      {/*          type='password'*/}
                                      {/*          value={password}*/}
                                      {/*          onChange={(e) => setPassword(e.target.value)}*/}
                                      {/*          style={{ width: '70%' }}*/}
                                      {/*          size='small'*/}
                                      {/*          error={!!validationErrors.password}*/}
                                      {/*          helperText={validationErrors.password}*/}
                                      {/*        />*/}
                                      {/*    </div>*/}

                                      {/*    <div className='fieldSubContainer'>*/}
                                      {/*        <div className='fieldTitle'>Phone Number</div>*/}
                                      {/*        <Tooltip title='Number must start with +'>*/}
                                      {/*            <RequiredTextField*/}
                                      {/*              name='phone'*/}
                                      {/*              value={formData.phone}*/}
                                      {/*              onChange={handleChange}*/}
                                      {/*              required*/}
                                      {/*              style={{ width: '70%' }}*/}
                                      {/*              size='small'*/}
                                      {/*              error={!!validationErrors.phone}*/}
                                      {/*              helperText={validationErrors.phone}*/}
                                      {/*            />*/}
                                      {/*        </Tooltip>*/}
                                      {/*    </div>*/}
                                      {/*</div>*/}
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


// import React, { useState } from 'react'
// import { useNavigate, useLocation } from 'react-router-dom'
// import {
//     TextField,
//     AccordionDetails,
//     Accordion,
//     AccordionSummary,
//     Typography,
//     Box,
//     MenuItem,
//     Tooltip,
//     Divider,
//     Select,
//     FormControl,
//     FormHelperText
// } from '@mui/material'
//
// import '../../styles/style.css'
// import { UsersUrl } from '../../services/ApiUrls'
// import { fetchData } from '../../components/FetchData'
// import { CustomAppBar } from '../../components/CustomAppBar'
// import { RequiredTextField } from '../../styles/CssStyled'
// import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown'
// import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp'
//
// type FormErrors = {
//     email?: string[];
//     password?: string[];
//     role?: string[];
//     phone?: string[];
//     alternate_phone?: string[];
//     address_line?: string[];
//     street?: string[];
//     city?: string[];
//     state?: string[];
//     pincode?: string[];
//     country?: string[];
//     profile_pic?: string[];
//     has_sales_access?: string[];
//     has_marketing_access?: string[];
//     is_organization_admin?: string[];
// };
// interface FormData {
//     email: string,
//     role: string,
//     phone: string,
//     alternate_phone: string,
//     address_line: string,
//     street: string,
//     city: string,
//     state: string,
//     pincode: string,
//     country: string,
//     profile_pic: string | null,
//     has_sales_access: boolean,
//     has_marketing_access: boolean,
//     is_organization_admin: boolean
//
//
// }
// export function AddUsers() {
//     const { state } = useLocation()
//     const navigate = useNavigate()
//
//     const [roleSelectOpen, setRoleSelectOpen] = useState(false)
//     const [countrySelectOpen, setCountrySelectOpen] = useState(false)
//     const [error, setError] = useState(false)
//     const [responseError, setResponseError] = useState(false)
//     const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
//
//     const handleChange = (e: any) => {
//         const { name, value, type, checked } = e.target;
//         if (type === 'file') {
//             setFormData({ ...formData, [name]: e.target.files?.[0] || null });
//         }
//         if (type === 'checkbox') {
//             setFormData({ ...formData, [name]: checked });
//         }
//         else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };
//
//     const backBtnHandle = () => {
//         navigate('/app/users')
//     }
//     const handleSubmit = (e: any) => {
//         e.preventDefault();
//         submitForm();
//     }
//     const [errors, setErrors] = useState<FormErrors>({});
//     const [profileErrors, setProfileErrors] = useState<FormErrors>({});
//     const [userErrors, setUserErrors] = useState<FormErrors>({});
//     const [password, setPassword] = useState<string>('');
//     const [formData, setFormData] = useState<FormData>({
//         email: '',
//         role: 'ADMIN',
//         phone: '',
//         alternate_phone: '',
//         address_line: '',
//         street: '',
//         city: '',
//         state: '',
//         pincode: '',
//         country: '',
//         profile_pic: null,
//         has_sales_access: false,
//         has_marketing_access: false,
//         is_organization_admin: false
//
//     })
//
//     const validateForm = (data: FormData) => {
//         const errors: { [key: string]: string } = {};
//         if (!data.email.trim()) errors.email = 'Email is required';
//         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format';
//
//         if (!password.trim()) errors.password = 'Password is required';
//         else if (password.trim().length < 8) errors.password = 'Password must be at least 8 characters';
//
//         if (!data.phone.trim()) errors.phone = 'Phone number is required';
//         else if (!/^\+\d+$/.test(data.phone.trim())) errors.phone = 'Phone number must start with + and contain digits';
//
//         if (!data.address_line.trim()) errors.address_line = 'Address line is required';
//         if (!data.city.trim()) errors.city = 'City is required';
//         if (!data.state.trim()) errors.state = 'State is required';
//         if (!data.pincode.trim()) errors.pincode = 'Pincode is required';
//         if (!data.country.trim()) errors.country = 'Country is required';
//
//         return errors;
//     };
//
//     const submitForm = () => {
//         const Header = {
//             Accept: 'application/json',
//             'Content-Type': 'application/json',
//             Authorization: localStorage.getItem('Token'),
//             org: localStorage.getItem('org')
//           }
//
//
//         const data = {
//             email: formData.email,
//             role: formData.role,
//             phone: formData.phone,
//             alternate_phone: formData.alternate_phone,
//             address_line: formData.address_line,
//             street: formData.street,
//             city: formData.city,
//             state: formData.state,
//             pincode: formData.pincode,
//             country: formData.country,
//             profile_pic: formData.profile_pic,
//             has_sales_access: formData.has_sales_access,
//             has_marketing_access: formData.has_marketing_access,
//             is_organization_admin: formData.is_organization_admin,
//              ...(password && password.trim().length > 0
//                  ? { password: password.trim() }
//                   : {}),
//         }
//
//         if (password && password.trim().length > 0) {
//             data.password = password.trim();
//             }
//
//         console.log(validateForm(data));
//
//         fetchData(`${UsersUrl}/`, 'POST', JSON.stringify(data), Header)
//             .then((res: any) => {
//                 console.log('Form data:', res);
//                 if (!res.error) {
//                     resetForm()
//                     navigate('/app/users')
//                 }
//                 if (res.error) {
//                     setError(true)
//                     setProfileErrors(res?.errors?.profile_errors)
//                     setUserErrors(res?.errors?.user_errors)
//                 }
//             })
//             .catch(() => {
//             })
//     };
//     const resetForm = () => {
//         setFormData({
//             email: '',
//             role: 'ADMIN',
//             phone: '',
//             alternate_phone: '',
//             address_line: '',
//             street: '',
//             city: '',
//             state: '',
//             pincode: '',
//             country: '',
//             profile_pic: null,
//             has_sales_access: false,
//             has_marketing_access: false,
//             is_organization_admin: false
//         });
//         setProfileErrors({})
//         setUserErrors({})
//     }
//     const onCancel = () => {
//         resetForm()
//     }
//     const module = 'Users'
//     const currentPage = 'Add Users'
//     const backBtn = 'Back To Users'
//
//     return (
//         <Box sx={{ mt: '60px' }}>
//             <CustomAppBar backbtnHandle={backBtnHandle} module={module} backBtn={backBtn} crntPage={currentPage} onCancel={onCancel} onSubmit={handleSubmit} />
//
//             <Box sx={{ mt: "120px" }}>
//                 <form onSubmit={handleSubmit}>
//                     <div style={{ padding: '10px' }}>
//                         <div className='leadContainer'>
//                             <Accordion defaultExpanded style={{ width: '98%' }}>
//                                 <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
//                                     <Typography className='accordion-header'>User Information</Typography>
//                                 </AccordionSummary>
//
//                                 <Divider className='divider' />
//
//                                 <AccordionDetails>
//                                     <Box
//                                         sx={{ width: '98%', color: '#1A3353', mb: 1 }}
//                                         component='form'
//                                         noValidate
//                                         autoComplete='off'
//                                     >
//                                         <div className='fieldContainer'>
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>Email</div>
//
//                                                 <RequiredTextField
//                                                     required
//                                                     name='email'
//                                                     value={formData.email}
//                                                     onChange={handleChange}
//                                                     style={{ width: '70%' }}
//                                                     size='small'
//                                                     error={!!profileErrors?.email?.[0] || !!userErrors?.email?.[0]}
//                                                     helperText={profileErrors?.email?.[0] || userErrors?.email?.[0] || ''}
//                                                 />
//                                             </div>
//
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>Role</div>
//
//                                                 <FormControl sx={{ width: '70%' }}>
//                                                     <Select
//                                                         name='role'
//                                                         value={formData.role}
//                                                         open={roleSelectOpen}
//                                                         onClick={() => setRoleSelectOpen(!roleSelectOpen)}
//                                                         IconComponent={() => (
//                                                             <div onClick={() => setRoleSelectOpen(!roleSelectOpen)} className="select-icon-background">
//                                                                 {roleSelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
//                                                             </div>
//                                                         )}
//                                                         className={'select'}
//                                                         onChange={handleChange}
//                                                         error={!!errors?.role?.[0]}
//                                                     >
//                                                         {['ADMIN', 'USER'].map((option) => (
//                                                             <MenuItem key={option} value={option}>
//                                                                 {option}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </FormControl>
//                                             </div>
//                                         </div>
//
//                                         <div className='fieldContainer2'>
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>Password</div>
//
//                                                 <RequiredTextField
//                                                   required
//                                                   name="password"
//                                                   type="password"
//                                                   value={password}
//                                                   onChange={(e) => setPassword(e.target.value)}
//                                                   style={{ width: '70%' }}
//                                                   size="small"
//                                                   placeholder="Min. 8 characters"
//                                                 />
//                                                 {userErrors?.password?.[0] && (
//                                                   <FormHelperText error>{userErrors.password[0]}</FormHelperText>
//                                                 )}
//                                             </div>
//
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>Phone Number</div>
//
//                                                 <Tooltip title="Number must starts with +91">
//                                                     <RequiredTextField
//                                                         name='phone'
//                                                         id='outlined-error-helper-text'
//                                                         value={formData.phone}
//                                                         onChange={handleChange}
//                                                         required
//                                                         style={{ width: '70%' }}
//                                                         size='small'
//                                                         error={!!profileErrors?.phone?.[0] || !!userErrors?.phone?.[0]}
//                                                         helperText={profileErrors?.phone?.[0] || userErrors?.phone?.[0] || ''}
//                                                     />
//                                                 </Tooltip>
//                                             </div>
//                                         </div>
//                                     </Box>
//                                 </AccordionDetails>
//                             </Accordion>
//                         </div>
//
//                         {/* Address Details */}
//
//                         <div className='leadContainer'>
//                             <Accordion defaultExpanded style={{ width: '98%' }}>
//                                 <AccordionSummary expandIcon={<FiChevronDown style={{ fontSize: '25px' }} />}>
//                                     <Typography className='accordion-header'>Address</Typography>
//                                 </AccordionSummary>
//
//                                 <Divider className='divider' />
//
//                                 <AccordionDetails>
//                                     <Box
//                                         sx={{ width: '98%', color: '#1A3353', mb: 1 }}
//                                         component='form'
//                                         noValidate
//                                         autoComplete='off'
//                                     >
//                                         <div className='fieldContainer'>
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>Address Lane</div>
//
//                                                 <TextField
//                                                     required
//                                                     name='address_line'
//                                                     value={formData.address_line}
//                                                     onChange={handleChange}
//                                                     style={{ width: '70%' }}
//                                                     size='small'
//                                                     error={!!profileErrors?.address_line?.[0] || !!userErrors?.address_line?.[0]}
//                                                     helperText={profileErrors?.address_line?.[0] || userErrors?.address_line?.[0] || ''}
//                                                 />
//                                             </div>
//
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>Street</div>
//
//                                                 <TextField
//                                                     required
//                                                     name='street'
//                                                     value={formData.street}
//                                                     onChange={handleChange}
//                                                     style={{ width: '70%' }}
//                                                     size='small'
//                                                     error={!!profileErrors?.street?.[0] || !!userErrors?.street?.[0]}
//                                                     helperText={profileErrors?.street?.[0] || userErrors?.street?.[0] || ''}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className='fieldContainer2'>
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>City</div>
//
//                                                 <TextField
//                                                     required
//                                                     name='city'
//                                                     value={formData.city}
//                                                     onChange={handleChange}
//                                                     style={{ width: '70%' }}
//                                                     size='small'
//                                                     error={!!profileErrors?.city?.[0] || !!userErrors?.city?.[0]}
//                                                     helperText={profileErrors?.city?.[0] || userErrors?.city?.[0] || ''}
//                                                 />
//                                             </div>
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>State</div>
//
//                                                 <TextField
//                                                     required
//                                                     name='state'
//                                                     value={formData.state}
//                                                     onChange={handleChange}
//                                                     style={{ width: '70%' }}
//                                                     size='small'
//                                                     error={!!profileErrors?.state?.[0] || !!userErrors?.state?.[0]}
//                                                     helperText={profileErrors?.state?.[0] || userErrors?.state?.[0] || ''}
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className='fieldContainer2'>
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>Pincode</div>
//
//                                                 <TextField
//                                                     required
//                                                     name='pincode'
//                                                     value={formData.pincode}
//                                                     onChange={handleChange}
//                                                     style={{ width: '70%' }}
//                                                     size='small'
//                                                     error={!!profileErrors?.pincode?.[0] || !!userErrors?.pincode?.[0]}
//                                                     helperText={profileErrors?.pincode?.[0] || userErrors?.pincode?.[0] || ''}
//                                                 />
//                                             </div>
//                                             <div className='fieldSubContainer'>
//                                                 <div className='fieldTitle'>Country</div>
//
//                                                 <FormControl sx={{ width: '70%' }}>
//                                                     <Select
//                                                         name='country'
//                                                         value={formData.country}
//                                                         open={countrySelectOpen}
//                                                         onClick={() => setCountrySelectOpen(!countrySelectOpen)}
//                                                         IconComponent={() => (
//                                                             <div onClick={() => setCountrySelectOpen(!countrySelectOpen)} className="select-icon-background">
//                                                                 {countrySelectOpen ? <FiChevronUp className='select-icon' /> : <FiChevronDown className='select-icon' />}
//                                                             </div>
//                                                         )}
//                                                         className={'select'}
//                                                         onChange={handleChange}
//                                                         error={!!profileErrors?.country?.[0]}
//                                                     >
//                                                         {state?.countries?.length && state?.countries.map((option: any) => (
//                                                             <MenuItem key={option[0]} value={option[0]}>
//                                                                 {option[1]}
//                                                             </MenuItem>
//                                                         ))}
//                                                     </Select>
//
//                                                     <FormHelperText>{profileErrors?.country?.[0] ? profileErrors?.country?.[0] : ''}</FormHelperText>
//                                                 </FormControl>
//                                             </div>
//                                         </div>
//                                     </Box>
//                                 </AccordionDetails>
//                             </Accordion>
//                         </div>
//                     </div>
//                 </form>
//             </Box>
//         </Box>
//     )
// }
