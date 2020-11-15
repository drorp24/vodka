import React from 'react';
import { connect } from "react-redux"
import {Div} from './common/StyledElements';
import {FlexRows, FlexColumns} from './common/CommonComponents';
import styled from 'styled-components';
import {Button} from 'semantic-ui-react';
import {map, keys, capitalize} from 'lodash/fp'
import {selectScenario} from '../redux/actions/actions'

export const StyledScenarioContainer = styled(Div)`    
    margin-left: 10px;
    margin-bottom: 10px;
    border-radius: 3px;
`;

function Scenario({scenario, selected, selectScenarioAction}) {
    const renderAttr = (name, value, selected, key) => {
        return <FlexColumns key={key} styleType="label3" marginBottom='10px' justifyContent="flex-start">
                    <Div width="220px" display="flex" styleType={selected ? "selectedScenarioLabelKey" : "scenarioLabelKey"}>
                        {capitalize(name)}:
                    </Div>
                    <Div width="220px" styleType="scenarioLabelValue">
                        {value}
                    </Div>                    
                </FlexColumns>
    }

    const handleSelectScenario = () => {
        selectScenarioAction(scenario.id.value)
    }

    return (
        <StyledScenarioContainer width="500px">
            <FlexRows>
                {/* <Button basic={!selected} color={selected ? "green" : "sdandard"} onClick={handleSelectScenario}> */}
                <Button basic={!selected} color="black" onClick={handleSelectScenario}>
                    <FlexRows alignItems="flex-start">
                        {
                            map((key) => renderAttr(scenario[key].key, scenario[key].value, selected, key), keys(scenario))
                        }
                    </FlexRows>                    
                </Button>
            </FlexRows>
        </StyledScenarioContainer>
    )
}

export default connect(null, {selectScenarioAction: selectScenario})(Scenario);