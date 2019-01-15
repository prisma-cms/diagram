import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";

import AddBuilding from "../Add/Building";
import gql from 'graphql-tag';

class DiagramPanel extends PrismaCmsComponent {

  // static contextType = Context;

  static propTypes = {
    diagramId: PropTypes.string.isRequired,
  }

  render() {

    const {
      Grid,
      query: {
        createDiagramNodeProcessor,
      },
    } = this.context;


    const {
      diagramId,
    } = this.props;

    return super.render(
      <Grid
        container
        spacing={8}
      >

        <Grid
          item
        >
          <AddBuilding
            inputProps={{
              label: "Название здания",
            }}
            mutate={async props => {

              const {
                variables: {
                  data: {
                    name,
                  },
                },
                ...other
              } = props

              this.mutate({
                mutation: gql(createDiagramNodeProcessor),
                variables: {
                  data: {
                    name,
                    Diagram: {
                      connect: {
                        id: diagramId
                      }
                    },
                    Building: {
                      create: {
                        name: name,
                      },
                    },
                    PortsIn: {
                      create: {
                        name: "Вход"
                      },
                    },
                    PortsOut: {
                      create: {
                        name: "Выход"
                      },
                    },
                  },
                },
                ...other,
              });

            }}
          />
        </Grid>

        <Grid
          item
        >
          <AddBuilding
            label="Добавить КПП"
            inputProps={{
              label: "Название КПП",
            }}
            mutate={async props => {

              const {
                variables: {
                  data: {
                    name,
                  },
                },
                ...other
              } = props

              this.mutate({
                mutation: gql(createDiagramNodeProcessor),
                variables: {
                  data: {
                    name,
                    Diagram: {
                      connect: {
                        id: diagramId
                      }
                    },
                    Checkpoint: {
                      create: {
                        name: name,
                        type: "People",
                      },
                    },
                    PortsIn: {
                      create: {
                        name: "Вход"
                      },
                    },
                    PortsOut: {
                      create: {
                        name: "Выход"
                      },
                    },
                  },
                },
                ...other,
              });

            }}
          />
        </Grid>

      </Grid>
    );
  }
}

export default DiagramPanel;