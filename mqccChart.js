
var localization = {
    en: {
        title: "Multivariate Quality Control Chart (mqcc)",
		navigation: "MQCC Chart",
		
		summaryPrintChk: "Print summary in addition to chart",
		
		//dataSelected: "Data (select one or more variable) to chart",
		//newDataSelected: "New data (select one or more datasets/matrices ) to chart",
		
		variableListSelcted: "Data (select one or more variables) to chart",
		groupingVariable: "(Optional) Select grouping Variable if subgroups are present",
		
		limitsChk: "If control limits (Phase I) must be computed and plotted",
		pred_limitsChk: "If prediction limits (Phase II) must be computed and plotted",
		
		confidence_level: "(Optional) A numeric value between 0 and 1 specifying the confidence level of the computed probability limits",
		
		genVarianceChk: "Plot control chart for the generalized variance |S| for all variables in the dataset",
		
		help: {
            title: "Multivariate Quality Control Chart(mqcc)",
            r_help: "help(mqcc, package = qcc)",
			body: `
				<b>Description</b></br>
				mqcc function to perform multivariate statistical quality control and the generalized variance |S|
				<br/>
				<br/>
				For the detail help - use R help(mqcc, package = qcc) and help(GVcontrol, package = IAcsSPCR)
				<br/>
				<br/>
				To try this, you may load the dataset called boiler from the qcc package with Load Dataset menu by selecting qcc package and then select boiler dataset to load
				<br/>
				<br/>
				Seelct the variables from the boiler dataset, leave everything as deafult, and run the dialog
				<br/>
				<br/>
				To plot generalized variance |S|, the dataset must have the first column as the subgroup - othrwise it will fail
				<br/>
				<br/>
				Follow the qcc tutorial at https://cran.r-project.org/web/packages/qcc/vignettes/qcc_a_quick_tour.html
				<br/>
			`
		},
		
	}
}

class mqccChart extends baseModal {
    constructor() {
        var config = {
            id: "mqccChart",
            label: localization.en.title,
            modalType: "two",
            RCode:`
	
	require(qcc)
	
	{{if(options.selected.genVarianceChk === 'TRUE')}} 
	require(IAcsSPCR)
	{{/if}}

	var_list = NULL
	var_list_gpd = NULL
	mqccX = NULL
	GVcontrolX = NULL
	
	{{if(options.selected.groupingVariable !== '')}} 
		var_list = list({{selected.variableListSelcted | safe}})
		var_list_gpd <- lapply(var_list, 
							   function(x)
							   {
									var_gpd = qcc.groups(x, {{dataset.name}}\${{selected.groupingVariable | safe}})
									row.names(var_gpd) = NULL
									return(var_gpd)
							   } 
							)
	{{#else}}
		var_list_gpd = list({{selected.variableListSelcted | safe}})
	{{/if}}
							
	mqccX = mqcc(var_list_gpd, type = "T2", 
				limits = {{selected.limitsChk | safe}}, 
				data.name = paste(names(var_list_gpd),collapse=','),
				pred.limits = {{selected.pred_limitsChk | safe}} {{selected.confidence_level | safe}} 
			 )
	
	
	{{if(options.selected.genVarianceChk === 'TRUE')}} 
		if(dim({{dataset.name}})[2] > 1){
			{{dataset.name}}_GVcontrol_df = as.data.frame({{dataset.name}})
			
			names({{dataset.name}}_GVcontrol_df) = c("subgroup", names({{dataset.name}})[2:dim({{dataset.name}})[2]])
			GVcontrolX = IAcsSPCR::GVcontrol(DF = {{dataset.name}}_GVcontrol_df, 
									m = length(unique(as.numeric({{dataset.name}}[,1]))), 
									n = nrow({{dataset.name}})/length(unique(as.numeric({{dataset.name}}[,1]))), 
									p = dim({{dataset.name}})[2]-1)
		}
	{{/if}}
	
	if(!is.null(mqccX))
		BSkyFormat(mqccX$cov, outputTableRenames = c(paste("{{dataset.name}}:","Covariance matrix")))
	
	if({{selected.summaryPrintChk | safe}}){
		if(!is.null(mqccX)){
				BSkyFormat(paste("Confidence level used for the Multivariate control chart:", round(mqccX$confidence.level, BSkyGetDecimalDigitSetting())))
				BSkyFormat("Summary for Multivariate control chart")
				summary(mqccX)
		}
		
		if(!is.null(GVcontrolX)){
				BSkyFormat("Summary for Generalized Variance control chart")
				print(GVcontrolX)
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
			/*
            dataSelected: {
                el: new dstVariableList(config, {
                    label: localization.en.dataSelected,
                    no: "dataSelected",
                    filter: "Dataset",
                    extraction: "UseComma|NoPrefix|Enclosed",
					extraction: "ValueAsIs",
                    required: true,
                })
            },
            newDataSelected: {
                el: new dstVariableList(config, {
                    label: localization.en.newDataSelected,
                    no: "newDataSelected",
                    filter: "Dataset",
                    //extraction: "UseComma|Enclosed",
					extraction: "ValueAsIs",
                    required: false,
                })
            },
			*/
			variableListSelcted: {
                el: new dstVariableList(config, {
                    label: localization.en.variableListSelcted,
                    no: "variableListSelcted",
                    required: true,
                    //filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					filter: "Numeric|Scale",
					style: "mt-1 ml-3",
                    extraction: "CustomFormat",
                }), r: ['{{ var | safe}}']
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
			confidence_level: {
                el: new input(config, {
                    no: 'confidence_level',
                    label: localization.en.confidence_level,
                    //placeholder: "",
                    required: false,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
					wrapped: ', confidence.level=c(%val%)',
					style: "mb-3",
					width: "w-25",
                })
            },
			limitsChk: {
                el: new checkbox(config, {
                    label: localization.en.limitsChk, 
					no: "limitsChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					state:"checked",
					newline: true,
                })
            },
			pred_limitsChk: { 
                el: new checkbox(config, {
                    label: localization.en.pred_limitsChk, 
					no: "pred_limitsChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			genVarianceChk: { 
                el: new checkbox(config, {
                    label: localization.en.genVarianceChk, 
					no: "genVarianceChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
        };

        const content = {
            left: [objects.content_var.el.content],
            right: [
					objects.summaryPrintChk.el.content,
					
					//objects.dataSelected.el.content,
					//objects.newDataSelected.el.content, 
					
					objects.variableListSelcted.el.content,
					objects.groupingVariable.el.content,
					
					objects.limitsChk.el.content,
					objects.pred_limitsChk.el.content,
					objects.confidence_level.el.content,
					objects.genVarianceChk.el.content
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
module.exports.item = new mqccChart().render()