import React from 'react';
import { Label } from 'semantic-ui-react';
import {map} from 'lodash/fp'
import {FlexColumns, FlexRows} from './common/CommonComponents';
import {Div} from './common/StyledElements';
import {task_colors} from '../configLoader';
import LOCALES from "../i18n/locales"

const MapPopup = ({relativeScore, score, name, locale, weightedAttributes}) => {
    let level = 1
    while (level < 10){
        if(relativeScore <= level/10) break
        level += 1
    }
    const imgUrl = `stars${level}.svg`
    let taskLevel = 1
    while (taskLevel < task_colors.length){
        if(relativeScore <= taskLevel/task_colors.length) break
        taskLevel += 1
    }
    return (
        <FlexRows style={{background: "rgba(255, 255, 255, 0.7)", marginBottom: "-5px"}}>
            <Div style={{display: "flex", justifyContent: "center", fontWeight: "600", fontSize: "16px", textAlign: locale === LOCALES.HEBREW ? 'right' : 'left'}}>{name}</Div>
            <Div>
                <img src={imgUrl} width="80" height="40" alt="star"/>
            </Div>
            <Label style={{margin: 0}} horizontal color={task_colors[taskLevel - 1]}>{score.toFixed(3)}</Label>
            <Div marginTop="5px">
            {
                map((attr) => <FlexColumns style={{display: "flex", justifyContent: "space-between"}}>
                    <Div style={{textAlign: locale === LOCALES.HEBREW ? 'right' : 'left'}}>{attr.key}: </Div>
                    <Div style={{textAlign: locale === LOCALES.HEBREW ? 'right' : 'left'}}>{attr.value} </Div>
                </FlexColumns>,
                weightedAttributes)
            }            
            </Div>
        </FlexRows>
    )
}

export default MapPopup