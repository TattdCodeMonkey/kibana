/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import * as React from 'react';
import { shallow } from 'enzyme';
import { mountWithIntl, nextTick } from '@kbn/test-jest-helpers';
import { act } from 'react-dom/test-utils';
import { OfExpression } from './of';
import { FormattedMessage } from '@kbn/i18n-react';

describe('of expression', () => {
  it('renders of builtin aggregation types', () => {
    const onChangeSelectedAggField = jest.fn();
    const wrapper = shallow(
      <OfExpression
        aggType="count"
        errors={{ aggField: [] }}
        fields={[{ normalizedType: 'number', name: 'test', text: 'test text' }]}
        aggField="test"
        onChangeSelectedAggField={onChangeSelectedAggField}
      />
    );
    expect(wrapper.find('[data-test-subj="availableFieldsOptionsComboBox"]'))
      .toMatchInlineSnapshot(`
      <EuiComboBox
        async={false}
        compressed={false}
        data-test-subj="availableFieldsOptionsComboBox"
        fullWidth={true}
        isClearable={true}
        isInvalid={false}
        noSuggestions={true}
        onChange={[Function]}
        optionMatcher={[Function]}
        options={Array []}
        placeholder="Select a field"
        selectedOptions={
          Array [
            Object {
              "label": "test",
            },
          ]
        }
        singleSelection={
          Object {
            "asPlainText": true,
          }
        }
        sortMatchesBy="none"
      />
    `);
  });

  it('renders with custom aggregation types', () => {
    const onChangeSelectedAggField = jest.fn();
    const wrapper = shallow(
      <OfExpression
        aggType="test2"
        errors={{ aggField: [] }}
        fields={[{ normalizedType: 'number', name: 'test2', text: 'test text' }]}
        aggField="test"
        onChangeSelectedAggField={onChangeSelectedAggField}
        customAggTypesOptions={{
          test1: {
            text: 'Test1()',
            fieldRequired: false,
            value: 'test1',
            validNormalizedTypes: [],
          },
          test2: {
            text: 'Test2()',
            fieldRequired: true,
            validNormalizedTypes: ['number'],
            value: 'test2',
          },
        }}
      />
    );
    expect(wrapper.find('[data-test-subj="availableFieldsOptionsComboBox"]'))
      .toMatchInlineSnapshot(`
      <EuiComboBox
        async={false}
        compressed={false}
        data-test-subj="availableFieldsOptionsComboBox"
        fullWidth={true}
        isClearable={true}
        isInvalid={false}
        noSuggestions={false}
        onChange={[Function]}
        optionMatcher={[Function]}
        options={
          Array [
            Object {
              "label": "test2",
            },
          ]
        }
        placeholder="Select a field"
        selectedOptions={
          Array [
            Object {
              "label": "test",
            },
          ]
        }
        singleSelection={
          Object {
            "asPlainText": true,
          }
        }
        sortMatchesBy="none"
      />
    `);
  });

  it('renders with default aggreagation type preselected if no aggType was set', () => {
    const onChangeSelectedAggField = jest.fn();
    const wrapper = shallow(
      <OfExpression
        aggType="count"
        errors={{ aggField: [] }}
        fields={[{ normalizedType: 'number', name: 'test', text: 'test text' }]}
        aggField="test"
        onChangeSelectedAggField={onChangeSelectedAggField}
      />
    );
    wrapper.simulate('click');
    expect(
      wrapper.contains(
        <FormattedMessage
          id="xpack.triggersActionsUI.common.expressionItems.of.popoverTitle"
          defaultMessage="of"
        />
      )
    ).toBeTruthy();
  });

  it('renders a helptext when passed as a prop', () => {
    const onChangeSelectedAggField = jest.fn();
    const wrapper = shallow(
      <OfExpression
        aggType="count"
        errors={{ aggField: [] }}
        fields={[{ normalizedType: 'number', name: 'test', text: 'test text' }]}
        aggField="test"
        onChangeSelectedAggField={onChangeSelectedAggField}
        helpText="Helptext test message"
      />
    );

    expect(wrapper.find('[data-test-subj="availableFieldsOptionsFormRow"]').prop('helpText')).toBe(
      'Helptext test message'
    );
  });

  it('clears selected agg field if fields does not contain current selection', async () => {
    const onChangeSelectedAggField = jest.fn();
    const wrapper = mountWithIntl(
      <OfExpression
        aggType="count"
        errors={{ aggField: [] }}
        fields={[
          {
            normalizedType: 'number',
            name: 'test',
            type: 'long',
            searchable: true,
            aggregatable: true,
          },
        ]}
        aggField="notavailable"
        onChangeSelectedAggField={onChangeSelectedAggField}
      />
    );

    await act(async () => {
      await nextTick();
      wrapper.update();
    });

    expect(onChangeSelectedAggField).toHaveBeenCalledWith(undefined);
  });
});
