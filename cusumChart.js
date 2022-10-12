
var localization = {
    en: {
        title: "Cusum chart",
		navigation: "Cusum chart",
		
		summaryPrintChk: "Print summary in addition to charts",
		//ocCurvesChk: "Plot operating characteristic curves where applicable",
		
		label2: "Two options - either select a variable to chart (and a grouping variable as needed) or select the variables in dataset to chart if already grouped",
		
		selectVariableRad: "Option 1: Select a variable from the dataset that needs to be grouped",
		variableSelcted: "Variable(observed data) to chart",
		groupingNeededChk: "Required for xbar, R and S charts - Variable to use for grouping data",
		groupingVariable: "Grouping Variable",
		variableControlLimits: "Rows to be discarded if any before grouping for variable control limits e.g. specify as 1:25 or 1,4,5,7:12",
		displayGroupsChk: "Display the groupings on the dataset UI grid",
		
		selectDatasetRad: "Option 2: Select the variables from the Dataset if already grouped",
		variablelistSelcted: "Select one or more grouped variables (observed data) to chart", 
		
		decisionInterval: "decision Interval - the number of standard errors of the summary statistics at which the cumulative sum is out of control",
		seShift: "Shif - the amount of shift to detect in the process, measured in standard errors of the summary statistics",
		
		rowsTobeUsed: "Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedAsNewData: "New Data - grouped Rows to be used as New Data to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12) - new data to plot but not included in the computations",
		
		//nsigmas: "Sigma - number of sigmas to use for computing control limits. It is ignored when the confidence.level argument is provided",
		//confidence_level: "Confidence Level - value between 0 and 1 specifying the confidence level of the computed probability limits",
		//sdWarnLimits: "Add warning limits (e.g. 2) at the specific std. deviations (for xbar charts only)",
		
		help: {
            title: "Cusum chart",
            r_help: "help(qcc, package = qcc)",
			body: `
				<b>Description</b></br>
				qcc function to to perform statistical quality control and to plot Shewhart charts
				<br/>
				<br/>
				For the detail help - use R help(qcc, package = qcc)
				<br/>
				<br/>
				To try this, you may load the dataset called pistonrings from the qcc package with Load Dataset menu by selecting qcc package and then select pistonrings dataset
				<br/>
				Choose option 1, diameter to variable(observed..), sample to Grouping variable, 
				<br/>
				Type 1:25 in Grouped rows to be used, 30:40 in New Data
				<br/>
				<br/>
				Follow the qcc tutorial at https://cran.r-project.org/web/packages/qcc/vignettes/qcc_a_quick_tour.html
				<br/>
			`
		},
	}
}

class cusumChart extends baseModal {
    constructor() {
        var config = {
            id: "cusumChart",
            label: localization.en.title,
            modalType: "two",
            RCode:`
require(qcc)

#Cusum Chart


selectedData = NULL

if(c('{{selected.gpbox1 | safe}}') == "variable"){
	
	if(trimws('{{selected.groupingVariable | safe}}') != "")
	{
		selectedData = with({{dataset.name}}, qcc.groups(c({{selected.variableSelcted | safe}}), c({{selected.groupingVariable | safe}})))
	}
	
	if({{selected.displayGroupsChk | safe}} && !is.null(selectedData))
	{
		{{selected.variableSelcted | safe}}Gpd = as.data.frame(selectedData)
		#BSkyFormat({{selected.variableSelcted | safe}}, outputTableRenames = paste("Grouping generated for {{selected.variableSelcted | safe}} by {{selected.groupingVariable | safe}}"))
		BSkyLoadRefresh('{{selected.variableSelcted | safe}}Gpd')
	}
	
	data_name = '{{selected.variableSelcted | safe}}'
	
}else
{
	if(length(c({{selected.variablelistSelcted | safe}})) == 0){
		selectedData = {{dataset.name}}[]
	}else{
		selectedData = {{dataset.name}}[, c({{selected.variablelistSelcted | safe}})]
	}
	
	data_name = '{{dataset.name}}'
}


cat("Charts selected: Cusum")


#chart type Cusum
	qccCusum = NULL 
	
	
	if(!is.null(selectedData)) {
		if(trimws('{{selected.rowsTobeUsedAsNewData | safe}}') == "" || trimws('{{selected.rowsTobeUsed | safe}}') ==""){
			BSkyFormat(paste("\nCusum chart", "for", data_name, "without new data"))
			qccCusum = qcc::cusum(data = selectedData[{{selected.rowsTobeUsed | safe}}], decision.interval = c({{selected.decisionInterval | safe}}), se.shift = c({{selected.seShift | safe}})) 
		}
		else if(trimws('{{selected.rowsTobeUsed | safe}}') != "" ){
			BSkyFormat(paste("\nCusum chart", "for", data_name,  "with new data"))
			qccCusum = qcc::cusum(data = selectedData[{{selected.rowsTobeUsed | safe}}], newdata=selectedData[c({{selected.rowsTobeUsedAsNewData | safe}}),], decision.interval = c({{selected.decisionInterval | safe}}), se.shift = c({{selected.seShift | safe}})) 
		}
		
		if({{selected.summaryPrintChk | safe}} && !is.null(qccCusum)){
			summary(qccCusum)
		}
	}
	
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) },
			summaryPrintChk: {
                el: new checkbox(config, {
                    label: localization.en.summaryPrintChk, 
					no: "summaryPrintChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			label2: { 
				el: new labelVar(config, { 
					label: localization.en.label2, 
					h: 6, 
					style: "mb-2",
				}) 
			},
			selectDatasetRad: {
                el: new radioButton(config, {
                    label: localization.en.selectDatasetRad,
                    no: "gpbox1",
                    increment: "selectDatasetRad",
                    value: "dataset",
                    state: "",
					//style: "mb-3",
                    extraction: "ValueAsIs",
                })
            },
			variablelistSelcted: {
                el: new dstVariableList(config, {
                    label: localization.en.variablelistSelcted,
                    no: "variablelistSelcted",
                    required: false,
                    filter: "Numeric|Scale",
					style: "mt-1 mb-3",
                    extraction: "NoPrefix|UseComma|Enclosed",
                })
            },
			selectVariableRad: {
                el: new radioButton(config, {
                    label: localization.en.selectVariableRad,
                    no: "gpbox1",
                    increment: "selectVariableRad",
                    value: "variable",
                    state: "checked",
                    extraction: "ValueAsIs",
                })
            },
			variableSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableSelcted,
                    no: "variableSelcted",
                    required: false,
                    //filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					filter: "Numeric|Scale",
					style: "mt-1 ml-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			groupingNeededChk: {
                el: new checkbox(config, {
                    label: localization.en.groupingNeededChk, 
					no: "groupingNeededChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-1, ml-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			groupingVariable: {
                el: new dstVariable(config, {
                    label: localization.en.groupingVariable,
                    no: "groupingVariable",
                    required: false,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					style: "ml-5",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			displayGroupsChk: {
                el: new checkbox(config, {
                    label: localization.en.displayGroupsChk, 
					no: "displayGroupsChk",
                    bs_type: "valuebox",
                    style: "mt-2 ml-5 mb-2",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			variableControlLimits: {
                el: new input(config, {
                    no: 'variableControlLimits',
                    label: localization.en.variableControlLimits,
                    placeholder: "",
                    required: false,
                    type: "character",
					style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
                })
            },
			rowsTobeUsed: {
                el: new input(config, {
                    no: 'rowsTobeUsed',
                    label: localization.en.rowsTobeUsed,
                    placeholder: "",
                    required: false,
                    type: "character",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: 'c(%val%) , ',
                })
            },
			rowsTobeUsedAsNewData: {
                el: new input(config, {
                    no: 'rowsTobeUsedAsNewData',
                    label: localization.en.rowsTobeUsedAsNewData,
                    placeholder: "",
                    required: false,
                    type: "character",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
                })
            },
			decisionInterval: {
                el: new input(config, {
                    no: 'decisionInterval',
                    label: localization.en.decisionInterval,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "5",
					width: "w-25",
                })
            },
			seShift: {
                el: new input(config, {
                    no: 'seShift',
                    label: localization.en.seShift,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "1",
					width: "w-25",
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [
					objects.summaryPrintChk.el.content,
					
					objects.label2.el.content,
					objects.selectVariableRad.el.content,
					objects.variableSelcted.el.content, 
					//objects.groupingNeededChk.el.content,
					objects.groupingVariable.el.content,
					//objects.variableControlLimits.el.content,
					objects.displayGroupsChk.el.content,
					
					objects.selectDatasetRad.el.content,
					objects.variablelistSelcted.el.content,
					
					objects.decisionInterval.el.content,
					objects.seShift.el.content,
					
					objects.rowsTobeUsed.el.content,
					objects.rowsTobeUsedAsNewData.el.content
					],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sixsigma",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new cusumChart().render()