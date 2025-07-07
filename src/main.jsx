import { StrictMode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App.jsx';
import QueryProvider from './QueryProvider.jsx';
import './index.css';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';

import './assets/scss/theme.scss';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Provider store={store}>
        <QueryProvider>
          <App />
        </QueryProvider>
      </Provider>
    </DndProvider>
  </StrictMode>
);
