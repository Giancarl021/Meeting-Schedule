import { Location, SupportedLanguage } from 'util/types.bicep'

targetScope = 'subscription'

param resourceGroupName string = 'JW-Pull'
param lang SupportedLanguage = 'en'
param location Location = 'eastus'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2025-04-01' = {
  name: resourceGroupName
  location: location
}

module resources 'resources.bicep' = {
  name: 'resources'
  scope: resourceGroup
  params: {
    location: location
    lang: lang
  }
}
