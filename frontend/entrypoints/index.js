import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';

import { Button } from 'react-toolbox/lib/button';

import Layout from '@layouts';

import Entry from '@routes/Entry';
import Home from '@routes/Home';
import About from '@routes/About';

const App = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Route path="/" exact component={Entry} />
        <Route path="/home" exact component={Home} />
        <Route path="/about" exact component={About} />
      </Layout>
    </BrowserRouter>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));