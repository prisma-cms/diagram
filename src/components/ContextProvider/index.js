
import React, {
  Component,
} from 'react';


import Context from '@prisma-cms/context';

import * as UI from "../ui";

class ContextProvider extends Component {

  static contextType = Context;

 

  render() {

    const {
      children,
    } = this.props;

    let {
      query,
    } = this.context;

    Object.assign(this.context, {
      query: {
        ...query,
        ...this.prepareQuery(),
      },
      ...UI,
    });

    return <Context.Provider
      value={this.context}
    >
      {children || null}
    </Context.Provider>;

  }


  prepareQuery() {


    return {
      ...this.prepareDiagramQuery(),
      ...this.prepareDiagramLinkQuery(),
      ...this.prepareDiagramNodeQuery(),
    }

  }


  prepareDiagramQuery() {
    const {
      queryFragments,
    } = this.context;


    const {
      DiagramNoNestingFragment,
      UserNoNestingFragment,
      DiagramNodeNoNestingFragment,
      DiagramPortInNoNestingFragment,
      DiagramPortOutNoNestingFragment,
      DiagramLinkNoNestingFragment,
      BuildingNoNestingFragment,
      CheckpointNoNestingFragment,
      ParkingNoNestingFragment,
    } = queryFragments;


    const diagramFragment = `
      fragment diagram on Diagram {
        ...DiagramNoNesting
        CreatedBy{
          ...UserNoNesting
        }
        Nodes{
          ...DiagramNodeNoNesting
          CreatedBy{
            ...UserNoNesting
          }
          PortsIn{
            ...DiagramPortInNoNesting
          }
          PortsOut{
            ...DiagramPortOutNoNesting
            Links{
              ...DiagramLinkNoNesting
              PortIn{
                ...DiagramPortInNoNesting
              }
            }
          }
          Building{
            ...BuildingNoNesting
          }
          Checkpoint{
            ...CheckpointNoNesting
          }
          Parking{
            ...ParkingNoNesting
          }
        }
      }

      ${DiagramNoNestingFragment}
      ${UserNoNestingFragment}
      ${DiagramNodeNoNestingFragment}
      ${DiagramPortInNoNestingFragment}
      ${DiagramPortOutNoNestingFragment}
      ${DiagramLinkNoNestingFragment}
      ${BuildingNoNestingFragment}
      ${CheckpointNoNestingFragment}
      ${ParkingNoNestingFragment}
    `;


    const diagramsConnection = `
      query diagramsConnection (
        $where: DiagramWhereInput
        $orderBy: DiagramOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objectsConnection: diagramsConnection (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          aggregate{
            count
          }
          edges{
            node{
              ...diagram
            }
          }
        }
      }

      ${diagramFragment}
    `;


    const diagrams = `
      query diagrams (
        $where: DiagramWhereInput
        $orderBy: DiagramOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objects: diagrams (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          ...diagram
        }
      }

      ${diagramFragment}
    `;


    const diagram = `
      query diagram (
        $where: DiagramWhereUniqueInput!
      ){
        object: diagram(
          where: $where
        ){
          ...diagram
        }
      }

      ${diagramFragment}
    `;


    const createDiagramProcessor = `
      mutation createDiagramProcessor(
        $data: DiagramCreateInput!
      ) {
        response: createDiagramProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...diagram
          }
        }
      }

      ${diagramFragment}
    `;


    const updateDiagramProcessor = `
      mutation updateDiagramProcessor(
        $data: DiagramUpdateInput!
        $where: DiagramWhereUniqueInput!
      ) {
        response: updateDiagramProcessor(
          data: $data
          where: $where
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...diagram
          }
        }
      }

      ${diagramFragment}
    `;


    const inviteDiagramProcessor = `
      mutation inviteDiagramProcessor(
        $data: DiagramInviteInput!
        $where: DiagramWhereUniqueInput!
      ){
        inviteDiagramProcessor(
          data: $data
          where: $where
        ) 
      }
    `;


    const leaveDiagram = `
      mutation leaveDiagram(
        $where: DiagramWhereUniqueInput!
      ){
        leaveDiagram(
          where: $where
        ){
          ...diagram
        }
      }
      ${diagramFragment}
    `;


    const joinDiagram = `
      mutation joinDiagram(
        $where: DiagramWhereUniqueInput!
      ){
        joinDiagram (
          where: $where
        ){
          ...diagram
        }
      }
      ${diagramFragment}
    `;

    return {
      diagramsConnection,
      diagrams,
      diagram,
      createDiagramProcessor,
      updateDiagramProcessor,
      inviteDiagramProcessor,
      leaveDiagram,
      joinDiagram,
    }
  }


  prepareDiagramNodeQuery() {
    const {
      queryFragments,
    } = this.context;


    const {
      DiagramNodeNoNestingFragment,
      UserNoNestingFragment,
    } = queryFragments;


    const diagramNodeFragment = `
      fragment diagramNode on DiagramNode {
        ...DiagramNodeNoNesting
        CreatedBy{
          ...UserNoNesting
        }
      }

      ${DiagramNodeNoNestingFragment}
      ${UserNoNestingFragment}
    `;


    const diagramNodesConnection = `
      query diagramNodesConnection (
        $where: DiagramNodeWhereInput
        $orderBy: DiagramNodeOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objectsConnection: diagramNodesConnection (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          aggregate{
            count
          }
          edges{
            node{
              ...diagramNode
            }
          }
        }
      }

      ${diagramNodeFragment}
    `;


    const diagramNodes = `
      query diagramNodes (
        $where: DiagramNodeWhereInput
        $orderBy: DiagramNodeOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objects: diagramNodes (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          ...diagramNode
        }
      }

      ${diagramNodeFragment}
    `;


    const diagramNode = `
      query diagramNode (
        $where: DiagramNodeWhereUniqueInput!
      ){
        object: diagramNode(
          where: $where
        ){
          ...diagramNode
        }
      }

      ${diagramNodeFragment}
    `;


    const createDiagramNodeProcessor = `
      mutation createDiagramNodeProcessor(
        $data: DiagramNodeCreateInput!
      ) {
        response: createDiagramNodeProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...diagramNode
          }
        }
      }

      ${diagramNodeFragment}
    `;


    const updateDiagramNodeProcessor = `
      mutation updateDiagramNodeProcessor(
        $data: DiagramNodeUpdateInput!
        $where: DiagramNodeWhereUniqueInput!
      ) {
        response: updateDiagramNodeProcessor(
          data: $data
          where: $where
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...diagramNode
          }
        }
      }

      ${diagramNodeFragment}
    `;


    const inviteDiagramNodeProcessor = `
      mutation inviteDiagramNodeProcessor(
        $data: DiagramNodeInviteInput!
        $where: DiagramNodeWhereUniqueInput!
      ){
        inviteDiagramNodeProcessor(
          data: $data
          where: $where
        ) 
      }
    `;


    const leaveDiagramNode = `
      mutation leaveDiagramNode(
        $where: DiagramNodeWhereUniqueInput!
      ){
        leaveDiagramNode(
          where: $where
        ){
          ...diagramNode
        }
      }
      ${diagramNodeFragment}
    `;


    const joinDiagramNode = `
      mutation joinDiagramNode(
        $where: DiagramNodeWhereUniqueInput!
      ){
        joinDiagramNode (
          where: $where
        ){
          ...diagramNode
        }
      }
      ${diagramNodeFragment}
    `;

    return {
      diagramNodesConnection,
      diagramNodes,
      diagramNode,
      createDiagramNodeProcessor,
      updateDiagramNodeProcessor,
      inviteDiagramNodeProcessor,
      leaveDiagramNode,
      joinDiagramNode,
    }
  }


  prepareDiagramLinkQuery() {
    const {
      queryFragments,
    } = this.context;


    const {
      DiagramLinkNoNestingFragment,
      UserNoNestingFragment,
    } = queryFragments;


    const diagramLinkFragment = `
      fragment diagramLink on DiagramLink {
        ...DiagramLinkNoNesting
        CreatedBy{
          ...UserNoNesting
        }
      }

      ${DiagramLinkNoNestingFragment}
      ${UserNoNestingFragment}
    `;


    const diagramLinksConnection = `
      query diagramLinksConnection (
        $where: DiagramLinkWhereInput
        $orderBy: DiagramLinkOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objectsConnection: diagramLinksConnection (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          aggregate{
            count
          }
          edges{
            node{
              ...diagramLink
            }
          }
        }
      }

      ${diagramLinkFragment}
    `;


    const diagramLinks = `
      query diagramLinks (
        $where: DiagramLinkWhereInput
        $orderBy: DiagramLinkOrderByInput
        $skip: Int
        $after: String
        $before: String
        $first: Int
        $last: Int
      ){
        objects: diagramLinks (
          where: $where
          orderBy: $orderBy
          skip: $skip
          after: $after
          before: $before
          first: $first
          last: $last
        ){
          ...diagramLink
        }
      }

      ${diagramLinkFragment}
    `;


    const diagramLink = `
      query diagramLink (
        $where: DiagramLinkWhereUniqueInput!
      ){
        object: diagramLink(
          where: $where
        ){
          ...diagramLink
        }
      }

      ${diagramLinkFragment}
    `;


    const createDiagramLinkProcessor = `
      mutation createDiagramLinkProcessor(
        $data: DiagramLinkCreateInput!
      ) {
        response: createDiagramLinkProcessor(
          data: $data
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...diagramLink
          }
        }
      }

      ${diagramLinkFragment}
    `;


    const updateDiagramLinkProcessor = `
      mutation updateDiagramLinkProcessor(
        $data: DiagramLinkUpdateInput!
        $where: DiagramLinkWhereUniqueInput!
      ) {
        response: updateDiagramLinkProcessor(
          data: $data
          where: $where
        ){
          success
          message
          errors{
            key
            message
          }
          data{
            ...diagramLink
          }
        }
      }

      ${diagramLinkFragment}
    `;


    const inviteDiagramLinkProcessor = `
      mutation inviteDiagramLinkProcessor(
        $data: DiagramLinkInviteInput!
        $where: DiagramLinkWhereUniqueInput!
      ){
        inviteDiagramLinkProcessor(
          data: $data
          where: $where
        ) 
      }
    `;


    const leaveDiagramLink = `
      mutation leaveDiagramLink(
        $where: DiagramLinkWhereUniqueInput!
      ){
        leaveDiagramLink(
          where: $where
        ){
          ...diagramLink
        }
      }
      ${diagramLinkFragment}
    `;


    const joinDiagramLink = `
      mutation joinDiagramLink(
        $where: DiagramLinkWhereUniqueInput!
      ){
        joinDiagramLink (
          where: $where
        ){
          ...diagramLink
        }
      }
      ${diagramLinkFragment}
    `;

    return {
      diagramLinksConnection,
      diagramLinks,
      diagramLink,
      createDiagramLinkProcessor,
      updateDiagramLinkProcessor,
      inviteDiagramLinkProcessor,
      leaveDiagramLink,
      joinDiagramLink,
    }
  }


}

export default ContextProvider;