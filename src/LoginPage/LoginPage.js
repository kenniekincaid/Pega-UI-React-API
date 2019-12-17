import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Grid, Header, Icon, Input, Button } from "semantic-ui-react";

import { userActions } from "../_actions";

class LoginPage extends Component {
  constructor(props) {
    super(props);

    this.props.dispatch(userActions.logout());

    this.state = {
      username: "",
      password: "",
      submitted: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleSubmit(e) {
    this.setState({ submitted: true });
    const { username, password } = this.state;
    const { dispatch } = this.props;

    if (username && password) {
      dispatch(userActions.login(username, password));
    }
  }

  render() {
    return (
      <Grid verticalAlign="middle" textAlign="center">
        <Grid.Column>
          <Header color="blue" as="h2" icon>
            <Icon name="home" />
            <Header.Content>Login with Pega</Header.Content>
          </Header>
          <Form size="large" onSubmit={e => this.handleSubmit(e)}>
            <Form.Field>
              <Input
                type="username"
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="User Name"
                onChange={this.handleChange}
              />
            </Form.Field>
            <Form.Field>
              <Input
                type="password"
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
              />
            </Form.Field>
            <Button fluid size="large" color="blue">
              Log In
            </Button>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.user;
  return {
    loggingIn
  };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };
