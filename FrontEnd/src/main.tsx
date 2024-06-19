import store from '@/Store/Store.ts';
import { Toaster } from "@/components/ui/toaster";
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import './index.css';
import "./i18n";


ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <Provider store={store}>
    <App />
    <Toaster />
  </Provider>
    ,
)
