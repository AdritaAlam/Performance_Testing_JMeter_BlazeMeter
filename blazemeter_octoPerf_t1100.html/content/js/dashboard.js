/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.92424242424242, "KoPercent": 0.07575757575757576};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5385714285714286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.77, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS"], "isController": false}, {"data": [0.055, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action;jsessionid=F76D6D810F7E73FE69EF184F8E1CBA3E?viewCategory=&categoryId=FISH"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.7377272727272727, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS"], "isController": false}, {"data": [0.7577272727272727, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=REPTILES"], "isController": false}, {"data": [0.7086363636363636, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS"], "isController": false}, {"data": [0.740909090909091, 500, 1500, "https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=AV-SB-02"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6600, 5, 0.07575757575757576, 1153.0209090909134, 223, 14079, 468.0, 2859.800000000001, 3755.699999999999, 6536.7499999999945, 284.1520644078013, 1124.9060730776682, 193.6433420695742], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=CATS", 1100, 0, 0.0, 734.5409090909089, 236, 8993, 428.0, 1913.6, 2523.1500000000005, 3306.5700000000006, 56.71564836298015, 202.8249065480794, 39.15816737561227], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action;jsessionid=F76D6D810F7E73FE69EF184F8E1CBA3E?viewCategory=&categoryId=FISH", 1100, 5, 0.45454545454545453, 2900.6472727272762, 1090, 14079, 1953.0, 5240.499999999999, 6498.950000000004, 9165.11, 53.34885299966051, 235.3274551081527, 36.364745501721714], "isController": false}, {"data": ["Test", 1100, 5, 0.45454545454545453, 6918.1254545454485, 2907, 19391, 6521.5, 10760.9, 12176.9, 14433.98, 46.65563897018281, 1108.2068693801161, 190.76871129702675], "isController": true}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=BIRDS", 1100, 0, 0.0, 755.2481818181818, 235, 8710, 440.0, 1928.6, 2482.4000000000005, 3270.95, 56.91225165562914, 203.7503071968129, 39.349486496274835], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=REPTILES", 1100, 0, 0.0, 743.2318181818173, 223, 5453, 433.0, 1912.1999999999994, 2333.9, 3422.99, 57.537399309551205, 206.10076237054088, 39.95028409090909], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=DOGS", 1100, 0, 0.0, 1014.0227272727271, 239, 12629, 439.0, 2718.2999999999997, 3375.6000000000004, 6016.570000000001, 58.25037068417708, 283.913671957742, 37.20287346430841], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action?viewProduct=&productId=AV-SB-02", 1100, 0, 0.0, 770.4345454545454, 234, 8199, 446.0, 1900.6999999999998, 2627.8500000000004, 3689.84, 56.815247146325085, 211.89202036310107, 39.33790061205516], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 5, 100.0, 0.07575757575757576], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6600, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://petstore.octoperf.com/actions/Catalog.action;jsessionid=F76D6D810F7E73FE69EF184F8E1CBA3E?viewCategory=&categoryId=FISH", 1100, 5, "500", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
