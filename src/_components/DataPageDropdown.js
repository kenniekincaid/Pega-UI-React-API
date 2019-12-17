import React, { Component } from "react";
import { connect } from "react-redux";
import { Form } from "semantic-ui-react";

import { dataPageService } from "../_services";

/**
 * Standardized component to handle dropdowns sourced from data pages.
 */
class DataPageDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: []
    };
  }

  componentDidMount() {
    // Directly calling dataPageService methods so we do not have actions overhead.
    // This should be very narrow use case, specific to component.
    dataPageService
      .getDataPage(this.props.pageName, this.props.pageParams)
      .then(
        dataPage => {
          this.setState({
            options: this.convertDataPageToOptions(dataPage)
          });
        },
        error => {
          this.setState({
            options: [{ key: error, text: error, value: error }]
          });
        }
      );
  }

  convertDataPageToOptions(dataPage) {
    let { propertyName, propertyPrompt } = this.props;
    let options = [];

    if (propertyName.indexOf(".") === 0) {
      propertyName = propertyName.substring(1);
    }

    dataPage.pxResults.forEach(result => {
      if (result[propertyName]) {
        options.push({
          key: result["pzInsKey"],
          text: result[propertyPrompt],
          value: result[propertyName]
        });
      }
    });

    return options;
  }

  getOptions() {
    if (this.state.options.length > 0) {
      return this.state.options;
    } else {
      return [];
    }
  }

  render() {
    const { props } = this;

    return (
      <Form.Dropdown
        placeholder={props.placeholder}
        labeled={props.labeled}
        fluid={props.fluid}
        selection={props.selection}
        options={this.getOptions()}
        onChange={props.onChange}
        onBlur={props.onBlur}
        reference={props.reference}
        value={props.value}
        required={props.required}
        disabled={props.readOnly}
        error={props.error}
        label={props.label}
      />
    );
  }
}

function mapStateToProps(state) {
  return {};
}

const connectedDataPageDropdown = connect(mapStateToProps)(DataPageDropdown);
export { connectedDataPageDropdown as DataPageDropdown };
