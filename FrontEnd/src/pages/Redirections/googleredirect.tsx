import { useAuth } from '@/Providers/AuthContext';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface RedirectPageGoogleProps { }

const RedirectPageGoogle: React.FC<RedirectPageGoogleProps> = () => {
  const { login } = useAuth();
  const [usergoogleData, setUsergoogleData] = useState<any>(null); // State to store the user googleData
  const navigate = useNavigate();

  const fetchUsergoogleData = async () => {
    try {
      // Extract 'code' from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        const response = await fetch(`http://localhost:5020/api/googleRedirect?code=${code}`);
        const googleData = await response.json();


        // Update the state with the user googleData
        setUsergoogleData(googleData);

        // Call the external function to log user googleData
        handleUsergoogleDataLog(googleData);
      } else {
        console.error('No code parameter found in the URL.');
      }
    } catch (error) {
      console.error('Error fetching user googleData:', error);
    }
  };

  const handleUsergoogleDataLog = (googleData: any) => {
    if (googleData) {
      login(googleData.userDb, googleData.accessToken);
    }
    navigate('/profile');
  };

  useEffect(() => {
    // Call the API when the component mounts
    fetchUsergoogleData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <>

      <div className='w-full h-full flex flex-col items-center p-32 '>
        <div className='text-3xl'>Google Redirecting ...</div>
        <img src='https://www.icegif.com/wp-content/uploads/2023/07/icegif-1262.gif' />
      </div>

    </>
  );
};

export default RedirectPageGoogle;
