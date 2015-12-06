import React from 'react';
import ReactDOM from 'react-dom';
import DemoApp from './DemoApp';

import 'expose?Perf!react-addons-perf';

ReactDOM.render(
  <DemoApp />,
  document.getElementById('root')
);
