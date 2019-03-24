import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import PlayGround from './PlayGround';
import About from '@routes/About';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Route path="/" exact component={PlayGround} />
        <Route path="/about/" component={About} />
      </div>
    </BrowserRouter>
  )
};

ReactDOM.render(<App />, document.getElementById('app'));