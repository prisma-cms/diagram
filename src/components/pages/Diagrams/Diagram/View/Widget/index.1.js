import {
  DiagramEngine,
  DiagramModel as DiagramModelBase,
  DefaultNodeModel,
  LinkModel,
  DiagramWidget,
  DefaultLinkModel,
  NodeModel,
} from "storm-react-diagrams";
import * as React from "react";


class DiagramModel extends DiagramModelBase {

  constructor(props) {

    super(props);

    // this.links = {};
    // this.nodes = {};

    // this.offsetX = -100;
    // this.offsetY = 100;
    // this.zoom = 50;
    // this.rendered = false;
    // this.gridSize = 0;
    // console.log("DiagramModel props", props);
    Object.assign(this, { ...props });
  }

}


export default (props) => {

  const {
    id,
    offsetX,
    offsetY,
    zoom,
    gridSize,
    linksUpdated,
    offsetUpdated,
    zoomUpdated,
    actionStillFiring,
    ...other
  } = props;

  //1) setup the diagram engine
  var engine = new DiagramEngine({
  });
  engine.installDefaultFactories();

  //2) setup the diagram model
  var model = new DiagramModel({
    offsetX,
    offsetY,
    gridSize,
    zoom,
  });

  if (id) {
    model.id = id;
  }

  console.log("DiagramModel props", props);

  console.log("DiagramModel", model);

  model.addListener({
    // // linksUpdated:   this.onUpdateLinks.bind(this),
    // // offsetUpdated:  _.debounce(this.updateOffset.bind(this),500),
    // // zoomUpdated:    this.updateZoom.bind(this),
    // linksUpdated: data => console.log("linksUpdated", data),
    // offsetUpdated: data => console.log("offsetUpdated", data),
    // zoomUpdated: data => console.log("zoomUpdated", data),
    // // offsetUpdated: canEdit ? data => this.onOffsetUpdated(data) : undefined,
    // // offsetUpdated: data => console.log("offsetUpdated", data),
    // // zoomUpdated: canEdit ? data => this.onZoomUpdated(data) : undefined,
    // // zoomUpdated: data => this.onZoomUpdated(data),
    // // zoomUpdated: data => this.onZoomUpdated({
    // //   zoom: 95,
    // // }),
    // actionStillFiring: (a) => console.log(a),

    linksUpdated,
    offsetUpdated,
    zoomUpdated,
    actionStillFiring,
  });

  //3-A) create a default node
  var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)");
  node1.id = "ffffffff";

  console.log("node1", node1);

  let port1 = node1.addOutPort("Out");
  node1.setPosition(100, 100);

  //3-B) create another default node
  var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
  node2.id = "aaaaaaaaaaaa";
  let port2 = node2.addInPort("In");
  node2.setPosition(400, 100);

  // link the ports
  let link1 = port1.link(port2);
  link1.addLabel("Hello World!");

  //4) add the models to the root graph
  const models = model.addAll(node1, node2, link1);

	// add a selection listener to each
	models.forEach(item => {
		item.addListener({
			// selectionChanged: action("selectionChanged")
			selectionChanged: console.log,
		});
	});

  //5) load model into engine
  engine.setDiagramModel(model);

  //6) render the diagram!
  return <DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />;
};