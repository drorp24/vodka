import React from 'react';
import { connect } from "react-redux"
import {Div} from './common/StyledElements';
import {FlexRows, FlexColumns} from './common/CommonComponents';
import styled from 'styled-components';
import {Button} from 'semantic-ui-react';
import {map, keys} from 'lodash/fp'
import translate from '../i18n/translate'
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
                        {translate(name, true)}:
                    </Div>
                    <Div width="220px" styleType={selected ? "selectedScenarioLabelValue" : "scenarioLabelValue"}>
                        {value}
                    </Div>                    
                </FlexColumns>
    }

    const handleSelectScenario = () => {
        selectScenarioAction(scenario.id)        
    }

    return (
        <StyledScenarioContainer width="500px">
            <FlexRows>
                <Button basic={!selected} color="black" onClick={handleSelectScenario}>
                    <FlexRows alignItems="flex-start">
                        {
                            map((key) => renderAttr(key, scenario[key], selected, key), keys(scenario))
                        }
                    </FlexRows>                    
                </Button>
            </FlexRows>
        </StyledScenarioContainer>
    )
}

export default connect(null, {selectScenarioAction: selectScenario})(Scenario);