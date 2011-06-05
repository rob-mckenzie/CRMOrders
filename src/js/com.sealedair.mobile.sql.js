
var db = openDatabase("Mobile Order Status", "1.0", "Mobile Order Status", 50*1024*1024);
var orderInfo = [];

db.onError = function(tx, e) {
	  alert('Something unexpected happened: ' + e.message );
	};

db.onSuccess = function(tx, r) {
	  // re-render all the data
	  // loadTodoItems is defined in Step 4a
	 //alert(r);
	 //tx.executeSql('DELETE FROM tblOrders2 where tblOrders2.ordernum !='+r);
	 console.log(r); 
	};

db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS tblLogin (username TEXT,password TEXT, daysOfHistory TEXT, lastResponse TEXT,refreshed TEXT)',[],[],db.onError)});
db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS tblSoldTo (soldto TEXT,JSONSoldTo TEXT,refreshed TEXT)',[],[],db.onError)});
db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS tblSalesArea (salesorg TEXT, division TEXT, distchannel,JSONSalesArea TEXT,refreshed TEXT)',[],[],db.onError)});
db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS tblShipTo (shipto TEXT,salesorg TEXT, division TEXT, distchannel TEXT, JSONShipTo TEXT,refreshed TEXT)',[],[],db.onError)});
db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS tblOrders (ordernum TEXT,JSONOrderHeader TEXT,refreshed TEXT)',[],[],db.onError)});
db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS tblOrders2 (ordernum TEXT,JSONOrderHeader2 TEXT,refreshed TEXT)',[],[],db.onError)});
db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS tblDetails (ordernum TEXT, itemnum TEXT,JSONOrderDetail TEXT,refreshed TEXT)',[],[],db.onError)});
db.transaction(function(tx){tx.executeSql('CREATE TABLE IF NOT EXISTS tblDeliveries (ordernum TEXT, itemnum TEXT,deliverynum TEXT, JSONDeliveryDetail TEXT,refreshed TEXT)',[],[],db.onError)});

function getLoginCredentials() {

	var loginQry = 'select \'{"userName":"\' || ifNull(username,\'\') || \'","password":"\' || ifNull(password,\'\') || \'","numOfDays":"\' || ifNull(daysOfHistory,\'0\') || \'","lastResponse":"\' || ifNull(lastResponse,\'empty\') || \'"}\' as creds FROM tblLogin ';
	
	console.log( loginQry );
	db.transaction(function(transaction){transaction.executeSql(loginQry, [],
			function (transaction, resultSet) {
				console.log('record Count for tlbLogin : ' + resultSet.rows.length );
				for (var i=0; i<resultSet.rows.length; i++) {
					var row = resultSet.rows.item(i);   
					orderInfo[i] = [row["creds"], ];
					console.log( orderInfo[i]);
					mobilens.SAMuserStore.add(JSON.parse(orderInfo[i]));
				}
				
				if( mobilens.SAMuserStore.getCount() < 1 )
					{ mobilens.SAMuserStore.add({userName: '',password: '',lastUpdated:'', numOfDays:'0',lastResponse:'empty'})
					  console.log(' user login credentials added to Store!');
					toggleUserPanel('1');
					}
				}
		);
	}
  );
}

function setLoginCredentials(newUser, newPass, daysOfHistory, getBaseData) {

	var tmpResponse = soapSAPLogin(newUser, newPass, getBaseData);
	
	// if there are no records add a new one
	if ( mobilens.SAMuserStore.getCount() < 1)
		{ mobilens.SAMuserStore.add({userName:newUser,password:newPass,numOfDays:'15',lastResponse:tmpResponse});
		}
	mobilens.SAMuserStore.each(function(uRecord){
			uRecord.set('userName',newUser);
			uRecord.set('password',newPass);
			if (daysOfHistory > 0)
				{ uRecord.set('numOfDays',daysOfHistory); }
			uRecord.set('lastResponse',tmpResponse);
			uRecord.refreshResponse();
		    } );
}	
	
function getOrderDetail () {
	
	mobilens.storeSAPOrders.each(function(record) {
		// alert ( record.get("documentNumber") );
		var orderRecDetailNumber = record.get("documentNumber");
		var detailQry = 'SELECT *, ? from  tblDetails where ordernum = ?';
		var recIndex = record.store.indexOf(record);

		db.transaction(function(transaction){transaction.executeSql(detailQry, [recIndex,orderRecDetailNumber],
				function (transaction, resultSet) {
						var returnL = resultSet.rows.length;
						if( returnL > 0 )
							{
								mobilens.storeSAPOrders.data.items[parseInt(recIndex)].set('itemCount',  returnL);
								mobilens.storeSAPOrders.data.items[parseInt(recIndex)].set('hasItems',  '1');
								mobilens.storeSAPOrders.data.items[parseInt(recIndex)].set('orderDisclose',  '');
								mobilens.storeSAPOrders.data.items[parseInt(recIndex)].set('isSelected',  '');
							
								var ascStore = mobilens.storeSAPOrders.data.items[parseInt(recIndex)].orderItems();
								ascStore.removeAll();
								
								for (var k=0; k<resultSet.rows.length; k++) {
										var row = resultSet.rows.item(k);
										ascStore.add(JSON.parse([row["JSONOrderDetail"], ]));
										if ( k==0 ) 
										{
											var crazyTrain = new Date([row["refreshed"], ] )
											mobilens.storeSAPOrders.data.items[parseInt(recIndex)].set('itemsRefreshed', crazyTrain.getFullYear() + '-' + crazyTrain.getMonth() + '-' + crazyTrain.getDate() + ' ' + crazyTrain.toLocaleTimeString() );
										}
										}
							}
					}
			);
		} 
		);
	});
	
	
	//mobilens.storeSAPOrders.formatItemRefreshDate();
	
	
};


function getOrderData () {
	
	mobilens.storeSAPOrders.removeAll();
	
	db.transaction(function(transaction){transaction.executeSql('SELECT * from tblOrders', [],
				function (transaction, resultSet) {
					for (var i=0; i<resultSet.rows.length; i++) {
						var row = resultSet.rows.item(i);   
						orderInfo[i] = [row["JSONOrderHeader"], ];
						//alert(orderInfo[i]);
						var newRec = mobilens.storeSAPOrders.add(JSON.parse(orderInfo[i]));
						var crazyTrain = new Date([row["refreshed"], ] )
						newRec[0].set({refreshed: crazyTrain.getFullYear() + '-' + crazyTrain.getMonth() + '-' + crazyTrain.getDate() + ' ' + crazyTrain.toLocaleTimeString() });
						
					   } // end of order header for loop
					} // end of order header transaction onSuccess function
			);
		}
	);

	db.transaction(function(transaction){transaction.executeSql('SELECT COUNT(*) from tblOrders', [],
			function (transaction, resultSet) {
				getOrderDetail ();
				} // end of order header transaction onSuccess function
		);
	}
);
	
};


function getSoldTo() {

	mobilens.storeSAPSoldToPartners.removeAll();
	
	db.transaction(function(transaction){transaction.executeSql('SELECT * from tblSoldTo', [],
				function (transaction, resultSet) {
					for (var i=0; i<resultSet.rows.length; i++) {
						var row = resultSet.rows.item(i);   
						orderInfo[i] = [row["JSONSoldTo"], ];
						//alert(orderInfo[i]);
						mobilens.storeSAPSoldToPartners.add(JSON.parse(orderInfo[i]));
					}
					console.log(resultSet.rows.length + ' Sold To partners added to Store!');
					}
			);
		}
	);
};

function getShipTo() {

	mobilens.storeSAPShipToCustomers.removeAll();
	
	db.transaction(function(transaction){transaction.executeSql('SELECT * from tblShipTo', [],
				function (transaction, resultSet) {
					for (var i=0; i<resultSet.rows.length; i++) {
						var row = resultSet.rows.item(i);   
						orderInfo[i] = [row["JSONShipTo"], ];
						//alert(orderInfo[i]);
						mobilens.storeSAPShipToCustomers.add(JSON.parse(orderInfo[i]));
					}
					console.log(resultSet.rows.length + ' Ship To partners added to Store!');
					}
			);
		}
	);
};

function getOrderData2() {
	
	db.transaction(function(transaction){transaction.executeSql('SELECT * from tblOrders2', [],
				function (transaction, resultSet) {
					for (var i=0; i<resultSet.rows.length; i++) {
						var row = resultSet.rows.item(i);   
						orderInfo[i] = [row["JSONOrderHeader2"], ];
						//alert(orderInfo[i]);
						mobilens.storeSAPOrders2.add(JSON.parse(orderInfo[i]));
					}
					console.log(resultSet.rows.length + ' Orders2 added to Store!');
					}
			);
		}
	);
};

function getOrderDeliveries() {
	db.transaction(function(transaction){transaction.executeSql('SELECT * from tblDeliveries', [],
				function (transaction, resultSet) {
					for (var i=0; i<resultSet.rows.length; i++) {
						var row = resultSet.rows.item(i);   
						orderInfo[i] = [row["JSONDeliveryDetail"], ];
						//alert(orderInfo[i]);
						var dRecNew = mobilens.storeSAPDeliveries.add(JSON.parse(orderInfo[i]));
						dRecNew[0].set('ordernum',[row["ordernum"], ]);
						dRecNew[0].set('itemnum',[row["itemnum"], ]);
					}
					console.log(resultSet.rows.length + ' Deliveries added to Store!');
					}
			);
		}
	);
};

mobilens.calculateDesiredWidth = function() {
	var viewWidth = Ext.Element.getViewportWidth(),
	desiredWidth = 700;  //Math.min(viewWidth, 500) - 10;
	return desiredWidth;
	}; 

mobilens.deliveryList = new Ext.List({
	cls: 'SAMlist',
	//width: 700, //Ext.Element.getViewportWidth(), //Ext.is.Phone ? undefined : Ext.Element.getViewportWidth(),
	height: 450, // Ext.is.Phone ? undefined : Ext.Element.getViewportHeight(),  
	//id: 'soldToPartnerList',
	xtype: 'list',
	mode: 'SINGLE',
	store: mobilens.storeSAPDeliveries,
	selectedItemCls: 'x-view-selected-rob',  // use this as a css class for selected records
	itemTpl:mobilens.xTplItemDelivery,
/*
	onItemTap: function(dv, index, item) {
		var myR = this.store.data.items[index];
				
		if (item.getTarget('.itemCount') ) // This if statement determines if the target is to select a list item or execute list item disclosure ...rmJr 2011-04-22
		{  
                       if(myR.get('isSelected') == '1')  // This if statement sets a flag field in the datasource to display selected item css  ...rmJr 2011-04-22
                             {myR.set('isSelected',''); }
                       else
                             {myR.set('isSelected','1'); }
             } ;
		}

*/		
	
})	
	

mobilens.deliveryPnl = new Ext.Panel({
	floating: true,
	centered: true,
	modal: true,
	width: mobilens.calculateDesiredWidth(),
	height: 650,

	dockedItems: [{
		dock: 'top',
		xtype: 'toolbar',
		title: 'Deliveries'
	},{
		dock: 'bottom',
		xtype: 'toolbar',
		layout: 
    	   {
            type: 'vbox',
            align: 'center',
            pack: 'center'
           },
		items: [{
			text: 'Close',
			handler: function() {
				mobilens.storeSAPDeliveries.clearFilter();
				mobilens.deliveryPnl.hide();
			}
		}]
	}],

	items: [ {html:'<center><b>Test</b></center>'},mobilens.deliveryList ]  // end of settings panel items   
});




function displayOrderItemDelivery(orderNum, itemNum, shippedFrom, tVolume, tWeight) {
	db.transaction(function(transaction){transaction.executeSql('SELECT "now" ', [],
			function (transaction, resultSet) {
					if ( mobilens.storeSAPDeliveries.getCount() < 1 )
							{
								mobilens.storeSAPDeliveries.removeAll();
								getOrderDeliveries();
							}
					
					db.transaction(function(transaction){transaction.executeSql('SELECT "now" ', [],
							function (transaction, resultSet) {
									mobilens.storeSAPDeliveries.clearFilter();
									mobilens.storeSAPDeliveries.filter('ordernum',orderNum);
									mobilens.storeSAPDeliveries.filter('itemnum',itemNum);
									
									db.transaction(function(transaction){transaction.executeSql('SELECT "now" ', [],
											function (transaction, resultSet) {
												if ( mobilens.storeSAPDeliveries.getCount() < 1 )
													{
													mobilens.deliveryList.bindStore(mobilens.storeMessages);
													mobilens.deliveryList.itemTpl = mobilens.xTplMsgNoDelivery; 
													mobilens.deliveryList.initComponent();
													mobilens.deliveryList.refresh();
													}
												else
													{
													mobilens.deliveryList.bindStore(mobilens.storeSAPDeliveries);
													mobilens.deliveryList.itemTpl = mobilens.xTplItemDelivery; 
													mobilens.deliveryList.initComponent();
													mobilens.deliveryList.refresh();
													}										
									});
									});
									
								db.transaction(function(transaction){transaction.executeSql('SELECT "now" ', [],
											function (transaction, resultSet) {
												mobilens.deliveryPnl.items.items[0].html = '<center>SHIPPED FROM:'+shippedFrom+'</center>'+'<br>Total Line Volume:'+tVolume+'<br>Total Line Weight:'+ tWeight;
												mobilens.deliveryPnl.show();
												//displayPanel.show();
								});
								});  // end of show transaction
					});
					});  // end of store binding transaction
	});
	});  // end of populate store transaction

}

function refreshOrderLine(orderNumber){
		// need to add a login check here that does not execute unless login verifies success.
		
		db.transaction(function(transaction){transaction.executeSql('SELECT COUNT(*) from tblOrders', [],
				function (transaction, resultSet) {
		   			soapSAPOrderDetails( mobilens.SAMuserStore.first().get('userName'), mobilens.SAMuserStore.first().get('password'),orderNumber);
        		    db.transaction(function(tx)
	        				   {
        		    			getOrderDetail ();
	   			   				});
					} // end of order header transaction onSuccess function
			);
		});
}


