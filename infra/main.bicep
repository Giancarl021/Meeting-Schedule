import { SupportedLanguage } from 'util/lang.bicep'

targetScope = 'subscription'

param resourceGroupName string = 'Meeting-Schedule'
param lang SupportedLanguage = 'en'

var location = deployment().location

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

output apiUrl string = resources.outputs.apiUrl
@secure()
output apiKey string = resources.outputs.apiKey
