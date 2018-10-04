const utilsHubspot = require('../../Utils/hubspot');

// Fonction de récupération et enregistrement de toutes les données Hubspot
const getActivities = async (apiToken, path, since) => {
  let hasMoreData = false;
  let offsetDoc = 0;
  const count = 100;
  const documents = [];
  do {
    // Définiton des paramètres de la requete Hubspot
    const infos = {
      path: `${path}?&count=${count}&since=${since}&offset=${offsetDoc}`,
      method: 'GET',
      data: null,
      token: `Bearer ${apiToken}`,
    };

    // Lancement de la requete Hubspot
    const result = await utilsHubspot.request(infos);
    if (!result) {
      return null;
    }

    result.results.forEach(element => {
      if (!element.isDeleted) {
        documents.push(element);
      }
    });

    hasMoreData = result.hasMore;
    offsetDoc = result.offset;
  } while (hasMoreData);

  return documents;
};

const getPipelines = async (apiToken) => {
  // Définiton des paramètres de la requete Hubspot
  const infos = {
    path: '/deals/v1/pipelines',
    method: 'GET',
    data: null,
    token: `Bearer ${apiToken}`,
  };
  // Lancement de la requete Hubspot
  const result = await utilsHubspot.request(infos);
  if (!result) {
    return null;
  }
  return result;
};

const getDealsOpened = async (apiToken, since, allIntegrations) => {
  const integrationIds = allIntegrations.map(int => int.integrationId);
  let documents = [];
  const path = '/deals/v1/deal/recent/modified';

  // const stages = await getStages(apiToken);
  const result = await getActivities(apiToken, path, since);

  result.forEach(element => {
    const compareDate = Number(element.properties.createdate.value);
    if (compareDate > since) {
      documents.push(element);
    }
  });
  documents = documents.filter(d => integrationIds.includes(Number(d.properties.hubspot_owner_id.value)));
  return documents;
};

const getStages = async (apiToken) => {
  const won = [];
  const lost = [];
  const path = '/deals/v1/pipelines';

  const result = await getPipelines(apiToken, path);

  result.forEach(pipeline => {
    pipeline.stages.forEach(stage => {
      if (stage.closedWon === true) {
        won.push(stage.stageId);
      }
      if (stage.probability === 0.0) {
        lost.push(stage.stageId);
      }
    });
  });

  return {
    won,
    lost,
  };
};

const getDealsWon = async (apiToken, since, allIntegrations) => {
  const integrationIds = allIntegrations.map(int => int.integrationId);
  let documents = [];
  const path = '/deals/v1/deal/recent/modified';

  const stages = await getStages(apiToken);
  const result = await getActivities(apiToken, path, since);

  result.forEach(element => {
    if (element.properties.closedate) {
      const compareDate = Number(element.properties.closedate.value);
      if (stages.won.includes(element.properties.dealstage.value) && (compareDate > since)) {
        documents.push(element);
      }
    }
  });
  documents = documents.filter(d => integrationIds.includes(Number(d.properties.hubspot_owner_id.value)));
  return documents;
};

const getEngagements = async (apiToken, since, allIntegrations) => {
  const integrationIds = allIntegrations.map(int => int.integrationId);
  let documents = [];
  let nbMeetings = 0;
  let nbCalls = 0;

  const path = '/engagements/v1/engagements/recent/modified';

  const result = await getActivities(apiToken, path, since);

  result.forEach(element => {
    if (element.engagement.createdAt > since && (element.engagement.type === 'MEETING' || element.engagement.type === 'CALL')) {
      if (element.engagement.type === 'MEETING') { nbMeetings += 1; }
      if (element.engagement.type === 'CALL') { nbCalls += 1; }
      documents.push(element);
    }
  });

  documents = documents.filter(d => integrationIds.includes(Number(d.engagement.ownerId)));

  return {
    nbMeetings,
    nbCalls,
    documents,
  };
};

exports.getDealsOpened = getDealsOpened;
exports.getDealsWon = getDealsWon;
exports.getEngagements = getEngagements;
exports.getStages = getStages;
exports.getPipelines = getPipelines;
