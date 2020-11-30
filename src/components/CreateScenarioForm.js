import React from 'react';
import { connect } from "react-redux"
import {Button, Modal, Segment, Form, FormField, TextArea, Loader, Dimmer} from 'semantic-ui-react';
import {withTheme} from 'styled-components';
import {getOr, isEmpty, toNumber, values, flow, compact, isNaN} from 'lodash/fp'
import {toggleCreateScenario, createScenario} from '../redux/actions/actions'
import AsyncRestParams from '../types/asyncRestParams';
import { FlexColumns } from './common/CommonComponents';
import translate from '../i18n/translate'

const FORM_FIELDS = {
    NAME: "name",
    DESCRIPTION: "description",
    STEPS: "steps",
    SIG_TASKS_PERC: "sig_tasks_percentage",
    SIG_NEIGH_PERC: "sig_neighbors_percentage",
    RADIUS: "radius",
    NEXT_STEP_SIG_TASKS_PERC: "next_step_sig_tasks_percentage"
}

class CreateScenarioForm extends React.Component {

    constructor(props){
        super(props)     
        this.fieldsValues = {}
        this.errors = {}
    }

    renderSimpleField = (props) => {
        const header = getOr("", "header", props)
        const inputType = getOr("number", "inputType", props)
        const min = getOr(null, "min", props)
        const max = getOr(null, "max", props)
        const error = getOr(null, "error", props)
        const width = getOr(4, "width", props)
        const required = getOr(false, "required", props)
        const onChange = getOr(null, "onChange", props)
        return (
            <Form.Input
                onChange={onChange}
                error={error}
                fluid
                label={header} type={inputType} min={min} max={max} width={width} required={required}
                />
        )
    }

    _ifSetCheckInRange = (value, min, max) => {
        if(value === null || value === undefined) return true
        const valueAsNumber = toNumber(value)
        if(isNaN(valueAsNumber)) return true
        return valueAsNumber >= min && valueAsNumber <= max
    }

    onCreate = () => {
        this.errors[FORM_FIELDS.NAME] = isEmpty(this.fieldsValues[FORM_FIELDS.NAME]) ? "Name field is mandatory" : null
        this.errors[FORM_FIELDS.SIG_TASKS_PERC] = this._ifSetCheckInRange(this.fieldsValues[FORM_FIELDS.SIG_TASKS_PERC], 1, 100) ? null : "Valid between 1 - 100"
        this.errors[FORM_FIELDS.SIG_NEIGH_PERC] = this._ifSetCheckInRange(this.fieldsValues[FORM_FIELDS.SIG_NEIGH_PERC], 1, 10) ? null : "Valid between 1 - 10"
        this.errors[FORM_FIELDS.NEXT_STEP_SIG_TASKS_PERC] = this._ifSetCheckInRange(this.fieldsValues[FORM_FIELDS.NEXT_STEP_SIG_TASKS_PERC], 1, 100) ? null : "Valid between 1 - 100"
        this.errors[FORM_FIELDS.RADIUS] = this._ifSetCheckInRange(this.fieldsValues[FORM_FIELDS.RADIUS], 1, 1000) ? null : "Valid between 1 - 1000 meters"
        this.errors[FORM_FIELDS.STEPS] = this._ifSetCheckInRange(this.fieldsValues[FORM_FIELDS.STEPS], 1, 5) ? null : "Valid between 1 - 5 steps"
                
        if(!isEmpty(flow([values, compact])(this.errors))){
            this.setState({})
            return
        }
        this.props.createScenarioAction(new AsyncRestParams("/simulation/scenario", "POST"),
        {
            "sig_neighbors_percentage": toNumber(this.fieldsValues[FORM_FIELDS.SIG_NEIGH_PERC]),
            "sig_tasks_percentage": toNumber(this.fieldsValues[FORM_FIELDS.SIG_TASKS_PERC]),
            "radius": toNumber(this.fieldsValues[FORM_FIELDS.RADIUS]),
            "number_of_steps": toNumber(this.fieldsValues[FORM_FIELDS.STEPS]),
            "new_sig_tasks_percentage": toNumber(this.fieldsValues[FORM_FIELDS.NEXT_STEP_SIG_TASKS_PERC]),
            "name": this.fieldsValues[FORM_FIELDS.NAME],
            "description": this.fieldsValues[FORM_FIELDS.DESCRIPTION],
            "creator": "TODO CREATOR"
        })
    }

    onFieldChange = (fieldName, e) => {
        const value = getOr(null, "target.value", e)
        this.fieldsValues[fieldName] = value
    }

    render() {
        return (
            <Modal
                size="large"
                open={true}
                dimmer="blurring">
                <Modal.Header><FlexColumns justifyContent="center">{translate("create_scenario", true)}</FlexColumns></Modal.Header>
                <Modal.Content scrolling>
                    {
                        this.props.createScenariosProcessing ? 
                        <FlexColumns width="300px" height="50vh" alignItems="center" justifyContent="center">
                            <Dimmer active inverted>
                                <Loader size="massive" active content="Processing"/>
                            </Dimmer>                            
                        </FlexColumns>                        
                        : 
                        <Form>
                        <Segment color="grey">
                            {this.renderSimpleField({header:translate("name"), required: true, inputType: "text", 
                                                    onChange: (value) => {this.onFieldChange(FORM_FIELDS.NAME, value)}, error: this.errors[FORM_FIELDS.NAME]})}
                            <FormField>
                                {translate("description")}
                                <TextArea onChange={(value) => {this.onFieldChange(FORM_FIELDS.DESCRIPTION, value)}}/>
                            </FormField>
                            {this.renderSimpleField({header:translate("stepsCount"), unitLabel: "steps", min: 1, max: 5,
                                                     onChange: (value) => {this.onFieldChange(FORM_FIELDS.STEPS, value)}, error: this.errors[FORM_FIELDS.STEPS]})}
                        </Segment>
                        <Segment color="grey">
                            <Form.Group>
                                {this.renderSimpleField({header:translate("tarPer"), min: 1, max: 100,
                                                    onChange: (value) => {this.onFieldChange(FORM_FIELDS.SIG_TASKS_PERC, value)}, error: this.errors[FORM_FIELDS.SIG_TASKS_PERC]})}
                                {this.renderSimpleField({header:translate("neiPer"), min: 1, max: 10,
                                                onChange: (value) => {this.onFieldChange(FORM_FIELDS.SIG_NEIGH_PERC, value)}, error: this.errors[FORM_FIELDS.SIG_NEIGH_PERC]})}
                                {this.renderSimpleField({header:translate("neiRad"), min: 1, max: 1000,
                                                onChange: (value) => {this.onFieldChange(FORM_FIELDS.RADIUS, value)}, error: this.errors[FORM_FIELDS.RADIUS]})}
                            </Form.Group>
                            <Form.Group>
                                {this.renderSimpleField({header:translate("nextSteptarPer"), min: 1, max: 100,
                                                onChange: (value) => {this.onFieldChange(FORM_FIELDS.NEXT_STEP_SIG_TASKS_PERC, value)}, error: this.errors[FORM_FIELDS.NEXT_STEP_SIG_TASKS_PERC]})}
                            </Form.Group>
                        </Segment>
                    </Form>
                    }
                </Modal.Content>
                <Modal.Actions>
                <Button onClick={this.props.toggleCreateScenarioAction} color={this.props.theme["cancelButtonColor"]}>
                        {translate("cancel", true)}
                    </Button>
                    <Button onClick={this.onCreate} color={this.props.theme["createButtonColor"]}>
                        {translate("create", true)}
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = state => ({
    createScenariosProcessing: state.simulation.createScenariosProcessing
})

export default connect(mapStateToProps, {
    toggleCreateScenarioAction: toggleCreateScenario,
    createScenarioAction: createScenario
})(withTheme(CreateScenarioForm));