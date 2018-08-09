
/* eslint-disable */
module.exports = {
  opportunityOpened: 'q=SELECT+Id,Name,OwnerId,AccountId,Amount,CloseDate,IsClosed,createdbyid,createddate,isdeleted,description,LastActivityDate,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Type,IsWon+FROM+Opportunity+WHERE+CreatedDate>',
  opportunityWon: 'q=SELECT+Id,Name,OwnerId,AccountId,Amount,CloseDate,IsClosed,createdbyid,createddate,isdeleted,description,LastActivityDate,LastModifiedById,LastModifiedDate,LastReferencedDate,LastViewedDate,Type,IsWon+FROM+Opportunity+WHERE+isWon=true+AND+LastModifiedDate>',
  event: 'q=SELECT+id,Subject,AccountId,IsArchived,OwnerId,CreatedById,CreatedDate,ActivityDate,IsDeleted,Description,DurationInMinutes,EndDateTime,LastModifiedById,LastModifiedDate,WhoId,WhatId,StartDateTime,ActivityDateTime,EventSubtype+FROM+Event+WHERE+CreatedDate>',
  task: "q=SELECT+id,subject,AccountId,IsArchived,OwnerId,CallObject,CallType,IsClosed,CreatedById,CreatedDate,IsDeleted,ActivityDate,LastModifiedById,LastModifiedDate,WhoId,WhatId,Status,TaskSubtype+FROM+Task+WHERE+tasksubtype='call'+AND+CreatedDate>",
};