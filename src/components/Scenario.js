import React from 'react';
import { connect } from "react-redux"
import {Div} from './common/StyledElements';
import {FlexRows, FlexColumns} from './common/CommonComponents';
import styled, {withTheme} from 'styled-components';
import {Button} from 'semantic-ui-react';
import {map, keys} from 'lodash/fp'
import translate from '../i18n/translate'
import {selectScenario} from '../redux/actions/actions'
import ScenarioPlayer from './ScenarioPlayer'

export const StyledScenarioContainer = styled(Div)`    
    
    margin-bottom: 10px;
    border-radius: 3px;
`;

function Scenario({scenario, selected, selectScenarioAction, theme}) {
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
                <Button style={{"margin": "0px"}} basic={!selected} color={theme["scenarioButtonColor"]} onClick={handleSelectScenario}>
                    <FlexRows alignItems="flex-start">
                        {
                            map((key) => renderAttr(key, scenario[key], selected, key), keys(scenario))
                        }
                    </FlexRows>                    
                </Button>
            </FlexRows>
            <ScenarioPlayer parentScenarioId={scenario.id}/>
        </StyledScenarioContainer>
    )
}

export default connect(null, {selectScenarioAction: selectScenario})(withTheme(Scenario));