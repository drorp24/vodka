import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import { scenarios } from '../common/themes/defaultTheme';

const useStyles = makeStyles(theme => ({
  root: {
    flexDirection: 'row-reverse',
  },
  nextBackButtons: {},
  playIcon: {
    width: '2.2rem',
    height: '2.2rem',
  },
  nextButton: {
    justifyContent: 'flex-start',
  },
  backButton: {
    justifyContent: 'flex-end',
  },
  nextIcon: {
    color: ({ activeStep, maxSteps, selectedScenarioId }) =>
      !selectedScenarioId || activeStep === maxSteps - 1
        ? scenarios.disabled
        : scenarios.progress,
  },
  backIcon: {
    color: ({ activeStep }) =>
      activeStep < 1 ? scenarios.disabled : scenarios.progress,
  },
  linearProgressRoot: {
    transform: 'scaleX(-1)',
  },
  progressBar: {
    backgroundColor: scenarios.progress,
  },
}));

const NewScenarioPlayer = ({ className }) => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  console.log(' ');
  console.log('activeStep: ', activeStep);
  const { selectedScenarioId, scenarioStepsCount } = useSelector(
    store => store.simulation
  );
  const maxSteps = selectedScenarioId ? scenarioStepsCount + 1 : 4;
  const classes = useStyles({ activeStep, maxSteps, selectedScenarioId });

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
      style={{ flexDirection: 'row-reverse' }}
      position="static"
      variant="progress"
      LinearProgressProps={{
        classes: {
          root: classes.linearProgressRoot,
          barColorPrimary: classes.progressBar,
        },
      }}
      activeStep={activeStep}
      backButton={
        <Button
          size="small"
          onClick={handleBack}
          disabled={activeStep < 1}
          className={classes.backButton}
        >
          {theme.direction === 'rtl' ? (
            <SkipPreviousIcon
              className={`${classes.playIcon} ${classes.backIcon}`}
            />
          ) : (
            <SkipNextIcon
              className={`${classes.playIcon} ${classes.backIcon}`}
            />
          )}
        </Button>
      }
      nextButton={
        <Button
          size="small"
          onClick={handleNext}
          disabled={!selectedScenarioId || activeStep === maxSteps - 1}
          className={classes.nextButton}
        >
          {theme.direction === 'rtl' ? (
            <SkipNextIcon
              className={`${classes.playIcon} ${classes.nextIcon}`}
            />
          ) : (
            <SkipPreviousIcon
              className={`${classes.playIcon} ${classes.nextIcon}`}
            />
          )}
        </Button>
      }
    />
  );
};

export default NewScenarioPlayer;
