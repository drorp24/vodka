import React from 'react';
import {FormattedMessage} from "react-intl"
import {capitalize as capital} from 'lodash/fp'


// const translate = (id, capitalize, values = {}) => <FormattedMessage id={id} values={{...values}}>
//     {(text) => capitalize ? capital(text) : text}
// </FormattedMessage>

const translate = (id, capitalize=false, values = {}) => <FormattedMessage id={id} values={{...values}}>
    {(text) => capitalize ? capital(text) : text}
</FormattedMessage>

export default translate