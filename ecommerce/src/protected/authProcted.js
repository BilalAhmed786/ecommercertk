import { useEffect } from 'react';
import { useUserDetailsMutation } from '../app/apiauth';
import { useNavigate } from 'react-router-dom';

const AuthProtected = ({ Component }) => {
  const [fetchUserDetails, { isLoading }] = useUserDetailsMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetchUserDetails();

        if (res?.data) {
          navigate('/');
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkUser();
  }, [fetchUserDetails, navigate]);

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  return <Component />;
};

export default AuthProtected;