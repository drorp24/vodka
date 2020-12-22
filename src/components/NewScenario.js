import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

import translate from '../i18n/translate';
import { task_colors } from '../configLoader';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  scenario: {
    margin: '0.5rem',
    backgroundColor: '#fff',
  },
  line: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  fieldName: {
    fontWeight: '700',
    color: 'rgba(0, 0, 0, 0.65)',
  },
}));

const NewScenario = ({ scenario }) => {
  const classes = useStyles();
  const { scenariosFilter } = useSelector(store => store.simulation);

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
    <Card elevation={5} className={classes.scenario}>
      <CardContent>
        {Object.entries(scenario).map(
          ([field, value]) =>
            field !== 'id' && (
              <div className={classes.line} key={`${scenario.id} ${field}`}>
                <Typography className={classes.fieldName}>
                  {translate(field, true)}
                </Typography>
                <Typography>
                  {field === 'name'
                    ? highlightSubstring(value, scenariosFilter)
                    : value}
                </Typography>
              </div>
            )
        )}
      </CardContent>
    </Card>
  );
};

export default NewScenario;
