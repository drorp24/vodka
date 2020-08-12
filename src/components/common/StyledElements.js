import styled, { css } from 'styled-components';

// Layout and non colored/fonted attributes

export const cssNonThemedAttributes = css`
height: ${({ height }) => height};
min-height: ${({ minHeight }) => minHeight};
max-height: ${({ maxHeight }) => maxHeight};
width: ${({ width }) => width};
min-width: ${({ minWidth }) => minWidth};
max-width: ${({ maxWidth }) => maxWidth};
margin: ${({ margin }) => margin};
margin-top: ${({ marginTop }) => marginTop};
margin-right: ${({ marginRight }) => marginRight};
margin-bottom: ${({ marginBottom }) => marginBottom};
margin-left: ${({ marginLeft }) => marginLeft};
padding: ${({ padding }) => padding};
padding-top: ${({ paddingTop }) => paddingTop};
padding-right: ${({ paddingRight }) => paddingRight};
padding-bottom: ${({ paddingBottom }) => paddingBottom};
padding-left: ${({ paddingLeft }) => paddingLeft};
position: ${({ position }) => position};
top: ${({ top }) => top};
right: ${({ right }) => right};
bottom: ${({ bottom }) => bottom};
left: ${({ left }) => left};
display: ${({ display }) => display};
flex: ${({ flex }) => flex};
flex-grow: ${({ flexGrow }) => flexGrow};
flex-wrap: ${({ flexWrap }) => flexWrap};
flex-direction: ${({ flexDirection }) => flexDirection};
flex-basis: ${({ flexBasis }) => flexBasis};
align-items: ${({ alignItems }) => alignItems};
justify-content: ${({ justifyContent }) => justifyContent};
align-content: ${({ alignContent }) => alignContent};
white-space: ${({ whiteSpace }) => whiteSpace};
border: ${({ border }) => border};
border-top: ${({ borderTop }) => borderTop};
border-right: ${({ borderRight }) => borderRight};
border-bottom: ${({ borderBottom }) => borderBottom};
border-left: ${({ borderLeft }) => borderLeft};
border-radius: ${({ borderRadius }) => borderRadius};
border-top-left-radius: ${({ borderTopLeftRadius }) => borderTopLeftRadius};
border-top-right-radius: ${({ borderTopRightRadius }) => borderTopRightRadius};
border-bottom-left-radius: ${({ borderBottomLeftRadius }) => borderBottomLeftRadius};
border-bottom-right-radius: ${({ borderBottomRightRadius }) => borderBottomRightRadius};
`;

// Colors and Fonts attributes logicaly named from theme

export const cssThemedAttributes = css`
background-color: ${({ theme, backgroundThemedColor }) => theme[backgroundThemedColor]};
color: ${({ theme, themedColor }) => theme[themedColor]};
`;

// Basic HTML elemetns allowing set css attributes as properties and includes potential theme key

export const Div = styled.div`
${cssNonThemedAttributes}
${cssThemedAttributes}
${({ theme, styleType }) => theme[styleType]};
background-color: ${({ backgroundColor }) => backgroundColor};
`;

// const Input = styled.input`
// ${cssNonThemedAttributes}
// ${cssThemedAttributes}
// ${({ theme, styleType }) => theme[styleType]};
// `;

export const Label = styled.label`
${cssNonThemedAttributes}
${cssThemedAttributes}
${({ theme, styleType }) => theme[styleType]};
`;

export const Span = styled.span`
${cssNonThemedAttributes}
${cssThemedAttributes}
${({ theme, styleType }) => theme[styleType]};
`;

export const Button = styled.button`
${cssNonThemedAttributes}
${cssThemedAttributes}
${({ theme, styleType }) => theme[styleType]};
`;

export const Image = styled.img`
${cssNonThemedAttributes}
${cssThemedAttributes}
${({ theme, styleType }) => theme[styleType]};`;