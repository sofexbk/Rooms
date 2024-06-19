import { useAuth } from '@/Providers/AuthContext';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RedirectPageGithub { }

const RedirectPageGithub: React.FC<RedirectPageGithub> = () => {
  const { login } = useAuth();
  const [usergithubData, setUsergithubData] = useState<any>(null); // State to store the user githubData
  const navigate = useNavigate();

  const fetchUsergithubData = async () => {
    try {
      // Extract 'code' from the URL
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        const response = await fetch(`http://localhost:5020/api/githubRedirect?code=${code}`);
        const githubData = await response.json();
        

        setUsergithubData(githubData);

        // Call the external function to log user githubData
        handleUsergithubDataLog(githubData);
      } else {
        console.error('No code parameter found in the URL.');
      }
    } catch (error) {
      console.error('Error fetching user githubData:', error);
    }
  };

  const handleUsergithubDataLog = (githubData: any) => {
    if (githubData) {
      login(githubData.userDb, githubData.accessToken);
    }
    navigate('/profile');
  };

  useEffect(() => {
    // Call the API when the component mounts
    fetchUsergithubData();
  }, []); // Empty dependency array ensures the effect runs only once when the component mounts

  return (
    <>
      <div className='w-full h-full flex flex-col items-center p-32 '>
        <div className='text-3xl'>Github Redirecting ...</div>
        <img src='https://www.icegif.com/wp-content/uploads/2023/07/icegif-1262.gif' />
      </div>
    </>
  );
};

export default RedirectPageGithub;
