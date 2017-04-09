import React, { Component, PropTypes } from 'react';
import { HashRouter as Router, Route, NavLink } from 'react-router-dom';
import { Button, ButtonRow } from 'buttercup-ui';
import { Flex } from 'styled-flexbox';
import styled from 'styled-components';
import '../../styles/workspace.global.scss';
import { emitActionToParentAndClose, closeCurrentWindow } from '../../system/utils';
import TypeSelector from './type-selector';
import Dropbox from './sources/dropbox';
import Webdav from './sources/webdav';

const Wrapper = styled(Flex)`
  background-color: #fff;
`;

const Footer = styled(Flex)`
  flex: 0 0 50px;
  padding: var(--spacing-one);
  background-color: var(--gray-light);
`;

const PathRenderer = ({ pathName, ...props }) => {
  switch (pathName) {
    case '/dropbox':
      return <Dropbox {...props}/>;
    case '/owncloud':
      return <Webdav owncloud {...props}/>;
    case '/webdav':
      return <Webdav owncloud {...props}/>;
    default:
      return null;
  }
};

PathRenderer.propTypes = {
  pathName: PropTypes.string
};

export default class FileManager extends Component {
  state = {
    selectedConfig: null,
    creatable: false
  };

  handleSelectFile = config => {
    this.setState({
      selectedConfig: config
    });
  }

  handleOpenClick = () => {
    emitActionToParentAndClose('load-archive', this.state.selectedConfig);
  }

  handleCreateClick = () => {
    document.dispatchEvent(new Event('new-archive-clicked'));
  }

  toggleCreateButton = toggle => {
    this.setState({
      creatable: toggle
    });
  }

  handleClose() {
    closeCurrentWindow();
  }

  renderPath = ({ match }) => {
    return (
      <PathRenderer
        pathName={match.path}
        onSelect={this.handleSelectFile} 
        toggleCreateButton={this.toggleCreateButton}
        />
    );
  }

  render() {
    return (
      <Router>
        <Wrapper flexAuto flexColumn>
          <Flex flexAuto>
            <Route exact path="/" component={TypeSelector}/>
            <Route path="/dropbox" render={this.renderPath} />
            <Route path="/webdav" render={this.renderPath} />
            <Route path="/owncloud" render={this.renderPath} />
          </Flex>
          <Footer>
            <Flex align="center" width="50%">
              <ButtonRow>
                <Button onClick={this.handleClose}>Cancel</Button>
                <NavLink
                  exact
                  to="/"
                  activeStyle={{ display: 'none' }}
                  >
                  <Button>Go Back</Button>
                </NavLink>
              </ButtonRow>
            </Flex>
            <Flex justify="flex-end" align="center" width="50%">
              <ButtonRow>
                <Button
                  disabled={!this.state.creatable}
                  onClick={this.handleCreateClick}
                  >New Archive</Button>
                <Button
                  primary
                  disabled={this.state.selectedConfig === null}
                  onClick={this.handleOpenClick}
                  >Open in Buttercup</Button>
              </ButtonRow>
            </Flex>
          </Footer>
        </Wrapper>
      </Router>
    );
  }
}
