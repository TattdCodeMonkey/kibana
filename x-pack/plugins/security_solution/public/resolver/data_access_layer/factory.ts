/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { CoreStart } from '@kbn/core/public';
import type { DataAccessLayer, TimeRange } from '../types';
import type {
  ResolverNode,
  ResolverRelatedEvents,
  ResolverEntityIndex,
  ResolverPaginatedEvents,
  SafeResolverEvent,
  ResolverSchema,
} from '../../../common/endpoint/types';

function getRangeFilter(timeRange: TimeRange | undefined) {
  return timeRange
    ? {
        timeRange: {
          from: timeRange.from,
          to: timeRange.to,
        },
      }
    : [];
}

/**
 * The data access layer for resolver. All communication with the Kibana server is done through this object. This object is provided to Resolver. In tests, a mock data access layer can be used instead.
 */
export function dataAccessLayerFactory(context: CoreStart): DataAccessLayer {
  const dataAccessLayer: DataAccessLayer = {
    /**
     * Used to get non-process related events for a node.
     * @deprecated use the new API (eventsWithEntityIDAndCategory & event) instead
     */
    async relatedEvents({
      entityID,
      timeRange,
      indexPatterns,
      agentId,
    }: {
      entityID: string;
      timeRange?: TimeRange;
      indexPatterns: string[];
      agentId: string;
    }): Promise<ResolverRelatedEvents> {
      const response: ResolverPaginatedEvents = await context.http.post(
        '/api/endpoint/resolver/events',
        {
          query: {},
          body: JSON.stringify({
            indexPatterns,
            agentId,
            ...getRangeFilter(timeRange),
            filter: JSON.stringify({
              bool: {
                filter: [
                  { term: { 'process.entity_id': entityID } },
                  { bool: { must_not: { term: { 'event.category': 'process' } } } },
                ],
              },
            }),
          }),
        }
      );

      return { ...response, entityID };
    },

    /**
     * Return events that have `process.entity_id` that includes `entityID` and that have
     * a `event.category` that includes `category`.
     */
    eventsWithEntityIDAndCategory({
      entityID,
      category,
      after,
      timeRange,
      indexPatterns,
      agentId,
    }: {
      entityID: string;
      category: string;
      after?: string;
      timeRange?: TimeRange;
      indexPatterns: string[];
      agentId: string;
    }): Promise<ResolverPaginatedEvents> {
      const commonFields = {
        query: { afterEvent: after, limit: 25 },
        body: {
          ...getRangeFilter(timeRange),
          indexPatterns,
        },
      };
      if (category === 'alert') {
        return context.http.post('/api/endpoint/resolver/events', {
          query: commonFields.query,
          body: JSON.stringify({
            ...commonFields.body,
            entityType: 'alerts',
            eventID: entityID,
            agentId,
          }),
        });
      } else {
        return context.http.post('/api/endpoint/resolver/events', {
          query: commonFields.query,
          body: JSON.stringify({
            ...commonFields.body,
            agentId,
            filter: JSON.stringify({
              bool: {
                filter: [
                  { term: { 'process.entity_id': entityID } },
                  { term: { 'event.category': category } },
                ],
              },
            }),
          }),
        });
      }
    },

    /**
     * Retrieves the node data for a set of node IDs. This is specifically for Endpoint graphs. It
     * only returns process lifecycle events.
     */
    async nodeData({
      ids,
      timeRange,
      indexPatterns,
      limit,
      agentId,
    }: {
      ids: string[];
      timeRange?: TimeRange;
      indexPatterns: string[];
      limit: number;
      agentId: string;
    }): Promise<SafeResolverEvent[]> {
      const query = {
        query: { limit },
        body: JSON.stringify({
          indexPatterns,
          agentId,
          ...getRangeFilter(timeRange),
          filter: JSON.stringify({
            bool: {
              filter: [
                { terms: { 'process.entity_id': ids } },
                { term: { 'event.category': 'process' } },
              ],
            },
          }),
        }),
      };
      const response: ResolverPaginatedEvents = await context.http.post(
        '/api/endpoint/resolver/events',
        query
      );
      return response.events;
    },

    /**
     * Return up to one event that has an `event.id` that includes `eventID`.
     */
    async event({
      nodeID,
      eventID,
      eventCategory,
      eventTimestamp,
      winlogRecordID,
      timeRange,
      indexPatterns,
      agentId,
    }: {
      nodeID: string;
      eventCategory: string[];
      eventTimestamp: string;
      eventID?: string | number;
      winlogRecordID: string;
      timeRange?: TimeRange;
      indexPatterns: string[];
      agentId: string;
    }): Promise<SafeResolverEvent | null> {
      /** @description - eventID isn't provided by winlog. This can be removed once runtime fields are available */
      const filter =
        eventID === undefined
          ? {
              bool: {
                filter: [
                  { terms: { 'event.category': eventCategory } },
                  { term: { 'process.entity_id': nodeID } },
                  { term: { '@timestamp': eventTimestamp } },
                  { term: { 'winlog.record_id': winlogRecordID } },
                ],
              },
            }
          : {
              bool: {
                filter: [{ term: { 'event.id': eventID } }],
              },
            };
      if (eventCategory.includes('alert') === false) {
        const response: ResolverPaginatedEvents = await context.http.post(
          '/api/endpoint/resolver/events',
          {
            query: { limit: 1 },
            body: JSON.stringify({
              agentId,
              indexPatterns,
              ...getRangeFilter(timeRange),
              filter: JSON.stringify(filter),
            }),
          }
        );
        const [oneEvent] = response.events;
        return oneEvent ?? null;
      } else {
        const response: ResolverPaginatedEvents = await context.http.post(
          '/api/endpoint/resolver/events',
          {
            query: { limit: 1 },
            body: JSON.stringify({
              indexPatterns,
              ...getRangeFilter(timeRange),
              entityType: 'alertDetail',
              eventID,
              agentId,
            }),
          }
        );
        const [oneEvent] = response.events;
        return oneEvent ?? null;
      }
    },

    /**
     * Retrieves a resolver graph given an ID, schema, timerange, and indices to use when search.
     *
     * @param {string} dataId - Id of the data for what will be the origin node in the graph
     * @param {*} schema - schema detailing what the id and parent fields should be
     * @param {*} timerange - date range in time to search for the nodes in the graph
     * @param {string[]} indices - specific indices to use for searching for the nodes in the graph
     * @returns {Promise<ResolverNode[]>} the nodes in the graph
     */
    async resolverTree({
      dataId,
      schema,
      timeRange,
      indices,
      ancestors,
      descendants,
      agentId,
    }: {
      dataId: string;
      schema: ResolverSchema;
      timeRange?: TimeRange;
      indices: string[];
      ancestors: number;
      descendants: number;
      agentId: string;
    }): Promise<ResolverNode[]> {
      return context.http.post('/api/endpoint/resolver/tree', {
        body: JSON.stringify({
          ancestors,
          descendants,
          timeRange,
          schema,
          nodes: [dataId],
          indexPatterns: indices,
          agentId,
        }),
      });
    },

    /**
     * Used to get the entity_id for an _id.
     */
    async entities({
      _id,
      indices,
      signal,
    }: {
      _id: string;
      indices: string[];
      signal: AbortSignal;
    }): Promise<ResolverEntityIndex> {
      return context.http.get('/api/endpoint/resolver/entity', {
        signal,
        query: {
          _id,
          indices,
        },
      });
    },
  };
  return dataAccessLayer;
}
