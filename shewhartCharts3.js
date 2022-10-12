
var localization = {
    en: {
        title: "Shewhart charts (xbar.one)",
		navigation: "Shewhart charts (xbar.one)",
		
		variableSelcted2: "Variable (observed data) to chart",
		
		printStatChk: "Print stats in addition to charts",
		printObjectSummaryChk: "Print QCC object summary",
		printTestSummaryChk: "Print summary from the tests for special causes",
		printTestDetailChk: "Print details from the tests for special causes",
		markTestNumberChk: "Mark Test Number on the chart (only the first test number will be marked if more than one tests found to be violated by a data point)",
		
		ocCurvesChk: "Plot operating characteristic curves where applicable (must have equal sample sizes)",
		
		rowsTobeUsed: "Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedAsNewData: "New Data - grouped Rows to be used as New Data to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12) - new data to plot but not included in the computations",
		
		additionalPhasesLabel: "Specify data to Chart additional phases (limited to max of 10 phases to be practical to plot on a single chart)",
		rowsTobeUsedPhase2: "Phase 2 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedPhase3: "Phase 3 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedPhase4: "Phase 4 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedPhase5: "Phase 5 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedPhase6: "Phase 6 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedPhase7: "Phase 7 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedPhase8: "Phase 8 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedPhase9: "Phase 9 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		rowsTobeUsedPhase10: "Phase 10 Grouped Rows to be used to Chart ( e.g.  specify as 1:25 or 1,4,5,7:12)",
		phaseNames: "Specify phase names (comma separated) for a multi-phase chart - default phase names are Phase 1, Phase 2, ...",
		
		nsigmas: "Sigma - number of sigmas to use for computing control limits. It is ignored when the confidence.level argument is provided",
		confidence_level: "Confidence Level - value between 0 and 1 specifying the confidence level of the computed probability limits",
		xbarOneStddev: "Xbar chart - Standard deviation method to be used",
		sdWarnLimits: "Add additional limit lines (comma separated) on the plot at the specific std. deviations (e.g. 1.5, 2)",
		
		digits: "Digits - number of digits to display",
		
		lower: "LSL - numeric value of lower specification limit to plot a LSL line",
		upper: "USL - numeric value of upper specification limit to plot a USL line",
		
		
		performTestLabel: "Perform selected tests for special causes",
		
		test1Chk: "Perform test 1",
		test2Chk: "Perform test 2",
		test3Chk: "Perform test 3",
		test4Chk: "Perform test 4",
		test5Chk: "Perform test 5",
		test6Chk: "Perform test 6",
		test7Chk: "Perform test 7",
		test8Chk: "Perform test 8",
		
		test1: "One point more than Kσ from center line (default 3)",
		test2: "K points in a row on the same side of the center line (defualt 9)",
		test3: "K points in a row, all increasing or all decreasing (default 6)",
		test4: "K points in a row, alternating up and down (defult 14)",
		test5: "K out of K+1 points more than 2σ from the center line same side (defualt 2 out of 2+1)",
		test6: "K out of K+1 points more than 1σ from center line same side (default 4 out of 4+1)",
		test7: "K points in a row within 1σ of center line either side (default 15)",
		test8: "K points in a row more than 1σ from center line either side (defualt 8)",
		
		help: {
            title: "Shewhart charts (xbar.one)",
            r_help: "help(qcc, package = qcc)",
			body: `
				<b>Description</b></br>
				qcc function to to perform statistical quality control and to plot Shewhart charts
				<br/>
				<br/>
				For the detail help - use R help(qcc, package = qcc)
				<br/>
				<br/>
				To try this, you may load the dataset called orangejuice from the qcc package with Load Dataset menu by selecting qcc package and then select pistonrings dataset
				<br/>
				Choose D to variable(observed..) 
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

class shewhartCharts3 extends baseModal {
    constructor() {
        var config = {
            id: "shewhartCharts3",
            label: localization.en.title,
            modalType: "two",
            RCode:`
require(qcc)

#Shewhart Charts xbar.one



phases = list(
			c({{selected.rowsTobeUsed | safe}}),
			c({{selected.rowsTobeUsedPhase2 | safe}}),
			c({{selected.rowsTobeUsedPhase3 | safe}}),
			c({{selected.rowsTobeUsedPhase4 | safe}}),
			c({{selected.rowsTobeUsedPhase5 | safe}}),
			c({{selected.rowsTobeUsedPhase6 | safe}}),
			c({{selected.rowsTobeUsedPhase7 | safe}}),
			c({{selected.rowsTobeUsedPhase8 | safe}}),
			c({{selected.rowsTobeUsedPhase9 | safe}}),
			c({{selected.rowsTobeUsedPhase10 | safe}})
			)

BSkySetSixSigmaTestOptions( test1 = {{selected.test1Chk | safe}}, one.point.k.stdv = {{selected.test1 | safe}}, 
							test2 = {{selected.test2Chk | safe}}, k.run.same.side = {{selected.test2 | safe}}, 
							test3 = {{selected.test3Chk | safe}}, k.run.increase.decrease = {{selected.test3 | safe}}, 
							test4 = {{selected.test4Chk | safe}}, k.run.alternating = {{selected.test4 | safe}},
							test5 = {{selected.test5Chk | safe}}, k.plusone.run.beyond.2dev = {{selected.test5 | safe}}, 
							test6 = {{selected.test6Chk | safe}}, k.plusone.run.beyond.1dev = {{selected.test6 | safe}}, 
							test7 = {{selected.test7Chk | safe}}, k.run.within.1dev = {{selected.test7 | safe}}, 
							test8 = {{selected.test8Chk | safe}}, k.run.beyond.1dev = {{selected.test8 | safe}}, 
							digits = {{selected.digits | safe}})



chartTypes = c("xbar.one")
cat("Charts selected:", chartTypes)

#chart type xbar.one
xbar.one.spc.qcc.objects = NULL

i=1
if(trimws(chartTypes) != "") 
{	
			BSkyFormat(paste("\nChart Type:", chartTypes[i], "for", c('{{selected.variableSelcted2 | safe}}')))
				
			xbar.one.spc.qcc.objects = plot.qcc.spc.phases(
								type = chartTypes[i],
								data = c({{dataset.name}}\${{selected.variableSelcted2 | safe}}), 
								data.name = c('{{selected.variableSelcted2 | safe}}'),  
								newdata=c({{selected.rowsTobeUsedAsNewData | safe}}), 
								newdata.name = c(),  
								phases.data.list = phases, 
								phase.names = {{selected.phaseNames | safe}}, 
                                nsigmas = c({{selected.nsigmas | safe}}), 
								confidence.level= c({{selected.confidence_level | safe}}), 
								std.dev = '{{selected.xbarOneStddev | safe}}',
								digits ={{selected.digits | safe}}, 
								spec.limits = list(lsl=c({{selected.lower | safe}}), usl= c({{selected.upper | safe}})),
								additional.sigma.lines = c({{selected.sdWarnLimits| safe}}),
								mark.test.number = {{selected.markTestNumberChk | safe}}
								)
}


if(!is.null(xbar.one.spc.qcc.objects))
{
			print.qcc.spc.phases(qcc.spc.phases.obects = xbar.one.spc.qcc.objects,
									print.stats = {{selected.printStatChk | safe}}, 
									print.test.summary = {{selected.printTestSummaryChk | safe}}, 
									print.test.detail = {{selected.printTestDetailChk | safe}},
									print.qcc.object.summary = {{selected.printObjectSummaryChk | safe}},
									digits = {{selected.digits | safe}}, 
									phase.names = {{selected.phaseNames | safe}}
								)
									
}


	
`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) },
			variableSelcted2: {
                el: new dstVariable(config, {
                    label: localization.en.variableSelcted2,
                    no: "variableSelcted2",
                    required: false,
                    //filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					filter: "Numeric|Scale",
					//style: "mt-1 ml-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			printStatChk: {
                el: new checkbox(config, {
                    label: localization.en.printStatChk, 
					no: "printStatChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					state: "checked",
					newline: true,
                })
            },
			printObjectSummaryChk: {
                el: new checkbox(config, {
                    label: localization.en.printObjectSummaryChk, 
					no: "printObjectSummaryChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					//state: "checked",
					newline: true,
                })
            },
			printTestSummaryChk: {
                el: new checkbox(config, {
                    label: localization.en.printTestSummaryChk, 
					no: "printTestSummaryChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					//state: "checked",
					newline: true,
                })
            },
			printTestDetailChk: {
                el: new checkbox(config, {
                    label: localization.en.printTestDetailChk, 
					no: "printTestDetailChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			markTestNumberChk: {
                el: new checkbox(config, {
                    label: localization.en.markTestNumberChk, 
					no: "markTestNumberChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					state: "checked",
					newline: true,
                })
            },
			ocCurvesChk: {
                el: new checkbox(config, {
                    label: localization.en.ocCurvesChk, 
					no: "ocCurvesChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-3",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			rowsTobeUsed: {
                el: new input(config, {
                    no: 'rowsTobeUsed',
                    label: localization.en.rowsTobeUsed,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedAsNewData: {
                el: new input(config, {
                    no: 'rowsTobeUsedAsNewData',
                    label: localization.en.rowsTobeUsedAsNewData,
                    placeholder: "",
                    required: false,
					filter: "character|numeric",
                    //type: "character",
					style: "mb-3",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
                })
            },
			additionalPhasesLabel: { 
				el: new labelVar(config, { 
					label: localization.en.additionalPhasesLabel, 
					h: 6, 
					style: "mb-2",
				}) 
			},
			phaseNames: {
                el: new input(config, {
                    no: 'phaseNames',
                    label: localization.en.phaseNames,
                    placeholder: "",
                    required: false,
                    type: "character",
					style: "mb-3",
                    extraction: "CreateArray",
					allow_spaces:true,
                    value: "Phase 1, Phase 2, Phase 3, Phase 4, Phase 5, Phase 6, Phase 7, Phase 8, Phase 9, Phase 10",
                })
            },
			rowsTobeUsedPhase2: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase2',
                    label: localization.en.rowsTobeUsedPhase2,
                    placeholder: "",
                    required: false,
					filter: "character|numeric",
                    //type: "character",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedPhase3: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase3',
                    label: localization.en.rowsTobeUsedPhase3,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedPhase4: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase4',
                    label: localization.en.rowsTobeUsedPhase4,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedPhase5: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase5',
                    label: localization.en.rowsTobeUsedPhase5,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedPhase6: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase6',
                    label: localization.en.rowsTobeUsedPhase6,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedPhase7: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase7',
                    label: localization.en.rowsTobeUsedPhase7,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedPhase8: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase8',
                    label: localization.en.rowsTobeUsedPhase8,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedPhase9: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase9',
                    label: localization.en.rowsTobeUsedPhase9,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			rowsTobeUsedPhase10: {
                el: new input(config, {
                    no: 'rowsTobeUsedPhase10',
                    label: localization.en.rowsTobeUsedPhase10,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					style: "mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
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
                    required: false,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
					width: "w-25",
                })
            },
			xbarOneStddev: {
                el: new selectVar(config, {
                    no: 'xbarOneStddev',
                    label: localization.en.xbarOneStddev,
                    multiple: false,
                    extraction: "NoPrefix|UseComma",
                    options: ["MR", "SD"],
                    default: "MR",
					style: "mb-3",
					//width: "w-25",
                })
            },
			sdWarnLimits: {
                el: new input(config, {
                    no: 'sdWarnLimits',
                    label: localization.en.sdWarnLimits,
                    placeholder: "",
                    required: false,
                    filter: "character|numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
					//style: "mb-2",
					width: "w-25",
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
                    value: 2,
					width: "w-25",
					style: "mb-2",
                })
            }, 
			lower: {
                el: new input(config, {
                    no: 'lower',
                    label: localization.en.lower,
                    placeholder: "",
                    required: false,
                    type: "numeric",
					//style: "ml-3",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
					width: "w-25",
                })
            },
			upper: {
                el: new input(config, {
                    no: 'upper',
                    label: localization.en.upper,
                    placeholder: "",
                    required: false,
                    type: "numeric",
					style: "mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
					width: "w-25",
                })
            },
			performTestLabel: { 
				el: new labelVar(config, { 
					label: localization.en.performTestLabel, 
					h: 6, 
					style: "mb-2",
				}) 
			},
			test1Chk: {
                el: new checkbox(config, {
                    label: localization.en.test1Chk, 
					no: "test1Chk",
                    bs_type: "valuebox",
                    //style: "mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					//state: "checked",
					newline: true,
                })
            },
			test2Chk: {
                el: new checkbox(config, {
                    label: localization.en.test2Chk, 
					no: "test2Chk",
                    bs_type: "valuebox",
                    //style: "mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					//state: "checked",
					newline: true,
                })
            },
			test3Chk: {
                el: new checkbox(config, {
                    label: localization.en.test3Chk, 
					no: "test3Chk",
                    bs_type: "valuebox",
                    //style: "mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			test4Chk: {
                el: new checkbox(config, {
                    label: localization.en.test4Chk, 
					no: "test4Chk",
                    bs_type: "valuebox",
                    //style: "mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			test5Chk: {
                el: new checkbox(config, {
                    label: localization.en.test5Chk, 
					no: "test5Chk",
                    bs_type: "valuebox",
                    //style: "mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			test6Chk: {
                el: new checkbox(config, {
                    label: localization.en.test6Chk, 
					no: "test6Chk",
                    bs_type: "valuebox",
                    //style: "mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			test7Chk: {
                el: new checkbox(config, {
                    label: localization.en.test7Chk, 
					no: "test7Chk",
                    bs_type: "valuebox",
                    //style: "mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			test8Chk: {
                el: new checkbox(config, {
                    label: localization.en.test8Chk, 
					no: "test8Chk",
                    bs_type: "valuebox",
                    //style: "mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			test1: {
                el: new input(config, {
                    no: 'test1',
                    label: localization.en.test1,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "3",
					width: "w-25",
                })
            },
			test2: {
                el: new input(config, {
                    no: 'test2',
                    label: localization.en.test2,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "9",
					width: "w-25",
                })
            },
			test3: {
                el: new input(config, {
                    no: 'test3',
                    label: localization.en.test3,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "6",
					width: "w-25",
                })
            },
			test4: {
                el: new input(config, {
                    no: 'test4',
                    label: localization.en.test4,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "14",
					width: "w-25",
                })
            },
			test5: {
                el: new input(config, {
                    no: 'test5',
                    label: localization.en.test5,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "2",
					width: "w-25",
                })
            },
			test6: {
                el: new input(config, {
                    no: 'test6',
                    label: localization.en.test6,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "4",
					width: "w-25",
                })
            },
			test7: {
                el: new input(config, {
                    no: 'test7',
                    label: localization.en.test7,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "15",
					width: "w-25",
                })
            },
			test8: {
                el: new input(config, {
                    no: 'test8',
                    label: localization.en.test8,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					style: "ml-5 mb-2",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "8",
					width: "w-25",
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content], 
            right: [
					objects.variableSelcted2.el.content, 
					
					objects.nsigmas.el.content,
					objects.confidence_level.el.content,
					objects.xbarOneStddev.el.content,
					
					//objects.processCapabilityChk.el.content,
					objects.upper.el.content,
					objects.lower.el.content,
					//objects.target.el.content 
					objects.sdWarnLimits.el.content, 
					
					objects.digits.el.content,
					
					objects.printStatChk.el.content, 
					objects.printObjectSummaryChk.el.content,
					
					//objects.ocCurvesChk.el.content,
					
					objects.rowsTobeUsed.el.content,
					objects.rowsTobeUsedAsNewData.el.content,
					
					objects.additionalPhasesLabel.el.content,
					objects.rowsTobeUsedPhase2.el.content,
					objects.rowsTobeUsedPhase3.el.content,
					objects.rowsTobeUsedPhase4.el.content,
					objects.rowsTobeUsedPhase5.el.content,
					objects.rowsTobeUsedPhase6.el.content,
					objects.rowsTobeUsedPhase7.el.content,
					objects.rowsTobeUsedPhase8.el.content,
					objects.rowsTobeUsedPhase9.el.content,
					objects.rowsTobeUsedPhase10.el.content, 
					objects.phaseNames.el.content,
					
					objects.performTestLabel.el.content,
					
					objects.markTestNumberChk.el.content,
					objects.printTestSummaryChk.el.content,
					objects.printTestDetailChk.el.content,
					
					objects.test1Chk.el.content,
					objects.test1.el.content,
					objects.test2Chk.el.content,
					objects.test2.el.content,
					objects.test3Chk.el.content,
					objects.test3.el.content,
					objects.test4Chk.el.content,
					objects.test4.el.content,
					objects.test5Chk.el.content,
					objects.test5.el.content,
					objects.test6Chk.el.content,
					objects.test6.el.content,
					objects.test7Chk.el.content,
					objects.test7.el.content,
					objects.test8Chk.el.content,
					objects.test8.el.content
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
module.exports.item = new shewhartCharts3().render()