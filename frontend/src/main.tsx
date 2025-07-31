import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from 'ic-use-internet-identity';
import { ToastProvider } from './contexts/ToastContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
        <InternetIdentityProvider>
            <ToastProvider>
                <App />
            </ToastProvider>
        </InternetIdentityProvider>
    </QueryClientProvider>
);
