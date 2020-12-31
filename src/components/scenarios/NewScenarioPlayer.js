import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectScenarioStep,
  updateScenariosSelection,
} from '../../redux/actions/actions';

import getLoadItemsRequestBody from '../../types/loadItemsRequestBodyType';
import AsyncRestParams from '../../types/asyncRestParams';

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
  const dispatch = useDispatch();

  const {
    scenariosSelection,
    selectedScenarioId,
    scenarioStepsCount,
    scenarioCurrentStepIdx,
  } = useSelector(store => store.simulation);

  const {
    items,
    selectedPriorityPresetId,
    selectedFilterPresetId,
    selectedGeoPresetId,
    weights,
  } = useSelector(store => store.domainItems);

  const maxSteps = selectedScenarioId ? scenarioStepsCount + 1 : 4;

  const handleScenarionStepRequest = scenarioStepIdx => {
    const ids = items.map(item => item.id);
    console.log(' ')
    console.log('ids: ', ids);

    const loadItemsRequestBody = getLoadItemsRequestBody({
      priorityPresetId: selectedPriorityPresetId,
      filterPresetId: selectedFilterPresetId,
      geoPresetId: selectedGeoPresetId,
      weights,
      scenarioId: selectedScenarioId,
      scenarioStepIdx,
      ids,
    });

    dispatch(
      selectScenarioStep(
        new AsyncRestParams('/data/tasksAndNeighbors', 'POST'),
        loadItemsRequestBody,
        weights
      )
    );
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
    if (scenariosSelection) dispatch(updateScenariosSelection(false));

    setTimeout(() => {
      handleScenarionStepRequest(scenarioCurrentStepIdx + 1);
    }, 700);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
    setTimeout(() => {
      handleScenarionStepRequest(scenarioCurrentStepIdx - 1);
    }, 700);
  };

  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const classes = useStyles({ activeStep, maxSteps, selectedScenarioId });

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
