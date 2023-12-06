function inbound() {

  var sheet1 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('inbound_task');

  var sheet2 = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('on_hand_inventory');

  // Get data from Table 1.
  var data_inbound = sheet1.getRange(2, 1, sheet1.getLastRow() - 1, sheet1.getLastColumn()).getValues(); // Assuming headers are in the first row.

  // Get data from Table 2.
  var data_on_hand_inv = sheet2.getDataRange().getValues();

  // Iterate through each row in Table 1.
  for (var i = 0; i < data_inbound.length; i++) {
    var ib_item_id = data_inbound[i][0]; // key is in Column A 
    var valuesToReplace = [data_inbound[i][14], data_inbound[i][15], data_inbound[i][16], data_inbound[i][17]]; // Values from columns O, P, Q, R.

    // Find the corresponding row in Table 2 using the key.
    var correspondingRowFound = false;
    for (var j = 0; j < data_on_hand_inv.length; j++) {
      if (data_on_hand_inv[j][0] == ib_item_id) { //  key is in Column A of Table 2.

        // Update values in columns O, P, Q, R of the corresponding row in Table 2.
        for (var k = 0; k < valuesToReplace.length; k++) {
          sheet2.getRange(j + 1, k + 15).setValue(valuesToReplace[k]); // values start from column O (index 15).
        }
        correspondingRowFound = true;
        break; // Exit the loop once the update is done for the current row.
      }
    }

    // If there is no corresponding row, add the entire row to the array.
    if (!correspondingRowFound) {
      sheet2.appendRow(data_inbound[i]);
    }
  }

  sheet1.getRange(2, 1, sheet1.getLastRow()).clear(); // Column A
  sheet1.getRange(2, 23, sheet1.getLastRow()).clear(); // Column W
  sheet1.getRange(2, 24, sheet1.getLastRow()).clear(); // Column X

  sheet2.getRange(1, 21, sheet2.getLastRow(), 6).clear(); // clear column 21 to 27.

  for (var i = data_on_hand_inv.length - 1; i >= 0; i--) {
  if (data_on_hand_inv[i][0] === '') {
    // Clear the entire row if column A is blank.
    sheet2.getRange(i + 1, 1, 1, sheet2.getLastColumn()).clearContent();
  } else if (data_on_hand_inv[i][14] === 0) {
    // Delete the row if the value in column O is 0.
    sheet2.deleteRow(i + 1);
  }
}
}
