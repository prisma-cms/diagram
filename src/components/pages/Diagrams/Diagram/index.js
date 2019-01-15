import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import View from "./View";

import ObjectPage from "../../Object";


class Diagram extends ObjectPage {


  static propTypes = {
    ...ObjectPage.propTypes,
    View: PropTypes.func.isRequired,
  };


  static defaultProps = {
    ...ObjectPage.defaultProps,
    View,
    // first: 10,
  } 


  // constructor(props) {

  //   console.log("Diagrams constructor");

  //   super(props)

  // }


  componentWillMount() {

    const {
      query: {
        diagram,
        updateDiagramProcessor,
      },
    } = this.context;

    this.Renderer = compose(
      graphql(gql(diagram)),
      graphql(gql(updateDiagramProcessor)),
    )(View);

  }


  render() {

    const {
      Renderer,
    } = this;

    const {
      View,
      ...other
    } = this.props;

    return <Renderer
      {...other}
    />
  }
}


export default Diagram; 