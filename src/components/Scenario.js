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
    const renderAttr = (name, value) => {
        return <FlexColumns styleType="label3" marginBottom='10px' justifyContent="flex-start">
                    <Div minWidth="100px" display="flex">
                        {capitalize(name)}:
                    </Div>
                    {value}
                </FlexColumns>
    }

    const handleSelectScenario = () => {
        selectScenarioAction(scenario.id)
    }

    return (
        <StyledScenarioContainer width="200px">
            <FlexRows>
                {/* <Button basic={!selected} color={selected ? "green" : "sdandard"} onClick={handleSelectScenario}> */}
                <Button basic={!selected} color="green" onClick={handleSelectScenario}>
                    <FlexRows alignItems="flex-start">
                        {
                            map((key) => renderAttr(key, scenario[key]), keys(scenario))
                        }
                    </FlexRows>                    
                </Button>
            </FlexRows>
        </StyledScenarioContainer>
    )
}

export default connect(null, {selectScenarioAction: selectScenario})(Scenario);