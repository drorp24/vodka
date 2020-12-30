import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadScenarios } from '../../redux/actions/actions';

import Language from '../Language';
import LOCALES from '../../i18n/locales';
import translate from '../../i18n/translate';
import AsyncRestParams from '../../types/asyncRestParams';

import ScenariosAppBar from './ScenariosAppBar';
import NewScenario from './NewScenario';
import { sideBarWidth } from '../common/themes/defaultTheme';
import { Loader } from 'semantic-ui-react';

import { makeStyles, useTheme, ThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  scenariosContainer: {
    position: 'fixed',
    top: '60px',
    left: ({ locale }) => (locale === LOCALES.HEBREW ? 0 : 'unset'),
    right: ({ locale }) => (locale === LOCALES.HEBREW ? 'unset' : 0),
    width: `${100 - sideBarWidth}vw`,
    height: '100vh',
    zIndex: 1001,
    visibility: ({ open }) => (open ? 'visible' : 'hidden'),
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    overflow: 'scroll',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    '-ms-overflow-style': 'none',
    // backgroundColor: 'rgba(192, 192, 192, 0.7)',
    backgroundColor: ({ open }) =>
      open ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.0)',
    transition: 'background-color 3s 0.5s',
  },
  message: {
    fontSize: '2rem',
  },
  scenariosGrid: {
    marginTop: '10vh',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem 1rem',
    padding: '1rem',
    justifyContent: 'space-evenly',
    alignContent: 'space-evenly',
    // backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  cancelIcon: {
    fontSize: '3rem',
  },
}));

const NewScenarios = ({ open }) => {
  const { locale } = useSelector(store => store.ui);
  const direction = locale === LOCALES.HEBREW ? 'rtl' : 'ltr';
  let theme = useTheme();
  theme = { ...theme, direction };
  const classes = useStyles({ open, locale });

  const { scenariosLoading, scenarios } = useSelector(
    store => store.simulation
  );
  const { scenariosFilter } = useSelector(store => store.simulation);
  const filteredScenarios = scenariosFilter
    ? scenarios.filter(
        scenario =>
          scenario.name.includes(scenariosFilter) ||
          scenario.name.toLowerCase().includes(scenariosFilter)
      )
    : scenarios;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadScenarios(new AsyncRestParams('/simulation/scenario', 'GET')));
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Language locale={locale}>
        <div className={classes.scenariosContainer}>
          <ScenariosAppBar />
          {scenariosLoading ? (
            <Loader size="massive" content={translate('loading')} />
          ) : !scenarios || !scenarios.length ? (
            <div className={classes.message}>{translate('noScenarios')}</div>
          ) : (
            <div className={classes.scenariosGrid}>
              {filteredScenarios.map(scenario => (
                <NewScenario
                  scenario={scenario}
                  key={scenario.id || scenario.name + Math.random().toString()} // ToDo: remove; for testing only
                />
              ))}
            </div>
          )}
        </div>
      </Language>
    </ThemeProvider>
  );
};

export default NewScenarios;
