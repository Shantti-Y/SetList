import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import Entry from '@routes/Entry';
import Home from '@routes/Home';
import About from '@routes/About';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Route path="/" exact component={Entry} />
        <Route path="/home" exact component={Home} />
        <Route path="/about" exact component={About} />
      </div>
    </BrowserRouter>
  )
};

ReactDOM.render(<App />, document.getElementById('app'));