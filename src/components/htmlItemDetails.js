import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { ServerStyleSheets, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import { red } from '@material-ui/core/colors';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles(theme => ({
  root: {},
}));

const ItemDetails = ({ item }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card style={{ boxShadow: 'none', textAlign: 'end' }}>
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
