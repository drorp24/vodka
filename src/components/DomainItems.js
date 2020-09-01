import React from 'react';
import { connect } from "react-redux"

const DomainItems = ({}) => {
    return null
}

const mapStateToProps = state => ({
    domainItems: state.domainItems.items
})

export default connect(mapStateToProps, {})(DomainItems);