import React from 'react';
import { connect } from "react-redux"
import {Button, Modal, Segment, Form} from 'semantic-ui-react';
import {withTheme} from 'styled-components';
import { Map as LeafletMap, TileLayer } from 'react-leaflet'
import { Div } from "./common/StyledElements"

const CreateScenarioForm = ({theme}) => {
    const [open, setOpen] = React.useState(false)
    return (
        <Modal
            size="large"
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            dimmer="blurring"
            trigger={<Button color={theme["topbarSliderButton"]} circular icon='file'/>}>
      <Modal.Header>Create Scenario</Modal.Header>
      <Modal.Content scrolling>
        <Form>
            <Segment color="grey">
                <Form.Group widths='equal'>
                    <Form.Input label='Scenario Name' placeholder='Name' />                    
                </Form.Group>
            </Segment>
            <Segment color="grey">
                <Form.Group widths='equal'>
                    <Form.Input label='Percentage from task db' placeholder='Percentage' />
                    <Form.Input label='Radius from each task' placeholder='Radius' />
                    <Form.Input label='Percentage of active tasks' placeholder='Active' />
                </Form.Group>
            </Segment>
            <Segment color="grey">
                <Form.Group inline>
                    <label>North East</label>
                    <Form.Input  placeholder='Latitude' />
                    <Form.Input  placeholder='Longitude' />
                </Form.Group>
                <Form.Group inline>
                    <label>South West</label>
                    <Form.Input  placeholder='Latitude' />
                    <Form.Input  placeholder='Longitude' />                    
                </Form.Group>
                <Div height="75vh" style={{"background-color": "red"}}>
                        <LeafletMap style={{"height": "100%"}} center={[32.8, 34.98]} zoom={12}>
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        </LeafletMap>
                    </Div>
            </Segment>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)} color={theme["topbarSliderButton"]}>
          Create
        </Button>
      </Modal.Actions>
    </Modal>
    )
}

const mapStateToProps = state => ({
    
})

export default connect(mapStateToProps, {})(withTheme(CreateScenarioForm));