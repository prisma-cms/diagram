
/**
 * Структура заведений, КПП, автоплощадок
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import View from "./View";
import { withStyles } from 'material-ui';

import Context from "@prisma-cms/context";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


export const styles = theme => {

  return {

    root: {
      // border: "1px solid",
      height: "100%",

      "& .srd-diagram": {
        height: "100%",
      },
    },
  };
}

export class StructurePage extends Component {

  static propTypes = {
  };

  static defaultProps = {
    View,
  }

  static contextType = Context;


  state = {
    object: {
      name: "Новая диаграма",
    },
  }


  componentWillMount() {

    if (!this.Renderer) {

      const {
        query: {
          updateDiagramProcessor,
        },
      } = this.context;

      this.Renderer = graphql(gql(updateDiagramProcessor))(View);

      // this.Renderer = View;

    }

    super.componentWillMount && super.componentWillMount();
  }

  render() {

    const {
      classes,
      View,
      ...other
    } = this.props;

    const {
      object,
    } = this.state;

    const {
      Renderer,
    } = this;

    return (
      <div
        className={classes.root}
      >
        <Renderer
          {...other}
          data={{
            object,
          }}
          // mutate={async () => {
          //   console.error("mutate");
          // }}
        />
      </div>
    );
  }
}


export default withStyles(styles)(props => <StructurePage
  {...props}
/>);