import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDetailsMutation } from '../app/apiauth';

function ClientProtected({ Component }) {
  const navigate = useNavigate();
  const [fetchUserDetails] = useUserDetailsMutation();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetchUserDetails();
        const user = res?.data;

        if (!user || user.userrole !== 'subscriber') {
          navigate('/login');
        } else {
          setUserDetails(user);
        }
      } catch (err) {
        console.error('Failed to fetch user', err);
        navigate('/login');
      }
    };

    checkUser();
  }, [fetchUserDetails, navigate]);

  if (!userDetails) return null; // Or loading spinner

  return (
    <Component
      userid={userDetails.userId}
      username={userDetails.username}
      useremail={userDetails.useremail}
    />
  );
}

export default ClientProtected;
