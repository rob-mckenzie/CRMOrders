

/* **************************************************************** */
/*                  Target Web Service Domain Determination         */
/* **************************************************************** */

var theDomain = document.domain;
if( theDomain === 'localhost')
	{ mobilens.hostname = 'https://sapecomdev.sealedair.com:443'; }
else
	{ mobilens.hostname = 'https://'+theDomain+':443'; }



/* **************************************************************** */
/*                  All Application Models                               */
/* **************************************************************** */
Ext.regModel('modelMessageStore',{
	fields:[
	{name: 'msg1', type: 'string', defaultValue: ''},
	{name: 'msg2', type: 'string', defaultValue: ''},
	{name: 'msg3', type: 'string', defaultValue: ''},
	{name: 'msg4', type: 'string', defaultValue: ''},
	{name: 'msg5', type: 'string', defaultValue: ''},
	{name: 'msg6', type: 'string', defaultValue: ''},
	{name: 'msg7', type: 'string', defaultValue: ''},
	{name: 'msg8', type: 'string', defaultValue: ''},
	{name: 'msg9', type: 'string', defaultValue: ''},
	{name: 'msg10', type: 'string', defaultValue: ''}	
	]
});

Ext.regModel('modelSystemState',{
	fields:[
	{name: 'recordType', type: 'string', defaultValue: ''},
	{name: 'primaryListSource', type: 'string', defaultValue: ''},
	{name: 'filteredShipTo', type: 'string', defaultValue: ''},
	{name: 'keyValue', type: 'string', defaultValue: ''}
	]

// create a custom function here that handles curtains and orientation changes.

});



Ext.regModel('modelSAPSoldTo',{
	fields:[
	{name: 'isSelected', type: 'string', defaultValue: ''},
	{name: 'customerCity',     type: 'string'},
	{name: 'customerName',     type: 'string'},
	{name: 'customerNo',     type: 'string'}
	]
});

Ext.regModel('modelSapShipTo',{
	fields:[
	{name: 'isSelected', type: 'string', defaultValue: ''},	        
	{name: 'city',     type: 'string'},
	{name: 'cityLine',     type: 'string'},
	{name: 'country',     type: 'string'},
	{name: 'currency',     type: 'string'},
	{name: 'customerId',     type: 'string'},
	{name: 'distChannel',     type: 'string'},
	{name: 'division',     type: 'string'},
	{name: 'divisionDesc',     type: 'string'},
	{name: 'emailAddress',     type: 'string'},
	{name: 'faxNumber',     type: 'string'},
	{name: 'firstName',     type: 'string'},
	{name: 'jobFunction',     type: 'string'},
	{name: 'lastName',     type: 'string'},
	{name: 'name3',     type: 'string'},
	{name: 'name4',     type: 'string'},
	{name: 'otherCity',     type: 'string'},
	{name: 'otherCountry',     type: 'string'},
	{name: 'partnerID',     type: 'string'},
	{name: 'partnerNo',     type: 'string'},
	{name: 'phoneNo1',     type: 'string'},
	{name: 'phoneNo2',     type: 'string'},
	{name: 'poBox',     type: 'string'},
	{name: 'postalCode',     type: 'string'},
	{name: 'salesOrg',     type: 'string'},
	{name: 'salesOrgDesc',     type: 'string'},
	{name: 'state',     type: 'string'},
	{name: 'zipCode',     type: 'string'}
	]
/*
,
	sorters: [
	          {
	              property : 'firstName',
	              direction: 'ASC'
	          }
	      ],
*/	      
});

Ext.regModel('modelSapOrders2',{
	fields:[
	{name: 'billtoAddress',     type: 'string'},
	{name: 'bpNumber',     type: 'string'},
	{name: 'currency',     type: 'string'},
	{name: 'disChannel',     type: 'string'},
	{name: 'division',     type: 'string'},
	{name: 'docDate',     type: 'string'},
	{name: 'docNumber',     type: 'string'},
	{name: 'docType',     type: 'string'},
	{name: 'headerDescription',     type: 'string'},
	{name: 'ipcConnectionKey',     type: 'string'},
	{name: 'isSoldToVisible',     type: 'string'},
	{name: 'netValue',     type: 'string'},
	{name: 'ordItems',     type: 'string'},
	{name: 'payerAddress',     type: 'string'},
	{name: 'payerCity',     type: 'string'},
	{name: 'payerName',     type: 'string'},
	{name: 'payerNumber',     type: 'string'},
	{name: 'paymentTerms',     type: 'string'},
	{name: 'processType',     type: 'string'},
	{name: 'purchaseOrderExt',     type: 'string'},
	{name: 'pyNumber',     type: 'string'},
	{name: 'reqDeliveryDate',     type: 'string'},
	{name: 'salesOrg',     type: 'string'},
	{name: 'shNumber',     type: 'string'},
	{name: 'shipCond',     type: 'string'},
	{name: 'shipToAddress',     type: 'string'},
	{name: 'shipToCity',     type: 'string'},
	{name: 'shipToName',     type: 'string'},
	{name: 'shipToNumber',     type: 'string'},
	{name: 'soldToAddress',     type: 'string'},
	{name: 'soldToCity',     type: 'string'},
	{name: 'soldToName',     type: 'string'},
	{name: 'soldToNumber',     type: 'string'},
	{name: 'spNumber',     type: 'string'},
	{name: 'totalOrderVolume',     type: 'string'},
	{name: 'totalOrderVolumeUOM',     type: 'string'},
	{name: 'totalOrderWeight',     type: 'string'},
	{name: 'totalOrderWeightUOM',     type: 'string'}
	],
	
	
});

Ext.regModel('modelSapDetails',{
	fields:[
	{name: 'batchOption',     type: 'string'},
	{name: 'batchOptionTxt',     type: 'string'},
	{name: 'confirmedQuantity',     type: 'string'},
	{name: 'currency',     type: 'string'},
	{name: 'customerPOItem',     type: 'string'},
	{name: 'customerProduct',     type: 'string'},
	{name: 'customerProductDesc',     type: 'string'},
	{name: 'deliveredQuantity',     type: 'string'},
	{name: 'description',     type: 'string'},
	{name: 'finalShippedDate',     type: 'string'},
	{name: 'freeQuantity',     type: 'string'},
	{name: 'isAvailableInPartnerCatalog',     type: 'string'},
	{name: 'itemDelivery',     type: 'string'},
	{name: 'itemValue',     type: 'string'},
	{name: 'loadLast',     type: 'string'},
	{name: 'netPrice',     type: 'string'},
	{name: 'netPriceUnit',     type: 'string'},
	{name: 'netQuantPriceUnit',     type: 'string'},
	{name: 'numberInt',     type: 'string'},
	{name: 'oldQuantity',     type: 'string'},
	{name: 'ordCallOff',     type: 'string'},
	{name: 'ordDelivery',     type: 'string'},
	{name: 'ordItemSch',     type: 'string'},
	{name: 'product',     type: 'string'},
	{name: 'productNo',     type: 'string'},
	{name: 'quantity',     type: 'string'},
	{name: 'quantityToDeliver',     type: 'string'},
	{name: 'reqDeliveryDate',     type: 'string'},
	{name: 'shipToAddress',     type: 'string'},
	{name: 'shippedFrom',     type: 'string'},
	{name: 'status',     type: 'string'},
	{name: 'totalLineVolume',     type: 'string'},
	{name: 'totalLineWeight',     type: 'string'},
	{name: 'unit',     type: 'string'},
	{name: 'unitOfVolume',     type: 'string'},
	{name: 'unitOfWeight',     type: 'string'}
	]
});

Ext.regModel('modelSapDeliveries',{
	fields:[
	{name: 'ordernum',     type: 'string'},	        
	{name: 'itemnum',     type: 'string'},	        
	{name: 'actualShippingDate',     type: 'string'},
	{name: 'carrier',     type: 'string'},
	{name: 'deliveryNo',     type: 'string'},
	{name: 'deliveryPosition',     type: 'string'},
	{name: 'objectId',     type: 'string'},
	{name: 'plannedSippingtDate',     type: 'string'},
	{name: 'quantity',     type: 'string'},
	{name: 'trackingNo',     type: 'string'},
	{name: 'trackingURL',     type: 'string'},
	{name: 'unitOfMeasurement',     type: 'string'}
	]
});


Ext.regModel('Search', {
    fields: [
        {name: 'soldTo',     type: 'string'},
        {name: 'docFrom',     type: 'string'},
        {name: 'docTo',     type: 'string'},
        {name: 'username',     type: 'string'},
        {name: 'password',     type: 'string'}
    ]
});

Ext.regModel('modelSAPOrders', {
	fields: [
	         {name: 'refreshed', type: 'string', defaultValue: ''},
	         {name: 'itemsRefreshed', type: 'string', defaultValue: ''},	         
	         {name: 'orderDisclose', type: 'string', defaultValue: '2'},
	         {name: 'isSelected', type: 'string', defaultValue: ''},
	         {name: 'isShipToFiltered', type: 'string', defaultValue: ''},	         
	         {name: 'itemCount', type: 'string', defaultValue: '0'},
	         {name: 'hasItems', type: 'string', defaultValue: '0'},
	         {name: 'Text', type: 'string', defaultValue: ''},
	         {name: '_children',  type: 'string' , defulautValue: ''},
	         {name: 'actualDeliveredQuantity',  type: 'string' , defulautValue: ''},
	         {name: 'actualGoodsMovementDate',  type: 'string' , defulautValue: ''},
	         {name: 'billingDocPostingStatus',  type: 'string' , defulautValue: ''},
	         {name: 'billingStatus',  type: 'string' , defulautValue: ''},
	         {name: 'contractValidFrom',  type: 'string' , defulautValue: ''},
	         {name: 'contractValidTo',  type: 'string' , defulautValue: ''},
	         {name: 'contractValidityPeriod',  type: 'string' , defulautValue: ''},
	         {name: 'createdDate',  type: 'string' , defulautValue: ''},
	         {name: 'cumulativeOrderQty',  type: 'string' , defulautValue: ''},
	         {name: 'custPoNumber',  type: 'string' , defulautValue: ''},
	         {name: 'customerAddress',  type: 'string' , defulautValue: ''},
	         {name: 'customerPoNumber',  type: 'string' , defulautValue: ''},
	         {name: 'customerPoNumberDispatchedOrder',  type: 'string' , defulautValue: ''},
	         {name: 'customerProductDesc',  type: 'string' , defulautValue: ''},
	         {name: 'delayStatus',  type: 'string' , defulautValue: ''},
	         {name: 'deliveryAddress',  type: 'string' , defulautValue: ''},
	         {name: 'deliveryStatus',  type: 'string' , defulautValue: ''},
	         {name: 'deliveryStatusOfItems',  type: 'string' , defulautValue: ''},
	         {name: 'distChannel',  type: 'string' , defulautValue: ''},
	         {name: 'division',  type: 'string' , defulautValue: ''},
	         {name: 'documentDate',  type: 'string' , defulautValue: ''},
	         {name: 'documentNumber',  type: 'string' , defulautValue: ''},
	         {name: 'entryTime',  type: 'string' , defulautValue: ''},
	         {name: 'goodsMovementStatus',  type: 'string' , defulautValue: ''},
	         {name: 'inCompletionStatus',  type: 'string' , defulautValue: ''},
	         {name: 'inCompletionStatusOfBilling',  type: 'string' , defulautValue: ''},
	         {name: 'inCompletionStatusOfDeliveryItems',  type: 'string' , defulautValue: ''},
	         {name: 'inCompletionStatusOfHeader',  type: 'string' , defulautValue: ''},
	         {name: 'materialLongDesc',  type: 'string' , defulautValue: ''},
	         {name: 'materialNo',  type: 'string' , defulautValue: ''},
	         {name: 'materialNumberByCustomer',  type: 'string' , defulautValue: ''},
	         {name: 'netValue',  type: 'string' , defulautValue: ''},
	         {name: 'orderBillingStatus',  type: 'string' , defulautValue: ''},
	         {name: 'orderReason',  type: 'string' , defulautValue: ''},
	         {name: 'orderType',  type: 'string' , defulautValue: ''},
	         {name: 'overAllBillingBlockStatus',  type: 'string' , defulautValue: ''},
	         {name: 'overAllBlockedStatus',  type: 'string' , defulautValue: ''},
	         {name: 'overAllDeliveryBlockStatus',  type: 'string' , defulautValue: ''},
	         {name: 'packingStatus',  type: 'string' , defulautValue: ''},
	         {name: 'pickConfirmationStatus',  type: 'string' , defulautValue: ''},
	         {name: 'pickingStatus',  type: 'string' , defulautValue: ''},
	         {name: 'podStatusHeader',  type: 'string' , defulautValue: ''},
	         {name: 'processingStatusOfDoc',  type: 'string' , defulautValue: ''},
	         {name: 'reasonForCancellation',  type: 'string' , defulautValue: ''},
	         {name: 'reasonForRejection',  type: 'string' , defulautValue: ''},
	         {name: 'refDocumentHeaderStatus',  type: 'string' , defulautValue: ''},
	         {name: 'refStatusOfItems',  type: 'string' , defulautValue: ''},
	         {name: 'rejectionStatusOfItems',  type: 'string' , defulautValue: ''},
	         {name: 'requestedDeliveryDate',  type: 'string' , defulautValue: ''},
	         {name: 'salesDocumentItem',  type: 'string' , defulautValue: ''},
	         {name: 'salesDocumentType',  type: 'string' , defulautValue: ''},
	         {name: 'salesOrg',  type: 'string' , defulautValue: ''},
	         {name: 'salesUnit',  type: 'string' , defulautValue: ''},
	         {name: 'sdDocumentCategory',  type: 'string' , defulautValue: ''},
	         {name: 'sdDocumentCurrency',  type: 'string' , defulautValue: ''},
	         {name: 'sdItemNo',  type: 'string' , defulautValue: ''},
	         {name: 'searchTerm',  type: 'string' , defulautValue: ''},
	         {name: 'shipToCity',  type: 'string' , defulautValue: ''},
	         {name: 'shipToName',  type: 'string' , defulautValue: ''},
	         {name: 'shipToNo',  type: 'string' , defulautValue: ''},
	         {name: 'soldTo',  type: 'string' , defulautValue: ''},
	         {name: 'soldToCity',  type: 'string' , defulautValue: ''},
	         {name: 'soldToName',  type: 'string' , defulautValue: ''},
	         {name: 'status',  type: 'string' , defulautValue: ''},
	         {name: 'statusz',  type: 'string' , defulautValue: ''},
	         {name: 'totalInCompletionStatusForPackaging',  type: 'string' , defulautValue: ''},
	         {name: 'totalInCompletionStatusForPicking',  type: 'string' , defulautValue: ''},
	         {name: 'totalInCompletionStatusForPostGoodsMvmt',  type: 'string' , defulautValue: ''},
	         {name: 'unitOfContractValidityPeriod',  type: 'string' , defulautValue: ''}
	         ],
	         
	         formatItemRefreshDate: function() {
	        	 var currDate = this.get('itemsRefreshed');
	        	 newDate = 'Rob Was Here';
	        	 
	        	 this.set('itemsRefreshed');
	         },
	         
	         hasMany: { model: 'modelSapDetails', name: 'orderItems'},
});


/* **************************************************************** */
/*                  User Store Model                               */
/* **************************************************************** */

Ext.regModel('SAMUser', {
    fields: ['userName', 'password','lastUpdated', 'numOfDays', 'lastResponse'],
    refreshResponse: function() {
    	var myD = new Date();
    	var myName = this.get('userName');
    	var myPassword = this.get('password');
    	var myResponse = this.get('lastResponse');
    	var daysOfHistory = this.get('numOfDays');
    	
		db.transaction(function(transaction){transaction.executeSql('DELETE FROM tblLogin',[],[],db.onError)});					
		db.transaction(function(transaction){transaction.executeSql('INSERT INTO tblLogin (username, password, refreshed, lastResponse, daysOfHistory) VALUES (?,?,?,?,?)',[myName,myPassword,myD,myResponse,daysOfHistory],[],db.onError)});
    }
});


/* **************************************************************** */
/*                  Store Instantiation                             */
/* **************************************************************** */

mobilens.SAMuserStore = new Ext.data.Store({
	model: 'SAMUser'
});

mobilens.storeSAPSoldToPartners = new Ext.data.Store({
    model: 'modelSAPSoldTo'
});

mobilens.storeSAPShipToCustomers = new Ext.data.Store({
    model: 'modelSapShipTo',
	sorters: 'firstName',
	getGroupString : function(record) {
		return record.get('firstName')[0];
	},
});

mobilens.storeSAPOrders2 = new Ext.data.Store({
    model: 'modelSapOrders2'
});

mobilens.storeSAPDetails = new Ext.data.Store({
    model: 'modelSapDetails'
});

mobilens.storeSAPDeliveries = new Ext.data.Store({
    model: 'modelSapDeliveries'
});

mobilens.storeDaysOfHistory = new Ext.data.Store({
    model: 'modelSAPSoldTo'
});

mobilens.storeMessages = new Ext.data.Store({
    model: 'modelMessageStore',
});

mobilens.storeSAPOrders = new Ext.data.Store({
	model: 'modelSAPOrders',
	sorters: 'documentNumber',
	storeId: 'primaryOrderDisplay',
	getGroupString : function(record) {
		return record.get('documentNumber')[0];
	},
});



/* **************************************************************** */
/*                  Store Defaults                                  */
/* **************************************************************** */

mobilens.storeDaysOfHistory.add({isSelected: '0'}); 
mobilens.storeMessages.add({msg1:'...Please wait while data is updated...',msg2:'...No Deliveries Exist...'});


