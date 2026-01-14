import { Constants } from 'types.bicep'

@export()
var constants Constants = {
  functionApp: {
    runtime: 'node'
    version: '22'
  }
  artifactUrl: 'https://github.com/Giancarl021/Meeting-Schedule/releases/latest/download/app.zip'
  roles: {
    storageBlobDataOwnerRoleId: 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'
    storageBlobDataContributorRoleId: 'ba92f5b4-2d11-453d-a403-e96b0029c9fe'
    storageQueueDataContributorId: '974c5e8b-45b9-4653-ba55-5f855dd0fb88'
    storageTableDataContributorId: '0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3'
    monitoringMetricsPublisherId: '3913510d-42f4-4e42-8a64-420c390055eb'
  }
}
