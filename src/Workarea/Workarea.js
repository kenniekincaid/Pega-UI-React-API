import React, { Component } from "react";
import { connect } from "react-redux";
import { Tab, Container, Menu, Icon } from "semantic-ui-react";

import { Dashboard } from "../Dashboard/Dashboard";
import { WorkObject } from "../WorkObject/WorkObject";
import { assignmentActions, userActions } from "../_actions";

/**
 * Component that contains CaseWorker style tabs.
 * First tab is always Dashboard.
 * Tabs can be opened / closed depending on open WorkObjects.
 */
class Workarea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0
    };
  }

  componentDidMount() {
    this.props.dispatch(userActions.getUserData());
  }

  componentWillReceiveProps(nextProps) {
    // If we have added to assignment list, then open newest assignment
    if (this.props.openAssignments.length < nextProps.openAssignments.length) {
      this.setState({ activeIndex: nextProps.openAssignments.length });
    }

    // If we have closed an assignment
    if (this.props.openAssignments.length > nextProps.openAssignments.length) {
      let activeAssignment = this.props.openAssignments[this.state.activeIndex];
      let nextIndex = nextProps.openAssignments.findIndex(
        x => x === activeAssignment
      );

      // Currently open assignment was closed, fall back one
      if (nextIndex === -1) {
        this.setState({ activeIndex: this.state.activeIndex - 1 });
      } else {
        this.setState({ activeIndex: nextIndex });
      }
    }
  }

  getPanes() {
    let panes = [
      {
        menuItem: "Dashboard",
        render: () => (
          <Tab.Pane>
            <Dashboard />
          </Tab.Pane>
        )
      }
    ];

    this.props.openAssignments.forEach(caseID => {
      if (
        (this.props.assignmentDetails[caseID] &&
          this.props.caseDetails[caseID]) ||
        this.props.pages[caseID]
      ) {
        panes.push({
          menuItem: this.getTabItem(caseID),
          render: () => (
            <Tab.Pane key={caseID}>
              <WorkObject
                assignment={this.props.assignmentDetails[caseID]}
                caseID={caseID}
                case={this.props.caseDetails[caseID]}
                page={this.props.pages[caseID]}
              />
            </Tab.Pane>
          )
        });
      } else {
        panes.push({
          menuItem: this.getTabItem(caseID, false),
          render: () => <Tab.Pane key={caseID} loading />
        });
      }
    });

    return panes;
  }

  getTabItem(id, showClose = true) {
    let objectId = id.split(" ")[1];
    if (objectId === undefined) {
      objectId = id.split("-").pop();
    }

    return (
      <Menu.Item key={id}>
        {objectId}
        {showClose && (
          <Icon
            name="window close"
            style={{ paddingLeft: "15px" }}
            onClick={e => this.closePane(id)}
          />
        )}
      </Menu.Item>
    );
  }

  closePane(id) {
    this.props.dispatch(assignmentActions.closeAssignment(id));
  }

  handleTabChange(e, data) {
    if (e.target.className !== "close icon") {
      this.setState({ activeIndex: data.activeIndex });
    }
  }

  render() {
    return (
      <div className="dashboard-container">
        <Container fluid>
          <Tab
            renderActiveOnly={true}
            panes={this.getPanes()}
            activeIndex={this.state.activeIndex}
            onTabChange={(e, data) => {
              this.handleTabChange(e, data);
            }}
          />
        </Container>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { openAssignments, assignmentDetails } = state.assignments;
  const { caseDetails, pages } = state.cases;

  return {
    openAssignments: openAssignments,
    assignmentDetails: assignmentDetails,
    caseDetails: caseDetails,
    pages: pages
  };
}

const connectedWorkarea = connect(mapStateToProps)(Workarea);
export { connectedWorkarea as Workarea };
