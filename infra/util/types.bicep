@export()
type Constants = {
  functionApp: {
    runtime: string
    version: string
  }
  artifactUrl: string
  roles: {
    storageBlobDataOwnerRoleId: string
    storageBlobDataContributorRoleId: string
    storageQueueDataContributorId: string
    storageTableDataContributorId: string
    monitoringMetricsPublisherId: string
  }
}
