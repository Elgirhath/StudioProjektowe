import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Tables from './views/TablesView.jsx';
import Statki from './views/Statki.jsx';
import Game from './views/GameView.jsx' 
export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Statki} />
      <Route path="/tables" component={Tables} />
      <Route path="/game" component={Game} />

       <Route component={Statki} />
      />
    </Switch>
  );
}