import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserDetailsMutation } from '../app/apiauth';

function Protected({ Component }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userdetails, setUserdetails] = useState(null);
  const [fetchUserDetails] = useUserDetailsMutation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetchUserDetails();

        const user = res?.data;

        if (!user || user.userrole !== 'admin') {
          navigate('/login');
        } else {
          setUserdetails(user);
        }
      } catch (error) {
        console.error('Error verifying user:', error);
        navigate('/login');
      }
    };

    checkUser();
  }, [navigate, fetchUserDetails]);

  if (!userdetails) {
    return <div>...loading</div>
  }

  return <Component user={userdetails} id={id} />;
}

export default Protected;
