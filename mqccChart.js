
var localization = {
    en: {
        title: "Multivariate Quality Control Chart (mqcc)",
		navigation: "MQCC Chart",
		
		summaryPrintChk: "Print summary in addition to chart",
		
		dataSelected: "Data (select one or more datasets/matrices ) to chart",
		newDataSelected: "New data (select one or more datasets/matrices ) to chart",
		
		limitsChk: "If control limits (Phase I) must be computed and plotted",
		pred_limitsChk: "If prediction limits (Phase II) must be computed and plotted",
		
		//confidence_level: "A numeric value between 0 and 1 specifying the confidence level of the computed probability limits",
		
		help: {
            title: "Multivariate Quality Control Chart(mqcc)",
            r_help: "help(mqcc, package = qcc)",
			body: `
				<b>Description</b></br>
				mqcc function to perform multivariate statistical quality control
				<br/>
				<br/>
				For the detail help - use R help(mqcc, package = qcc)
				<br/>
				<br/>
				To try this, you may load the dataset called boiler from the qcc package with Load Dataset menu by selecting qcc package and then select boiler dataset to load
				<br/>
				<br/>
				select the boiler dataset on the dialod UI to move to the Data box, leave everything as deafult, and run the dialog
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

	dataX = NULL
	newDataX = NULL
	mqccX = NULL

			dataX = list({{selected.dataSelected | safe}})
			
			if(trimws('{{selected.newDataSelected | safe}}') != "")
			{
				newDataX = list({{selected.newDataSelected | safe}})
				names(newDataX) = strsplit(c('{{selected.newDataSelected | safe}}'),',')[[1]]
			}
			
			if(length(dataX) == 1)
			{
				if(is.null(newDataX))
				{
					mqccX = mqcc({{selected.dataSelected | safe}}, type = "T2.single", limits = {{selected.limitsChk | safe}}, pred.limits = {{selected.pred_limitsChk | safe}})
				} else
				{
					mqccX = mqcc({{selected.dataSelected | safe}}, type = "T2.single", newdata = {{selected.newDataSelected | safe}}, limits = {{selected.limitsChk | safe}}, pred.limits = {{selected.pred_limitsChk | safe}})
				}
				
			}else
			{
				names(dataX) = strsplit(c('{{selected.dataSelected | safe}}'),',')[[1]]
				
				if(is.null(newDataX))
				{
					mqccX = mqcc(dataX, type = "T2", limits = {{selected.limitsChk | safe}}, pred.limits = {{selected.pred_limitsChk | safe}})
				}else
				{
					mqccX = mqcc(dataX, type = "T2", newdata = newDataX, limits = {{selected.limitsChk | safe}}, pred.limits = {{selected.pred_limitsChk | safe}})
				}
				
			}

			if({{selected.summaryPrintChk | safe}} && !is.null(mqccX)){
				summary(mqccX)
			}
	
`
        };
        var objects = {
            dataset_var: { el: new srcDataSetList(config, { action: "move" }) },
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
			/*
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
					wrapped: ', confidence.level=c(%val%)',
					width: "w-25",
                })
            },
			*/
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
        };

        const content = {
            left: [objects.dataset_var.el.content],
            right: [
					objects.summaryPrintChk.el.content,
					
					objects.dataSelected.el.content,
					objects.newDataSelected.el.content, 
					
					objects.limitsChk.el.content,
					objects.pred_limitsChk.el.content
					//objects.confidence_level.el.content
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