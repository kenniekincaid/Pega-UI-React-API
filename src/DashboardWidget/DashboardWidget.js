import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Header, Icon, Button } from "semantic-ui-react";

import { assignmentActions } from "../_actions";

class DashboardWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  getNextAssignment() {
    this.setState({ loading: true });
    this.props.dispatch(assignmentActions.getNextAssignment()).then(action => {
      if (action) {
        this.setState({ loading: false });
      }
    });
  }

  render() {
    return (
      <Container textAlign="center">
        {this.props.type === "getNext" ? (
          <Button
            basic
            color="blue"
            icon
            labelPosition="left"
            size="large"
            onClick={e => this.getNextAssignment()}
            loading={this.state.loading}
          >
            <Icon name="plus" />
            Get Next Work
          </Button>
        ) : (
          <Header as="h4" icon textAlign="center">
            <Icon name={this.props.type} />
            I am a widget
            <Header.Subheader>Of type {this.props.type}</Header.Subheader>
          </Header>
        )}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const connectedDashboardWidget = connect(mapStateToProps)(DashboardWidget);
export { connectedDashboardWidget as DashboardWidget };
