import React, { Component } from 'react'
import Users from './Users';
import './RoomInfo.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class RoomInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            collaborators: this.props.collaborators
        }
    }

    componentWillReceiveProps (newProps) {
        this.setState({
            collaborators: newProps.collaborators
        });
    }

    render () {
        return (
            <div className="room-info">   
                <Users collaborators={this.state.collaborators}/>
                <hr/>
                <Tabs>
                    <TabList>
                        <Tab>Tab 1</Tab>
                        <Tab>Tab 2</Tab>
                    </TabList>

                    <TabPanel>
                        <h2>Ex. Tab 1</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>Ex. Tab 2</h2>
                    </TabPanel>               
                </Tabs>
            </div>
        );
    }
}

export default RoomInfo;