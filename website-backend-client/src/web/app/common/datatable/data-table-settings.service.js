(function() {
    angular.module('app.common').service('DataTableSettings', DataTableSettings);
    DataTableSettings.$inject = ['$ocLazyLoad', 'serverAPI', '$q', 'applicationSettings'];

    function DataTableSettings($ocLazyLoad, serverAPI, $q, applicationSettings) {
        this.buttons = buttons;
        this.dom = dom;
        this.processingMessage = processingMessage;
        this.loadDependancies = loadDependancies;
        this.onDataRetrivalError = onDataRetrivalError;
        this.configureColumnSearch = configureColumnSearch;
        this.buildDefaultTable = buildDefaultTable;
        this.applyCustomSettings = applyCustomSettings;
        this.convertSingleColumn = convertSingleColumn;
        this.getTaggedContent = getTaggedContent;

        function buttons(newButtons) {
            var buttonArray = [{
                extend: 'copy',
                text: '',
                className: 'fa fa-copy',
            }, {
                extend: 'excel',
                text: '',
                className: 'fa fa-file-excel-o',
                title: 'ExampleFile'
            }, {
                extend: 'pdf',
                text: '',
                className: 'fa fa-file-pdf-o',
                title: 'ExampleFile'
            }, {
                extend: 'print',
                text: '',
                className: 'fa fa-print',
                customize: function(win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');
                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }];
            if (typeof newButtons != 'undefined' && typeof newButtons.addbutton != 'undefined') {
                buttonArray.push(newButtons.addbutton);
            }
            return buttonArray;
        }

        function dom() {
            return '<"html5buttons"B>lTgtipr';
        }

        function processingMessage() {
            return '<div class="sk-spinner sk-spinner-wave"><div class="sk-rect1"></div>' +
                '<div class="sk-rect2"></div><div class="sk-rect3"></div>' +
                '<div class="sk-rect4"></div><div class="sk-rect5"></div></div>';
        }

        function loadDependancies() {
            return $ocLazyLoad.load(
                [{
                    serie: true,
                    insertBefore: '#loadBefore',
                    files: ['css/plugins/dataTables/datatables.css']
                }, {
                    serie: true,
                    files: ['js/plugins/dataTables/datatables.js']
                }, {
                    insertBefore: '#loadBefore',
                    serie: true,
                    files: ['css/plugins/dataTables/angular-datatables.css']
                }, {
                    serie: true,
                    name: 'datatables',
                    files: ['js/plugins/dataTables/angular-datatables.js',
                        'js/plugins/dataTables/jquery.spring-friendly.js'
                    ]
                }, {
                    serie: true,
                    name: 'datatables.buttons',
                    files: ['js/plugins/dataTables/angular-datatables.buttons.js']
                }]
            );
        }

        function onDataRetrivalError() {
            console.log('onDataRetrivalError');
            //$window.location.reload();
        }

        function getTaggedContent(data, type, full, meta) {
            var dataArray = [];
            var content = "";
            if (data) {
                dataArray = tagTransformer.stringToTags(data);
                for (var i = 0; i < dataArray.length; i++) {
                    content = content + "<span  class='tag-item'>" + dataArray[i].text + "</span>";
                }
            }
            return content;
        }

        function configureColumnSearch(currentScope, table) {
            table.columns().every(function() {
                var that = this;
                if (that.footer()) {
                    EventManager.addEvent(currentScope, 'keyup change', onChange, $('input', that.footer()));
                }

                function onChange() {
                    if (that.search() !== this.value) {
                        that.search(this.value).draw();
                    }
                }
            });
        }

        function buildDefaultTable(DTOptionsBuilder) {
            return DTOptionsBuilder.newOptions()
                .withDOM(dom())
                .withOption('responsive', true)
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('serverSide', true).withOption("language", getLanguage());
        }


        function getLanguage() {
            return {
                "processing": processingMessage(),
                "url": getURL()
            };
        }

        function getURL() {
            var language = applicationSettings.getSettings().language;
            var url = "js/plugins/dataTables/translation/english.json";
            if (language && language == "zh_CN") {
                url = "js/plugins/dataTables/translation/chinese.json";
            }
            return url;
        }

        function applyCustomSettings(vm, tableId) {
            vm.tableDTOptions.drawCallback = getWrappedDrawCallback(vm, tableId);
            decorateHTMLforConverters(vm);
            setDefaultContent(vm);

            function decorateHTMLforConverters(vm) {
                var columns = vm.tableDTColumns;
                for (i = 0; i < columns.length; i++) {
                    converter = columns[i].icmdbConverter;
                    if (converter) {
                        columns[i].withOption('class', columns[i].mData + '_convert');
                    }
                }
            }

            function setDefaultContent(vm) {
                var columns = vm.tableDTColumns;
                for (i = 0; i < columns.length; i++) {
                    columns[i].withOption('defaultContent', "");
                }
            }

            function getWrappedInitComplete(vm1, tableId) {
                var initComplete = vm1.tableDTOptions.initComplete;
                var vm = vm1;
                return initCompleteWrapped;

                function initCompleteWrapped(settings, json) {
                    if (initComplete) {
                        initComplete(settings, json);
                    }
                }
            }

            function getWrappedDrawCallback(vm1, tableId) {
                var drawCallback = vm1.tableDTOptions.drawCallback;
                var vm = vm1;
                return drawCallbackWrapped;

                function drawCallbackWrapped(settings, json) {
                    processConverters(vm, tableId);
                    if (drawCallback) {
                        drawCallback(settings, json);
                    }
                }
            }

            function processConverters(vm, tableId) {
                var columns = vm.tableDTColumns;
                var tableInstance = vm.tableDTInstance;
                var conversionServiceSettings = [];
                var useConversionService = false;
                for (i = 0; i < columns.length; i++) {
                    converter = columns[i].icmdbConverter;
                    if (converter) {
                        var converterSettings = {
                            'tableId': tableId,
                            'tableInstance': tableInstance,
                            'columnIndex': i,
                            'column': columns[i].mData
                        };
                        if (vm[converter]) {
                            vm[converter](converterSettings);
                        } else {
                            converterSettings.converterName = converter;
                            conversionServiceSettings.push(converterSettings);
                            useConversionService = true;
                        }
                    }
                
                }

                if (useConversionService) {
                    convertUsingConversionService(conversionServiceSettings);
                }
            }

            function convertUsingConversionService(conversionServiceSettings) {
                var request = {};
                request.conveters = [];

                var rows = conversionServiceSettings[0].tableInstance.DataTable.data();
                for (var i = 0; i < conversionServiceSettings.length; i++) {
                    var converter = {
                        'name': conversionServiceSettings[i].converterName
                    };
                    converter.data = [];
                    for (var j = 0; j < rows.length; j++) {
                        converter.data.push(rows[j][conversionServiceSettings[i].column]);
                    }
                    request.conveters.push(converter);
                }
                serverAPI.postData(ICMDBURLs.getURLS('app.common').conversionService, request)
                    .then(function(data) {
                        applyConversion(data, conversionServiceSettings);
                    }, function(error) {
                        console.log('error in code conversion');
                    });
            }

            function applyConversion(serviceResponse, conversionServiceSettings) {
                for (var i = 0; i < conversionServiceSettings.length; i++) {
                    var converterName = conversionServiceSettings[i].converterName;
                    var convertedData = null;
                    for (var j = 0; j < serviceResponse.length; j++) {
                        if (converterName === serviceResponse[j].converterName) {
                            convertedData = serviceResponse[j];
                            break;
                        }
                    }
                    convertSingleColumn(getPromiseForData(convertedData), getMatchingValue, getConvertedValue, conversionServiceSettings[i]);
                }

                function getPromiseForData(convertedData) {
                    return promiceForData;

                    function promiceForData() {
                        var deferred = $q.defer();
                        deferred.resolve(convertedData.convertedRecords);
                        return deferred.promise;
                    }
                }

                function getMatchingValue(record) {
                    return record.key;
                }

                function getConvertedValue(record) {
                    var language = applicationSettings.getSettings().language;
                    if (language && language == "zh_CN") {
                        return record.valueCN;
                    }
                    return record.valueEn;
                }
            }
        }

        function convertSingleColumn(dataFuncion, matchingValue, convertedValue, converterSettings) {
            var rows = converterSettings.tableInstance.DataTable.data();
            dataFuncion().then(
                function(data) {
                    var isConverted = false;
                    var allCodes = data;
                    for (i = 0; i < rows.length; i++) {
                        for (j = 0; j < allCodes.length; j++) {
                            if (rows[i][converterSettings.column] == matchingValue(allCodes[j])) {
                                rows[i][converterSettings.column] = convertedValue(allCodes[j]);
                                isConverted = true;
                                break;
                            }
                        }
                    }

                    $($(converterSettings.tableId + ' tbody')).find('td.' + converterSettings.column + '_convert').each(function(index, element) {
                        for (j = 0; j < allCodes.length; j++) {
                            if (element.innerHTML == matchingValue(allCodes[j])) {
                                element.innerHTML = convertedValue(allCodes[j]);
                                isConverted = true;
                                break;
                            }
                        }
                    });

                    if (isConverted) {
                        converterSettings.tableInstance.dataTable.fnAdjustColumnSizing(false);
                    }
                },
                function(error) {
                    console.log("error while getting all codes");
                }
            );
        }
        
    }
})();
