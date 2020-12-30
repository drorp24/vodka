import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateScenariosFilter } from '../redux/actions/actions';

import translate from '../i18n/translate';

import NewScenarioPlayer from './NewScenarioPlayer';

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { sideBarWidth, scenarios } from './common/themes/defaultTheme';

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
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    textAlign: 'center',
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
  const classes = useStyles();
  const { scenariosFilter } = useSelector(store => store.simulation);
  const dispatch = useDispatch();

  const handleSearchInput = ({ target: { value } }) => {
    dispatch(updateScenariosFilter(value));
  };

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <NewScenarioPlayer className={classes.scenariosPlayer} />
        <Typography className={classes.title} variant="h6" noWrap>
          {translate('selectScenario', true)}
        </Typography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
            onChange={handleSearchInput}
            value={scenariosFilter || ''}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
