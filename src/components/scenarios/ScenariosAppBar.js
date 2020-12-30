import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateScenariosFilter } from '../../redux/actions/actions';
import LOCALES from '../../i18n/locales';

import NewScenarioPlayer from './NewScenarioPlayer';
import ScenarioHeader from './ScenarioHeader';

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { sideBarWidth, scenarios } from '../common/themes/defaultTheme';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'fixed',
    height: '10vh',
    width: `${100 - sideBarWidth}vw`,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: scenarios.appBar,
  },
  toolbar: {
    height: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
  },
  scenariosPlayer: {
    height: '50%',
    overflow: ({ locale }) => (locale === LOCALES.HEBREW ? 'hidden' : 'auto'),
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.primary.contrastText,
    '& > button': {
      color: theme.palette.primary.contrastText,
    },
  },

  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    height: '50%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: scenarios.search,
    transform: 'scale(1.2)',
  },
  inputRoot: {
    color: 'inherit',
    height: '100%',
    fontSize: '1.3rem',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20vw',
      '&:focus': {
        width: '25vw',
      },
    },
    color: scenarios.search,
  },
}));

const MyAppBar = () => {
  const { scenariosFilter } = useSelector(store => store.simulation);
  const { locale } = useSelector(store => store.ui);
  const classes = useStyles({ locale });
  const dispatch = useDispatch();

  const handleSearchInput = ({ target: { value } }) => {
    dispatch(updateScenariosFilter(value));
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <NewScenarioPlayer className={classes.scenariosPlayer} />
        <ScenarioHeader />
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            onChange={handleSearchInput}
            value={scenariosFilter || ''}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
