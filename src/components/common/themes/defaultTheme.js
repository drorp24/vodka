import { css } from 'styled-components';

export const primaryColor = `#00a9d5`;
export const primaryColorHover = `rgba(0, 169, 213, 0.1)`;
export const secondaryColor = 'white';
export const secondaryColorHover = `rgba(0, 169, 213, 0.2)`;
export const baseColor = 'white';

// Line seperator
export const secondaryLineColor = 'black';
export const primaryLineColor = `#00a9d5`;

// Button
export const primaryBtnColor = 'white';
export const secondaryBtnColor = `#00a9d5`;

export const l1 = css`
font-size: 40px;
font-weight: bold;
font-family: sans-serif;
`;

export const l2 = css`
font-size: 30px;
font-weight: bold;
font-family: sans-serif;
`;

export const l3 = css`
font-size: 16px;
font-weight: bold;
`;

export const l4 = css`
color: ${primaryColor};
font-size: 30px;
font-weight: bold;
font-family: sans-serif;
`;

export const primaryBtn = css`
color: ${primaryBtnColor};
background-color: ${primaryColor};
border: 1px solid ${primaryColor};
font-weight: bold;
font-size: 15px;
:hover {
  cursor: pointer;
}
:focus {
  outline: 0;
}
`;

export const secondaryBtn = css`
color: ${secondaryBtnColor};
background-color: ${secondaryColor};
border: 1px solid ${primaryColor};
font-weight: bold;
font-size: 15px;
:hover {
  cursor: pointer;
  background-color: ${secondaryColorHover};
}
:focus {
  outline: 0;
}
`;

export const secondaryLine =css`
border: 1px solid ${secondaryLineColor};
`;

export const primaryLine =css`
border: 1px solid ${primaryLineColor};
`;