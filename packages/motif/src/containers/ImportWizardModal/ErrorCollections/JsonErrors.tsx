import React from 'react';
import { Block } from 'baseui/block';
import ErrorMessage from '../../../components/ImportErrorMessage';

const BoldCodeText: React.FC = ({ children }) => {
  return (
    <b>
      <code>{children}</code>
    </b>
  );
};

export const EmptyData = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          The datasets provided are empty.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to import your dataset because the provided JSON is
          empty.
        </Block>
      }
    />
  );
};

export const MissingNodeOrEdge = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid Motif JSON Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Uploaded dataset(s) does not contain{' '}
          <BoldCodeText>nodes</BoldCodeText> or{' '}
          <BoldCodeText>edges</BoldCodeText>.
        </Block>
      }
    />
  );
};

export const RestrictedDataType = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          The uploaded datasets contain type column in node properties
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <BoldCodeText>type</BoldCodeText> is a reserve words used as
          identifiers to perform styling.
          <br />
          You can rename <BoldCodeText>type</BoldCodeText> column to{' '}
          <BoldCodeText>node_type</BoldCodeText> or{' '}
          <BoldCodeText>types</BoldCodeText> to import data successfully.
        </Block>
      }
    />
  );
};

export const InvalidJsonFormat = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Invalid JSON Format.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          Motif unable to parse the dataset because it contains invalid JSON
          format.
        </Block>
      }
    />
  );
};

export const EdgeSourceValueUndefined = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Missing value in edge source column.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif unable to establish a relationship between nodes with the
            provided <b>edge target</b> because selected attribute might be
            missing.
          </Block>

          <Block marginTop='scale300'>
            Please fix the missing attribute or select an appropriate{' '}
            <b>Source</b> to try again.
          </Block>
        </Block>
      }
    />
  );
};

export const EdgeTargetValueUndefined = () => {
  return (
    <ErrorMessage
      title={
        <Block overrides={{ Block: { style: { textTransform: 'uppercase' } } }}>
          Missing value in edge target column.
        </Block>
      }
      content={
        <Block marginTop='scale300'>
          <Block>
            Motif unable to establish a relationship between nodes with the
            provided <b>edge target</b> because selected attribute might be
            missing.
          </Block>

          <Block marginTop='scale300'>
            Please fix the missing attribute or select an appropriate{' '}
            <b>Target</b> above to try again.
          </Block>
        </Block>
      }
    />
  );
};
