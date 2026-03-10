import airflow from '../assets/logos/airflow.png';
import dpp from '../assets/logos/dpp.png';
import airbyte from '../assets/logos/airbyte.svg';
import api from '../assets/logos/api.svg';
import aws from '../assets/logos/aws.svg';
import azure from '../assets/logos/azure.svg';
import bigquery from '../assets/logos/bigquery.svg';
import conveyor from '../assets/logos/conveyor.svg';
import databricks from '../assets/logos/databricks.svg';
import dbt from '../assets/logos/dbt.svg';
import delta from '../assets/logos/delta.svg';
import duckdb from '../assets/logos/duckdb.svg';
import googlecloud from '../assets/logos/googlecloud.svg';
import hive from '../assets/logos/hive.svg';
import iceberg from '../assets/logos/iceberg.svg';
import kafka from '../assets/logos/kafka.svg';
import looker from '../assets/logos/looker.svg';
import minio from '../assets/logos/minio.svg';
import opa from '../assets/logos/opa.webp';
import polars from '../assets/logos/polars.svg';
import powerbi from '../assets/logos/powerbi.svg';
import quicksight from '../assets/logos/quicksight.svg';
import s3 from '../assets/logos/s3.svg';
import spark from '../assets/logos/spark.svg';
import superset from '../assets/logos/superset.svg';
import traefik from '../assets/logos/traefik.svg';
import trino from '../assets/logos/trino.svg';
import zitadel from '../assets/logos/zitadel.png';

const logos = {
  // Networking
  'VPC + ALB':           aws,
  'VNet + App Gateway':  azure,
  'VPC + Cloud LB':      googlecloud,
  'Traefik':             traefik,

  // Auth
  'IAM + Lake Formation': aws,
  'Azure AD + RBAC':     azure,
  'IAM':                 googlecloud,
  'OPA':                 opa,
  'Zitadel':             zitadel,

  // Ingestion
  'AppFlow':             aws,
  'DMS':                 aws,
  'Kinesis':             aws,
  'Data Factory':        azure,
  'Event Hubs':          azure,
  'Dataflow':            googlecloud,
  'Pub/Sub':             googlecloud,
  'Airbyte':             airbyte,
  'Kafka':               kafka,
  'Datastream':          googlecloud,

  // Storage
  'S3':                  s3,
  'ADLS Gen2':           azure,
  'GCS':                 googlecloud,
  'MinIO':               minio,

  // Table Format
  'Iceberg':             iceberg,
  'Delta':               delta,

  // Catalog
  'Glue Catalog':        aws,
  'Unity Catalog':       databricks,
  'Dataplex':            googlecloud,
  'Hive Metastore':      hive,

  // Processing
  'EMR Spark':           spark,
  'Synapse Spark':       spark,
  'Dataproc':            spark,
  'Spark on K8s':        spark,
  'Lambda + DuckDB':     duckdb,
  'Functions + DuckDB':  duckdb,
  'DuckDB':              duckdb,
  'Polars':              polars,

  // Query
  'Athena':              aws,
  'Synapse Serverless':  azure,
  'BigQuery':            bigquery,
  'Trino':               trino,

  // Data Product Catalog
  'Data Product Portal': dpp,

  // Serving
  'QuickSight':          quicksight,
  'API Gateway':         aws,
  'Power BI':            powerbi,
  'API Management':      azure,
  'Looker':              looker,
  'Apigee':              googlecloud,
  'Superset':            superset,
  'REST API':            api,

  // Transform
  'dbt':                 dbt,
  'Dataform':            googlecloud,

  // Orchestration
  'Conveyor':            conveyor,
  'Airflow':             airflow,
  'Cloud Composer':      airflow,
};

export function getIcon(tech) {
  return logos[tech] || null;
}
