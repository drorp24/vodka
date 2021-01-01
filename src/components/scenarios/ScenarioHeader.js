import React from 'react';
import { useSelector } from 'react-redux';

import { scenarios } from '../common/themes/defaultTheme';

import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import translate from '../../i18n/translate';
import LOCALES from '../../i18n/locales';

const useStyles = makeStyles(theme => ({
  root: {
    color: scenarios.header,
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  pageTitle: {
    fontSize: '1.5rem',
    textTransform: 'uppercase',
    color: '#fff',
  },
  headerTitle: {
    fontSize: '1.2rem',
    textTransform: 'uppercase',
    color: '#fff',
  },
  chip: {
    margin: '0.5rem',
    backgroundColor: scenarios.chips,
    color: '#fff',
  },
  headerDetails: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    fontSize: '0.8rem',
  },
  headerLine: {
    display: 'flex',
    justifyContent: 'center',
    lineHeight: 1.3,
    '& > span': {
      marginLeft: '0.5rem',
    },
    fontWeight: '100',
  },
  headerField: {
    fontWeight: '400',
    margin: '0 !important',
  },
  headerNumeric: {
    display: 'flex',
    flexDirection: ({ locale }) =>
      locale === LOCALES.HEBREW ? 'row-reverse' : 'row',
  },
}));

const ScenarioHeader = () => {
  const { locale } = useSelector(store => store.ui);
  const classes = useStyles({ locale });
  const { scenarios, selectedScenarioId } = useSelector(
    store => store.simulation
  );
  const scenario = selectedScenarioId
    ? scenarios.find(s => s.id === selectedScenarioId)
    : null;
  const { tarPer, nextSteptarPer, neiPer, neiRad } = scenario || {};

  const Tasks = () => (
    <div className={classes.headerLine}>
      <span className={classes.headerField}>{translate('scnTasks', true)}</span>
      <span className={classes.headerNumeric}>
        <span>{tarPer}%</span>
        <span>/</span>
        <span>{nextSteptarPer}%</span>
      </span>
    </div>
  );

  const Neighbors = () => (
    <div className={classes.headerLine}>
      <span className={classes.headerField}>{translate('scnNei', true)}</span>
      <span className={classes.headerNumeric}>
        <span>{neiPer}%</span>
        <span>/</span>
        <span>{neiRad}km</span>
      </span>
    </div>
  );

  return (
    <div className={classes.root}>
      {scenario ? (
        <>
          <div className={classes.headerTitle}>{scenario.name}</div>
          <div className={classes.headerDetails}>
            <Chip label={<Tasks />} size="small" className={classes.chip} />
            <Chip label={<Neighbors />} size="small" className={classes.chip} />
          </div>
        </>
      ) : (
        <div className={classes.pageTitle}>
          {translate('selectScenario', true)}
        </div>
      )}
    </div>
  );
};

export default ScenarioHeader;
