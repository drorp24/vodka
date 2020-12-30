import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import translate from '../../i18n/translate';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  headerTitle: {
    fontSize: '1.3rem',
  },
  headerDetails: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: '0.8rem',
  },
  headerLine: {
    display: 'flex',
    justifyContent: 'center',
    lineHeight: 1.3,
    '& > span': {
      marginLeft: '2rem',
    },
  },
  headerField: {
    fontWeight: '700',
  },
  headerNumeric: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}));

const ScenarioHeader = () => {
  const classes = useStyles();
  const { scenarios, selectedScenarioId } = useSelector(
    store => store.simulation
  );
  const scenario = selectedScenarioId
    ? scenarios.find(s => s.id === selectedScenarioId)
    : null;
  const { tarPer, nextSteptarPer, neiPer, neiRad } = scenario || {};

  return (
    <Typography className={classes.root} variant="h6" noWrap>
      {scenario ? (
        <>
          <div className={classes.headerTitle}>{scenario.name}</div>
          <div className={classes.headerDetails}>
            <div className={classes.headerLine}>
              <span className={classes.headerField}>
                {translate('scnTasks', true)}
              </span>
              <span className={classes.headerNumeric}>
                <span>{tarPer}%</span>
                <span>/</span>
                <span>{nextSteptarPer}%</span>
              </span>
            </div>
            <div className={classes.headerLine}>
              <span className={classes.headerField}>
                {translate('scnNei', true)}
              </span>
              <span className={classes.headerNumeric}>
                <span>{neiPer}%</span>
                <span>/</span>
                <span>{neiRad}km</span>
              </span>
            </div>
          </div>
        </>
      ) : (
        translate('selectScenario', true)
      )}
    </Typography>
  );
};

export default ScenarioHeader;
