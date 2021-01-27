import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Tables from './views/TablesView.jsx';
import Chinese from './views/Chinese.jsx';
import Game from './views/GameView.jsx';
import Pawn from './views/PawnChooseView.jsx';
import GameView3 from './views/GameView3.jsx';
export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Chinese} />
      <Route path="/tables" component={Tables} />
      <Route path="/game" component={Game} />
      <Route path="/pawn" component={Pawn} />
      <Route path="/settings" component={GameView3} />

       <Route component={Chinese} />
      />
    </Switch>
  );
}
