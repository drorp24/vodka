import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectScenario } from '../../redux/actions/actions';

import translate from '../../i18n/translate';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import CheckedIcon from '@material-ui/icons/CheckCircleRounded';
import { scenarios } from '../common/themes/defaultTheme';

const useStyles = makeStyles(theme => ({
  scenario: {
    margin: '0.5rem',
    backgroundColor: '#fff',
  },
  cardHeader: {
    fontSize: '1rem',
  },
  action: {
    position: 'absolute',
    margin: 0,
    alignSelf: 'unset',
  },
  iconButton: {
    padding: 0,
  },
  cardContent: {
    backgroundColor: scenarios.cardBackground,
  },
  cardHeaderAvatar: {
    marginLeft: 0,
  },
  avatar: {
    fontSize: '1rem',
  },
  checkedIcon: {
    color: scenarios.checked,
    transition: 'width 0.3s, margin-left 0.3s, margin-right 0.3s',
  },
  selected: {
    width: '40px',
    height: '40px',
    marginLeft: 0,
  },
  unselected: {
    width: 0,
    height: 0,
    marginLeft: '20px',
  },
  line: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  fieldName: {
    color: 'rgba(0, 0, 0, 0.65)',
  },
}));

const Scenario = ({
  scenario: { id, name, description, creator, stepsCount, ...rest },
}) => {
  const classes = useStyles();
  const { scenariosFilter } = useSelector(store => store.simulation);
  const { selectedScenarioId } = useSelector(store => store.simulation);
  const dispatch = useDispatch();

  const markSelected = (id, stepsCount) => () => {
    dispatch(selectScenario(id, stepsCount));
  };

  // ToDo: fix useMemo, or use React.memo
  const highlightSubstring = (str, sub) => {
    if (!sub) return <span>{str}</span>;

    const strlength = str.length;
    const sublength = sub.length;

    let i = str.toLowerCase().indexOf(sub);
    if (i === -1) i = str.indexOf(sub);
    if (i === -1) return <span>{str}</span>;

    const prefix = str.substring(0, i);
    const highlighted = str.substring(i, i + sublength);
    const suffix =
      i + sublength + 1 <= strlength
        ? str.substring(i + sublength, strlength)
        : '';

    return (
      <span>
        {prefix}
        <strong style={{ color: scenarios.match }}>{highlighted}</strong>
        {suffix}
      </span>
    );
  };

  const title = scenariosFilter
    ? highlightSubstring(name, scenariosFilter)
    : name;

  const selected = selectedScenarioId && id === selectedScenarioId;
  const className =
    classes.checkedIcon +
    ' ' +
    (selected ? classes.selected : classes.unselected);

  return (
    <Card
      elevation={5}
      className={classes.scenario}
      onClick={markSelected(id, stepsCount)}
    >
      <CardHeader
        className={classes.cardHeader}
        classes={{ action: classes.action, avatar: classes.cardHeaderAvatar }}
        avatar={<Avatar className={classes.avatar}>{creator}</Avatar>}
        title={title}
        subheader={description}
        action={
          <IconButton className={classes.iconButton}>
            <CheckedIcon className={className} />
          </IconButton>
        }
      />
      <Divider />
      <CardContent className={classes.cardContent}>
        {Object.entries(rest).map(([field, value]) => (
          <div className={classes.line} key={`${id} ${field}`}>
            <Typography className={classes.fieldName}>
              {translate(field, true)}
            </Typography>
            <Typography>{value}</Typography>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Scenario;
