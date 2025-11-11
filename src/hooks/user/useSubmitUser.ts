import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../components/FetchData';
import { UsersUrl } from '../../services/ApiUrls';
import { UserFormData } from './useUserFormData';

export const useSubmitUser = (resetForm: () => void) => {
  const navigate = useNavigate();

  const submitForm = async (formData: UserFormData, password: string) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('Token'),
      org: localStorage.getItem('org'),
    };

    const data = {
      ...formData,
      ...(password?.trim() && { password: password.trim() }),
    };

    try {
      const res = await fetchData(`${UsersUrl}/`, 'POST', JSON.stringify(data), Header);
      if (!res.error) {
        resetForm();
        navigate('/app/users');
      } else {
        return res.errors;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return { submitForm };
};