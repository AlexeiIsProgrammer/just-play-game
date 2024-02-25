import ReactDOM from 'react-dom/client';
import App from './app/App.tsx';
import './index.css';
import theme from './theme.ts';
import { ChakraBaseProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { store } from './redux/index.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <Provider store={store}>
    <ChakraBaseProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </ChakraBaseProvider>
  </Provider>
  //</React.StrictMode>
);
