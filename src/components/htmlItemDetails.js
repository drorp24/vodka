import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { ServerStyleSheets, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AssignmentIcon from '@material-ui/icons/Assignment';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const ItemDetails = ({ item }) => {
  const classes = useStyles();

  return (
    <Card style={{ boxShadow: 'none' }}>
      <CardHeader
        style={{ display: 'flex', justifyContent: 'space-between' }}
        avatar={
          <Avatar
            style={{ backgroundColor: `${red[500]}`, marginRight: '-16px' }}
          >
            {item.currIdx}
          </Avatar>
        }
        title={item.name}
        subheader={item.id}
      />
      <CardContent></CardContent>
    </Card>
  );
};

const sheets = new ServerStyleSheets();

const htmlItemDetails = item =>
  ReactDOMServer.renderToString(sheets.collect(<ItemDetails item={item} />));

export const css = sheets.toString();

export default htmlItemDetails;
