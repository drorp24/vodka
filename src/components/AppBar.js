import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateScenariosFilter } from '../redux/actions/actions';

import { task_colors } from '../configLoader';
import translate from '../i18n/translate';

import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { sideBarWidth } from './common/themes/defaultTheme';

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'fixed',
    height: '10vh',
    width: `${100 - sideBarWidth}vw`,
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: task_colors[3],
  },
  toolBar: {
    height: '100%',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
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
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '35ch',
      '&:focus': {
        width: '50ch',
      },
    },
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
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="open drawer"
        >
          <MenuIcon />
        </IconButton>
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
