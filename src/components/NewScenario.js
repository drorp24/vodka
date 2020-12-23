import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectScenario } from '../redux/actions/actions';

import translate from '../i18n/translate';
import { task_colors } from '../configLoader';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

const useStyles = makeStyles(theme => ({
  scenario: {
    margin: '0.5rem',
    backgroundColor: '#fff',
  },
  cardHeader: {
    fontSize: '1rem',
  },
  action: {
    margin: 0,
    alignSelf: 'unset',
  },
  iconButton: {
    padding: 0,
  },
  cardContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  avatar: {
    fontSize: '1rem',
  },
  checkedIcon: {
    transition: 'font-size 0.2s',
    color: task_colors[3],
  },
  line: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  fieldName: {
    color: 'rgba(0, 0, 0, 0.65)',
  },
}));

const NewScenario = ({
  scenario: { id, name, description, creator, ...rest },
}) => {
  const classes = useStyles();
  const { scenariosFilter } = useSelector(store => store.simulation);
  const { selectedScenarioId } = useSelector(store => store.simulation);
  const dispatch = useDispatch();

  const markSelected = id => () => {
    dispatch(selectScenario(id));
  };

  // ToDo: fix useMemo, or use React.memo
  const highlightSubstring = useMemo(
    () =>
      function (str, sub) {
        console.log('entered highlightSubstring with');
        console.log('str, sub: ', str, sub);
        if (!sub) return <span>{str}</span>;

        const strlength = str.length;
        const sublength = sub.length;

        const i = str.indexOf(sub);
        if (i === -1) return <span>{str}</span>;

        const prefix = str.substring(0, i);
        const highlighted = str.substring(i, sublength);
        const suffix =
          i + sublength + 1 < strlength
            ? str.substring(i + sublength, strlength)
            : '';

        return (
          <span>
            {prefix}
            <strong style={{ color: task_colors[3] }}>{highlighted}</strong>
            {suffix}
          </span>
        );
      },
    []
  );

  return (
    <Card elevation={5} className={classes.scenario} onClick={markSelected(id)}>
      <CardHeader
        className={classes.cardHeader}
        classes={{ action: classes.action }}
        avatar={<Avatar className={classes.avatar}>{creator}</Avatar>}
        title={highlightSubstring(name, scenariosFilter)}
        subheader={description}
        action={
          <IconButton className={classes.iconButton}>
            <RadioButtonCheckedIcon
              className={classes.checkedIcon}
              style={{ fontSize: id === selectedScenarioId ? '3rem' : '0' }}
            />
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
            <Typography>
              {field === 'name'
                ? highlightSubstring(value, scenariosFilter)
                : value}
            </Typography>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewScenario;
