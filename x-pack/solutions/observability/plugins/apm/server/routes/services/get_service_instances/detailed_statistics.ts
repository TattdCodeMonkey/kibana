/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { keyBy } from 'lodash';
import { offsetPreviousPeriodCoordinates } from '../../../../common/utils/offset_previous_period_coordinate';
import type { Coordinate } from '../../../../typings/timeseries';
import type { LatencyAggregationType } from '../../../../common/latency_aggregation_types';
import { joinByKey } from '../../../../common/utils/join_by_key';
import { withApmSpan } from '../../../utils/with_apm_span';
import { getServiceInstancesSystemMetricStatistics } from './get_service_instances_system_metric_statistics';
import { getServiceInstancesTransactionStatistics } from './get_service_instances_transaction_statistics';
import type { APMEventClient } from '../../../lib/helpers/create_es_client/create_apm_event_client';

interface ServiceInstanceDetailedStatisticsParams {
  environment: string;
  kuery: string;
  latencyAggregationType: LatencyAggregationType;
  apmEventClient: APMEventClient;
  serviceName: string;
  transactionType: string;
  searchAggregatedTransactions: boolean;
  numBuckets: number;
  start: number;
  end: number;
  serviceNodeIds: string[];
  offset?: string;
}

interface ServiceInstancesDetailedStat {
  serviceNodeName: string;
  errorRate?: Coordinate[];
  latency?: Coordinate[];
  throughput?: Coordinate[];
  cpuUsage?: Coordinate[];
  memoryUsage?: Coordinate[];
}

export interface ServiceInstancesDetailedStatisticsResponse {
  currentPeriod: Record<string, ServiceInstancesDetailedStat>;
  previousPeriod: Record<string, ServiceInstancesDetailedStat>;
}

async function getServiceInstancesDetailedStatistics(
  params: ServiceInstanceDetailedStatisticsParams
): Promise<ServiceInstancesDetailedStat[]> {
  return withApmSpan('get_service_instances_detailed_statistics', async () => {
    const [transactionStats, systemMetricStats = []] = await Promise.all([
      getServiceInstancesTransactionStatistics({
        ...params,
        includeTimeseries: true,
      }),
      getServiceInstancesSystemMetricStatistics({
        ...params,
        includeTimeseries: true,
      }),
    ]);

    const stats = joinByKey([...transactionStats, ...systemMetricStats], 'serviceNodeName');

    return stats;
  });
}

export async function getServiceInstancesDetailedStatisticsPeriods({
  environment,
  kuery,
  latencyAggregationType,
  apmEventClient,
  serviceName,
  transactionType,
  searchAggregatedTransactions,
  numBuckets,
  serviceNodeIds,
  start,
  end,
  offset,
}: {
  environment: string;
  kuery: string;
  latencyAggregationType: LatencyAggregationType;
  apmEventClient: APMEventClient;
  serviceName: string;
  transactionType: string;
  searchAggregatedTransactions: boolean;
  numBuckets: number;
  serviceNodeIds: string[];
  start: number;
  end: number;
  offset?: string;
}): Promise<ServiceInstancesDetailedStatisticsResponse> {
  return withApmSpan('get_service_instances_detailed_statistics_periods', async () => {
    const commonParams = {
      environment,
      kuery,
      latencyAggregationType,
      apmEventClient,
      serviceName,
      transactionType,
      searchAggregatedTransactions,
      numBuckets,
      serviceNodeIds,
    };

    const currentPeriodPromise = getServiceInstancesDetailedStatistics({
      ...commonParams,
      start,
      end,
    });

    const previousPeriodPromise = offset
      ? getServiceInstancesDetailedStatistics({
          ...commonParams,
          start,
          end,
          offset,
        })
      : [];
    const [currentPeriod, previousPeriod] = await Promise.all([
      currentPeriodPromise,
      previousPeriodPromise,
    ]);

    const firstCurrentPeriod = currentPeriod?.[0];

    return {
      currentPeriod: keyBy(currentPeriod, 'serviceNodeName'),
      previousPeriod: keyBy(
        previousPeriod.map((data) => {
          return {
            ...data,
            cpuUsage: offsetPreviousPeriodCoordinates({
              currentPeriodTimeseries: firstCurrentPeriod?.cpuUsage,
              previousPeriodTimeseries: data.cpuUsage,
            }),
            errorRate: offsetPreviousPeriodCoordinates({
              currentPeriodTimeseries: firstCurrentPeriod?.errorRate,
              previousPeriodTimeseries: data.errorRate,
            }),
            latency: offsetPreviousPeriodCoordinates({
              currentPeriodTimeseries: firstCurrentPeriod?.latency,
              previousPeriodTimeseries: data.latency,
            }),
            memoryUsage: offsetPreviousPeriodCoordinates({
              currentPeriodTimeseries: firstCurrentPeriod?.memoryUsage,
              previousPeriodTimeseries: data.memoryUsage,
            }),
            throughput: offsetPreviousPeriodCoordinates({
              currentPeriodTimeseries: firstCurrentPeriod?.throughput,
              previousPeriodTimeseries: data.throughput,
            }),
          };
        }),
        'serviceNodeName'
      ),
    };
  });
}
