Date.prototype.adjust = function(yr,mn,dy,hr,mi,se) {
var m,t;
this.setYear(this.getFullYear() + yr);
m = this.getMonth() + mn;
if(m != 0) this.setYear(this.getFullYear() + Math.floor(m/12));
if(m < 0) {
this.setMonth(12 + (m%12));
} else if(m > 0) {
this.setMonth(m%12);
}
t = this.getTime();
t += (dy * 86400000);
t += (hr * 3600000);
t += (mi * 60000);
t += (se * 1000);
this.setTime(t);
};





// Ext.ns('sink', 'demos', 'demos.Data', 'Ext.ux');
Ext.ns('sink', 'mobilens', 'Ext.ux');




mobilens.xTplOrdersPrimaryLandscape = '<tpl for="."><div class="colmask doublepage"><div class="colleft">'+
'<div class="col1">'+ 
'<!-- Column 1 start -->'+
'<table table align=center width=100% border=0><tr><td width=40%>'+
'<div class="itemCount">'+
' <tpl if="isSelected==1"><div class="headerItemCounterSelected">{itemCount}</div></tpl>'+
' <tpl if="hasItems!=1 && isSelected!=1"><div class="headerItemCounter">{itemCount}</div></tpl>'+
' <tpl if="hasItems==1 && isSelected!=1"><div class="headerItemCounterHasItems">{itemCount}</div></tpl>'+
'</div>'+
'</td><td align=right width=60%>'+
'<tpl if="orderDisclose!=1">'+
'<tpl if="orderDisclose!=3">'+
'<div class="expand"></div></tpl>'+
'<tpl if="orderDisclose==3"><div class="expandUpdate"></div></tpl></tpl>'+
'<tpl if="orderDisclose==1"><div class="expanded"></div></tpl>'+
'</td></tr></table>'+
'<p class="orderNumber">{documentNumber}</p>'+


'<tpl if="orderDisclose==1">'+
'<div class="item-detail-radius">'+
' <p class="refreshLabel">Refreshed:<br>{refreshed}</p>'+
' <p class="headerLabel">Status:&nbsp;&nbsp</p><p class="headerDetail">&nbsp {statusz} ({status})</p>'+
' <p class="headerLabel">Reference:&nbsp;&nbsp</p><p class="headerDetail">&nbsp {custPoNumber}</p>'+
' <p class="headerLabel">Order Volume:&nbsp;&nbsp</p><p class="headerDetail">&nbsp </p>'+
' <p class="headerLabel">Payment Terms:&nbsp;&nbsp</p><p class="headerDetail">&nbsp </p>'+
' <p class="headerLabel">Shipping Conditions:&nbsp;&nbsp</p><p class="headerDetail">&nbsp </p>'+
'</div>'+
'</tpl>'+
'<!-- Column 1 end -->'+


'</div><div class="col2">'+
'<!-- Column 2 start -->'+ 
' <p><span class="headerLabel">Ship To:&nbsp;&nbsp;&nbsp;</span><span class="xTplShipTo">{shipToName} [{shipToNo}] [{salesOrg}][{division}], {shipToCity}</span></p>'+
' <p><span class="headerLabel">Sold To:&nbsp;&nbsp;&nbsp;</span><span class="xTplSoldTo">{soldToName} [{soldTo}] [{salesOrg}][{division}], {soldToCity}</span></p>'+
' <p><span class="headerLabel">Ttl Net Price:&nbsp;&nbsp;&nbsp;</span><span class="headerDetail">{netValue}&nbsp;&nbsp;&nbsp&nbsp;&nbsp;</span>'+
' <span class="headerLabel">Req Delivery:&nbsp;&nbsp;&nbsp;</span><span class=headerDetail>{requestedDeliveryDate}&nbsp;&nbsp;&nbsp&nbsp;&nbsp;</span>'+
'<tpl if="orderDisclose==1">'+
'<div class="item-detail-radius">'+

'<left><table id="box-table-a" summary="">'+
'<caption><table width=100%><tr>'+
'<td width=60%><p class="refreshLabel">Refreshed:&nbsp;&nbsp {itemsRefreshed}</p></td><td width=39%><div class="detailText">Refresh Item Detail - </div></td><td width=1%><div class="detail" onClick="refreshOrderLine([\'{parent.documentNumber}\']);"></div></td>'+
'</tr></table></caption><thead>'+
'<tr>'+
'<th scope="col">&nbsp</th>'+
'<th scope="col">ItemNo</th>'+
'<th scope="col">Product</th>'+
'<th scope="col">CustPrd</th>'+
//'<th scope="col"">CustDes</th>'+
'<th scope="col">Req Date</th>'+
'<th scope="col">Tot Qty</th>'+
'<th scope="col">Cnfrm Qty</th>'+
//'<th scope="col">DlvQty</th>'+
//'<th scope="col">RemnQty</th>'+
'<th scope="col">Cust PO</th>'+
//'<th scope="col">Status</th>'+
'<th scope="col">ShipFrm</th>'+
'<th scope="col">NetPrice</th>'+
//'<th scope="col">DeliveryNo</th>'+
'</tr>'+
'</thead>'+
'<tbody>'+

'<tpl if="hasItems!=1">'+
'<tr>'+
'<td>&nbsp</td>'+
'<td> - No Items Downloaded - </td>'+
'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
'</tr>'+
'</tpl>'+




'<tpl if="hasItems==1>'+
'<tpl for="orderItems">'+
'<tr>'+
'<td><div class="delivery" onClick="displayOrderItemDelivery(\'{parent.documentNumber}\',\'{product}\',\'{shippedFrom}\',\'{totalLineVolume} {unitOfVolume}\', \'{totalLineWeight} {unitOfWeight}\');"></div></td>'+








'<td>{product}</td>'+
'<td>{productNo}</td>'+
'<td>{customerProduct}</td>'+
//'<td>{customerProductDesc}</td>'+
'<td>{reqDeliveryDate}</td>'+
'<td>{quantity}</td>'+
'<td>{confirmedQuantity}</td>'+
//'<td>{deliveredQuantity}</td>'+
//'<td>{quantityToDeliver}</td>'+
'<td>{customerPOItem}</td>'+
//'<td>{status}</td>'+
'<td>{shippedFrom}</td>'+
'<td>{netPrice} - {netPriceUnit}</td>'+
//'<td>{itemDelivery}</td>'+
'</tr>'+
'</tpl>'+
'</tpl>'+



'</tbody>'+
'</table></left>'+

//'<tpl if="hasItems!=1">'+
//'<p class="itemReloadIndicator">This order has no downloaded items click here to get them</p><p>&nbsp</p>'+
//'<center><div class="detail" onClick="refreshOrderLine([\'{parent.documentNumber}\']);"></div></center>'+
//'</tpl>'+
'</div>'+
'</tpl>'+
'<!-- Column 2 end -->'+ 
'</div></div></div>';






mobilens.xTplOrdersPrimaryPortrait = '<tpl for="."><div class="colmask doublepage"><div class="colleft">'+
'<div class="col1">'+ 
'<!-- Column 1 start -->'+
'<table table align=center width=100% border=0><tr><td width=40%>'+
'<div class="itemCount">'+
' <tpl if="isSelected==1"><div class="headerItemCounterSelected">{itemCount}</div></tpl>'+
' <tpl if="hasItems!=1 && isSelected!=1"><div class="headerItemCounter">{itemCount}</div></tpl>'+
' <tpl if="hasItems==1 && isSelected!=1"><div class="headerItemCounterHasItems">{itemCount}</div></tpl>'+
'</div>'+
'</td><td align=right width=60%>'+
'<tpl if="orderDisclose!=1"><div class="expand"></div></tpl>'+
'<tpl if="orderDisclose==1"><div class="expanded"></div></tpl>'+
'</td></tr></table>'+
'<p class="orderNumber">{documentNumber}</p>'+


'<tpl if="orderDisclose==1">'+
'<div class="item-detail-radius">'+
' <p class="refreshLabel">Refreshed:<br>{refreshed}</p>'+
' <p class="headerLabel">Status:&nbsp;&nbsp</p><p class="headerDetail">&nbsp {statusz} ({status})</p>'+
' <p class="headerLabel">Reference:&nbsp;&nbsp</p><p class="headerDetail">&nbsp {custPoNumber}</p>'+
' <p class="headerLabel">Order Volume:&nbsp;&nbsp</p><p class="headerDetail">&nbsp </p>'+
' <p class="headerLabel">Payment Terms:&nbsp;&nbsp</p><p class="headerDetail">&nbsp </p>'+
' <p class="headerLabel">Shipping Conditions:&nbsp;&nbsp</p><p class="headerDetail">&nbsp </p>'+
'</div>'+
'</tpl>'+
'<!-- Column 1 end -->'+


'</div><div class="col2">'+
'<!-- Column 2 start -->'+ 
' <p><span class="headerLabel">Ship To:&nbsp;&nbsp;&nbsp;</span><span class="xTplShipTo">{shipToName} [{shipToNo}] [{salesOrg}][{division}], {shipToCity}</span></p>'+
' <p><span class="headerLabel">Sold To:&nbsp;&nbsp;&nbsp;</span><span class="xTplSoldTo">{soldToName} [{soldTo}] [{salesOrg}][{division}], {soldToCity}</span></p>'+
' <p><span class="headerLabel">Ttl Net Price:&nbsp;&nbsp;&nbsp;</span><span class="headerDetail">{netValue}&nbsp;&nbsp;&nbsp&nbsp;&nbsp;</span>'+
' <span class="headerLabel">Req Delivery:&nbsp;&nbsp;&nbsp;</span><span class=headerDetail>{requestedDeliveryDate}&nbsp;&nbsp;&nbsp&nbsp;&nbsp;</span>'+
//' <span class="headerLabel">Status:&nbsp;&nbsp;&nbsp;</span><span class="headerDetail">{statusz} ({status})</span></p>'+
'<tpl if="orderDisclose==1">'+
'<div class="item-detail-radius">'+
//'<tpl if="hasItems==1>'+
//'<tpl for="orderItems">'+


'<left><table id="box-table-a" summary="">'+
'<caption><table width=100%><tr>'+
'<td width=60%><p class="refreshLabel">Refreshed:&nbsp;&nbsp {itemsRefreshed}</p></td><td width=29%><div class="detailText">Refresh Item Detail - </div></td><td width=1%><div class="detail" onClick="refreshOrderLine([\'{parent.documentNumber}\']);"></div></td>'+
'</tr></table></caption><thead>'+
'<tr>'+
'<th scope="col">&nbsp</th>'+
'<th scope="col">ItemNo</th>'+
//'<th scope="col">Product</th>'+
//'<th scope="col">CustPrd</th>'+
//'<th scope="col"">CustDes</th>'+
//'<th scope="col">Req Date</th>'+
'<th scope="col">Tot Qty</th>'+
'<th scope="col">Cnfrm Qty</th>'+
//'<th scope="col">DlvQty</th>'+
//'<th scope="col">RemnQty</th>'+
'<th scope="col">Cust PO</th>'+
//'<th scope="col">Status</th>'+
'<th scope="col">ShipFrm</th>'+
'<th scope="col">NetPrice</th>'+
//'<th scope="col">DeliveryNo</th>'+
'</tr>'+
'</thead>'+
'<tbody>'+

'<tpl if="hasItems!=1">'+
'<tr>'+
'<td>&nbsp</td>'+
'<td> - No Items Downloaded - </td>'+
//'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
'<td>&nbsp</td>'+
//'<td>&nbsp</td>'+
'</tr>'+
'</tpl>'+




'<tpl if="hasItems==1>'+
'<tpl for="orderItems">'+
'<tr>'+
'<td><div class="delivery" onClick="displayOrderItemDelivery(\''+'{parent.documentNumber}'+'\',\''+'{product}'+'\');"></div></td>'+
'<td>{product}</td>'+
//'<td>{productNo}</td>'+
//'<td>{customerProduct}</td>'+
//'<td>{customerProductDesc}</td>'+
//'<td>{reqDeliveryDate}</td>'+
'<td>{quantity}</td>'+
'<td>{confirmedQuantity}</td>'+
//'<td>{deliveredQuantity}</td>'+
//'<td>{quantityToDeliver}</td>'+
'<td>{customerPOItem}</td>'+
//'<td>{status}</td>'+
'<td>{shippedFrom}</td>'+
'<td>{netPrice} - {netPriceUnit}</td>'+
//'<td>{itemDelivery}</td>'+
'</tr>'+
'</tpl>'+
'</tpl>'+



'</tbody>'+
'</table></left>'+

//'<tpl if="hasItems!=1">'+
//'<p class="itemReloadIndicator">This order has no downloaded items click here to get them</p><p>&nbsp</p>'+
//'<center><div class="detail" onClick="refreshOrderLine([\'{parent.documentNumber}\']);"></div></center>'+
//'</tpl>'+
'</div>'+
'</tpl>'+
'<!-- Column 2 end -->'+ 
'</div></div></div>';





mobilens.xTplItemDelivery  =  '<tpl for="."><table class="xTplItemDelivery" border=1 align=center width=100%>'+
'<table id="box-table-a" summary="">'+
'<caption>'+
'<tpl if="trackingURL != \'\'"><div><br><p class="xTplItemDelivery" Target="_{trackingNo}">Tracking Number: <a href="{trackingURL}">'+
'<tpl if="trackingNo != \'\'"> {trackingNo} </tpl>'+
'<tpl if="trackingNo == \'\'">Click Here To Track </tpl>'+
'</a><br></div></tpl>'+

'</caption><thead>'+
'<tr>'+
'<th scope="col">DeliveryNo</td>'+
'<th scope="col">Position</td>'+
'<th scope="col">ObjectId</td>'+
'<th scope="col">Carrier</td>'+
'<th scope="col">Actual Ship Date</td>'+
'<th scope="col">Planned Ship Date</td>'+
'<th scope="col">Qty UOM</td>'+
'</tr>'+
'</thead>'+

'<tr>'+
'<td>{deliveryNo}</td>'+
'<td>{deliveryPosition}</td>'+
'<td>{objectId}</td>'+
'<td>{carrier}</td>'+
'<td>{actualShippingDate}</td>'+
'<td>{plannedSippingtDate}</td>'+
'<td>{quantity} {unitOfMeasurement}</td>'+
'</tr></table>'+
'</tpl>';



mobilens.xTplShipToPrimary = '<tpl for=".">'+
'<p class="xTplShipTo">'+
'<tpl if="isSelected==1"><b> X &nbsp &nbsp </b></tpl>'+
'{firstName} [ {customerId} ][{salesOrg}][{division}] {city}</p>'+
'</tpl>';


mobilens.xTplDaysOfHistory =  '<tpl for="."><p class="xTplDaysOfHistory">{isSelected} Days Of History</p>'+
'<tpl if="customerName==\'Success\'"><p class="tplLastLoginLabel"> &nbsp </p><p class="tplLastLoginSuccess">Last Login Status: {customerName} </p></tpl>'+
'<tpl if="customerName!=\'Success\'"><p class="tplLastLoginLabel">Last Login Status: </p><p class="tplLastLoginFail">{customerName} </p></tpl>'+
'</tpl>';




mobilens.xTplSoldToPrimary = '<p class="xTplSoldTo"><tpl for=".">{customerName} [ {customerNo} ] {customerCity}</tpl></p>';
mobilens.xTplMsgWait =  '<p class="xTplMsgWait"><tpl for=".">{msg1}</tpl></p>';
mobilens.xTplMsgNoDelivery =  '<p class="xTplMsgWait"><tpl for=".">{msg2}</tpl></p>';



