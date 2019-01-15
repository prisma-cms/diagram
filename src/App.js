import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./styles/less/styles.css";

import "storm-react-diagrams/dist/style.min.css";

import Context from '@prisma-cms/context';

import SubscriptionProvider from "./components/SubscriptionProvider";
import ContextProvider from "./components/ContextProvider";

import Diagrams from "./components/pages/Diagrams";
import Diagram from "./components/pages/Diagrams/Diagram";


export {
  ContextProvider,
  SubscriptionProvider,

  Diagrams,
  Diagram,
}

class App extends Component {

  static contextType = Context;

  render() {
    return (
      <Diagrams />
    );
  }
}

export default App;