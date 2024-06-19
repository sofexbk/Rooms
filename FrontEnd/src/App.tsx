import { AuthProvider } from '@/Providers/AuthContext';
import "./i18n";
import { DM_SocketsProvider } from '@/Providers/DM_SocketsContext';
import DM from "@/pages/DM/dm";
import Settings from '@/pages/Settings/settings';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { ColorProvider } from './components/ui/color-provider';
import Login from './pages/Authentification/login';
import Signup from './pages/Authentification/signup';
import Profile from './pages/Profile/profile';
import Landing from './pages/Landing/Landing';
import RedirectPageGithub from './pages/Redirections/githubredirect';
import RedirectPageGoogle from './pages/Redirections/googleredirect';
import Rooms from '@/pages/Rooms/rooms';
import SettingsAccountPage from './pages/Settings/forms/account/page';
import SettingsAppearancePage from './pages/Settings/forms/appearance/page';
import SettingsDisplayPage from './pages/Settings/forms/display/page';
import SettingsNotificationsPage from './pages/Settings/forms/notifications/page';
import SettingsProfilePage from './pages/Settings/forms/profile/page';
import Test from './pages/Test/test';
import { RoomsProvider } from './Providers/RoomsContext';
import { Rooms_SocketsProvider } from './Providers/Rooms_SocketsContext';
import { LanguageChanger } from './components/shared/LanguageChanger';


const router = createBrowserRouter(
  createRoutesFromElements(
    <>

      <Route path="/">
        <Route path="" element={<Landing />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="/rooms/:idRoom" element={<Rooms />} />
        <Route path="direct" element={<DM />} />
        <Route path="/direct/:idContact" element={<DM />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/githubredirect" element={<RedirectPageGithub />} />
        <Route path="/googleredirect" element={<RedirectPageGoogle />} />
        <Route path="test" element={<Test />} />
      </Route>


      <Route path="/settings">
        <Route path="profile" element={<Settings children={<SettingsProfilePage />} />} />
        <Route path="account" element={<Settings children={<SettingsAccountPage />} />} />
        <Route path="appearance" element={<Settings children={<SettingsAppearancePage />} />} />
        <Route path="notifications" element={<Settings children={<SettingsNotificationsPage />} />} />
        <Route path="display" element={<Settings children={<SettingsDisplayPage />} />} />
      </Route>


    </>
  )
)

function App() {

  return (
    <>
      <AuthProvider>
        <RoomsProvider>
          <DM_SocketsProvider>
            <Rooms_SocketsProvider>
              <RouterProvider router={router} />
              <ColorProvider defaultTheme="violetLight" storageKey="vite-ui-theme" children={undefined} ></ColorProvider>
            </Rooms_SocketsProvider>
          </DM_SocketsProvider >
        </RoomsProvider>
      </AuthProvider >
    </>
  );
}

export default App;
