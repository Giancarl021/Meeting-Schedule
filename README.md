# Meeting-Pull

Azure Functions App to download Jehovah Witnesses meetings data and provide it in a simple format for easy integration. The data collected comes from the public website.

## Installation

It is possible to run the project locally or deploy it to Azure.

### Azure

Following is an automated deployment link (based on [this Bicep files](infra)) for easy deployment:

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)]()

The deployment will automatically create a resource group with all the necessary resources.

### Local

It is also possible to run the project locally using the following commands (assuming you have Node.js 22+ and npm installed):

```bash
npm install
npm run create-local-settings
npm run start
```

## Endpoints

For more details about the endpoints, please refer to the [API documentation](./swagger.yml).

## How it works

When queries for a specific month, the API will go to the public website for a matching Meeting Workbook and Watchtower Magazine, parse the HTML content to get JWPUB download links, parse it with the [meeting-schedules-parser package](https://www.npmjs.com/package/meeting-schedules-parser) and then transform the data into a clean JSON format.

The data pipeline is as follows:

1. Get year and month from the request
2. Go in parallel to:

- `https://www.jw.org/en/library/jw-meeting-workbook/?contentLanguageFilter={lang}&pubFilter=mwb&yearFilter={year}` for meeting workbooks
- `https://www.jw.org/en/library/magazines/?contentLanguageFilter={lang}&pubFilter=w&yearFilter={year}` for watchtower magazines

3. For each HTML page returned, grab the `#pubsViewResults .syn-body.publication` elements and filter them by month (in full)

- In the Watchtower Magazine case, the month is offset by -2 (for example: december -> october)

4. Get the `href` attribute of the `.fileLinks [title="Download"][data-preselect="jwpub"]` element on the filtered element
5. Using the `href` attribute, fetch a download link map in JSON
6. Get the final download link using the property `downloadMap[<key that contains a "JWPUB" property>].JWPUB[0].file.url`
7. In parallel, parse the publication urls using the [meeting-schedules-parser package](https://www.npmjs.com/package/meeting-schedules-parser)
8. Join the meeting schedules from each publication into pairs
9. Convert the pairs into a [`MeetingData[]`](src/services/DataTransformer.ts#L11) object.
10. Returns a JSON representation of the meeting data.
