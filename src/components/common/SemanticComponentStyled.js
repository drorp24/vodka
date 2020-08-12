import { List } from 'semantic-ui-react'
import styled from 'styled-components';
import { cssNonThemedAttributes, cssThemedAttributes } from './StyledElements';

export const ListItem = styled(List.Item)`
${cssNonThemedAttributes}
${cssThemedAttributes}
`;

export const ListItemContent = styled(List.Content)`
${cssNonThemedAttributes}
${cssThemedAttributes}
`;


export const ListItemHeader = styled(List.Header)`
${cssNonThemedAttributes}
${cssThemedAttributes}
`;
