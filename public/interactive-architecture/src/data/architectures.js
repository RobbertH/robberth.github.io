/**
 * Master mapping: layer -> provider -> (scale, dataSize, tableFormat) -> technologies
 *
 * Each entry returns an array of technology strings for a given layer.
 * Technologies should NOT be combined (e.g. "OPA + Zitadel" -> separate "OPA", "Zitadel").
 */

const arch = {
  networking: {
    aws:    () => ['VPC + ALB'],
    azure:  () => ['VNet + App Gateway'],
    gcp:    () => ['VPC + Cloud LB'],
    self:   () => ['Traefik'],
  },

  auth: {
    aws:    () => ['IAM + Lake Formation'],
    azure:  () => ['Azure AD + RBAC'],
    gcp:    () => ['IAM'],
    self:   () => ['OPA', 'Zitadel'],
  },

  ingestion: {
    aws:    ({ scale }) => scale === 'enterprise' ? ['AppFlow', 'DMS', 'Kinesis'] : ['AppFlow', 'DMS'],
    azure:  ({ scale }) => scale === 'enterprise' ? ['Data Factory', 'Event Hubs'] : ['Data Factory'],
    gcp:    ({ scale }) => scale === 'enterprise' ? ['Dataflow', 'Pub/Sub'] : ['Dataflow'],
    self:   ({ scale }) => scale === 'enterprise' ? ['Airbyte', 'Kafka'] : ['Airbyte'],
  },

  orchestration: {
    aws:    () => ['Conveyor'],
    azure:  () => ['Conveyor'],
    gcp:    () => ['Conveyor'],
    self:   () => ['Airflow'],
  },

  storage: {
    aws:    () => ['S3'],
    azure:  () => ['ADLS Gen2'],
    gcp:    () => ['GCS'],
    self:   () => ['MinIO'],
  },

  tableformat: {
    aws:    ({ tableFormat }) => [tableFormat === 'iceberg' ? 'Iceberg' : 'Delta'],
    azure:  ({ tableFormat }) => [tableFormat === 'iceberg' ? 'Iceberg' : 'Delta'],
    gcp:    ({ tableFormat }) => [tableFormat === 'iceberg' ? 'Iceberg' : 'Delta'],
    self:   ({ tableFormat }) => [tableFormat === 'iceberg' ? 'Iceberg' : 'Delta'],
  },

  catalog: {
    aws:    () => ['Glue Catalog'],
    azure:  () => ['Unity Catalog'],
    gcp:    () => ['Dataplex'],
    self:   () => ['Hive Metastore'],
  },

  processing: {
    aws:    ({ dataSize }) => dataSize === 'big' ? ['EMR Spark'] : ['DuckDB'],
    azure:  ({ dataSize }) => dataSize === 'big' ? ['Synapse Spark'] : ['DuckDB'],
    gcp:    ({ dataSize }) => dataSize === 'big' ? ['Dataproc'] : ['DuckDB'],
    self:   ({ dataSize }) => dataSize === 'big' ? ['Spark on K8s'] : ['DuckDB', 'Polars'],
  },

  transform: {
    aws:    () => ['dbt'],
    azure:  () => ['dbt'],
    gcp:    () => ['dbt', 'Dataform'],
    self:   () => ['dbt'],
  },

  query: {
    aws:    () => ['Athena'],
    azure:  () => ['Synapse Serverless'],
    gcp:    () => ['BigQuery'],
    self:   () => ['Trino'],
  },

  datacatalog: {
    aws:    () => ['Data Product Portal'],
    azure:  () => ['Data Product Portal'],
    gcp:    () => ['Data Product Portal'],
    self:   () => ['Data Product Portal'],
  },

  serving: {
    aws:    ({ scale }) => scale === 'enterprise' ? ['QuickSight', 'API Gateway'] : ['QuickSight'],
    azure:  ({ scale }) => scale === 'enterprise' ? ['Power BI', 'API Management'] : ['Power BI'],
    gcp:    ({ scale }) => scale === 'enterprise' ? ['Looker', 'Apigee'] : ['Looker'],
    self:   ({ scale }) => scale === 'enterprise' ? ['Superset', 'REST API'] : ['Superset'],
  },

  // Ingestion detail view
  ing_streaming: {
    aws:    () => ['Kinesis'],
    azure:  () => ['Event Hubs'],
    gcp:    () => ['Pub/Sub'],
    self:   () => ['Kafka'],
  },

  ing_full: {
    aws:    () => ['AppFlow'],
    azure:  () => ['Data Factory'],
    gcp:    () => ['Dataflow'],
    self:   () => ['Airbyte'],
  },

  ing_incremental: {
    aws:    () => ['AppFlow'],
    azure:  () => ['Data Factory'],
    gcp:    () => ['Dataflow'],
    self:   () => ['Airbyte'],
  },

  ing_cdc: {
    aws:    () => ['DMS'],
    azure:  () => ['Data Factory'],
    gcp:    () => ['Datastream'],
    self:   () => ['Airbyte'],
  },
};

/**
 * Generate flat list of technologies per layer for given selections.
 */
export function resolveTechnologies(selections) {
  const { provider } = selections;
  return Object.entries(arch).map(([layerId, providers]) => {
    const resolver = providers[provider];
    if (!resolver) return { layerId, techs: [] };
    return { layerId, techs: resolver(selections) };
  });
}
