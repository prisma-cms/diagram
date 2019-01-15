
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import gql from "graphql-tag";

import Context from '@prisma-cms/context';

export default class SubscriptionProvider extends Component {


  static contextType = Context;


  state = {
    subscriptions: [],
  }


  componentDidMount() {

    this.subscribe();

  }

  componentWillUnmount() {

    this.unsubscribe();

  }


  async subscribe() {

    const {
      client,
    } = this.context;


    if(!client){
      console.error("client is empty");
      return;
    }

    await this.unsubscribe();


    let {
      subscriptions,
    } = this.state;


    const subscribeDiagram = gql`
      subscription diagram{
        diagram{
          mutation
          node{
            id
          }
        }
      }
    `;

    const diagramSub = await client
      .subscribe({
        query: subscribeDiagram,
        variables: {
        },
      })
      .subscribe({
        next: async (data) => {

          await this.reloadData();

        },
        error(error) {
          console.error('subscribeCalls callback with error: ', error)
        },
      });

      subscriptions.push(diagramSub);



    const subscribeDiagramNode = gql`
      subscription diagramNode{
        diagramNode{
          mutation
          node{
            id
          }
        }
      }
    `;

    const diagramNodeSub = await client
      .subscribe({
        query: subscribeDiagramNode,
        variables: {
        },
      })
      .subscribe({
        next: async (data) => {

          await this.reloadData();

        },
        error(error) {
          console.error('subscribeCalls callback with error: ', error)
        },
      });

      subscriptions.push(diagramNodeSub);


    const subscribeDiagramLink = gql`
      subscription diagramLink{
        diagramLink{
          mutation
          node{
            id
          }
        }
      }
    `;

    const diagramLinkSub = await client
      .subscribe({
        query: subscribeDiagramLink,
        variables: {
        },
      })
      .subscribe({
        next: async (data) => {

          await this.reloadData();

        },
        error(error) {
          console.error('subscribeCalls callback with error: ', error)
        },
      });

      subscriptions.push(diagramLinkSub);



    this.setState({
      subscriptions,
    });

  }


  unsubscribe() {


    return new Promise((resolve) => {

      const {
        subscriptions,
      } = this.state;

      if (subscriptions && subscriptions.length) {


        subscriptions.map(n => {
          n.unsubscribe();
        });

        Object.assign(this.state, {
          subscriptions: [],
        });

      }

      resolve();

    });

  }


  async reloadData() {

    const {
      client,
      loadApiData,
    } = this.context;

    await loadApiData();

    await client.reFetchObservableQueries();

  }


  render() {

    const {
      children,
      diagram,
      client,
      loadApiData,
      ...other
    } = this.props;

    return children ? <children.type
      {...children.props}
      {...other}
    /> : null;

  }

}