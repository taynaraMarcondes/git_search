import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './components/App';
import { QueryClientProvider, QueryClient } from 'react-query';
import './assets/css/index.css';

const queryClient = new QueryClient()
const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>);
