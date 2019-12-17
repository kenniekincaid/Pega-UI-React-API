import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Header,
  Segment,
  Table,
  Pagination,
  Dropdown
} from "semantic-ui-react";

import { caseActions, workQueueActions } from "../_actions";
import { assignmentActions } from "../_actions";

/**
 * React component to show WorkLists and WorkQueues
 */
class Worklist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: {
        Worklist: 1
      },
      current: "Worklist",
      loading: false
    };
  }

  componentDidMount() {
    this.props.dispatch(workQueueActions.getWorkList());
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.current !== nextState.current) {
      if (nextState.current !== "Worklist") {
        this.setState({ loading: true });
        this.props
          .dispatch(workQueueActions.getWorkQueue(nextState.current))
          .then(() => this.setState({ loading: false }));
      }
    }
  }

  openAssignment(id, caseID) {
    this.props.dispatch(assignmentActions.addOpenAssignment(caseID));
    this.props.dispatch(assignmentActions.getAssignment(id));
    this.props.dispatch(caseActions.getCase(caseID));
  }

  getTableRows(startIndex, endIndex) {
    const targetList =
      this.state.current === "Worklist"
        ? this.props.workList
        : this.props.workQueues[this.state.current];

    if (targetList && targetList.length > 0) {
      return targetList.slice(startIndex, endIndex).map(entry => {
        return (
          <Table.Row
            onClick={e =>
              this.openAssignment(entry.pzInsKey, entry.pxRefObjectKey)
            }
            key={entry.pxRefObjectKey}
          >
            <Table.Cell>{entry.pxRefObjectInsName}</Table.Cell>
            <Table.Cell>{entry.pyAssignmentStatus}</Table.Cell>
            <Table.Cell>{entry.pyLabel}</Table.Cell>
            <Table.Cell>{entry.pxUrgencyAssign}</Table.Cell>
          </Table.Row>
        );
      });
    }

    // No entries found for current workbasket, this is to demonstrate no rows
    return (
      <Table.Row>
        <Table.Cell>---</Table.Cell>
        <Table.Cell />
        <Table.Cell />
      </Table.Row>
    );
  }

  getTotalPagesForCurrent(pageSize) {
    let count = 0;

    if (this.state.current === "Worklist") {
      count = this.props.workList.length;
    }

    if (this.props.workQueues[this.state.current]) {
      count = this.props.workQueues[this.state.current].length;
    }

    return Math.ceil(count / pageSize);
  }

  getWorkItemTableFromAssignments() {
    const { pages, current } = this.state;
    const activePage = pages[current] ? pages[current] : 1;
    const pageSize = 10;
    const endIndex = activePage * pageSize;
    const startIndex = endIndex - pageSize;
    const totalPages = this.getTotalPagesForCurrent(pageSize);

    return (
      <div>
        <Table celled sortable striped selectable compact color="blue">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Case</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Category</Table.HeaderCell>
              <Table.HeaderCell>Urgency</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>{this.getTableRows(startIndex, endIndex)}</Table.Body>
        </Table>
        <Pagination
          activePage={activePage}
          totalPages={totalPages}
          onPageChange={(e, data) => this.changePage(e, data)}
        />
      </div>
    );
  }

  changePage(e, data) {
    this.setState({
      pages: {
        ...this.state.pages,
        [this.state.current]: data.activePage
      }
    });
  }

  changeBasket(workbasket) {
    this.setState({
      current: workbasket
    });
  }

  getHeaderContent() {
    if (this.props.workBaskets.length === 0) {
      return <Header.Content>Worklist</Header.Content>;
    }

    let workBaskets = this.props.workBaskets.slice(0);
    workBaskets.unshift("Worklist");

    return (
      <Dropdown
        text={
          this.state.current === "Worklist"
            ? this.state.current
            : "Workqueue for " + this.state.current
        }
      >
        <Dropdown.Menu>
          {workBaskets.map((wb, index) => {
            if (wb !== "") {
              return (
                <Dropdown.Item
                  key={wb}
                  text={wb}
                  onClick={() => this.changeBasket(wb)}
                />
              );
            } else {
              return null;
            }
          })}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  render() {
    return (
      <Segment.Group piled>
        <Segment>
          <Header as="h3" textAlign="center">
            {this.getHeaderContent()}
          </Header>
        </Segment>
        <Segment loading={this.props.loading || this.state.loading}>
          {this.getWorkItemTableFromAssignments()}
        </Segment>
      </Segment.Group>
    );
  }
}

function mapStateToProps(state) {
  const { cases, assignments } = state;
  return {
    cases: cases.cases,
    allAssignments: assignments.allAssignments,
    loading: assignments.loading,
    workBaskets: state.user.userData.workbaskets
      ? state.user.userData.workbaskets
      : [],
    workQueues: state.workqueue.workQueues,
    workList: state.workqueue.workList
  };
}

const connectedWorklist = connect(mapStateToProps)(Worklist);
export { connectedWorklist as Worklist };
