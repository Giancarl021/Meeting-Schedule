import { Location } from 'util/types.bicep'
import { SupportedLanguage } from 'util/lang.bicep'

targetScope = 'subscription'

param resourceGroupName string = 'Meeting-Pull'
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
