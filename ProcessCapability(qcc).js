
var localization = {
    en: {
        title: "Process Capability (qcc pkg)",
		navigation: "Process Capability(qcc)",
		
		//chartTypeXbarChk: "xbar chart",
		
		summaryPlotChk: "Plot the underlying xbar and xbar.one charts used for computing the process capability",
		
		label2: "Two options - either select a variable to chart (and a grouping variable as needed) or select the variables in dataset to chart if already grouped",
		
		selectVariableRad: "Option 1: Select a variable from the dataset (optionally that may need to be grouped)",
		variableSelcted: "Variable (observed data) to chart (for xbar and xbar.one)",
		//groupingNeededChk: "Required for xbar - Variable to use for grouping data",
		groupingVariable: "Grouping Variable (needed for xbar and not needed for xbar.one)",
		variableControlLimits: "Rows to be discarded if any before grouping for variable control limits e.g. specify as 1:25 or 1,4,5,7:12",
		displayGroupsChk: "Display the groupings on the dataset UI grid",
		
		selectDatasetRad: "Option 2: Select the variables from the Dataset if already grouped (for xbar - not for xbar.one)",
		variablelistSelcted: "Select one or more grouped variables (observed data) to chart", 
		
		rowsTobeUsed: "Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		//rowsTobeUsedAsNewData: "New Data - grouped Rows to be used as New Data to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12) - new data to plot but not included in the computations",
		nsigmas: "Sigma - number of sigmas to use for computing control limits",
		confidence_level: "A numeric value between 0 and 1 specifying the level to use for computing confidence intervals",
		stddev: "Standard deviation method for calculating xbar (for group size > 1)", 
		//sdWarnLimits: "Add warning limits (e.g. 2) at the specific std. deviations (for xbar charts only)",
		
		//processCapabilityChk: "Process capability analysis (with xbar chart)",
		lower: "LSL - numeric value of lower specification limit (type NA to specify one-sided specification limits)",
		upper: "USL - numeric value of upper specification limit (type NA to specify one-sided specification limits)",
		target: "Target specification limits (optional)",
		digits: "Digits - number of digits to display",
		
		help: {
            title: "Process Capability (qcc pkg)",
            r_help: "help(process.capability, package = qcc)",
			body: `
				<b>Description</b></br>
				qcc function to to computes capability indices 
				<br/>
				<br/>
				For the detail help - use R help(process.capability, package = qcc), help(qcc, package = qcc), help(sd.xbar, package = qcc), and help(sd.xbar.one, package = qcc)
				<br/>
				<br/>
				To try this, you may load the dataset called pistonrings from the qcc package with Load Dataset menu by selecting qcc package and then select pistonrings dataset
				<br/>
				Choose option 1, diameter to variable(observed..), sample to Grouping variable, 
				<br/>
				Type 1:25 in Grouped rows to be used
				<br/>
				For Process capability analysis - type 73.95 in LSL, 74.05 in USL, and 74.0 in Target Limit
				<br/>
				<br/>
				Follow the qcc tutorial at https://cran.r-project.org/web/packages/qcc/vignettes/qcc_a_quick_tour.html
				<br/>
			`
		},
	
	}
}

class processCapabilityQcc extends baseModal {
    constructor() {
        var config = {
            id: "processCapabilityQcc",
            label: localization.en.title,
            modalType: "two",
            RCode:`
require(qcc)

	selectedData = NULL
	qccXOneOverall = NULL
	qccXPotential = NULL 
	qccXOnePotential = NULL
	sample_size = 1
	
	
{{if(options.selected.lower === 'NA' && options.selected.upper === 'NA')}}
	BSkyFormat("\nError: LSL or USL or both must be specified\n")

{{#else}}

	if(c('{{selected.gpbox1 | safe}}') == "variable"){
		
		data_name = '{{selected.variableSelcted | safe}}{{if(options.selected.rowsTobeUsed !== "")}} [c({{selected.rowsTobeUsed | safe}})] {{/if}}'
		
		if(length(trimws(c({{selected.variableControlLimits | safe}}))) != 0){
			
			if(trimws('{{selected.groupingVariable | safe}}') != ""){
				selectedData_variable_control_limit = with({{dataset.name}}, qcc.groups(c({{selected.variableSelcted | safe}})[-c({{selected.variableControlLimits | safe}})], c({{selected.groupingVariable | safe}})[-c({{selected.variableControlLimits | safe}})]))
				
				if({{selected.displayGroupsChk | safe}}){
					{{selected.variableSelcted | safe}}ControlLimit = as.data.frame(selectedData_variable_control_limit)
					BSkyLoadRefresh('{{selected.variableSelcted | safe}}ControlLimit')
				}
				
				sample_size = dim(selectedData_variable_control_limit)[2]
				
				selectedData_variable_control_limitNonNAs = selectedData_variable_control_limit[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}), {{/if}}]
				selectedData_variable_control_limitNonNAs = selectedData_variable_control_limitNonNAs[!is.na(selectedData_variable_control_limitNonNAs)]
				
				qccXOneOverall = with({{dataset.name}}, qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
														type="xbar.one", std.dev = "SD", 
														data = selectedData_variable_control_limitNonNAs, 
														data.name = paste(data_name, "( variable sample size of ",sample_size, ")"),
														nsigmas = c({{selected.nsigmas | safe}})))
				
				qccXPotential = qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
									type="xbar", std.dev = '{{selected.stddev | safe}}', 
									data = selectedData_variable_control_limit[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}), {{/if}}], 
									data.name = paste(data_name, "( variable sample size of ",sample_size, ")"),
									nsigmas = c({{selected.nsigmas | safe}}) {{selected.confidence_level | safe}})
			
			}else{
				selectedData_variable_control_limit = with({{dataset.name}}, c({{selected.variableSelcted | safe}})[-c({{selected.variableControlLimits | safe}})])
				
				sample_size = 1
				
				qccXOneOverall = with({{dataset.name}}, qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
																type="xbar.one", std.dev = "SD", 
																data = selectedData_variable_control_limit[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}) {{/if}}], 
																data.name = paste(data_name, "( sample size of ",sample_size, ")"),
																nsigmas = c({{selected.nsigmas | safe}})))
				
				qccXOnePotential = with({{dataset.name}}, qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
															type="xbar.one", std.dev = "MR", 
															data = selectedData_variable_control_limit[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}) {{/if}}], 
															data.name = paste(data_name, "( sample size of ",sample_size, ")"),
															nsigmas = c({{selected.nsigmas | safe}}))) 
			}
		}else{
			if(trimws('{{selected.groupingVariable | safe}}') != ""){
				selectedData = with({{dataset.name}}, qcc::qcc.groups(c({{selected.variableSelcted | safe}}), c({{selected.groupingVariable | safe}})))
			
				sample_size = dim(selectedData)[2]
				
				if({{selected.displayGroupsChk | safe}} && !is.null(selectedData)){
					{{selected.variableSelcted | safe}}Gpd = as.data.frame(selectedData)
					BSkyLoadRefresh('{{selected.variableSelcted | safe}}Gpd')
				}
				
				qccXOneOverall = qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
									type="xbar.one", std.dev = 'SD', 
									data = unlist(selectedData[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}), {{/if}}]), 
									data.name = paste(data_name, "( sample size of ",sample_size, ")"),								
									nsigmas = c({{selected.nsigmas | safe}})) 
				
				qccXPotential = qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
									type="xbar", std.dev = '{{selected.stddev | safe}}', 
									data = selectedData[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}), {{/if}}], 
									data.name = paste(data_name, "( sample size of ",sample_size, ")"),
									nsigmas = c({{selected.nsigmas | safe}})) 
			}else{
				sample_size = 1
				
				qccXOneOverall = with({{dataset.name}}, qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
															type="xbar.one", std.dev = "SD", 
															data = c({{selected.variableSelcted | safe}})[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}) {{/if}}], 
															data.name = paste(data_name, "( sample size of ",sample_size, ")"),
															nsigmas = c({{selected.nsigmas | safe}})))
				
				qccXOnePotential = with({{dataset.name}}, qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
															type="xbar.one", std.dev = "MR", 
															data = c({{selected.variableSelcted | safe}})[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}) {{/if}}], 
															data.name = paste(data_name, "( sample size of ",sample_size, ")"),
															nsigmas = c({{selected.nsigmas | safe}})))
			}
		}
	}else{
		data_name = '{{dataset.name}}{{if(options.selected.rowsTobeUsed !== "")}} [c({{selected.rowsTobeUsed | safe}}),] {{/if}}'
		
		if(length(c({{selected.variablelistSelcted | safe}})) == 0){
			selectedData = {{dataset.name}}[]
		}else{
			selectedData = {{dataset.name}}[, c({{selected.variablelistSelcted | safe}})]
		}
		
		sample_size = dim(selectedData)[2]
		
		qccXOneOverall = with({{dataset.name}}, qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
													type="xbar.one", std.dev = "SD", 
													data = selectedData[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}), {{/if}}], 
													data.name = paste(data_name, "( sample size of ",sample_size, ")"),
													nsigmas = c({{selected.nsigmas | safe}})))

		qccXPotential = qcc::qcc(plot = FALSE,  rules = c(), digits = {{selected.digits | safe}}, 
							type="xbar", std.dev = '{{selected.stddev | safe}}', 
							data = selectedData[{{if(options.selected.rowsTobeUsed !== "")}} c({{selected.rowsTobeUsed | safe}}), {{/if}}], 
							data.name = paste(data_name, "( sample size of ",sample_size, ")"),															
							nsigmas = c({{selected.nsigmas | safe}}))
	}
	
	
	if(!is.null(qccXOneOverall)){
		
		BSkyFormat(paste("Overall Process Capability Indices for ", data_name, "( sample size of ",sample_size, ")"))
		process.capability.enhanced(qccXOneOverall {{selected.confidence_level | safe}}, digits = {{selected.digits | safe}}, nsigmas = c({{selected.nsigmas | safe}}), print = TRUE, capability.type = "overall", spec.limits=c(c({{selected.lower | safe}}),c({{selected.upper | safe}})) {{selected.target | safe}})
	}
	
	if(!is.null(qccXPotential)){
		BSkyFormat(paste("Potential (Within) Process Capability Indices for ", data_name, "( sample size of ",sample_size, ")"))
		process.capability.enhanced(qccXPotential {{selected.confidence_level | safe}}, digits = {{selected.digits | safe}}, nsigmas = c({{selected.nsigmas | safe}}), print = TRUE, capability.type = "potential", spec.limits=c(c({{selected.lower | safe}}),c({{selected.upper | safe}})) {{selected.target | safe}})
	}else{
		BSkyFormat(paste("Potential (Within) Process Capability Indices for ", data_name, "( sample size of ",sample_size, ")"))
		process.capability.enhanced(qccXOnePotential {{selected.confidence_level | safe}}, digits = {{selected.digits | safe}}, nsigmas = c({{selected.nsigmas | safe}}), print = TRUE, capability.type = "potential", spec.limits=c(c({{selected.lower | safe}}),c({{selected.upper | safe}})) {{selected.target | safe}})
	}
	
	if({{selected.summaryPlotChk | safe}} && !is.null(qccXOneOverall)){
		
		BSkyFormat(paste("xbar.one Chart Used for Computing Overall Process Capability Indices for ", data_name, "(sample size of ",sample_size, ")"))
		plot(qccXOneOverall, digits = {{selected.digits | safe}}) 
	}
	
	if({{selected.summaryPlotChk | safe}} && !is.null(qccXPotential)){
		BSkyFormat(paste("xbar Chart Used for Computing Potential (Within) Process Capability Indices for ", data_name, "(sample size of ",sample_size, ")"))
		plot(qccXPotential, digits = {{selected.digits | safe}})
	}else if({{selected.summaryPlotChk | safe}}){
		BSkyFormat(paste("xbar.one Chart Used for Computing Potential Process Capability Indices for ", data_name, "(sample size of ",sample_size, ")"))
		plot(qccXOnePotential, digits = {{selected.digits | safe}})
	}

{{/if}}

`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) },
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
			summaryPlotChk: {
                el: new checkbox(config, {
                    label: localization.en.summaryPlotChk, 
					no: "summaryPlotChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
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
                    value: "",
					//wrapped: 'c(%val%) ',
                })
            },
			nsigmas: {
                el: new input(config, {
                    no: 'nsigmas',
                    label: localization.en.nsigmas,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "3",
					width: "w-25",
                })
            },
			confidence_level: {
                el: new input(config, {
                    no: 'confidence_level',
                    label: localization.en.confidence_level,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "0.95",
					wrapped: ', confidence.level=c(%val%)',
					width: "w-25",
                })
            },
			lower: {
                el: new input(config, {
                    no: 'lower',
                    label: localization.en.lower,
                    placeholder: "",
                    required: true,
                    //type: "numeric",
					//style: "ml-3",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "NA",
					width: "w-25",
                })
            },
			upper: {
                el: new input(config, {
                    no: 'upper',
                    label: localization.en.upper,
                    placeholder: "",
                    required: true,
                    //type: "numeric",
					//style: "ml-3",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "NA",
					width: "w-25",
                })
            },
			target: {
                el: new input(config, {
                    no: 'target',
                    label: localization.en.target,
                    placeholder: "",
                    required: false,
                    type: "numeric",
					//style: "ml-3",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: ', target=c(%val%)',
					width: "w-25",
                })
            },
			stddev: {
                el: new selectVar(config, {
                    no: 'stddev',
                    label: localization.en.stddev,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["RMSDF", "UWAVE-R", "UWAVE-SD", "MVLUE-R", "MVLUE-SD"],
                    default: "RMSDF",
					//width: "w-25",
                })
            },
			digits: {
                el: new inputSpinner(config, {
                    no: 'digits',
                    label: localization.en.digits,
                    required: true,
                    min: 0,
                    max: 15,
                    step: 1,
                    value: 6,
					width: "w-25",
					style: "mb-2",
                })
            },              
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [
					objects.label2.el.content,
					objects.selectVariableRad.el.content,
					objects.variableSelcted.el.content, 
					
					objects.groupingVariable.el.content,
					objects.variableControlLimits.el.content,
					objects.displayGroupsChk.el.content,
					
					objects.selectDatasetRad.el.content,
					objects.variablelistSelcted.el.content,
					
					objects.lower.el.content,
					objects.upper.el.content,
					objects.target.el.content,
					
					objects.rowsTobeUsed.el.content,
					
					objects.nsigmas.el.content,
					objects.confidence_level.el.content,
					objects.stddev.el.content,
					objects.digits.el.content,
					objects.summaryPlotChk.el.content
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
module.exports.item = new processCapabilityQcc().render()