import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// import {
//   styles,
//   TableView,
// } from '../../../../view/List';

import { withStyles } from 'material-ui/styles';


import Diagram from "../Object";
import gql from 'graphql-tag';

import {
  styles,
  TableView,
} from '../../../../view/List';

class DiagramsListView extends TableView {


  static defaultProps = {
    ...TableView.defaultProps,
    title: "Диаграмы",
  };


  // getColumns() {

  //   const {
  //     DiagramLink,
  //     ChatRoomLink,
  //     UserLink,
  //     Grid,
  //   } = this.context;

  //   return [
  //     // {
  //     //   id: "id",
  //     // },
  //     {
  //       id: "id",
  //       label: "ID сообщения",
  //       renderer: (value, record) => {

  //         return record ? <DiagramLink
  //           object={record}
  //         /> : null;
  //       },
  //     },
  //     {
  //       id: "Room",
  //       label: "Название комнаты",
  //       renderer: (value, record) => {

  //         return value ? <ChatRoomLink
  //           object={value}
  //         /> : null;
  //       },
  //     },
  //     {
  //       id: "CreatedBy",
  //       label: "Автор сообщения",
  //       renderer: (value) => {

  //         return value ? <UserLink
  //           user={value}
  //         /> : null;
  //       },
  //     },
  //   ]

  // }

  renderContent() {

    const {
      data: {
        loading,
        objectsConnection,
      },
      classes,
    } = this.props;

    const {
      Grid,
      query: {
        updateDiagramProcessor,
      },
    } = this.context;


    let diagrams = objectsConnection && objectsConnection.edges.map(({ node }) => node) || [];


    let diagramsList = <Grid
      container
    >
      {diagrams.map(n => {

        return <Grid
          key={n.id}
          item
          xs={12}
        >
          <Diagram
            data={{
              object: n,
            }}
            mutate={props => {

              return this.mutate({
                mutation: gql(updateDiagramProcessor),
                ...props
              });
            }}
          />
        </Grid>

      })}
    </Grid>

    return <div
      className={classes.root}
    >
      {diagramsList}
    </div>;

  }

}


export default withStyles(styles)(props => <DiagramsListView
  {...props}
/>);