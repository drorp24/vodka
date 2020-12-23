import React from 'react';

import translate from '../i18n/translate';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

const useStyles = makeStyles(theme => ({
  nextBackButtons: {
    fontSize: '1rem',
  },
}));

const NewScenarioPlayer = ({ className }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = 5;

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  return (
    <MobileStepper
      steps={maxSteps}
      className={className}
      position="static"
      variant="text"
      activeStep={activeStep}
      nextButton={
        <Button
          size="small"
          onClick={handleBack}
          disabled={activeStep === 0}
          className={classes.nextBackButtons}
        >
          {translate('Back', true)}
          {theme.direction === 'rtl' ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </Button>
      }
      backButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={activeStep === maxSteps - 1}
          className={classes.nextBackButtons}
        >
          {theme.direction === 'rtl' ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
          {translate('Next', true)}
        </Button>
      }
    />
  );
};

export default NewScenarioPlayer;
