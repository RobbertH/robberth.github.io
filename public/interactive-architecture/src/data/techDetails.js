/**
 * Descriptions, code snippets, and alternatives for each technology node.
 * Keyed by the exact label string used in architectures.js.
 */
const details = {
  // ── Networking ──────────────────────────────────────────
  'VPC + ALB': {
    title: 'VPC + Application Load Balancer',
    description:
      'AWS Virtual Private Cloud with Application Load Balancer. Provides network isolation for your data platform and routes incoming HTTP/HTTPS traffic to backend services.',
    alternatives: ['CloudFront + API Gateway', 'NLB (Network Load Balancer)', 'Traefik on ECS'],
    snippet: {
      language: 'hcl',
      label: 'Terraform',
      code: `resource "aws_vpc" "data_platform" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true

  tags = { Name = "data-platform-vpc" }
}

resource "aws_lb" "main" {
  name               = "data-platform-alb"
  internal           = true
  load_balancer_type = "application"
  subnets            = aws_subnet.private[*].id
}`,
    },
  },
  'VNet + App Gateway': {
    title: 'VNet + Application Gateway',
    description:
      'Azure Virtual Network with Application Gateway. Provides L7 load balancing with WAF capabilities for your data platform endpoints.',
    alternatives: ['Azure Front Door', 'Azure Load Balancer', 'Traefik on AKS'],
    snippet: {
      language: 'hcl',
      label: 'Terraform',
      code: `resource "azurerm_virtual_network" "data_platform" {
  name                = "data-platform-vnet"
  address_space       = ["10.0.0.0/16"]
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
}`,
    },
  },
  'VPC + Cloud LB': {
    title: 'VPC + Cloud Load Balancer',
    description:
      'Google Cloud VPC with Cloud Load Balancing. Global load balancing with auto-scaling and SSL termination.',
    alternatives: ['Cloud CDN + Cloud Armor', 'Internal TCP/UDP LB', 'Traefik on GKE'],
    snippet: {
      language: 'hcl',
      label: 'Terraform',
      code: `resource "google_compute_network" "data_platform" {
  name                    = "data-platform-vpc"
  auto_create_subnetworks = false
}`,
    },
  },
  Traefik: {
    title: 'Traefik Reverse Proxy',
    description:
      'Cloud-native reverse proxy and load balancer. Auto-discovers services via Docker/Kubernetes labels, handles TLS, and provides observability out of the box.',
    alternatives: ['Nginx', 'HAProxy', 'Caddy', 'Envoy'],
    snippet: {
      language: 'yaml',
      label: 'Docker Compose',
      code: `services:
  traefik:
    image: traefik:v3.0
    command:
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro`,
    },
  },

  // ── Auth / IAM ─────────────────────────────────────────
  'IAM + Lake Formation': {
    title: 'AWS IAM + Lake Formation',
    description:
      'Fine-grained access control for your data lake. Lake Formation adds column-level and row-level security on top of IAM, so you can grant access to specific tables or even specific columns without managing S3 bucket policies.',
    alternatives: ['Apache Ranger', 'IAM-only with S3 bucket policies', 'OPA + custom policies'],
    snippet: {
      language: 'python',
      label: 'Boto3',
      code: `import boto3

lf = boto3.client("lakeformation")

lf.grant_permissions(
    Principal={"DataLakePrincipalIdentifier": "arn:aws:iam::123456:role/analyst"},
    Resource={
        "Table": {
            "DatabaseName": "analytics",
            "Name": "orders",
        }
    },
    Permissions=["SELECT"],
    PermissionsWithGrantOption=[],
)`,
    },
  },
  'Azure AD + RBAC': {
    title: 'Azure Active Directory + RBAC',
    description:
      'Identity and role-based access control for Azure resources. Integrates with Azure Purview for data governance and supports managed identities for service-to-service auth.',
    alternatives: ['Azure Purview policies', 'Apache Ranger on HDInsight'],
    snippet: {
      language: 'bash',
      label: 'Azure CLI',
      code: `# Assign Storage Blob Data Reader to a group
az role assignment create \\
  --assignee-object-id <group-id> \\
  --role "Storage Blob Data Reader" \\
  --scope /subscriptions/<sub>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/<account>`,
    },
  },
  IAM: {
    title: 'Google Cloud IAM',
    description:
      'Unified identity and access management for GCP. Supports fine-grained roles, conditions, and integration with BigQuery column-level security.',
    alternatives: ['Dataplex data governance', 'Apache Ranger on Dataproc'],
    snippet: {
      language: 'bash',
      label: 'gcloud CLI',
      code: `gcloud projects add-iam-policy-binding my-project \\
  --member="group:analysts@company.com" \\
  --role="roles/bigquery.dataViewer" \\
  --condition='expression=resource.name.startsWith("projects/my-project/datasets/analytics"),title=analytics-only'`,
    },
  },
  OPA: {
    title: 'Open Policy Agent',
    description:
      'Policy-as-code authorization engine. OPA evaluates fine-grained policies written in Rego, decoupling authorization logic from your application. Widely used for Kubernetes admission control and data access policies.',
    alternatives: ['Casbin', 'Cedar (AWS)', 'Cerbos'],
    snippet: {
      language: 'rego',
      label: 'OPA Policy (Rego)',
      code: `package data.authz

default allow = false

allow {
    input.action == "read"
    input.resource.dataset == "analytics"
    "analyst" == input.user.roles[_]
}`,
    },
  },
  Zitadel: {
    title: 'Zitadel',
    description:
      'Open-source identity management platform. Provides OAuth2/OIDC, SAML, and passwordless authentication out of the box. Self-hosted or cloud, with multi-tenancy support and built-in user management.',
    alternatives: ['Keycloak', 'Authentik', 'Ory Stack', 'Auth0'],
    snippet: {
      language: 'yaml',
      label: 'Docker Compose',
      code: `services:
  zitadel:
    image: ghcr.io/zitadel/zitadel:latest
    command: start-from-init --masterkey "your-master-key"
    ports:
      - "8080:8080"
    environment:
      ZITADEL_EXTERNALDOMAIN: auth.example.com
      ZITADEL_DATABASE_POSTGRES_HOST: postgres`,
    },
  },

  // ── Ingestion ──────────────────────────────────────────
  AppFlow: {
    title: 'Amazon AppFlow',
    description:
      'Managed integration service for transferring data from SaaS apps (Salesforce, Zendesk, Slack, etc.) into S3 or Redshift. No-code setup, supports scheduled and event-driven flows.',
    alternatives: ['Fivetran', 'Airbyte', 'Stitch', 'Custom Lambda ingestion'],
    snippet: {
      language: 'python',
      label: 'Boto3 - trigger a flow',
      code: `import boto3

appflow = boto3.client("appflow")

appflow.start_flow(flowName="salesforce-to-s3-daily")`,
    },
  },
  DMS: {
    title: 'AWS Database Migration Service',
    description:
      'Migrate and replicate databases to AWS with minimal downtime. Supports CDC (Change Data Capture) for ongoing replication from RDS, on-prem databases, or other sources into your data lake.',
    alternatives: ['Debezium + Kafka', 'AWS SCT', 'Fivetran database connector'],
    snippet: {
      language: 'sql',
      label: 'DMS table mapping',
      code: `-- DMS task table mapping (JSON selection rule)
{
  "rules": [{
    "rule-type": "selection",
    "rule-id": "1",
    "rule-action": "include",
    "object-locator": {
      "schema-name": "public",
      "table-name": "orders"
    }
  }]
}`,
    },
  },
  Kinesis: {
    title: 'Amazon Kinesis',
    description:
      'Real-time streaming data service. Kinesis Data Streams handles high-throughput ingestion, while Kinesis Firehose delivers data directly to S3 in Parquet/ORC format.',
    alternatives: ['Amazon MSK (Kafka)', 'Apache Flink on EMR', 'Redpanda'],
    snippet: {
      language: 'python',
      label: 'Kinesis producer',
      code: `import boto3, json

kinesis = boto3.client("kinesis")

kinesis.put_record(
    StreamName="clickstream",
    Data=json.dumps({"user_id": "u123", "event": "page_view"}),
    PartitionKey="u123",
)`,
    },
  },
  'Data Factory': {
    title: 'Azure Data Factory',
    description:
      'Cloud ETL service for data integration at scale. Supports 90+ connectors, visual pipeline authoring, and mapping data flows for code-free transformations.',
    alternatives: ['Fivetran', 'Airbyte', 'Azure Synapse Pipelines'],
    snippet: {
      language: 'json',
      label: 'ADF pipeline activity',
      code: `{
  "name": "CopyBlobToLake",
  "type": "Copy",
  "inputs": [{ "referenceName": "SourceBlob" }],
  "outputs": [{ "referenceName": "SinkParquet" }],
  "typeProperties": {
    "source": { "type": "BlobSource" },
    "sink": { "type": "ParquetSink" }
  }
}`,
    },
  },
  'Event Hubs': {
    title: 'Azure Event Hubs',
    description:
      'Big data streaming platform. Kafka-compatible endpoint that can ingest millions of events per second. Integrates natively with Azure Stream Analytics and Functions.',
    alternatives: ['Azure Service Bus', 'Confluent Cloud on Azure', 'Apache Kafka on AKS'],
    snippet: {
      language: 'python',
      label: 'Event Hubs producer',
      code: `from azure.eventhub import EventHubProducerClient, EventData

producer = EventHubProducerClient.from_connection_string(conn_str, eventhub_name="events")
batch = producer.create_batch()
batch.add(EventData('{"user": "u123", "action": "click"}'))
producer.send_batch(batch)
producer.close()`,
    },
  },
  Dataflow: {
    title: 'Google Cloud Dataflow',
    description:
      'Fully managed stream and batch processing based on Apache Beam. Auto-scales workers, handles exactly-once semantics, and integrates tightly with Pub/Sub and BigQuery.',
    alternatives: ['Cloud Dataproc (Spark)', 'Pub/Sub + Cloud Functions', 'Fivetran'],
    snippet: {
      language: 'python',
      label: 'Apache Beam pipeline',
      code: `import apache_beam as beam

with beam.Pipeline(options=pipeline_options) as p:
    (p
     | "Read" >> beam.io.ReadFromPubSub(topic="projects/my-proj/topics/events")
     | "Parse" >> beam.Map(json.loads)
     | "Write" >> beam.io.WriteToBigQuery("my-proj:analytics.events"))`,
    },
  },
  'Pub/Sub': {
    title: 'Google Cloud Pub/Sub',
    description:
      'Global messaging and event ingestion service. Decouples publishers and subscribers with at-least-once delivery, push/pull subscriptions, and dead-letter queues.',
    alternatives: ['Confluent Kafka on GKE', 'Cloud Tasks', 'Redpanda'],
    snippet: {
      language: 'python',
      label: 'Pub/Sub publisher',
      code: `from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
topic = "projects/my-project/topics/events"

future = publisher.publish(topic, b'{"event": "page_view"}')
print(f"Published: {future.result()}")`,
    },
  },
  Airbyte: {
    title: 'Airbyte',
    description:
      'Open-source data integration platform with 300+ connectors. Self-hosted or cloud, supports incremental syncs, CDC, and schema evolution. The go-to choice for self-hosted EL(T).',
    alternatives: ['Fivetran', 'Meltano', 'Singer taps', 'Sling'],
    snippet: {
      language: 'yaml',
      label: 'Airbyte connection config',
      code: `# airbyte-config.yaml
source:
  name: postgres-prod
  type: source-postgres
  config:
    host: db.internal
    port: 5432
    database: app
    replication_method: CDC

destination:
  name: s3-lake
  type: destination-s3
  config:
    s3_bucket_name: data-lake-raw
    output_format: parquet`,
    },
  },
  Kafka: {
    title: 'Apache Kafka',
    description:
      'Distributed event streaming platform. Handles high-throughput, low-latency data feeds. Self-managed gives you full control over topics, partitions, retention, and exactly-once semantics.',
    alternatives: ['Redpanda', 'Apache Pulsar', 'NATS JetStream'],
    snippet: {
      language: 'python',
      label: 'Kafka producer',
      code: `from confluent_kafka import Producer

producer = Producer({"bootstrap.servers": "kafka:9092"})

producer.produce(
    "raw-events",
    key="user-123",
    value='{"event": "purchase", "amount": 49.99}',
)
producer.flush()`,
    },
  },

  // ── Orchestration ──────────────────────────────────────
  Conveyor: {
    title: 'Conveyor',
    description:
      'Managed data platform that handles orchestration, CI/CD, and infrastructure for data teams. Deploy Airflow DAGs, Spark jobs, and dbt projects with built-in environments, secrets management, and monitoring. No infrastructure to manage.',
    alternatives: ['MWAA', 'Dagster Cloud', 'Prefect', 'Astronomer'],
    snippet: {
      language: 'python',
      label: 'Conveyor DAG',
      code: `from airflow.decorators import dag, task
from pendulum import datetime

@dag(schedule="@daily", start_date=datetime(2024, 1, 1), catchup=False)
def data_pipeline():
    @task
    def extract(): ...

    @task
    def transform(data): ...

    @task
    def load(data): ...

    load(transform(extract()))

data_pipeline()`,
    },
  },
  Airflow: {
    title: 'Apache Airflow',
    description:
      'The de-facto standard for data pipeline orchestration. Self-hosted gives full control over executors (Celery, Kubernetes), plugins, and custom operators. Define workflows as Python DAGs.',
    alternatives: ['Dagster', 'Prefect', 'Mage', 'Temporal'],
    snippet: {
      language: 'python',
      label: 'Airflow DAG',
      code: `from airflow.decorators import dag, task
from pendulum import datetime

@dag(schedule="@daily", start_date=datetime(2024, 1, 1), catchup=False)
def data_pipeline():
    @task
    def extract(): ...

    @task
    def transform(data): ...

    @task
    def load(data): ...

    load(transform(extract()))

data_pipeline()`,
    },
  },
  'Cloud Composer': {
    title: 'Cloud Composer',
    description:
      'Google-managed Apache Airflow. Runs on GKE, integrates with BigQuery, Dataflow, and other GCP services. Composer 2 supports auto-scaling and per-task resource allocation.',
    alternatives: ['Dagster Cloud', 'Prefect', 'Cloud Workflows'],
    snippet: {
      language: 'python',
      label: 'Airflow DAG with GCP operators',
      code: `from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator

load_to_bq = BigQueryInsertJobOperator(
    task_id="gcs_to_bq",
    configuration={
        "load": {
            "sourceUris": ["gs://data-lake/raw/events/*.parquet"],
            "destinationTable": {"projectId": "my-proj", "datasetId": "raw", "tableId": "events"},
            "sourceFormat": "PARQUET",
            "writeDisposition": "WRITE_TRUNCATE",
        }
    },
)`,
    },
  },

  // ── Storage ────────────────────────────────────────────
  S3: {
    title: 'Amazon S3',
    description:
      'Object storage with 99.999999999% durability. The foundation of most data lakes on AWS. Supports lifecycle policies, S3 Glacier for archival, and S3 Select for server-side filtering.',
    alternatives: ['EFS (for file-based access)', 'FSx for Lustre (HPC)', 'MinIO (self-hosted)'],
    snippet: {
      language: 'python',
      label: 'PyArrow write to S3',
      code: `import pyarrow.parquet as pq
import s3fs

fs = s3fs.S3FileSystem()

pq.write_to_dataset(
    table,
    root_path="s3://data-lake/warehouse/orders",
    partition_cols=["year", "month"],
    filesystem=fs,
)`,
    },
  },
  'ADLS Gen2': {
    title: 'Azure Data Lake Storage Gen2',
    description:
      'Hierarchical namespace on top of Azure Blob Storage. Combines the scalability of blob storage with file system semantics (directories, ACLs). The standard storage layer for Azure data lakes.',
    alternatives: ['Azure Blob Storage (flat namespace)', 'Azure Files'],
    snippet: {
      language: 'python',
      label: 'ADLS access with fsspec',
      code: `import adlfs

fs = adlfs.AzureBlobFileSystem(account_name="datalake", credential=credential)

# List parquet files
files = fs.ls("raw/events/2024/")

# Read with pandas
import pandas as pd
df = pd.read_parquet("abfss://raw@datalake.dfs.core.windows.net/events/", storage_options={"account_name": "datalake"})`,
    },
  },
  GCS: {
    title: 'Google Cloud Storage',
    description:
      'Unified object storage with multiple storage classes (Standard, Nearline, Coldline, Archive). Integrates natively with BigQuery external tables and Dataproc.',
    alternatives: ['Cloud Filestore (NFS)', 'Persistent Disk'],
    snippet: {
      language: 'python',
      label: 'GCS upload',
      code: `from google.cloud import storage

client = storage.Client()
bucket = client.bucket("data-lake-raw")

blob = bucket.blob("events/2024/01/events.parquet")
blob.upload_from_filename("local_events.parquet")`,
    },
  },
  MinIO: {
    title: 'MinIO',
    description:
      'High-performance, S3-compatible object storage. Runs on bare metal or Kubernetes. Provides the same S3 API so all your S3 tooling (boto3, PyArrow, DuckDB) works without changes.',
    alternatives: ['Ceph', 'SeaweedFS', 'LakeFS (with MinIO backend)'],
    snippet: {
      language: 'yaml',
      label: 'Docker Compose',
      code: `services:
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: supersecret
    volumes:
      - minio-data:/data`,
    },
  },

  // ── Table Format ───────────────────────────────────────
  Iceberg: {
    title: 'Apache Iceberg',
    description:
      'Open table format for huge analytic datasets. Provides ACID transactions, schema evolution, time travel, and hidden partitioning. Became the de-facto open standard backed by Apple, Netflix, and the broader community.',
    alternatives: ['Delta Lake', 'Apache Hudi', 'Apache Paimon'],
    snippet: {
      language: 'python',
      label: 'PyIceberg',
      code: `from pyiceberg.catalog import load_catalog

catalog = load_catalog("glue", **{"type": "glue"})

table = catalog.load_table("analytics.orders")

# Time travel
scan = table.scan(snapshot_id=older_snapshot)
df = scan.to_pandas()

# Schema evolution
with table.update_schema() as update:
    update.add_column("discount", FloatType())`,
    },
  },
  Delta: {
    title: 'Delta Lake',
    description:
      'Open-source storage framework by Databricks. Brings ACID transactions, scalable metadata, and time travel to data lakes. Tight integration with Spark, and growing support in other engines via delta-rs.',
    alternatives: ['Apache Iceberg', 'Apache Hudi', 'Apache Paimon'],
    snippet: {
      language: 'python',
      label: 'delta-rs (Python)',
      code: `from deltalake import DeltaTable, write_deltalake

# Write
write_deltalake("s3://lake/orders", df)

# Read with time travel
dt = DeltaTable("s3://lake/orders", version=5)
df = dt.to_pandas()

# Compact small files
dt.optimize.compact()
dt.vacuum(retention_hours=168)`,
    },
  },

  // ── Catalog ────────────────────────────────────────────
  'Glue Catalog': {
    title: 'AWS Glue Data Catalog',
    description:
      'Centralized metadata repository compatible with Apache Hive Metastore. Stores table definitions, schemas, and partition info. Used by Athena, EMR, Redshift Spectrum, and Lake Formation.',
    alternatives: ['Nessie (Iceberg-native)', 'Tabular', 'Polaris Catalog'],
    snippet: {
      language: 'python',
      label: 'Glue Catalog via Boto3',
      code: `import boto3

glue = boto3.client("glue")

glue.create_table(
    DatabaseName="analytics",
    TableInput={
        "Name": "orders",
        "StorageDescriptor": {
            "Columns": [
                {"Name": "order_id", "Type": "string"},
                {"Name": "amount", "Type": "double"},
            ],
            "Location": "s3://data-lake/warehouse/orders/",
            "InputFormat": "org.apache.iceberg...",
        },
        "TableType": "EXTERNAL_TABLE",
    },
)`,
    },
  },
  'Unity Catalog': {
    title: 'Unity Catalog',
    description:
      'Databricks unified governance solution. Provides a three-level namespace (catalog.schema.table), fine-grained access control, data lineage, and support for Delta, Iceberg, and external tables.',
    alternatives: ['Apache Polaris (Iceberg REST)', 'Hive Metastore', 'Nessie'],
    snippet: {
      language: 'sql',
      label: 'Unity Catalog SQL',
      code: `-- Create a managed table in Unity Catalog
CREATE TABLE analytics.orders.fact_orders (
  order_id STRING,
  amount DOUBLE,
  order_date DATE
)
USING DELTA
PARTITIONED BY (order_date);

-- Grant access
GRANT SELECT ON TABLE analytics.orders.fact_orders TO analysts;`,
    },
  },
  Dataplex: {
    title: 'Google Dataplex',
    description:
      'Intelligent data fabric for organizing, managing, and governing data across GCS and BigQuery. Auto-discovers metadata, runs data quality checks, and provides a unified catalog.',
    alternatives: ['BigQuery metadata', 'Apache Polaris', 'Hive Metastore on Dataproc'],
    snippet: {
      language: 'bash',
      label: 'gcloud CLI',
      code: `# Create a Dataplex lake
gcloud dataplex lakes create analytics-lake \\
  --location=us-central1 \\
  --description="Main analytics data lake"

# Add a zone
gcloud dataplex zones create raw-zone \\
  --lake=analytics-lake \\
  --location=us-central1 \\
  --type=RAW \\
  --resource-location-type=SINGLE_REGION`,
    },
  },
  'Hive Metastore': {
    title: 'Apache Hive Metastore',
    description:
      'The original open-source metadata catalog. Stores schema definitions, partition info, and storage locations. Still widely used as the backend for Trino, Spark, and Iceberg catalogs.',
    alternatives: ['Nessie', 'Apache Polaris (Iceberg REST)', 'Unity Catalog OSS'],
    snippet: {
      language: 'yaml',
      label: 'Docker Compose',
      code: `services:
  hive-metastore:
    image: apache/hive:4.0.0
    environment:
      SERVICE_NAME: metastore
      DB_DRIVER: postgres
      SERVICE_OPTS: >-
        -Djavax.jdo.option.ConnectionURL=jdbc:postgresql://postgres:5432/metastore
    ports:
      - "9083:9083"
    depends_on:
      - postgres`,
    },
  },

  // ── Processing ─────────────────────────────────────────
  'Lambda + DuckDB': {
    title: 'AWS Lambda + DuckDB',
    description:
      'Serverless compute paired with an embedded analytical database. DuckDB runs inside a Lambda function, reading Parquet/Iceberg directly from S3. Perfect for small-to-medium data: fast, cheap, zero infrastructure.',
    alternatives: ['EMR Spark', 'Glue ETL', 'Athena CTAS', 'ECS Fargate + DuckDB'],
    snippet: {
      language: 'python',
      label: 'Lambda handler with DuckDB',
      code: `import duckdb

def handler(event, context):
    con = duckdb.connect()
    con.execute("INSTALL httpfs; LOAD httpfs;")
    con.execute("SET s3_region='eu-west-1';")

    result = con.sql("""
        SELECT date_trunc('day', order_date) AS day,
               sum(amount) AS revenue
        FROM read_parquet('s3://data-lake/warehouse/orders/**/*.parquet')
        WHERE order_date >= current_date - interval '7 days'
        GROUP BY 1 ORDER BY 1
    """).fetchdf()

    return result.to_dict(orient="records")`,
    },
  },
  'EMR Spark': {
    title: 'Amazon EMR (Spark)',
    description:
      'Managed Spark clusters on AWS. Use for heavy distributed processing: joins across billions of rows, ML feature engineering, or large-scale ETL. EMR Serverless removes cluster management entirely.',
    alternatives: ['AWS Glue (Spark)', 'Lambda + DuckDB (small data)', 'Databricks on AWS'],
    snippet: {
      language: 'python',
      label: 'PySpark on EMR',
      code: `from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("etl").getOrCreate()

orders = spark.read.format("iceberg").load("glue_catalog.analytics.orders")

daily = (orders
    .filter("order_date >= current_date() - interval 7 days")
    .groupBy("order_date")
    .agg({"amount": "sum"})
)

daily.writeTo("glue_catalog.analytics.daily_revenue").overwritePartitions()`,
    },
  },
  'Functions + DuckDB': {
    title: 'Azure Functions + DuckDB',
    description:
      'Serverless compute on Azure with DuckDB for analytical queries. DuckDB reads Parquet directly from ADLS, making this a cost-effective choice for small-to-medium data workloads.',
    alternatives: ['Synapse Spark', 'Databricks on Azure', 'Azure Container Apps + DuckDB'],
    snippet: {
      language: 'python',
      label: 'Azure Function with DuckDB',
      code: `import duckdb
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    con = duckdb.connect()
    con.execute("INSTALL azure; LOAD azure;")

    result = con.sql("""
        SELECT date_trunc('day', order_date) AS day,
               sum(amount) AS revenue
        FROM read_parquet('az://raw/orders/**/*.parquet')
        GROUP BY 1 ORDER BY 1
    """).fetchdf()

    return func.HttpResponse(result.to_json(orient="records"))`,
    },
  },
  'Synapse Spark': {
    title: 'Azure Synapse Spark',
    description:
      'Managed Spark pools within Azure Synapse Analytics. Tight integration with Synapse SQL, Power BI, and Azure Purview. Good for enterprise-scale processing on Azure.',
    alternatives: ['Databricks on Azure', 'HDInsight Spark', 'Azure Functions + DuckDB (small data)'],
    snippet: {
      language: 'python',
      label: 'PySpark in Synapse',
      code: `df = (spark.read
    .format("delta")
    .load("abfss://lake@storage.dfs.core.windows.net/orders"))

daily = (df
    .groupBy("order_date")
    .agg({"amount": "sum"})
)

daily.write.format("delta").mode("overwrite").save(
    "abfss://lake@storage.dfs.core.windows.net/daily_revenue"
)`,
    },
  },
  Dataproc: {
    title: 'Google Cloud Dataproc',
    description:
      'Managed Spark and Hadoop on GCP. Spin up clusters in 90 seconds, auto-scale based on YARN metrics, and pay per second. Integrates with BigQuery, GCS, and Dataplex.',
    alternatives: ['Dataflow (Beam)', 'BigQuery Spark', 'Cloud Functions + DuckDB (small data)'],
    snippet: {
      language: 'python',
      label: 'PySpark on Dataproc',
      code: `from pyspark.sql import SparkSession

spark = SparkSession.builder \\
    .config("spark.jars.packages", "org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:1.5.0") \\
    .getOrCreate()

df = spark.read.format("iceberg").load("dataplex.analytics.orders")
df.createOrReplaceTempView("orders")

spark.sql("""
    SELECT date_trunc('day', order_date) AS day, sum(amount) AS revenue
    FROM orders GROUP BY 1
""").write.format("iceberg").mode("overwrite").save("dataplex.analytics.daily_revenue")`,
    },
  },
  'Spark on K8s': {
    title: 'Spark on Kubernetes',
    description:
      'Run Spark natively on your Kubernetes cluster using the Spark Operator. Full control over resources, no managed service lock-in. Works with any storage backend.',
    alternatives: ['Polars / DuckDB (small data)', 'Ray on K8s', 'Dask on K8s'],
    snippet: {
      language: 'yaml',
      label: 'SparkApplication CRD',
      code: `apiVersion: sparkoperator.k8s.io/v1beta2
kind: SparkApplication
metadata:
  name: daily-etl
spec:
  type: Python
  mode: cluster
  image: spark:3.5
  mainApplicationFile: s3a://code/etl.py
  sparkConf:
    spark.sql.catalog.lakehouse: org.apache.iceberg.spark.SparkCatalog
  driver:
    cores: 1
    memory: "2g"
  executor:
    cores: 2
    instances: 4
    memory: "4g"`,
    },
  },
  DuckDB: {
    title: 'DuckDB',
    description:
      'Embedded analytical SQL database. Runs in-process (no server), reads Parquet, Iceberg, Delta, CSV natively from S3/GCS/ADLS. Perfect for single-node analytics where data fits on one machine. Think SQLite for OLAP.',
    alternatives: ['Polars', 'DataFusion', 'chDB'],
    snippet: {
      language: 'python',
      label: 'DuckDB',
      code: `import duckdb

con = duckdb.connect()

# Query Parquet on S3 directly
result = con.sql("""
    SELECT date_trunc('day', order_date) AS day,
           sum(amount) AS revenue
    FROM read_parquet('s3://lake/orders/**/*.parquet')
    WHERE order_date >= '2024-01-01'
    GROUP BY 1 ORDER BY 1
""").fetchdf()`,
    },
  },
  Polars: {
    title: 'Polars',
    description:
      'Rust-based DataFrame library for Python and Rust. 10-100x faster than pandas with lazy evaluation, query optimization, and native Parquet/Arrow support. Ideal for ETL pipelines and data transformations.',
    alternatives: ['DuckDB', 'pandas', 'DataFusion', 'Modin'],
    snippet: {
      language: 'python',
      label: 'Polars',
      code: `import polars as pl

df = (
    pl.scan_parquet("s3://lake/orders/**/*.parquet")
    .filter(pl.col("order_date") >= "2024-01-01")
    .group_by("order_date")
    .agg(pl.col("amount").sum())
    .sort("order_date")
    .collect()
)`,
    },
  },

  // ── Transformation ─────────────────────────────────────
  dbt: {
    title: 'dbt (data build tool)',
    description:
      'SQL-first transformation framework. Write SELECT statements, dbt handles the DAG, testing, documentation, and materializations (views, tables, incremental). The standard for analytics engineering.',
    alternatives: ['SQLMesh', 'Dataform (GCP)', 'Custom Spark/Python transforms'],
    snippet: {
      language: 'sql',
      label: 'dbt model',
      code: `-- models/marts/orders/fct_orders.sql
{{ config(materialized='incremental', unique_key='order_id') }}

with source as (
    select * from {{ ref('stg_orders') }}
)

select
    order_id,
    customer_id,
    order_date,
    amount,
    amount * tax_rate as total_with_tax
from source
{% if is_incremental() %}
where order_date > (select max(order_date) from {{ this }})
{% endif %}`,
    },
  },
  Dataform: {
    title: 'Dataform',
    description:
      'Google-native SQL transformation tool, integrated into BigQuery. Define transformations as SQLX files with dependency management, assertions, and incremental processing. Acquired by Google, free to use with BigQuery.',
    alternatives: ['dbt', 'SQLMesh', 'BigQuery scheduled queries'],
    snippet: {
      language: 'sql',
      label: 'Dataform SQLX',
      code: `-- definitions/fct_orders.sqlx
config {
  type: "incremental",
  bigquery: { partitionBy: "order_date" }
}

SELECT
  order_id,
  customer_id,
  order_date,
  amount
FROM \${ref("stg_orders")}
WHERE order_date > COALESCE(
  (SELECT MAX(order_date) FROM \${self()}),
  '1970-01-01'
)`,
    },
  },

  // ── Query Engine ───────────────────────────────────────
  Athena: {
    title: 'Amazon Athena',
    description:
      'Serverless query engine for S3. Pay per query ($5/TB scanned). Supports Iceberg, Delta, Hudi, CSV, JSON, Parquet, and ORC. Uses Trino under the hood. Great for ad-hoc analysis and BI tool connectivity.',
    alternatives: ['Redshift Serverless', 'Trino on EMR', 'DuckDB (local)'],
    snippet: {
      language: 'sql',
      label: 'Athena SQL',
      code: `-- Query an Iceberg table with time travel
SELECT order_date, sum(amount) AS revenue
FROM analytics.orders
FOR TIMESTAMP AS OF TIMESTAMP '2024-06-01 00:00:00'
GROUP BY 1
ORDER BY 1;

-- CTAS to materialize results
CREATE TABLE analytics.daily_revenue
WITH (format = 'PARQUET', external_location = 's3://lake/curated/daily_revenue/')
AS SELECT ...`,
    },
  },
  'Synapse Serverless': {
    title: 'Synapse Serverless SQL',
    description:
      'Query data in ADLS using T-SQL without provisioning compute. Pay per TB processed. Supports Parquet, Delta, CSV. Connects directly to Power BI for interactive dashboards.',
    alternatives: ['Databricks SQL', 'Azure SQL with external tables', 'Trino on AKS'],
    snippet: {
      language: 'sql',
      label: 'Synapse Serverless SQL',
      code: `-- Query Parquet files directly
SELECT order_date, SUM(amount) AS revenue
FROM OPENROWSET(
    BULK 'https://datalake.dfs.core.windows.net/warehouse/orders/**',
    FORMAT = 'PARQUET'
) AS orders
GROUP BY order_date
ORDER BY order_date;`,
    },
  },
  BigQuery: {
    title: 'Google BigQuery',
    description:
      'Serverless, petabyte-scale data warehouse. Columnar storage with automatic optimization, slot-based pricing or on-demand ($6.25/TB). Supports standard SQL, ML (BQML), and federated queries to GCS.',
    alternatives: ['AlloyDB (OLTP+OLAP)', 'Trino on Dataproc', 'DuckDB (local)'],
    snippet: {
      language: 'sql',
      label: 'BigQuery SQL',
      code: `-- Query with partition pruning
SELECT DATE(order_date) AS day, SUM(amount) AS revenue
FROM \`my-project.analytics.orders\`
WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY 1
ORDER BY 1;

-- Create a materialized view
CREATE MATERIALIZED VIEW analytics.mv_daily_revenue AS
SELECT DATE(order_date) AS day, SUM(amount) AS revenue
FROM analytics.orders
GROUP BY 1;`,
    },
  },
  Trino: {
    title: 'Trino',
    description:
      'Distributed SQL query engine (formerly PrestoSQL). Queries data where it lives: S3, HDFS, Iceberg, Delta, PostgreSQL, MySQL, MongoDB, and 30+ connectors. The backbone of many open data platforms.',
    alternatives: ['DuckDB (single-node)', 'Apache Drill', 'Spark SQL'],
    snippet: {
      language: 'sql',
      label: 'Trino SQL',
      code: `-- Query an Iceberg table
SELECT order_date, sum(amount) AS revenue
FROM iceberg.analytics.orders
GROUP BY 1
ORDER BY 1;

-- Federated query across Iceberg and PostgreSQL
SELECT o.order_id, c.name
FROM iceberg.analytics.orders o
JOIN postgresql.public.customers c ON o.customer_id = c.id
WHERE o.order_date >= DATE '2024-01-01';`,
    },
  },
  // ── Data Product Catalog ─────────────────────────────
  'Data Product Portal': {
    title: 'Data Product Portal',
    description:
      'Open-source self-service marketplace for data products by Dataminded. Lets data producers publish domain-specific, business-ready data products while consumers discover, evaluate, and request access through a standardized workflow. Integrates with AWS, Azure, Databricks, and Snowflake.',
    alternatives: ['DataHub', 'OpenMetadata', 'Collibra', 'Atlan'],
    snippet: {
      language: 'yaml',
      label: 'Docker Compose',
      code: `services:
  portal-frontend:
    image: ghcr.io/conveyordata/data-product-portal/portal-frontend:latest
    ports:
      - "3000:80"
  portal-backend:
    image: ghcr.io/conveyordata/data-product-portal/portal-backend:latest
    ports:
      - "8080:8080"
    environment:
      DATABASE_URL: postgresql://portal:pass@postgres:5432/portal
    depends_on:
      - postgres`,
    },
  },

  // ── Serving ──────────────────────────────────────────
  QuickSight: {
    title: 'Amazon QuickSight',
    description:
      'Serverless BI service with SPICE in-memory engine. Supports dashboards, embedded analytics, ML-powered insights, and paginated reports. Pay-per-session pricing makes it cost-effective at scale.',
    alternatives: ['Tableau', 'Looker', 'Metabase', 'Superset'],
    snippet: {
      language: 'python',
      label: 'Boto3 - create dataset',
      code: `import boto3

qs = boto3.client("quicksight")

qs.create_data_set(
    AwsAccountId="123456789",
    DataSetId="daily-revenue",
    Name="Daily Revenue",
    PhysicalTableMap={
        "athena": {
            "CustomSql": {
                "DataSourceArn": "arn:aws:quicksight:...:datasource/athena-lake",
                "Name": "revenue_query",
                "SqlQuery": "SELECT * FROM analytics.daily_revenue",
            }
        }
    },
    ImportMode="SPICE",
)`,
    },
  },
  'API Gateway': {
    title: 'Amazon API Gateway',
    description:
      'Managed service for creating REST, HTTP, and WebSocket APIs. Use it to expose your data platform via APIs — serve model predictions, curated datasets, or query results to downstream applications.',
    alternatives: ['AWS AppSync (GraphQL)', 'ALB + Lambda', 'Kong'],
    snippet: {
      language: 'hcl',
      label: 'Terraform',
      code: `resource "aws_apigatewayv2_api" "data_api" {
  name          = "data-platform-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "query" {
  api_id             = aws_apigatewayv2_api.data_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.query_handler.invoke_arn
}`,
    },
  },
  'Power BI': {
    title: 'Microsoft Power BI',
    description:
      'Enterprise BI platform with rich visualization capabilities. DirectQuery connects live to Synapse/ADLS, Import mode caches data for fast dashboards. Tight integration with the Microsoft ecosystem.',
    alternatives: ['Tableau', 'Looker', 'Metabase', 'Superset'],
    snippet: {
      language: 'json',
      label: 'Power BI dataset config',
      code: `{
  "name": "Lakehouse Analytics",
  "defaultMode": "DirectQuery",
  "tables": [{
    "name": "daily_revenue",
    "source": {
      "type": "synapse",
      "query": "SELECT * FROM analytics.daily_revenue"
    }
  }]
}`,
    },
  },
  'API Management': {
    title: 'Azure API Management',
    description:
      'Full-lifecycle API management on Azure. Publish data APIs with rate limiting, authentication, caching, and developer portal. Sits in front of your data services to provide secure, governed access.',
    alternatives: ['Azure Functions HTTP trigger', 'Kong on AKS', 'AWS API Gateway'],
    snippet: {
      language: 'hcl',
      label: 'Terraform',
      code: `resource "azurerm_api_management" "data_api" {
  name                = "data-platform-apim"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  publisher_name      = "Data Platform"
  publisher_email     = "data-team@company.com"
  sku_name            = "Developer_1"
}`,
    },
  },
  Looker: {
    title: 'Looker',
    description:
      'Google Cloud BI platform with a semantic modeling layer (LookML). Defines metrics once, reuse across dashboards and embedded analytics. Native BigQuery integration with live queries.',
    alternatives: ['Looker Studio (free)', 'Tableau', 'Metabase', 'Superset'],
    snippet: {
      language: 'ruby',
      label: 'LookML model',
      code: `# models/analytics.model.lkml
connection: "bigquery_lake"

explore: orders {
  join: customers {
    type: left_outer
    sql_on: \${orders.customer_id} = \${customers.id} ;;
  }
}

view: orders {
  sql_table_name: analytics.fact_orders ;;

  measure: total_revenue {
    type: sum
    sql: \${amount} ;;
    value_format_name: usd
  }
}`,
    },
  },
  Apigee: {
    title: 'Apigee API Platform',
    description:
      'Google Cloud API management platform. Provides API proxying, analytics, developer portal, and monetization. Use it to expose data products as managed APIs with quotas and key-based access.',
    alternatives: ['Cloud Endpoints', 'Kong on GKE', 'Cloud Functions HTTP'],
    snippet: {
      language: 'xml',
      label: 'Apigee proxy config',
      code: `<ProxyEndpoint name="data-api">
  <HTTPProxyConnection>
    <BasePath>/api/v1/data</BasePath>
  </HTTPProxyConnection>
  <RouteRule name="default">
    <TargetEndpoint>query-service</TargetEndpoint>
  </RouteRule>
</ProxyEndpoint>`,
    },
  },
  Superset: {
    title: 'Apache Superset',
    description:
      'Open-source data exploration and visualization platform. Connects to 30+ databases via SQLAlchemy. Rich dashboards, SQL editor, and chart builder. The go-to self-hosted BI tool.',
    alternatives: ['Metabase', 'Redash', 'Grafana', 'Lightdash'],
    snippet: {
      language: 'yaml',
      label: 'Docker Compose',
      code: `services:
  superset:
    image: apache/superset:latest
    ports:
      - "8088:8088"
    environment:
      SUPERSET_SECRET_KEY: your-secret-key
      SQLALCHEMY_DATABASE_URI: postgresql://superset:pass@postgres:5432/superset
    depends_on:
      - postgres
      - redis`,
    },
  },
  'REST API': {
    title: 'Custom REST API',
    description:
      'Build a lightweight API layer on top of your query engine to serve curated data products. Use FastAPI or Express to expose endpoints that query Trino/DuckDB and return JSON. Full control over caching, auth, and response format.',
    alternatives: ['GraphQL (Hasura, Strawberry)', 'gRPC', 'Apache Arrow Flight'],
    snippet: {
      language: 'python',
      label: 'FastAPI + DuckDB',
      code: `from fastapi import FastAPI
import duckdb

app = FastAPI()

@app.get("/api/revenue")
def get_revenue(days: int = 7):
    con = duckdb.connect("lake.db", read_only=True)
    result = con.sql(f"""
        SELECT order_date, sum(amount) AS revenue
        FROM orders
        WHERE order_date >= current_date - interval '{days} days'
        GROUP BY 1 ORDER BY 1
    """).fetchdf()
    return result.to_dict(orient="records")`,
    },
  },
};

/**
 * Look up detail info for a given technology label.
 * @param {string} techLabel
 * @returns {object|null}
 */
export function getTechDetail(techLabel) {
  return details[techLabel] || null;
}
