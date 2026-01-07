import { Location } from 'util/types.bicep'
import { SupportedLanguage } from 'util/lang.bicep'
import { constants } from 'util/constants.bicep'

targetScope = 'resourceGroup'

param location Location
param lang SupportedLanguage

var resourceToken = toLower(uniqueString(resourceGroup().id, location))
var functionAppDeploymentContainerName = 'FunctionDeployment'
var langs = loadJsonContent('util/languages.json')

var monthMap = langs[lang].monthMap
var talkKey = langs[lang].ayf_talk_key
var searchLang = langs[lang].search_lang

resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: 'law-${resourceToken}'
  location: location
  properties: {
    retentionInDays: 30
    sku: {
      name: 'PerGB2018'
    }
  }
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'appi-${resourceToken}'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}

resource storage 'Microsoft.Storage/storageAccounts@2023-05-01' = {
  name: 'st${resourceToken}'
  location: location
  kind: 'StorageV2'
  sku: { name: 'Standard_LRS' }
  properties: {
    accessTier: 'Hot'
    allowBlobPublicAccess: false
    allowSharedKeyAccess: true
    dnsEndpointType: 'Standard'
    minimumTlsVersion: 'TLS1_2'
    networkAcls: {
      bypass: 'AzureServices'
      defaultAction: 'Allow'
    }
    publicNetworkAccess: 'Enabled'
  }

  resource blobServices 'blobServices' = {
    name: 'default'

    resource deploymentContainer 'containers' = {
      name: functionAppDeploymentContainerName
      properties: {
        publicAccess: 'None'
      }
    }
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: 'plan-${resourceToken}'
  location: location
  kind: 'functionapp'
  sku: {
    tier: 'FlexConsumption'
    name: 'FC1'
  }
  properties: {
    reserved: true
  }
}

resource functionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: 'fn-${resourceToken}'
  location: location
  kind: 'functionapp,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      minTlsVersion: '1.2'
    }
    functionAppConfig: {
      deployment: {
        storage: {
          type: 'blobContainer'
          value: '${storage.properties.primaryEndpoints.blob}${functionAppDeploymentContainerName}'
          authentication: {
            type: 'SystemAssignedIdentity'
          }
        }
      }
      runtime: {
        name: constants.functionApp.runtime
        version: constants.functionApp.version
      }
    }
  }

  resource configAppSettings 'config' = {
    name: 'appsettings'
    properties: {
      AzureWebJobsStorage__accountName: storage.name
      AzureWebJobsStorage__credential: 'managedidentity'
      APPINSIGHTS_INSTRUMENTATIONKEY: applicationInsights.properties.InstrumentationKey
      SEARCH_LANG: searchLang
      MONTH_MAP: monthMap
      AYF_TALK_KEY: talkKey
      WEBSITE_TIMEZONE: 'UTC'
    }
  }

  resource srcDeployment 'sourcecontrols' = {
    name: 'web'
    properties: {
      repoUrl: 'https://github.com/Giancarl021/Meeting-Schedule.git'
      branch: 'master'
      isManualIntegration: true
      deploymentRollbackEnabled: true
    }
  }
}
