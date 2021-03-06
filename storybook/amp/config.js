import React from 'react';
import { ThemeProvider } from 'styled-components';
import { addDecorator, configure } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { withKnobs } from '@storybook/addon-knobs';
import centered from '@storybook/addon-centered';
import theme, { injectBaseStyles } from '../../src/theme';

setOptions({
  name: 'Leaf-UI',
  url: 'https://github.com/treebohotels/leaf-ui',
  addonPanelInRight: true,
});

addDecorator(withKnobs);

addDecorator((story) => {
  injectBaseStyles(theme);
  return (
    <ThemeProvider theme={theme}>
      {story()}
    </ThemeProvider>
  );
});

addDecorator(centered);

configure(() => {
  const req = require.context('../../src', true, /\/amp\/.*\.story.js$/);
  req.keys().forEach((filename) => req(filename));
}, module);
