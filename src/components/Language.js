import React, { useMemo } from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import LOCALES from '../i18n/locales';

import { StylesProvider, jssPreset } from '@material-ui/core/styles';

const RTL = ({ children }) => {
  const useJss = useMemo(
    () => create({ plugins: [...jssPreset().plugins, rtl()] }),
    []
  );

  return <StylesProvider jss={useJss}>{children}</StylesProvider>;
};

const Language = ({ locale, children }) =>
  locale === LOCALES.HEBREW ? <RTL>{children}</RTL> : <div>{children}</div>;

export default Language;
