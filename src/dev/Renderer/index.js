import React, { Component, Fragment } from 'react';
import PropTypes from "prop-types";

import "moment/locale/ru";

import App, {
  ContextProvider,
  SubscriptionProvider,

  Diagrams,
  Diagram,
} from "../../App";

import { Renderer as PrismaCmsRenderer } from '@prisma-cms/front'

import { withStyles } from 'material-ui';


const styles = theme => {

  return {
    root: {
      // border: "1px solid",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      
      "& #Renderer--body": {
        flex: 1,
        // border: "1px solid blue",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        flexBasis: "100%",
      },
    },
  };

}

class DevRenderer extends PrismaCmsRenderer {


  static propTypes = {
    ...PrismaCmsRenderer.propTypes,
    pure: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...PrismaCmsRenderer.defaultProps,
    pure: false,
  }


  getRoutes() {

    let routes = super.getRoutes();

    return [
      {
        exact: true,
        path: "/",
        component: App,
      },
      {
        exact: true,
        path: "/diagrams",
        component: Diagrams,
      },
      {
        exact: true,
        path: "/diagrams/:id",
        render: props => {

          const {
            match: {
              params: {
                id,
              },
            },
          } = props;

          return <Diagram
            key={id}
            where={{
              id,
            }}
            {...props}
          />
        },
      },
      // {
      //   path: "*",
      //   render: props => this.renderOtherPages(props),
      // },
    ].concat(routes);

  }


  renderWrapper() {

    return <ContextProvider>
      <SubscriptionProvider>
        {super.renderWrapper()}
      </SubscriptionProvider>
    </ContextProvider>;

  }


  render() {

    const {
      pure,
      classes,
      ...other
    } = this.props;

    return <Fragment>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body, #root {
              height: 100%;
            }
          `,
        }}
      />
      <div
        className={classes.root}
      >
        {pure ? <App
          {...other}
        /> : super.render()}
      </div>
    </Fragment>;

  }

}

export default withStyles(styles)(props => <DevRenderer
  {...props}
/>);