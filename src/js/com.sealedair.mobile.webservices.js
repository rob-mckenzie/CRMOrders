/*!
 * assumes an include of jQuery JavaScript Library v1.4.4 http://jquery.com/
 * assumes an include of saXMLUtils.js library for XML to json http://www.terracoder.com/docs/XMLObjectifier.pdf
 *
 * Date: DEC 19 2010
 * By:  Jason Brummett
 * 
 * Modfied: April 12 2011
 * By: Ryan Van Vleet
 */

//The calling soap message is defined by the WSDL.  I used ECLIPSE soap test client to test the call.
//and to get the 'marshalled' soap envelope specification below.

//var server = "http://172.16.172.71:50000"
//var server = "https://sapecomdev.sealedair.com:443"
//var server = "https://sapecomtest.sealedair.com:443/"
//var server = "https://myextracare.sealedair.com/"

var loginStatus = '';
var jsonSAPLogin ={};
var personalStatus = '';
var jsonSAPPersonal ={};
var partnerStatus = '';
var jsonSAPPartners = {};
var callbackstatus = '';
var jsonSAPOrders ={};
var callbackdetailstatus = '';
var jsonSAPOrderDetails ={};




function soapSAPLogin(username, password, getBaseData){ 	
	var soapMessage = '<SOAP-ENV:Envelope \
	    xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" \
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance\" \
		xmlns:xs="http://www.w3.org/2001/XMLSchema\"> \
		<SOAP-ENV:Body> \
		<pns:login xmlns:pns=\'urn:MobileLoginWSVi\'> \
		<pns:username>'+username+'</pns:username> \
		<pns:password>'+password+'</pns:password> \
		</pns:login> \
		</SOAP-ENV:Body> \
		</SOAP-ENV:Envelope>';	
	
//		$ is the jQuery factory.  The ajax method is a nice wrapping of the JS standard XMLHttpRequest(); however I think either could be used
//		it may makes sense to handle the AJAX via the standard methods if we need to manipulate HTTP headers for any reason

		//Ext.getBody().mask('Loading&hellip','data-loading',true);		
		
		$.ajax({
			async: false,
			url: mobilens.hostname+"/MobileLoginWS/Config1?style=document",
			type: "POST",
			dataType: "XML",
			data: soapMessage,
			complete: restifySAPLoginXML,
			contentType: "text/xml; charset=\"utf-8\""
		});
		
		if(loginStatus == 'success'){
			var d = new Date();
			var loginResponse = jsonSAPLogin['Body'][0]['loginResponse'][0]['Response'][0]['errorMessage'][0]['Text'];
			
			if( loginResponse == 'Success' && getBaseData === '1') 
				{ soapSAPPersonal(username,password,d); }
			return loginResponse;
		}
		else {
			return loginStatus;
		}   	
};

function restifySAPLoginXML(xmlHttpRequest, status){
	if(status == 'success'){
		loginStatus = status;		
		jsonSAPLogin = XMLObjectifier.xmlToJSON(xmlHttpRequest.responseXML);
		//XMLObjectifier called here to turn the XML from SAPs webservice into JSON 
	}
	else{
		console.log('Not able to connect to server or no network connection available!');
		//Ext.Msg.alert('SAP Orders Not Updated', '(VPN connection required). Using Local Data', Ext.emptyFn);
	}
};

function soapSAPPersonal(username, password,d){ 	
	var soapMessage = '<SOAP-ENV:Envelope \
	    xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" \
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance\" \
		xmlns:xs="http://www.w3.org/2001/XMLSchema\"> \
		<SOAP-ENV:Header> \
		<sapsess:Session xmlns:sapsess=\"http://www.sap.com/webas/630/soap/features/session/\"> \
		<enableSession>true</enableSession> \
		</sapsess:Session> \
		</SOAP-ENV:Header> \
		<SOAP-ENV:Body> \
		<pns:getUserPersonalization xmlns:pns=\'urn:MobileUserPersonalizationWSVi\'> \
		<pns:username>'+username+'</pns:username> \
		<pns:password>'+password+'</pns:password> \
		</pns:getUserPersonalization> \
		</SOAP-ENV:Body> \
		</SOAP-ENV:Envelope>';	

//		$ is the jQuery factory.  The ajax method is a nice wrapping of the JS standard XMLHttpRequest(); however I think either could be used
//		it may makes sense to handle the AJAX via the standard methods if we need to manipulate HTTP headers for any reason

	//Ext.getBody().mask('Loading&hellip','data-loading',true);		
		
		$.ajax({
			async: false,
			url: mobilens.hostname+"/MobileUserPersonalizationWS/Config1?style=document",
			type: "POST",
			dataType: "XML",
			data: soapMessage,
			complete: restifySAPPersonalXML,
			contentType: "text/xml; charset=\"utf-8\""
		});
				
		if(personalStatus == 'success'){
			var personalResponse = jsonSAPPersonal['Body'][0]['getUserPersonalizationResponse'][0]['Response'][0]['errorMessage'][0]['Text'];
			if(personalResponse == 'Success'){
				var jsonSAPuserPersonalization = jsonSAPPersonal['Body'][0]['getUserPersonalizationResponse'][0]['Response'][0]['userPersonalization'][0]['customers'];
				//var jsonSAPPersonalCustomers = jsonSAPPersonal['Body'][0]['getUserPersonalizationResponse'][0]['Response'][0]['userPersonalization'][0]['customers'][0]['CustomerBean'];
								
				if (typeof jsonSAPuserPersonalization === 'undefined'){  
	                alert('No Sold To partners are defined for your user id.  Please contact your sales administration!');
	            }
				else{
					var jsonSAPPersonalCustomers = jsonSAPPersonal['Body'][0]['getUserPersonalizationResponse'][0]['Response'][0]['userPersonalization'][0]['customers'][0]['CustomerBean'];
					db.transaction(function(transaction){transaction.executeSql('DELETE FROM tblSoldTo',[],[],db.onError)});
					db.transaction(function(transaction){
						var soldtolist ='';
						for (i=0; i<=jsonSAPPersonalCustomers.length-1; i++){
        	    		jsonSAPCustomersTransformed = buildSAPOrderItemsJSON(jsonSAPPersonalCustomers[i]);        	    		
        	    		var soldtonum = jsonSAPCustomersTransformed.substring(jsonSAPCustomersTransformed.indexOf("\",\"customerNo\":\"")+16,jsonSAPCustomersTransformed.indexOf("\"}"));
        	    		transaction.executeSql('INSERT INTO tblSoldTo (soldto, JSONSoldTo, refreshed) VALUES (?,?,?)',[soldtonum,jsonSAPCustomersTransformed,d],[],db.onError);
						soldtolist=soldtolist+'<pns:String>'+soldtonum+'</pns:String>';
						}
						
						var jsonSAPPeronalSalesAreas = 	jsonSAPPersonal['Body'][0]['getUserPersonalizationResponse'][0]['Response'][0]['userPersonalization'][0]['salesAreas'][0]['SalesAreaBean'];
						var distchannellist ='';
						var divisionlist='';
						var salesorglist=''; 
						if (typeof jsonSAPPeronalSalesAreas === 'undefined'){
						console.log('you have no sales areas');
						soapSAPPartners(username,password,soldtolist,salesorglist,divisionlist,distchannellist,d);
						}
						else{
							
							db.transaction(function(transaction){transaction.executeSql('DELETE FROM tblSalesArea',[],[],db.onError)});
							db.transaction(function(transaction){
							
								
								for (i=0; i<=jsonSAPPeronalSalesAreas.length-1; i++){
				        		jsonSAPSalesAreaTransformed = buildSAPOrderItemsJSON(jsonSAPPeronalSalesAreas[i]);        	    		
				        		jsonSAPSalesAreaTransformed1 = buildSAPOrderItemsJSON(jsonSAPPeronalSalesAreas[i]);        	    		
				        		jsonSAPSalesAreaTransformed2 = buildSAPOrderItemsJSON(jsonSAPPeronalSalesAreas[i]);        	    		
				        		
				        		var distchannel = jsonSAPSalesAreaTransformed.substring(jsonSAPSalesAreaTransformed.indexOf("\",\"distChannel\":\"")+17,jsonSAPSalesAreaTransformed.indexOf("\",\"division\":\""));
				        		var salesorg = jsonSAPSalesAreaTransformed.substring(jsonSAPSalesAreaTransformed.indexOf("\",\"salesOrg\":\"")+14,jsonSAPSalesAreaTransformed.indexOf("\"}"));
				        		var division = jsonSAPSalesAreaTransformed.substring(jsonSAPSalesAreaTransformed.indexOf("\",\"division\":\"")+14,jsonSAPSalesAreaTransformed.indexOf("\",\"salesOrg\":\""));
				        				
				        		transaction.executeSql('INSERT INTO tblSalesArea (salesorg, division, distchannel, JSONSalesArea, refreshed) VALUES (?,?,?,?,?)',[salesorg,division,distchannel,jsonSAPSalesAreaTransformed,d],[],db.onError);
				        		distchannellist=distchannellist+'<pns:String>'+distchannel+'</pns:String>';
				        		divisionlist=divisionlist+'<pns:String>'+division+'</pns:String>';
				        		salesorglist=salesorglist+'<pns:String>'+salesorg+'</pns:String>';				        							        		
								}	
								soapSAPPartners(username,password,soldtolist,salesorglist,divisionlist,distchannellist,d);
							})					
						}											
					})					
				}
			}
			else{
				alert('Login Error: '+personalResponse);
			}	
		}   	
};

function restifySAPPersonalXML(xmlHttpRequest, status){
	if(status == 'success'){
		personalStatus = status;
		jsonSAPPersonal = XMLObjectifier.xmlToJSON(xmlHttpRequest.responseXML);
		//XMLObjectifier called here to turn the XML from SAPs webservice into JSON (because everyone knows JSON is best:>)   
	}
	else{
		alert('Not able to connect to server or no network connection available!');
	}
};

function soapSAPPartners(username,password,soldtolist,salesorglist,divisionlist,dischannellist,d){	
		
		if(salesorglist ==''){
			var soapMessage = '<SOAP-ENV:Envelope \
			    xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" \
				xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" \
				xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"> \
				<SOAP-ENV:Header> \
				<sapsess:Session xmlns:sapsess=\"http://www.sap.com/webas/630/soap/features/session/\"> \
				<enableSession>true</enableSession> \
				</sapsess:Session> \
				</SOAP-ENV:Header> \
				<SOAP-ENV:Body> \
				<pns:getPartners xmlns:pns=\'urn:MobileGetPartnersWSVi\'> \
				<ns1:customers xmlns:ns1=\'urn:MobileGetPartnersWSVi\' \
				xmlns:pns=\'urn:java/lang\'>'
				+soldtolist+
				'</ns1:customers> \
				<pns:salesOrg xsi:nil=\'true\'></pns:salesOrg> \
				<pns:division xsi:nil=\'true\'></pns:division> \
				<pns:distChannel xsi:nil=\'true\'></pns:distChannel> \
				<ns2:partnerFunctions xmlns:ns2=\'urn:MobileGetPartnersWSVi\' \
				xmlns:pns=\'urn:java/lang\'> \
				<pns:String>WE</pns:String> \
				</ns2:partnerFunctions>	\
				<pns:username>'+username+'</pns:username> \
				<pns:password>'+password+'</pns:password> \
				</pns:getPartners> \
				</SOAP-ENV:Body> \
				</SOAP-ENV:Envelope>';
		}
		else{
			var soapMessage = '<SOAP-ENV:Envelope \
				xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" \
				xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"> \
				<SOAP-ENV:Header><sapsess:Session xmlns:sapsess=\"http://www.sap.com/webas/630/soap/features/session/\"> \
				<enableSession>true</enableSession></sapsess:Session></SOAP-ENV:Header><SOAP-ENV:Body> \
				<pns:getPartners xmlns:pns=\'urn:MobileGetPartnersWSVi\'> \
				<ns1:customers xmlns:ns1=\'urn:MobileGetPartnersWSVi\' \
				xmlns:pns=\'urn:java/lang\'>'
				+soldtolist+
				'</ns1:customers> \
				<ns2:salesOrg xmlns:ns2=\'urn:MobileGetPartnersWSVi\' \
				xmlns:pns=\'urn:java/lang\'>'
				+salesorglist+
				'</ns2:salesOrg> \
				<ns3:division xmlns:ns3=\'urn:MobileGetPartnersWSVi\' \
				xmlns:pns=\'urn:java/lang\'>'
				+divisionlist+
				'</ns3:division> \
				<ns4:distChannel xmlns:ns4=\'urn:MobileGetPartnersWSVi\' \
				xmlns:pns=\'urn:java/lang\'>'
				+dischannellist+
				'</ns4:distChannel> \
				<ns5:partnerFunctions \
				xmlns:ns5=\'urn:MobileGetPartnersWSVi\' \
				xmlns:pns=\'urn:java/lang\'> \
				<pns:String>WE</pns:String> \
				</ns5:partnerFunctions> \
				<pns:username>'+username+'</pns:username> \
				<pns:password>'+password+'</pns:password> \
				</pns:getPartners> \
				</SOAP-ENV:Body> \
				</SOAP-ENV:Envelope>';
			
		}
		
		
		
		//console.log(soapMessage);

//		$ is the jQuery factory.  The ajax method is a nice wrapping of the JS standard XMLHttpRequest(); however I think either could be used
//		it may makes sense to handle the AJAX via the standard methods if we need to manipulate HTTP headers for any reason

		//Ext.getBody().mask('Loading&hellip','data-loading',true);		
		
		$.ajax({
			async: false,
			url: mobilens.hostname+"/MobileGetPartnersWS/Config1?style=document",
			type: "POST",
			dataType: "XML",
			data: soapMessage,
			complete: restifySAPPartnersXML,
			contentType: "text/xml; charset=\"utf-8\""
		});
				
		if(partnerStatus == 'success'){
			
			var partnerResponse = jsonSAPPartners['Body'][0]['getPartnersResponse'][0]['Response'][0]['errorMessage'][0]['Text'];
			if(partnerResponse == 'Success'){
				var jsonSAPShipToCustomers = jsonSAPPartners['Body'][0]['getPartnersResponse'][0]['Response'][0]['partners'][0]['Partner'];
				if (typeof jsonSAPShipToCustomers === 'undefined'){  
	                alert('No Ship To partners are defined for your user id.  Please contact your sales administration!');
	            }
				else{
					db.transaction(function(transaction){transaction.executeSql('DELETE FROM tblShipTo',[],[],db.onError)});
					db.transaction(function(transaction){						
						for (i=0; i<=jsonSAPShipToCustomers.length-1; i++){
        	    		jsonSAPShipToTransformed = buildSAPOrderItemsJSON(jsonSAPShipToCustomers[i]);        	    		
        	    		var shiptonum = jsonSAPShipToTransformed.substring(jsonSAPShipToTransformed.indexOf("\",\"partnerNo\":\"")+15,jsonSAPShipToTransformed.indexOf("\",\"phoneNo1\""));
        	    		var salesorg = jsonSAPShipToTransformed.substring(jsonSAPShipToTransformed.indexOf("\",\"salesOrg\":\"")+14,jsonSAPShipToTransformed.indexOf("\",\"salesOrgDesc\""));
        	    		var division = jsonSAPShipToTransformed.substring(jsonSAPShipToTransformed.indexOf("\",\"division\":\"")+14,jsonSAPShipToTransformed.indexOf("\",\"divisionDesc\""));
        	    		var distchannel = jsonSAPShipToTransformed.substring(jsonSAPShipToTransformed.indexOf("\",\"distChannel\":\"")+17,jsonSAPShipToTransformed.indexOf("\",\"division\""));
        	    		transaction.executeSql('INSERT INTO tblShipTo (shipto, salesorg, division, distchannel, JSONShipTo, refreshed) VALUES (?,?,?,?,?,?)',[shiptonum,salesorg,division,distchannel,jsonSAPShipToTransformed,d],[],db.onError);
						};
					});
				}
			}
			else{
				alert('Login Error: '+partnerResponse);
			}	
		}		
		else{
		}   	
};

function restifySAPPartnersXML(xmlHttpRequest, status){
	if(status == 'success'){
		partnerStatus = status;
		jsonSAPPartners = XMLObjectifier.xmlToJSON(xmlHttpRequest.responseXML);
		//XMLObjectifier called here to turn the XML from SAPs webservice into JSON (because everyone knows JSON is best:>)   
	}
	else{
		alert('Not able to connect to server or no network connection available!');
	}
};

function soapSAPOrders(docfrom, docto, username, password) 
{ 	
	var soapMessage = '<SOAP-ENV:Envelope \
	    xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" \
		xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance\" \
		xmlns:xs="http://www.w3.org/2001/XMLSchema\"> \
		<SOAP-ENV:Header> \
		<sapsess:Session xmlns:sapsess=\"http://www.sap.com/webas/630/soap/features/session/\"> \
		<enableSession>true</enableSession> \
		</sapsess:Session> \
		</SOAP-ENV:Header> \
		<SOAP-ENV:Body> \
		<pns:findorder xmlns:pns=\'urn:MobileFindOrderWSVi\'> \
		<pns:soldTo></pns:soldTo> \
		<pns:shipTo></pns:shipTo> \
		<pns:docFrom>'+docfrom+'T00:00:00.000+00:00</pns:docFrom> \
		<pns:docTo>'+docto+'T23:59:59.999+00:00</pns:docTo> \
		<pns:productType></pns:productType> \
		<pns:customerProductNo></pns:customerProductNo> \
		<pns:docStat></pns:docStat> \
		<pns:documentId></pns:documentId> \
		<pns:poNumber></pns:poNumber> \
		<pns:materialNo></pns:materialNo> \
		<pns:username>'+username+'</pns:username> \
		<pns:password>'+password+'</pns:password> \
		</pns:findorder> \
		</SOAP-ENV:Body> \
		</SOAP-ENV:Envelope>';	

//		$ is the jQuery factory.  The ajax method is a nice wrapping of the JS standard XMLHttpRequest(); however I think either could be used
//		it may makes sense to handle the AJAX via the standard methods if we need to manipulate HTTP headers for any reason
		d= new Date();
	
		//Ext.getBody().mask('Loading&hellip','data-loading',true);		
		
		$.ajax({
			async: false,
			url: mobilens.hostname+"/MobileFindOrderWS/Config1?style=document",
			type: "POST",
			dataType: "XML",
			data: soapMessage,
			complete: restifySAPOrdersXML,
			contentType: "text/xml; charset=\"utf-8\""
		});
				
		if(callbackstatus == 'success'){
			
			var jsonSAPOrderItems = jsonSAPOrders['Body'][0]['findorderResponse'][0]['Response'][0]['orderResults'][0]['OrderBean'];
			
			if (typeof jsonSAPOrderItems === 'undefined'){	
				alert('No records matched your selection criteria.  Local data will remain the same!');
			}
			else{
				
				db.transaction(function(transaction){transaction.executeSql('DELETE FROM tblOrders',[],[],db.onError)});
				db.transaction(function (tx) {
					for (i=0; i<=jsonSAPOrderItems.length-1; i++){
        	    		jsonSAPOrdersTransformed = buildSAPOrderItemsJSON(jsonSAPOrderItems[i]);
        	    		var ordernum = jsonSAPOrdersTransformed.substring(jsonSAPOrdersTransformed.indexOf("\",\"documentNumber\":\"")+20,jsonSAPOrdersTransformed.indexOf("\",\"entryTime\""));
        	    		tx.executeSql('INSERT INTO tblOrders (ordernum, JSONOrderHeader, refreshed) VALUES (?,?,?)',[ordernum,jsonSAPOrdersTransformed,d],db.onSuccess,db.onError);        	    		
        	    		};
        	    		//console.log(i+' sales order headers added to local SQL!');
				});
				
        	    db.transaction(function(transaction){transaction.executeSql('SELECT tblOrders2.ordernum FROM tblOrders2 LEFT JOIN tblOrders ON tblOrders2.ordernum = tblOrders.ordernum where tblOrders.ordernum IS NULL',[],function (tx, results) {
        	    		  var len = results.rows.length, i;
        	    		  for (i = 0; i < len; i++) {
        	    		    //alert(results.rows.item(i).ordernum);
        	    		    tx.executeSql('DELETE FROM tblOrders2 where tblOrders2.ordernum = \''+results.rows.item(i).ordernum+'\'')
        	    		  }
        	    		},db.onError)});
        	    
        	    db.transaction(function(transaction){transaction.executeSql('SELECT tblDetails.ordernum FROM tblDetails LEFT JOIN tblOrders ON tblDetails.ordernum = tblOrders.ordernum where tblOrders.ordernum IS NULL',[],function (tx, results) {
  	    		  var len = results.rows.length, i;
  	    		  for (i = 0; i < len; i++) {
  	    		    //alert(results.rows.item(i).ordernum);
  	    		    tx.executeSql('DELETE FROM tblDetails where tblDetails.ordernum = \''+results.rows.item(i).ordernum+'\'')
  	    		  }
  	    		},db.onError)});
        	    
        	    db.transaction(function(transaction){transaction.executeSql('SELECT tblDeliveries.ordernum FROM tblDeliveries LEFT JOIN tblOrders ON tblDeliveries.ordernum = tblOrders.ordernum where tblOrders.ordernum IS NULL',[],function (tx, results) {
  	    		  var len = results.rows.length, i;
  	    		  for (i = 0; i < len; i++) {
  	    		    //alert(results.rows.item(i).ordernum);
  	    		    tx.executeSql('DELETE FROM tblDeliveries where tblDeliveries.ordernum = \''+results.rows.item(i).ordernum+'\'')
  	    		  }
  	    		},db.onError)});       	    
			};			
		}
		else{
			var curr_hour = d.getHours();
			var curr_min = d.getMinutes();
			var curr_sec = d.getSeconds();
		    var txtNORECSOrderView = "[{\"VBELN\":\"Warning:  No records loaded from SAP.  Updated at "+curr_hour + " - " + curr_min + " - " + curr_sec+"\", \"AUART\":\"\"}]";
			var jsonNORECSOrderView= JSON.parse(txtNORECSOrderView);
			Ext.Msg.alert('SAP Orders Not Updated', '(VPN connection required). Using Local Data', Ext.emptyFn);
		};   	
};

function restifySAPOrdersXML(xmlHttpRequest, status){
	if(status == 'success'){
		callbackstatus = status;
		jsonSAPOrders = XMLObjectifier.xmlToJSON(xmlHttpRequest.responseXML);
		//XMLObjectifier called here to turn the XML from SAPs webservice into JSON (because everyone knows JSON is best:>)   
	}
	else{
		Ext.Msg.alert('SAP Orders Not Updated', '(Internet connection required). Using Local Data', Ext.emptyFn);
	}
};

function soapSAPOrderDetails(username, password, orders) 
{ 	
	
	if (orders.length > 0){
		var orderlist='';
		for (var i=0; i<orders.length; i++) {
			orderlist=orderlist+'<pns:String>'+orders[i]+'</pns:String>';		
		}
		
	var soapMessage = '<SOAP-ENV:Envelope \
		xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/\" \
		xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" \
		xmlns:xs=\"http://www.w3.org/2001/XMLSchema\"> \
		<SOAP-ENV:Header> \
		<sapsess:Session xmlns:sapsess=\"http://www.sap.com/webas/630/soap/features/session/\"> \
		<enableSession>true</enableSession> \
		</sapsess:Session></SOAP-ENV:Header> \
		<SOAP-ENV:Body> \
		<pns:getOrderDetails xmlns:pns=\'urn:MobileOrderDetailsWSVi\'> \
		<ns1:salesDocumentNo xmlns:ns1=\'urn:MobileOrderDetailsWSVi\' \
		xmlns:pns=\'urn:java/lang\'>'
		+orderlist+
		'</ns1:salesDocumentNo> \
		<pns:username>'+username+'</pns:username> \
		<pns:password>'+password+'</pns:password> \
		</pns:getOrderDetails> \
		</SOAP-ENV:Body> \
		</SOAP-ENV:Envelope>';

//		$ is the jQuery factory.  The ajax method is a nice wrapping of the JS standard XMLHttpRequest(); however I think either could be used
//		it may makes sense to handle the AJAX via the standard methods if we need to manipulate HTTP headers for any reason
		d= new Date();
	
		//Ext.getBody().mask('Loading&hellip','data-loading',true);		
		
		$.ajax({
			async: false,
			url: mobilens.hostname+"/MobileOrderDetailsWS/Config1?style=document",
			type: "POST",
			dataType: "XML",
			data: soapMessage,
			complete: restifySAPOrderDetailsXML,
			contentType: "text/xml; charset=\"utf-8\""
		});
				
		if(callbackdetailstatus == 'success'){
			
			var detailResponse = jsonSAPOrderDetails['Body'][0]['getOrderDetailsResponse'][0]['Response'][0]['errorMessage'][0]['Text'];
			console.log('checking it : ' + detailResponse);
			if (detailResponse == 'Success'){ 
			
				var SAPOrderHeaders = jsonSAPOrderDetails['Body'][0]['getOrderDetailsResponse'][0]['Response'][0]['orderHeaders'][0]['OrderHeader'];
				var SAPOrderDetails ='';
				var SAPOrderDeliveries = '';
			
				if (typeof SAPOrderHeaders === 'undefined'){	
					alert('No records matched your selection criteria.  Local data will remain the same!');
				}
				else{
					db.transaction(function(tx){
	        	    	for (i=0; i<=SAPOrderHeaders.length-1; i++){
	        	    		jsonSAPOrderHeadersTransformed = buildSAPOrderItemsJSON(SAPOrderHeaders[i]);
	        	    		var ordernum = jsonSAPOrderHeadersTransformed.substring(jsonSAPOrderHeadersTransformed.indexOf("\",\"docNumber\":\"")+15,jsonSAPOrderHeadersTransformed.indexOf("\",\"docType\""));
	        	    		if (ordernum.length==10){
	        	    			ordernum=ordernum;
	        	    		}
	        	    		else if (ordernum.length==9){
	        	    			ordernum='0'+ordernum;
	        	    		}
	        	    		else if (ordernum.length==8){
	        	    			ordernum='00'+ordernum;
	        	    		}
	        	    		else if (ordernum.length==7){
	        	    			ordernum='000'+ordernum;
	        	    		}
	        	    		else if (ordernum.length==6){
	        	    			ordernum='0000'+ordernum;
	        	    		}
	        	    		else if (ordernum.length==5){
	        	    			ordernum='00000'+ordernum;
	        	    		}
	        	    		else if (ordernum.length==4){
	        	    			ordernum='000000'+ordernum;
	        	    		}
	        	    		else if (ordernum.length==3){
	        	    			ordernum='0000000'+ordernum;
	        	    		}
	        	    		else if (ordernum.length==2){
	        	    			ordernum='00000000'+ordernum;
	        	    		}
	        	    		else if (ordernum.length==1){
	        	    			ordernum='000000000'+ordernum;
	        	    		}
	        	    		else {
	        	    			ordernum='0000000000'
	        	    		}
	        	    		
	        	    		tx.executeSql('DELETE FROM tblOrders2 where tblOrders2.ordernum = \''+ordernum+'\'');
	        	    		tx.executeSql('DELETE FROM tblDetails where tblDetails.ordernum = \''+ordernum+'\'');
	        	    		tx.executeSql('DELETE FROM tblDeliveries where tblDeliveries.ordernum = \''+ordernum+'\'');
	        	    		
	        	    		tx.executeSql('INSERT INTO tblOrders2 (ordernum, JSONOrderHeader2, refreshed) VALUES (?,?,?)',[ordernum,jsonSAPOrderHeadersTransformed,d],[],db.onError);
	        	    		SAPOrderDetails = SAPOrderHeaders[i]['ordItems'][0]['OrderItem'];
	        	    		
	        	    		(function(ordernum,SAPOrderDetails) {
	        	    			db.transaction(function(tx){
	        	    				for (j=0; j<=SAPOrderDetails.length-1; j++){
	        	    					jsonSAPOrderDetailsTransformed = buildSAPOrderItemsJSON(SAPOrderDetails[j]);
		                    	    	var itemnum = jsonSAPOrderDetailsTransformed.substring(jsonSAPOrderDetailsTransformed.indexOf("\",\"product\":\"")+13,jsonSAPOrderDetailsTransformed.indexOf("\",\"quantity\""));
		                	    		tx.executeSql('INSERT INTO tblDetails (ordernum, itemnum, JSONOrderDetail, refreshed) VALUES (?,?,?,?)',[ordernum,itemnum,jsonSAPOrderDetailsTransformed,d],[],db.onError);
		                	    		SAPOrderDeliveries=SAPOrderDetails[j]['ordDelivery'][0]['OrderDelivery'];
		                	    		
		                	    		(function(ordernum,itemnum,SAPOrderDeliveries) {
		                	    			db.transaction(function(tx){
		                	    				if( SAPOrderDeliveries != undefined ){
		                	    				for (k=0; k<=SAPOrderDeliveries.length-1; k++){
		                	    					jsonSAPDeliveriesTransformed = buildSAPOrderItemsJSON(SAPOrderDeliveries[k]);
		                	    					deliverynum = jsonSAPDeliveriesTransformed.substring(jsonSAPDeliveriesTransformed.indexOf("\",\"deliveryNo\":\"")+16,jsonSAPDeliveriesTransformed.indexOf("\",\"plannedSippingtDate\""));
		        	                	    		tx.executeSql('INSERT INTO tblDeliveries (ordernum, itemnum, deliverynum,JSONDeliveryDetail, refreshed) VALUES (?,?,?,?,?)',[ordernum,itemnum,deliverynum,jsonSAPDeliveriesTransformed,d],[],db.onError);
		                	    					}
		                	    				}}),console.log('delivery insert complete.');
		                	    		})(ordernum,itemnum,SAPOrderDeliveries);
	        	    				}
	        	    			});                                 
	        	    		})(ordernum,SAPOrderDetails);
	        	    	}
					});				
				};
			}
			else{
				alert(detailResponse+": local order details could not be processed!");
			}
		}
		else{
			var curr_hour = d.getHours();
			var curr_min = d.getMinutes();
			var curr_sec = d.getSeconds();
		    var txtNORECSOrderView = "[{\"VBELN\":\"Warning:  No records loaded from SAP.  Updated at "+curr_hour + " - " + curr_min + " - " + curr_sec+"\", \"AUART\":\"\"}]";
			var jsonNORECSOrderView= JSON.parse(txtNORECSOrderView);
			Ext.Msg.alert('SAP Order Details Not Updated', '(Network connection required). Using Local Data', Ext.emptyFn);
		};
	}	
	else{
	alert('No orders selected, please try again!');
	}		
		
};

function restifySAPOrderDetailsXML(xmlHttpRequest, status){
	if(status == 'success'){
		callbackdetailstatus = status;
		jsonSAPOrderDetails = XMLObjectifier.xmlToJSON(xmlHttpRequest.responseXML);
		//XMLObjectifier called here to turn the XML from SAPs webservice into JSON (because everyone knows JSON is best:>)   
	}
	else{
		Ext.Msg.alert('SAP Order Details Not Updated', '(Internet connection required). Using Local Data', Ext.emptyFn);
	}
};

function buildSAPOrderItemsJSON(orders){
	
	var i=0;
	var j=0;
	var strSep = ',';
	var strClose = '';
    var xformedSAPOrdersName = [];
	var xformedSAPOrdersValue = [];
	var xformedSAPOrdersPaired = '{';	
	
	if (orders !== null) {
		$.each(orders, function(key, value) {

		if (key === 'ordItems' ||key === 'ordDelivery' ||key === 'ordItemSch' || key == 'itemDelivery' || key === 'batchOption' ||key === 'batchOptionTxt'){			
			innerValue = 	null;
		}
		else{
			innerValue = JSON.stringify($.makeArray(value).pop()).match(/(?:"(?:[^"\\]+|\\(?:\\\\)*.)*"|'(?:[^'\\]+|\\(?:\\\\)*.)*')/g);
		};
		//console.log(key);
		//console.log(innerValue);
		
		xformedSAPOrdersName.push(key);
		if (innerValue !== null){
			$.each(innerValue, function(key2,value2){
				if (value2 == "\"Text\""){
					} 
				else{
					xformedSAPOrdersValue.push(value2);
					};				
			});
        }
        else{
			xformedSAPOrdersValue.push('\"\"');
        };
		});
	}	
	
	for(j=0;j<=(xformedSAPOrdersName.length-1);j++){
		if (j==xformedSAPOrdersName.length-1){
			strSep='';
			strClose = '}'};
		if(xformedSAPOrdersValue[j]==null){
			tmpVal = '\"\"'}
		else{
			tmpVal = xformedSAPOrdersValue[j]
			};
		xformedSAPOrdersPaired = xformedSAPOrdersPaired + '\"'+ xformedSAPOrdersName[j]+'\":'+tmpVal+strSep+strClose;
	}
	
	jsonSAPOrdersPaired = JSON.parse(xformedSAPOrdersPaired);
	return xformedSAPOrdersPaired;	
};
/*
 			 db.transaction(function(tx2) {
    			for (j=0; j<3; j++){
    				alert(i+': '+j);
    	    		tx2.executeSql('INSERT INTO tblDetails (ordernum, itemnum, JSONOrderDetail, Refreshed) VALUES (?,?,?,?)',[i,j,j,d],[],db.onError);
    			}
    		});
 */

function linkListener() {
    alert(this.i);
}

function test2(){
	db.transaction(function(transaction){transaction.executeSql('DROP TABLE IF EXISTS tblOrders2',[],[],db.onError)});
	db.transaction(function(transaction){transaction.executeSql('CREATE TABLE IF NOT EXISTS tblOrders2 (ordernum TEXT,JSONOrderHeader TEXT,Refreshed TEXT)',[],[],db.onError)});
	for (var i=0; i<7; i++){  
	      (function(i) {
	        db.transaction(function (tx) {  
	                tx.executeSql('INSERT INTO tblOrders2 (ordernum) VALUES (?)',  [i]);
	        });
	      })(i);
	    };
};

function test(){
	 numberofArticles = 5;
	    db.transaction(function(tx) {
	        tx.executeSql('DROP TABLE IF EXISTS tblOrders2',[],[],db.onError);
	    });
	    db.transaction(function(tx) {
	        tx.executeSql('CREATE TABLE IF NOT EXISTS tblOrders2 (ordernum TEXT,JSONOrderHeader TEXT,Refreshed TEXT)',[],[],db.onError);
	    });
	    db.transaction(function(tx) {
	        tx.executeSql('DROP TABLE IF EXISTS tblDetails',[],[],db.onError);
	    });
	    db.transaction(function(tx) {
	        tx.executeSql('CREATE TABLE IF NOT EXISTS tblDetails (ordernum TEXT, itemnum TEXT,JSONOrderDetail TEXT,Refreshed TEXT)',[],[],db.onError);
	    });
	    db.transaction(function(tx) {
	        tx.executeSql('DROP TABLE IF EXISTS tblDeliveries',[],[],db.onError);
	    });
	    db.transaction(function(tx) {
	        tx.executeSql('CREATE TABLE IF NOT EXISTS tblDeliveries (ordernum TEXT, itemnum TEXT,deliverynum TEXT, JSONDeliveryDetail TEXT,Refreshed TEXT)',[],[],db.onError);
	    });	    
	    
	    db.transaction(function (tx) {  
	        for (var i=0; i<3; i++){  
	            tx.executeSql('INSERT INTO tblOrders2 (ordernum,JSONOrderHeader,Refreshed) VALUES (?,?,?)',  [i,i,d]);
	            
	            (function(i) {
	            db.transaction(function (tx) {  
	    	        for (var j=0; j<3; j++){  
	    	            tx.executeSql('INSERT INTO tblDetails (ordernum,itemnum,JSONOrderDetail,Refreshed) VALUES (?,?,?,?)',  [i,j,j,d]);
	    	            
	    	            (function(i,j){
	    	            db.transaction(function (tx) {  
	    	    	        for (var k=0; k<3; k++){  
	    	    	            tx.executeSql('INSERT INTO tblDeliveries (ordernum,itemnum,deliverynum,JSONDeliveryDetail,Refreshed) VALUES (?,?,?,?,?)',  [i,j,k,k,d]);
	    	    	            
	    	    	        }
	    	            });
	    	        	})(i,j);
	    	        };
	    	    });
	            })(i);
	        };
	    });
	    
	    
	    
	    
	    
}






